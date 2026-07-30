"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { NOTIFICATION_PATHS, OTJ_PATHS } from "../constants";

function buildHeaders(orgId) {
  if (!orgId) return {};
  return { "x-organisation-id": orgId };
}

function unwrap(result) {
  return result.data?.data ?? result.data;
}

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
export async function getDigestPreference() {
  try {
    const result = await $apiClient.get(NOTIFICATION_PATHS.digestPreference());
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

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
