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
