"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { REPORTING_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function getEmployerDashboard(orgId) {
  try {
    const result = await $apiClient.get(REPORTING_PATHS.EMPLOYER_DASHBOARD, {
      headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
    });
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getLevyUtilisation(orgId) {
  try {
    const result = await $apiClient.get(REPORTING_PATHS.LEVY_UTILISATION, {
      headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
    });
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getLevyRoi(orgId) {
  try {
    const result = await $apiClient.get(REPORTING_PATHS.LEVY_ROI, {
      headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
    });
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getLevyRoiBreakdown(orgId, groupBy) {
  try {
    const result = await $apiClient.get(REPORTING_PATHS.LEVY_ROI_BREAKDOWN, {
      headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
      params: { groupBy },
    });
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function exportLevyRoiPdf(orgId) {
  try {
    const result = await $apiClient.post(
      REPORTING_PATHS.LEVY_ROI_EXPORT,
      {},
      { headers: orgId ? { "X-Organisation-Id": orgId } : undefined },
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** F1.4.1 AC5 — who currently receives the scheduled monthly report. */
export async function getLevyRoiSubscribers(orgId) {
  try {
    const result = await $apiClient.get(REPORTING_PATHS.LEVY_ROI_SUBSCRIBERS, {
      headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
    });
    return unwrap(result) ?? [];
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * Replaces the distribution list wholesale.
 *
 * A PUT of the full list rather than add/remove calls: the screen is a set of
 * checkboxes and a save button, and incremental calls would make it issue a
 * diff — which goes wrong when two admins edit at once.
 */
export async function setLevyRoiSubscribers(orgId, userIds) {
  try {
    const result = await $apiClient.put(
      REPORTING_PATHS.LEVY_ROI_SUBSCRIBERS,
      { userIds },
      { headers: orgId ? { "X-Organisation-Id": orgId } : undefined },
    );
    return unwrap(result) ?? [];
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F1.4.2 AC3 — downloads the comparison as CSV.
 *
 * Fetched through `$apiClient` rather than pointing a link at the URL so the
 * bearer token and organisation header go with it; a bare anchor would hit
 * the endpoint unauthenticated and download a 401 page named ".csv".
 */
export async function downloadProviderComparisonCsv(orgId) {
  try {
    const result = await $apiClient.get(
      REPORTING_PATHS.PROVIDER_COMPARISON_CSV,
      {
        headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
        responseType: "blob",
      },
    );
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** F1.4.2 AC3 — queues the comparison PDF; poll the returned job. */
export async function exportProviderComparisonPdf(orgId) {
  try {
    const result = await $apiClient.post(
      REPORTING_PATHS.PROVIDER_COMPARISON_EXPORT,
      {},
      { headers: orgId ? { "X-Organisation-Id": orgId } : undefined },
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
