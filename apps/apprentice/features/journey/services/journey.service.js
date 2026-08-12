// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { JOURNEY_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

/**
 * `GET /enrolments/:id/journey` — the single source for the programme
 * timeline (F3.2.1), the gateway checklist (F3.2.2) and the EPA countdown
 * (F3.2.3). One request serves all three screens; they are three views of one
 * payload, not three fetches.
 *
 * @param {string} enrolmentId
 */
export async function getEnrolmentJourney(enrolmentId) {
  try {
    const result = await $apiClient.get(JOURNEY_PATHS.JOURNEY(enrolmentId));
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
