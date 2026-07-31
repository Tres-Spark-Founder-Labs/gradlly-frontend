// @ts-check
/**
 * Typed against the API's own OpenAPI document.
 *
 * `// @ts-check` above is a per-file opt-in — the app is not globally
 * type-checked, so this can be adopted service by service without a
 * whole-codebase migration. `npm run check-types` runs it.
 *
 * The point is narrow and specific: a response field that does not exist on
 * the DTO is now a build failure rather than an `undefined` that silently
 * takes a fallback path. That is the single failure mode behind the £0.00
 * levy balance, the discarded `standardDisplayName`, the `employeeId` that was
 * hardcoded null, and the `off_track` value no screen recognised.
 */
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { NOTIFICATION_PATHS, OTJ_PATHS } from "../constants";

/**
 * @typedef {import("@/types/api-schemas").OtjLogEntry} OtjLogEntry
 * @typedef {import("@/types/api-schemas").BulkOtjActionResult} BulkOtjActionResult
 * @typedef {import("@/types/api-schemas").DigestPreference} DigestPreference
 */

function buildHeaders(orgId) {
  if (!orgId) return {};
  return { "x-organisation-id": orgId };
}

function unwrap(result) {
  return result.data?.data ?? result.data;
}

/**
 * `status` accepts `""` because filter controls pass the empty string for "no
 * filter". The guard below already handled it; the type now says so rather
 * than leaving a comparison the checker reads as unreachable.
 *
 * @param {{
 *   orgId?: string,
 *   status?: OtjLogEntry["status"] | "",
 *   apprenticeId?: string,
 *   enrolmentId?: string,
 *   from?: string,
 *   to?: string,
 *   page?: number,
 *   perPage?: number,
 * }} [args]
 * @returns {Promise<{ data: OtjLogEntry[], meta?: unknown }>}
 */
export async function listOtjEntries({
  orgId,
  status,
  apprenticeId,
  enrolmentId,
  from,
  to,
  page = 1,
  perPage = 20,
} = {}) {
  /** @type {Record<string, unknown>} */
  const params = { page, perPage };
  if (status !== undefined && status !== null && status !== "")
    params.status = status;
  if (apprenticeId) params.apprenticeId = apprenticeId;
  if (enrolmentId) params.enrolmentId = enrolmentId;
  if (from) params.from = from;
  if (to) params.to = to;

  try {
    const result = await $apiClient.get(OTJ_PATHS.BASE, {
      headers: buildHeaders(orgId),
      params,
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listOtjLogEntries(args) {
  return listOtjEntries(args);
}

/**
 * Approval sends ids only.
 *
 * A `reason` was previously always included, defaulting to "". The API
 * validates with `forbidNonWhitelisted`, and only rejection accepts a comment
 * (F1.2.3 AC3) — so an empty reason on approve is now a 400, not a harmless
 * extra field.
 */
export async function bulkApproveOtj({ orgId, ids }) {
  try {
    const result = await $apiClient.post(
      OTJ_PATHS.bulkApprove(),
      { ids },
      { headers: buildHeaders(orgId) },
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function bulkApproveOtjEntries(ids, orgId) {
  return bulkApproveOtj({ orgId, ids });
}

export async function bulkRejectOtj({ orgId, ids, reason }) {
  try {
    const result = await $apiClient.post(
      OTJ_PATHS.bulkReject(),
      { ids, reason },
      { headers: buildHeaders(orgId) },
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateOtjEntry({ orgId, id, ...body }) {
  try {
    const result = await $apiClient.patch(OTJ_PATHS.detail(id), body, {
      headers: buildHeaders(orgId),
    });
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function deleteOtjEntry({ orgId, id }) {
  try {
    await $apiClient.delete(OTJ_PATHS.detail(id), {
      headers: buildHeaders(orgId),
    });
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Digest preference (F1.2.3 AC7) ─────────────────────────────────────────

/**
 * No org header: the digest cadence is a property of the signed-in user, not
 * of the organisation they are currently viewing. Sending one would imply a
 * per-org setting the API does not store.
 */
/** @returns {Promise<DigestPreference>} */
export async function getDigestPreference() {
  try {
    const result = await $apiClient.get(NOTIFICATION_PATHS.digestPreference());
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * @param {{ frequency: DigestPreference["frequency"] }} args
 * @returns {Promise<DigestPreference>}
 */
export async function updateDigestPreference({ frequency }) {
  try {
    const result = await $apiClient.patch(
      NOTIFICATION_PATHS.digestPreference(),
      { frequency },
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
