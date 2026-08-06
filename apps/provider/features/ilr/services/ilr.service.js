// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { ILR_PATHS } from "../constants";

/** @typedef {import("@/types/api").paths["/ilr/learner-records"]["get"]["parameters"]["query"]} IlrRecordsQuery */

/** @typedef {import("@/types/api").paths["/ilr/funding-claims"]["get"]["parameters"]["query"]} FundingClaimsQuery */

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

// ─── Learner records ─────────────────────────────────────────────────────────
export async function buildIlrRecord(payload) {
  try {
    const result = await $apiClient.post(ILR_PATHS.build, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** @param {IlrRecordsQuery} [options] */
export async function listIlrRecords({
  page = 1,
  perPage = 20,
  enrolmentId,
  collectionPeriod,
  status,
} = {}) {
  try {
    const params = { page, perPage };
    if (enrolmentId) params.enrolmentId = enrolmentId;
    if (collectionPeriod) params.collectionPeriod = collectionPeriod;
    if (status) params.status = status;

    const result = await $apiClient.get(ILR_PATHS.records, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getIlrRecord(id) {
  try {
    const result = await $apiClient.get(ILR_PATHS.recordById(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateIlrOverrides({ id, manualOverrides }) {
  try {
    const result = await $apiClient.patch(ILR_PATHS.recordById(id), {
      manualOverrides,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function validateIlrRecord(id) {
  try {
    const result = await $apiClient.post(ILR_PATHS.validate(id), {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getIlrValidationReport(id) {
  try {
    const result = await $apiClient.get(ILR_PATHS.validationReport(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function submitIlrRecord(id) {
  try {
    const result = await $apiClient.post(ILR_PATHS.submit(id), {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function amendIlrRecord(id) {
  try {
    const result = await $apiClient.post(ILR_PATHS.amend(id), {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listRecordSubmissions(id) {
  try {
    const result = await $apiClient.get(ILR_PATHS.recordSubmissions(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Submissions (poll) ──────────────────────────────────────────────────────
export async function getIlrSubmission(id) {
  try {
    const result = await $apiClient.get(ILR_PATHS.submissionById(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Mapping configs ─────────────────────────────────────────────────────────
export async function listMappingConfigs() {
  try {
    const result = await $apiClient.get(ILR_PATHS.mappingConfigs);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getActiveMappingConfig(academicYear) {
  try {
    const result = await $apiClient.get(ILR_PATHS.mappingConfigActive, {
      params: { academicYear },
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createMappingConfig(payload) {
  try {
    const result = await $apiClient.post(ILR_PATHS.mappingConfigs, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function publishMappingConfig(id) {
  try {
    const result = await $apiClient.post(
      ILR_PATHS.mappingConfigPublish(id),
      {},
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Funding claim tracker (F2.3.2 AC7) ──────────────────────────────────────

/** @param {FundingClaimsQuery} [options] */
export async function listFundingClaims({
  page = 1,
  perPage = 20,
  discrepanciesOnly,
} = {}) {
  try {
    const params = { page, perPage };
    if (discrepanciesOnly) params.discrepanciesOnly = "true";
    const result = await $apiClient.get(ILR_PATHS.fundingClaims, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function setFundingClaimResolution({ enrolmentId, payload }) {
  try {
    const result = await $apiClient.patch(
      ILR_PATHS.fundingClaimResolution(enrolmentId),
      payload,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
