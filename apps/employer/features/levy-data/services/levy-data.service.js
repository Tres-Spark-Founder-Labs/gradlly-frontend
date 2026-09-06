"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { LEVY_DATA_PATHS } from "../constants";

/** Manual levy entry. Owner/admin only — the API enforces it too. */

export async function saveLevyBalance(payload) {
  try {
    const result = await $apiClient.post(LEVY_DATA_PATHS.BALANCE, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** REPLACES the organisation's whole monthly series. Not an upsert. */
export async function replaceMonthlySeries(months) {
  try {
    const result = await $apiClient.put(LEVY_DATA_PATHS.MONTHLY, { months });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * REPLACES the tranches on one DAS account.
 *
 * `donorLinkId` is explicit because an organisation may hold several linked
 * accounts for separate legal entities (F4.1.1 AC4); the other accounts'
 * tranches are untouched.
 */
export async function replaceTranches(donorLinkId, tranches) {
  try {
    const result = await $apiClient.put(LEVY_DATA_PATHS.TRANCHES, {
      donorLinkId,
      tranches,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function saveFundingPayment(payload) {
  try {
    const result = await $apiClient.post(
      LEVY_DATA_PATHS.FUNDING_PAYMENTS,
      payload,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createDonorLink(payload) {
  try {
    const result = await $apiClient.post(LEVY_DATA_PATHS.DONOR_LINK, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getDonorLinks() {
  try {
    const result = await $apiClient.get(LEVY_DATA_PATHS.DONOR_LINKS);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/* ── Reads used to pre-populate the forms ─────────────────────────────────── */

export async function getStoredBalance() {
  try {
    const result = await $apiClient.get(LEVY_DATA_PATHS.READ_BALANCE);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getStoredMonthly() {
  try {
    const result = await $apiClient.get(LEVY_DATA_PATHS.READ_MONTHLY);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getStoredTranches(donorLinkId) {
  try {
    const result = await $apiClient.get(LEVY_DATA_PATHS.READ_TRANCHES, {
      params: { donorLinkId },
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getStoredFundingPayments() {
  try {
    const result = await $apiClient.get(LEVY_DATA_PATHS.READ_FUNDING_PAYMENTS);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
