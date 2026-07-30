"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { LEVY_PATHS } from "../constants";

function buildHeaders(orgId) {
  if (!orgId) return {};
  return { "x-organisation-id": orgId };
}

export async function getLevy({ orgId } = {}) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.SURPLUS, {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getExpiryCalendar({ orgId } = {}) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.EXPIRY_CALENDAR, {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getDonorLinks({ orgId } = {}) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.DONOR_LINKS, {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function syncDonorLink({ orgId, id }) {
  try {
    const result = await $apiClient.post(
      LEVY_PATHS.donorSync(id),
      {},
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F1.1.4 AC2 — browse/search SME transfer recipients.
 * Returns only profiles whose owning SME opted in to the directory.
 */
export async function getRecipientDirectory({ orgId, params } = {}) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.RECIPIENT_DIRECTORY, {
      headers: buildHeaders(orgId),
      params,
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getMatchApplications({ orgId, params } = {}) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.MATCH_APPLICATIONS, {
      headers: buildHeaders(orgId),
      params,
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateMatchApplicationStatus({ orgId, id, status }) {
  try {
    const result = await $apiClient.patch(
      LEVY_PATHS.matchApplication(id),
      { status },
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getTransfers({ orgId, params } = {}) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.TRANSFERS, {
      headers: buildHeaders(orgId),
      params,
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getTransfer({ orgId, id }) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.transfer(id), {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createTransferFromMatch({
  orgId,
  matchApplicationId,
  recipientSignerUserId,
  startDate,
}) {
  try {
    const result = await $apiClient.post(
      LEVY_PATHS.TRANSFERS,
      { matchApplicationId, recipientSignerUserId, startDate },
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function signTransfer({ orgId, id, party, signatureImageKey }) {
  try {
    const result = await $apiClient.post(
      LEVY_PATHS.transferSign(id),
      { party, signatureImageKey },
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function submitTransferToDas({ orgId, id }) {
  try {
    const result = await $apiClient.post(
      LEVY_PATHS.transferSubmit(id),
      {},
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getTransferDocument({ orgId, id }) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.transferDocument(id), {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
