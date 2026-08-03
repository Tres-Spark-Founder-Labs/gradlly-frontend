"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { REVIEW_PATHS } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id header
// (see lib/api/client), so none of these calls set it explicitly.

/**
 * F2.2.3 AC6 — reviews for this employer's apprentices.
 *
 * Read-only by design; there is no create, update or sign here. Reviews are
 * stamped with the *provider's* organisation, so the API resolves an
 * employer's visibility through the enrolment rather than the review row.
 */
export async function listReviews({ page = 1, perPage = 20, status } = {}) {
  try {
    const params = { page, perPage };
    if (status) params.status = status;

    const result = await $apiClient.get(REVIEW_PATHS.BASE, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getReview(id) {
  try {
    const result = await $apiClient.get(REVIEW_PATHS.byId(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * The full record: SMART goals, previous-goal progress, OTJ discussion,
 * wellbeing and actions.
 *
 * A 404 here is a normal state, not a fault — a scheduled review has no
 * record until the tutor writes one. The caller distinguishes the two.
 */
export async function getReviewRecord(id) {
  try {
    const result = await $apiClient.get(REVIEW_PATHS.record(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
