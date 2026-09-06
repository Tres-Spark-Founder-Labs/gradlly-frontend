"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { LEARNER_PATHS } from "../constants";

/**
 * The learner profile aggregate for one enrolment.
 *
 * Same call the provider app makes. The employer sees a narrower slice of the
 * same response — the API decides what this caller may read — so nothing here
 * filters or reshapes it.
 */
export async function getLearnerProfile(enrolmentId) {
  try {
    const result = await $apiClient.get(LEARNER_PATHS.profile(enrolmentId));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
