// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { LEARNER_PATHS } from "../constants";

/**
 * Query shapes are derived from the generated OpenAPI types rather than
 * restated here, so a filter the API stops accepting becomes a build failure
 * instead of a parameter the server silently ignores.
 *
 * @typedef {import("@/types/api").paths["/learners/cohort"]["get"]["parameters"]["query"]} CohortQuery
 * @typedef {import("@/types/api").paths["/learners/intervention-queue"]["get"]["parameters"]["query"]} InterventionQueueQuery
 */

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

/** @param {CohortQuery} [options] */
export async function listCohort({
  page = 1,
  perPage = 20,
  employerOrganisationId,
  standardId,
  statusBadge,
  tutorUserId,
  epaMonth,
  sortBy,
  sortOrder,
} = {}) {
  try {
    const params = { page, perPage };
    if (employerOrganisationId)
      params.employerOrganisationId = employerOrganisationId;
    if (standardId) params.standardId = standardId;
    if (statusBadge) params.statusBadge = statusBadge;
    if (tutorUserId) params.tutorUserId = tutorUserId;
    if (epaMonth) params.epaMonth = epaMonth;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    const result = await $apiClient.get(LEARNER_PATHS.cohort, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** F2.2.1 AC2 — employer, standard and tutor options for the filter bar. */
export async function getCohortFilterOptions() {
  try {
    const result = await $apiClient.get(LEARNER_PATHS.cohortFilterOptions);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** Filters only — page/perPage are meaningless for a whole-cohort export. */
function cohortFilterParams(filters = {}) {
  const params = {};
  if (filters.employerOrganisationId)
    params.employerOrganisationId = filters.employerOrganisationId;
  if (filters.standardId) params.standardId = filters.standardId;
  if (filters.statusBadge) params.statusBadge = filters.statusBadge;
  if (filters.tutorUserId) params.tutorUserId = filters.tutorUserId;
  if (filters.epaMonth) params.epaMonth = filters.epaMonth;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  return params;
}

/**
 * F2.2.1 AC5 — CSV of the whole filtered cohort, from the API.
 *
 * This used to be built in the browser from the rows already on screen, which
 * meant "Export CSV" silently produced the current page: twenty learners out
 * of four hundred, with nothing to indicate the rest were missing. The API
 * has always returned every matching row for `format=csv`.
 */
export async function downloadCohortCsv(filters = {}) {
  try {
    const result = await $apiClient.get(LEARNER_PATHS.cohort, {
      params: { ...cohortFilterParams(filters), format: "csv" },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([result.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `learner-cohort-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** F2.2.1 AC5 — queues the cohort PDF; poll the returned job like any other. */
export async function exportCohortPdf(filters = {}) {
  try {
    const result = await $apiClient.post(
      LEARNER_PATHS.cohortExportPdf,
      {},
      { params: cohortFilterParams(filters) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** @param {InterventionQueueQuery} [options] */
export async function getInterventionQueue({ tutorUserId, mine } = {}) {
  try {
    const params = {};
    if (tutorUserId) params.tutorUserId = tutorUserId;
    if (mine) params.mine = mine;

    const result = await $apiClient.get(LEARNER_PATHS.interventionQueue, {
      params,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function logIntervention({ enrolmentId, payload }) {
  try {
    const result = await $apiClient.post(
      LEARNER_PATHS.interventions(enrolmentId),
      payload,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getLearnerProfile(enrolmentId) {
  try {
    const result = await $apiClient.get(LEARNER_PATHS.profile(enrolmentId));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Tutor caseload (F2.2.5) ─────────────────────────────────────────────────

export async function getTutorCaseload() {
  try {
    const result = await $apiClient.get(LEARNER_PATHS.caseload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function assignTutorInBulk({ enrolmentIds, tutorUserId }) {
  try {
    const result = await $apiClient.post(LEARNER_PATHS.caseloadAssignTutor, {
      enrolmentIds,
      // Explicitly null rather than omitted: null un-assigns, which is a real
      // action when a tutor leaves.
      tutorUserId: tutorUserId || null,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
