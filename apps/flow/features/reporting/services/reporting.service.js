// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { REPORTING_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

// The active org is auto-attached by $apiClient (X-Organisation-Id), so the
// backend scopes this to the caller's Flow org — no manual header needed.
export async function getSmeOverview() {
  try {
    const result = await $apiClient.get(REPORTING_PATHS.SME_OVERVIEW);
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
