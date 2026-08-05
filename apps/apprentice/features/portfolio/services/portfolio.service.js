// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { PORTFOLIO_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function listEvidenceItems({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(PORTFOLIO_PATHS.EVIDENCE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getKsbHeatmap(enrolmentId) {
  try {
    const result = await $apiClient.get(PORTFOLIO_PATHS.KSB_HEATMAP, {
      params: { enrolmentId },
    });
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getLearnerDocument(orgId) {
  try {
    const result = await $apiClient.get(PORTFOLIO_PATHS.LEARNER_DOCUMENT, {
      headers: orgId ? { "X-Organisation-Id": orgId } : undefined,
    });
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createKsbEvidence(payload) {
  try {
    const result = await $apiClient.post(PORTFOLIO_PATHS.EVIDENCE, payload);
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
