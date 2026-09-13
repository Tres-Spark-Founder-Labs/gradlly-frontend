// @ts-check
"use client";

import { $apiClient, $publicApiClient } from "@/lib/api/client";
import { ApiClientError, normalizeApiClientError } from "@/lib/errors";

import { LEVY_EXCHANGE_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

// Public, throttled (30/min). No auth, no org scoping — see $publicApiClient.
export async function checkLevyEligibility(payload) {
  try {
    const result = await $publicApiClient.post(
      LEVY_EXCHANGE_PATHS.ELIGIBILITY_CHECK,
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Recipient side (signed-in SME) ───────────────────────────────────────────
// The active organisation travels on every call via X-Organisation-Id (see
// lib/api/client), so none of these pass it explicitly.

/**
 * The SME's recipient profile, or null when it has not been created yet.
 *
 * The API answers 404 for "no profile" (LevyRecipientProfileService.get). That
 * is the normal state for an SME arriving here for the first time, not an
 * error, so it is returned as null and the form opens empty.
 */
export async function getRecipientProfile() {
  try {
    const result = await $apiClient.get(LEVY_EXCHANGE_PATHS.RECIPIENT_PROFILE);
    return unwrap(result);
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 404) return null;
    throw normalizeApiClientError(e);
  }
}

export async function saveRecipientProfile(payload) {
  try {
    const result = await $apiClient.put(
      LEVY_EXCHANGE_PATHS.RECIPIENT_PROFILE,
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * Runs the rule-based match search for the active SME.
 *
 * A POST with a side effect: when nothing matches, the service inserts the
 * organisation into the waiting pool. That is why this is only ever called
 * from a mutation, never from a query that could refetch on window focus.
 */
export async function searchMatches(payload = {}) {
  try {
    const result = await $apiClient.post(
      LEVY_EXCHANGE_PATHS.MATCH_SEARCH,
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * Paginated: returns the whole envelope ({ data, meta }) rather than
 * unwrapping, so the query layer keeps the pagination meta.
 */
export async function listMatchApplications(params = {}) {
  try {
    const result = await $apiClient.get(
      LEVY_EXCHANGE_PATHS.MATCH_APPLICATIONS,
      { params },
    );
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createMatchApplication(payload) {
  try {
    const result = await $apiClient.post(
      LEVY_EXCHANGE_PATHS.MATCH_APPLICATIONS,
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
