// @ts-check
"use client";

import { $publicApiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

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
