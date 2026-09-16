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

/**
 * F1.2.2 AC3 — approved and pending off-the-job minutes per ISO week, over
 * the programme lifetime, grouped by the API.
 *
 * Not built from `profile.otj.recentEntries`: that list is capped at 500 and
 * silently truncates a long programme, so a chart drawn from it would end
 * early and look complete.
 */
export async function getLearnerOtjWeekly(enrolmentId) {
  try {
    const result = await $apiClient.get(LEARNER_PATHS.otjWeekly(enrolmentId));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
