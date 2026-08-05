// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { OFSTED_PATHS } from "../constants";

/** @typedef {import("@/types/api").paths["/ofsted/evidence-packs"]["post"]["requestBody"]["content"]["application/json"]} CreateEvidencePackBody */

/** @typedef {import("@/types/api").paths["/qip-actions"]["get"]["parameters"]["query"]} QipActionsQuery */

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

// ─── EIF criteria + scores ───────────────────────────────────────────────────
export async function getEifCriteria() {
  try {
    const result = await $apiClient.get(OFSTED_PATHS.eifCriteria);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getEifScores() {
  try {
    const result = await $apiClient.get(OFSTED_PATHS.eifScores);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** F2.1.1 AC5 — twelve-month score movement, one series per criterion. */
export async function getEifScoreTrend() {
  try {
    const result = await $apiClient.get(OFSTED_PATHS.eifScoreTrend);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── QIP actions ─────────────────────────────────────────────────────────────
/** @param {QipActionsQuery} [options] */
export async function listQipActions({
  page = 1,
  perPage = 20,
  status,
  eifCriterionSlug,
  overdue,
} = {}) {
  try {
    const params = { page, perPage };
    if (status) params.status = status;
    if (eifCriterionSlug) params.eifCriterionSlug = eifCriterionSlug;
    if (overdue) params.overdue = overdue;

    const result = await $apiClient.get(OFSTED_PATHS.qipActions, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getQipSummary() {
  try {
    const result = await $apiClient.get(OFSTED_PATHS.qipSummary);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createQipAction(payload) {
  try {
    const result = await $apiClient.post(OFSTED_PATHS.qipActions, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateQipAction({ id, payload }) {
  try {
    const result = await $apiClient.patch(
      OFSTED_PATHS.qipActionById(id),
      payload,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F2.1.2 — progress only: status, evidence notes and attachments.
 *
 * Separate from updateQipAction because the capability behind it is wider.
 * A tutor who did the work marks it done; what the plan *contains* stays with
 * whoever owns the plan. The narrow payload is what makes that safe — this
 * route cannot reach the title, owner, target date or criterion.
 */
export async function updateQipActionProgress({ id, payload }) {
  try {
    const result = await $apiClient.patch(
      OFSTED_PATHS.qipActionProgress(id),
      payload,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function deleteQipAction(id) {
  try {
    await $apiClient.delete(OFSTED_PATHS.qipActionById(id));
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── SAR (F2.1.3) ────────────────────────────────────────────────────────────
export async function listSarReports() {
  try {
    const result = await $apiClient.get(OFSTED_PATHS.sarReports);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** Idempotent on the API — asking twice returns the draft already started. */
export async function generateSarReport(academicYear) {
  try {
    const result = await $apiClient.post(OFSTED_PATHS.sarReports, {
      academicYear,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateSarReport({ id, sections }) {
  try {
    const result = await $apiClient.patch(OFSTED_PATHS.sarReportById(id), {
      sections,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function lockSarReport(id) {
  try {
    const result = await $apiClient.post(OFSTED_PATHS.sarReportLock(id), {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F2.1.3 AC3 — the Word document, served inline rather than queued.
 *
 * `responseType: "blob"` matters: without it axios parses the .docx bytes as
 * text and the saved file is corrupt.
 */
export async function downloadSarDocx({ id, academicYear }) {
  try {
    const result = await $apiClient.get(OFSTED_PATHS.sarReportExport(id), {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([result.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `sar-${academicYear}.docx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Safeguarding checklist ──────────────────────────────────────────────────
export async function getSafeguardingChecklist() {
  try {
    const result = await $apiClient.get(OFSTED_PATHS.safeguardingChecklist);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function completeSafeguardingItem({ slug, evidenceStorageKey }) {
  try {
    const body = {};
    if (evidenceStorageKey) body.evidenceStorageKey = evidenceStorageKey;
    const result = await $apiClient.patch(
      OFSTED_PATHS.safeguardingItem(slug),
      body,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Programme documents ─────────────────────────────────────────────────────
export async function listProgrammeDocuments(programmeId) {
  try {
    const result = await $apiClient.get(
      OFSTED_PATHS.programmeDocuments(programmeId),
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createProgrammeDocument({ programmeId, payload }) {
  try {
    const result = await $apiClient.post(
      OFSTED_PATHS.programmeDocuments(programmeId),
      payload,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Evidence pack jobs (owner/admin) ────────────────────────────────────────
/** @param {CreateEvidencePackBody} [options] */
export async function createEvidencePackJob({ additionalStorageKeys } = {}) {
  try {
    const body = {};
    if (additionalStorageKeys?.length) {
      body.additionalStorageKeys = additionalStorageKeys;
    }
    const result = await $apiClient.post(OFSTED_PATHS.evidencePacks, body);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getEvidencePackJob(id) {
  try {
    const result = await $apiClient.get(OFSTED_PATHS.evidencePackById(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F2.1.2 AC5 — queues the Quality Improvement Plan as a PDF.
 *
 * Returns a job to poll, like every other PDF on the platform.
 */
export async function exportQipPlan() {
  try {
    const result = await $apiClient.post(OFSTED_PATHS.qipExport, {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
