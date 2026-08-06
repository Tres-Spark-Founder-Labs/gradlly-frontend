// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { PORTFOLIO_PATHS } from "../constants";

/** @typedef {import("@/types/api").paths["/ksb-evidence-items"]["get"]["parameters"]["query"]} EvidenceItemsQuery */

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

// ─── KSB Definitions ─────────────────────────────────────────────────────────
export async function listKsbDefinitions(standardId) {
  try {
    // Plain array response (no pagination meta).
    const result = await $apiClient.get(
      PORTFOLIO_PATHS.ksbDefinitionsForStandard(standardId),
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createKsbDefinition({ standardId, payload }) {
  try {
    const result = await $apiClient.post(
      PORTFOLIO_PATHS.ksbDefinitionsForStandard(standardId),
      payload,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateKsbDefinition({ id, payload }) {
  try {
    const result = await $apiClient.patch(
      PORTFOLIO_PATHS.ksbDefinitionById(id),
      payload,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function deleteKsbDefinition(id) {
  try {
    await $apiClient.delete(PORTFOLIO_PATHS.ksbDefinitionById(id));
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Heatmap + coverage ──────────────────────────────────────────────────────
export async function getKsbHeatmap(enrolmentId) {
  try {
    const result = await $apiClient.get(PORTFOLIO_PATHS.ksbHeatmap, {
      params: { enrolmentId },
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function upsertKsbCoverage({
  enrolmentId,
  ksbDefinitionId,
  assessment,
}) {
  try {
    const result = await $apiClient.put(
      PORTFOLIO_PATHS.ksbCoverage(enrolmentId, ksbDefinitionId),
      { assessment },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Evidence items (provider review side) ───────────────────────────────────
/** @param {EvidenceItemsQuery} [options] */
export async function listEvidenceItems({
  page = 1,
  perPage = 20,
  enrolmentId,
  apprenticeId,
  status,
  ksbDefinitionId,
} = {}) {
  try {
    const params = { page, perPage };
    if (enrolmentId) params.enrolmentId = enrolmentId;
    if (apprenticeId) params.apprenticeId = apprenticeId;
    if (status) params.status = status;
    if (ksbDefinitionId) params.ksbDefinitionId = ksbDefinitionId;

    const result = await $apiClient.get(PORTFOLIO_PATHS.evidenceItems, {
      params,
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getEvidenceItem(id) {
  try {
    const result = await $apiClient.get(PORTFOLIO_PATHS.evidenceItemById(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function reviewEvidenceItem(id) {
  try {
    const result = await $apiClient.post(
      PORTFOLIO_PATHS.evidenceReview(id),
      {},
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function acceptEvidenceItem(id) {
  try {
    const result = await $apiClient.post(
      PORTFOLIO_PATHS.evidenceAccept(id),
      {},
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function returnEvidenceItem({ id, reason }) {
  try {
    const result = await $apiClient.post(PORTFOLIO_PATHS.evidenceReturn(id), {
      reason,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── EPA pack jobs ───────────────────────────────────────────────────────────
export async function createEpaPackJob(enrolmentId) {
  try {
    const result = await $apiClient.post(PORTFOLIO_PATHS.epaPackJobs, {
      enrolmentId,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getEpaPackJob(id) {
  try {
    const result = await $apiClient.get(PORTFOLIO_PATHS.epaPackJobById(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
