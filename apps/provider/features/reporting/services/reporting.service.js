// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { REPORTING_PATHS } from "../constants";

/** @typedef {import("@/types/api").paths["/reporting/employer-directory"]["get"]["parameters"]["query"]} EmployerDirectoryQuery */

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

export async function getProviderDashboard() {
  try {
    const result = await $apiClient.get(REPORTING_PATHS.providerDashboard);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** @param {EmployerDirectoryQuery} [options] */
export async function listEmployerDirectory({
  page = 1,
  perPage = 20,
  region,
  minActiveLearners,
  minAverageOtjPercent,
} = {}) {
  try {
    const params = { page, perPage };
    if (region) params.region = region;
    if (minActiveLearners) params.minActiveLearners = minActiveLearners;
    if (minAverageOtjPercent)
      params.minAverageOtjPercent = minAverageOtjPercent;

    const result = await $apiClient.get(REPORTING_PATHS.employerDirectory, {
      params,
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
