"use client";

import {
  dataUrlToFile,
  uploadFileForKey,
} from "@/features/storage/services/storage.service";
import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import {
  COMMITMENT_PATHS,
  SIGNATURE_UPLOAD_CATEGORY,
  TRIPARTITE_PARTY,
} from "../constants";

/**
 * F3.4.1 — the apprentice's side of commitment statement signing.
 *
 * Reuses the endpoints the provider and employer portals already call. The
 * only new thing here is the signature upload step, and even that is assembled
 * from `features/storage` helpers that already existed in this app
 * (`dataUrlToFile`, `uploadFileForKey`).
 */

/**
 * The statements for one enrolment.
 *
 * The API filters by `enrolmentId` and `status`; there is no "mine" endpoint,
 * so the caller passes the enrolment it already has from the journey query.
 */
export async function getCommitmentStatements({ enrolmentId, status } = {}) {
  try {
    const params = new URLSearchParams();
    if (enrolmentId) params.set("enrolmentId", enrolmentId);
    if (status) params.set("status", status);
    const qs = params.toString();

    const result = await $apiClient.get(
      qs ? `${COMMITMENT_PATHS.list}?${qs}` : COMMITMENT_PATHS.list,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getCommitmentStatement(id) {
  try {
    const result = await $apiClient.get(COMMITMENT_PATHS.byId(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F3.4.1 AC5 — "Signed PDF immediately available in the document library."
 *
 * Returns a short-lived download URL for the fully signed PDF. The API only
 * produces one once every party has signed, so a 404 here is a normal state
 * mid-sequence rather than a fault, and the caller renders it as "not ready"
 * rather than as an error.
 */
export async function getSignedDocumentUrl(id) {
  try {
    const result = await $apiClient.get(COMMITMENT_PATHS.signedDocument(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F3.4.1 AC3 — signs with a captured signature image.
 *
 * `SignCommitmentDto.signatureImageKey` is required and takes a *storage key*,
 * never image bytes, so both capture modes converge here: the drawn pad exports
 * its canvas to a PNG data URL, and the typed name is rasterised to one. This
 * function does not care which produced it.
 *
 * Upload first, then sign. If the upload fails the statement is untouched,
 * which is the right way round — a signature row pointing at a key that was
 * never stored would be worse than no signature at all.
 */
export async function signCommitmentStatement({
  id,
  signatureDataUrl,
  signal,
}) {
  if (!signatureDataUrl) {
    throw normalizeApiClientError(
      new Error("A signature is required before signing."),
    );
  }

  try {
    const file = dataUrlToFile(signatureDataUrl, "signature.png");
    const key = await uploadFileForKey({
      file,
      category: SIGNATURE_UPLOAD_CATEGORY,
      signal,
    });

    const result = await $apiClient.post(COMMITMENT_PATHS.sign(id), {
      party: TRIPARTITE_PARTY.APPRENTICE,
      signatureImageKey: key,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
