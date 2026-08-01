"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { COMMITMENT_PATHS } from "../constants";

function buildHeaders(orgId) {
  if (!orgId) return {};
  return { "x-organisation-id": orgId };
}

/**
 * F1.3.1 — the employer status board.
 *
 * Distinct from `getCommitmentStatements`, which hits the list endpoint
 * scoped to the statement's owning organisation. Commitment statements are
 * drafted by the provider, so that endpoint returns nothing for an employer
 * no matter what filters are applied.
 *
 * Returns `{ rows, actionRequiredCount, total }`. The count is deliberately
 * calculated across the whole board rather than the filtered rows, because it
 * drives the sidebar badge (AC5).
 */
export async function getCommitmentBoard({
  orgId,
  status,
  providerOrganisationId,
  standardId,
  actionRequiredOnly,
} = {}) {
  try {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (providerOrganisationId) {
      params.set("providerOrganisationId", providerOrganisationId);
    }
    if (standardId) params.set("standardId", standardId);
    if (actionRequiredOnly) params.set("actionRequiredOnly", "true");

    const qs = params.toString();
    const result = await $apiClient.get(
      qs ? `${COMMITMENT_PATHS.BOARD}?${qs}` : COMMITMENT_PATHS.BOARD,
      { headers: buildHeaders(orgId) },
    );
    const data = result.data?.data ?? result.data;
    return {
      rows: data?.rows ?? [],
      actionRequiredCount: data?.actionRequiredCount ?? 0,
      total: data?.total ?? 0,
    };
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** F1.3.2 AC5 — all versions with dates and signatories, newest first. */
export async function getCommitmentVersionHistory({ orgId, groupId }) {
  try {
    const result = await $apiClient.get(
      COMMITMENT_PATHS.versionHistory(groupId),
      { headers: buildHeaders(orgId) },
    );
    const data = result.data?.data ?? result.data;
    return {
      groupId: data?.groupId ?? groupId,
      versions: data?.versions ?? [],
    };
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F1.3.2 AC6 — a short-lived link to the signed PDF.
 *
 * Not the generic storage download endpoint: that authorises on the key
 * prefix, and the PDF sits under the drafting provider namespace, so it
 * refuses an employer who is a party to the document.
 */
export async function getSignedCommitmentDocument({ orgId, id }) {
  try {
    const result = await $apiClient.get(COMMITMENT_PATHS.signedDocument(id), {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F1.3.3 AC3 — queues the Ofsted-ready audit trail PDF.
 *
 * Returns `{ jobId, status, ... }`; the caller polls `GET /pdf/jobs/:id` and
 * opens `downloadUrl` when it completes. Asynchronous because the trail spans
 * every version and every signature of the statement, which is more work than
 * a request should hold open.
 */
export async function exportCommitmentAuditTrail({ orgId, id }) {
  try {
    const result = await $apiClient.post(
      COMMITMENT_PATHS.auditTrailExport(id),
      {},
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getCommitmentStatements({
  orgId,
  page = 1,
  perPage = 100,
  enrolmentId,
  status,
} = {}) {
  try {
    const params = new URLSearchParams({ page, perPage });
    if (enrolmentId) params.set("enrolmentId", enrolmentId);
    if (status) params.set("status", status);
    const result = await $apiClient.get(
      `${COMMITMENT_PATHS.LIST}?${params.toString()}`,
      { headers: buildHeaders(orgId) },
    );
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getCommitmentStatement({ orgId, id }) {
  try {
    const result = await $apiClient.get(COMMITMENT_PATHS.detail(id), {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createCommitmentStatement({ orgId, body }) {
  try {
    const result = await $apiClient.post(COMMITMENT_PATHS.LIST, body, {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateCommitmentStatement({ orgId, id, body }) {
  try {
    const result = await $apiClient.patch(COMMITMENT_PATHS.detail(id), body, {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function publishCommitmentStatement({ orgId, id }) {
  try {
    const result = await $apiClient.post(
      COMMITMENT_PATHS.publish(id),
      {},
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function cancelCommitmentStatement({ orgId, id }) {
  try {
    const result = await $apiClient.post(
      COMMITMENT_PATHS.cancel(id),
      {},
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function signCommitmentStatement({
  orgId,
  id,
  party,
  signatureImageKey,
}) {
  try {
    const result = await $apiClient.post(
      COMMITMENT_PATHS.sign(id),
      { party, signatureImageKey },
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
