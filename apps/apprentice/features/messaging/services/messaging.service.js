"use client";

import { putToPresignedUrl } from "@/features/storage/services/storage.service";
import { $apiClient } from "@/lib/api/client";
import { ApiClientError, normalizeApiClientError } from "@/lib/errors";

import { MESSAGING_PATHS } from "../constants";

export async function getUnreadCount() {
  try {
    const result = await $apiClient.get(MESSAGING_PATHS.UNREAD_COUNT);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listThreads({ enrolmentId, apprenticeId } = {}) {
  try {
    const result = await $apiClient.get(MESSAGING_PATHS.THREADS, {
      params: { enrolmentId, apprenticeId },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getThread(id) {
  try {
    const result = await $apiClient.get(MESSAGING_PATHS.thread(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function markThreadRead(id) {
  try {
    const result = await $apiClient.patch(MESSAGING_PATHS.threadRead(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listMessages({ threadId, page = 1, perPage = 20 }) {
  try {
    const result = await $apiClient.get(MESSAGING_PATHS.messages(threadId), {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function sendMessage({ threadId, body, attachments }) {
  try {
    const result = await $apiClient.post(MESSAGING_PATHS.messages(threadId), {
      body,
      attachments,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createAttachmentUploadUrl({
  apprenticeId,
  enrolmentId,
  filename,
  contentType,
  contentLength,
}) {
  try {
    const result = await $apiClient.post(
      MESSAGING_PATHS.ATTACHMENT_UPLOAD_URL,
      { apprenticeId, enrolmentId, filename, contentType, contentLength },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10MB per PRD F3.4.2

/**
 * Presigns via the messaging-specific upload-url endpoint (which validates the
 * caller against the thread's enrolment), then PUTs the file straight to S3.
 * Returns the attachment descriptor to include on `POST .../messages`.
 */
export async function uploadMessageAttachment({
  file,
  apprenticeId,
  enrolmentId,
}) {
  if (!file) {
    throw new ApiClientError({ message: "No file selected.", status: 400 });
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new ApiClientError({
      message: "Attachments must be smaller than 10 MB.",
      status: 400,
    });
  }

  const presigned = await createAttachmentUploadUrl({
    apprenticeId,
    enrolmentId,
    filename: file.name,
    contentType: file.type,
    contentLength: file.size,
  });

  const uploadUrl = presigned?.uploadUrl ?? presigned?.url;
  const storageKey = presigned?.key;
  if (!uploadUrl || !storageKey) {
    throw new ApiClientError({
      message: "Upload could not be initialised. Please try again.",
      status: 502,
    });
  }

  await putToPresignedUrl({ uploadUrl, file });

  return {
    storageKey,
    filename: file.name,
    contentType: file.type,
    contentLength: file.size,
  };
}
