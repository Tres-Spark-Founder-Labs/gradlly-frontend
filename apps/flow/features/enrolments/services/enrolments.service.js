"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { ENROLMENT_PATHS } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so this call does not set it explicitly.

export async function getParticipantOptions(enrolmentId) {
  try {
    const result = await $apiClient.get(
      ENROLMENT_PATHS.participantOptions(enrolmentId),
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
