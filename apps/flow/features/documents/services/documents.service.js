// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { DOCUMENT_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

/**
 * The learner profile aggregate, for its `documents` (F1.2.2 AC5).
 *
 * The profile admits the employer named on the enrolment
 * (LearnerProfileService.findReadableEnrolment), which is what a FlowPortal
 * SME is on its own apprentices' enrolments. The API answers 404, not 403, for
 * an enrolment the caller cannot read.
 */
export async function getLearnerProfile(enrolmentId) {
  try {
    const result = await $apiClient.get(
      DOCUMENT_PATHS.learnerProfile(enrolmentId),
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
