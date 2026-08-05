// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { ApiClientError, normalizeApiClientError } from "@/lib/errors";

// ─── Paths & constants ──────────────────────────────────────────────────────
//
// Storage uploads are a two-step, presigned-URL flow:
//   1. Ask our backend for a short-lived S3 PUT URL (auth-protected, via proxy).
//   2. PUT the raw file bytes straight to S3 (cross-origin to a 3rd party, so a
//      plain `fetch` — NO proxy, NO cookies; the signature in the URL is the
//      only credential S3 needs).
//
// The durable public URL to persist on the owning resource (user.avatarUrl,
// organisation.logoUrl, …) is the upload URL with its query string removed.
//
// NOTE: the S3 bucket must expose a CORS policy allowing the portal origins,
// the PUT method, and the Content-Type header — otherwise the browser's
// preflight is rejected before the request reaches S3.

const STORAGE_PATHS = Object.freeze({
  UPLOAD_URL: "/api/v1/storage/upload-url",
  DOWNLOAD_URL: "/api/v1/storage/download-url",
});

export const STORAGE_CATEGORY = Object.freeze({
  GENERAL: "general",
  AVATAR: "general",
  LOGO: "general",
  // Real backend categories (StorageObjectCategory). The image-upload flow above
  // only ever needs "general"; the key-returning flow below uses the rest.
  EVIDENCE: "evidence",
  SIGNATURE: "signature",
  EXPORT: "export",
  ATTACHMENT: "attachment",
});

// Backend hard cap for presigned uploads (25 MB).
export const MAX_PRESIGNED_BYTES = 25 * 1024 * 1024;

// Defensive client-side guard. The backend remains the source of truth, but
// failing fast here saves a wasted round-trip and gives the user a clear error.
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_IMAGE_TYPES = Object.freeze([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

// ─── Step 1: request a presigned upload URL ─────────────────────────────────
/**
 * @param {{ filename: string, contentType: string, contentLength: number,
 *           category?: string, signal?: AbortSignal }} params
 * @returns {Promise<{ uploadUrl: string, fileUrl: string }>}
 */
export async function requestUploadUrl({
  filename,
  contentType,
  contentLength,
  category = STORAGE_CATEGORY.GENERAL,
  signal,
}) {
  try {
    const result = await $apiClient.post(
      STORAGE_PATHS.UPLOAD_URL,
      { filename, contentType, contentLength, category },
      { signal },
    );
    const data = result.data?.data ?? result.data;

    const uploadUrl = data?.uploadUrl ?? data?.url;
    if (!uploadUrl) {
      throw new ApiClientError({
        message: "Upload could not be initialised. Please try again.",
        status: 502,
      });
    }

    // Prefer an explicit public URL if the backend returns one; otherwise the
    // durable URL is the presigned URL without its (expiring) query string.
    // `key` is only a path, so use it solely when it is already absolute.
    const fileUrl =
      firstAbsoluteUrl(data?.fileUrl, data?.publicUrl, data?.key) ??
      stripQuery(uploadUrl);

    return { uploadUrl, fileUrl };
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Step 2: PUT the file straight to S3 ────────────────────────────────────
/**
 * Uploads raw bytes to a presigned S3 URL with a plain `fetch`. Deliberately
 * bypasses `$apiClient` (which prefixes `/api/proxy` and JSON-encodes the body)
 * — S3 needs the binary File as-is, with a Content-Type that matches the
 * `contentType` sent to /upload-url.
 *
 * @param {{ uploadUrl: string, file: File, signal?: AbortSignal }} params
 */
export async function putToPresignedUrl({ uploadUrl, file, signal }) {
  let response;
  try {
    response = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
      signal,
    });
  } catch (e) {
    if (e?.name === "AbortError") {
      throw new ApiClientError({ message: "Upload cancelled.", status: 0 });
    }
    // A thrown fetch (TypeError: Failed to fetch) never reached S3 — the request
    // was blocked by the browser. This is almost always one of two server-side
    // issues, both fixed off the frontend:
    //   • the S3 bucket has no CORS policy allowing this origin + PUT, or
    //   • the presigned URL carries signed headers the browser can't satisfy
    //     (e.g. a baked-in x-amz-checksum-* the browser cannot reproduce).
    throw new ApiClientError({
      message:
        "Couldn't reach storage. The upload was blocked before sending — " +
        "check the bucket CORS policy and the presigned URL's signed headers.",
      status: 0,
    });
  }

  if (!response.ok) {
    // S3 reached but rejected (e.g. SignatureDoesNotMatch / BadDigest). Surface
    // the status so the cause is visible rather than a generic message.
    throw new ApiClientError({
      message: `Storage rejected the upload (HTTP ${response.status}).`,
      status: response.status,
    });
  }
}

// ─── Orchestrator: validate → presign → upload → return durable URL ─────────
/**
 * Single entry point used by mutations. Returns the durable public URL to
 * persist on the owning resource.
 *
 * @param {{ file: File, category?: string, signal?: AbortSignal }} params
 * @returns {Promise<string>} the public file URL
 */
export async function uploadFile({
  file,
  category = STORAGE_CATEGORY.GENERAL,
  signal,
}) {
  assertValidImage(file);

  const { uploadUrl, fileUrl } = await requestUploadUrl({
    filename: file.name,
    contentType: file.type,
    contentLength: file.size,
    category,
    signal,
  });

  await putToPresignedUrl({ uploadUrl, file, signal });

  return fileUrl;
}

// ─── Validation helpers ─────────────────────────────────────────────────────

// ─── Key-returning presigned upload (signatures, evidence, attachments) ─────
//
// Unlike uploadFile above (which returns a durable PUBLIC URL for avatars/logos),
// these resources are private: the backend stores and references them by their
// S3 `key`. The commitment signing flow needs the key to pass as
// `signatureImageKey`, so this orchestrator returns the key, not a URL.

/**
 * @param {{ filename, contentType, contentLength, category, learnerId?, signal? }} params
 * @returns {Promise<{ key: string, uploadUrl: string, expiresAt?: string }>}
 */
export async function requestKeyedUploadUrl({
  filename,
  contentType,
  contentLength,
  category,
  learnerId,
  signal,
}) {
  try {
    const body = { filename, contentType, contentLength, category };
    if (learnerId) body.learnerId = learnerId;

    const result = await $apiClient.post(STORAGE_PATHS.UPLOAD_URL, body, {
      signal,
    });
    const data = result.data?.data ?? result.data;

    if (!data?.key || !data?.uploadUrl) {
      throw new ApiClientError({
        message: "Upload could not be initialised. Please try again.",
        status: 502,
      });
    }
    return {
      key: data.key,
      uploadUrl: data.uploadUrl,
      expiresAt: data.expiresAt,
    };
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * Validate → presign → PUT to S3 → return the durable S3 `key`.
 * @param {{ file: File, category: string, learnerId?: string, signal?: AbortSignal }} params
 * @returns {Promise<string>} the S3 object key
 */
export async function uploadFileForKey({ file, category, learnerId, signal }) {
  assertWithinPresignedLimit(file);

  const { key, uploadUrl } = await requestKeyedUploadUrl({
    filename: file.name,
    contentType: file.type,
    contentLength: file.size,
    category,
    learnerId,
    signal,
  });

  await putToPresignedUrl({ uploadUrl, file, signal });

  return key;
}

// ─── Presigned download URL (for private objects: signed PDFs, evidence) ─────
/**
 * @param {{ key: string, signal?: AbortSignal }} params
 * @returns {Promise<{ downloadUrl: string, expiresAt?: string }>}
 */
export async function requestDownloadUrl({ key, signal }) {
  try {
    const result = await $apiClient.post(
      STORAGE_PATHS.DOWNLOAD_URL,
      { key },
      { signal },
    );
    const data = result.data?.data ?? result.data;
    if (!data?.downloadUrl) {
      throw new ApiClientError({
        message: "Could not generate a download link. Please try again.",
        status: 502,
      });
    }
    return { downloadUrl: data.downloadUrl, expiresAt: data.expiresAt };
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export function assertWithinPresignedLimit(file) {
  if (!file) {
    throw new ApiClientError({ message: "No file selected.", status: 400 });
  }
  if (file.size > MAX_PRESIGNED_BYTES) {
    throw new ApiClientError({
      message: `File must be smaller than ${Math.round(
        MAX_PRESIGNED_BYTES / (1024 * 1024),
      )} MB.`,
      status: 400,
    });
  }
}

export function assertValidImage(file) {
  if (!file) {
    throw new ApiClientError({ message: "No file selected.", status: 400 });
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new ApiClientError({
      message: "Unsupported format. Use PNG, JPG, WEBP, GIF or SVG.",
      status: 400,
    });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ApiClientError({
      message: `Image must be smaller than ${Math.round(
        MAX_UPLOAD_BYTES / (1024 * 1024),
      )} MB.`,
      status: 400,
    });
  }
}

function stripQuery(url) {
  if (typeof url !== "string") return url;
  const i = url.indexOf("?");
  return i === -1 ? url : url.slice(0, i);
}

// Returns the first argument that is an absolute http(s) URL, else null.
function firstAbsoluteUrl(...candidates) {
  for (const c of candidates) {
    if (typeof c === "string" && /^https?:\/\//i.test(c)) return c;
  }
  return null;
}
