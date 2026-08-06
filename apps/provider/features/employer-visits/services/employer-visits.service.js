// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { EMPLOYER_VISIT_PATHS } from "../constants";

/** @typedef {import("@/types/api").paths["/employer-visits"]["get"]["parameters"]["query"]} EmployerVisitsQuery */

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

function unwrap(result) {
  return result.data?.data ?? result.data;
}

/** @param {EmployerVisitsQuery} [options] */
export async function listEmployerVisits({
  page = 1,
  perPage = 20,
  employerOrganisationId,
} = {}) {
  try {
    const params = { page, perPage };
    if (employerOrganisationId) {
      params.employerOrganisationId = employerOrganisationId;
    }
    const result = await $apiClient.get(EMPLOYER_VISIT_PATHS.BASE, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createEmployerVisit(payload) {
  try {
    const result = await $apiClient.post(EMPLOYER_VISIT_PATHS.BASE, payload);
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getNextVisitSuggestion(employerOrganisationId) {
  try {
    const result = await $apiClient.get(
      EMPLOYER_VISIT_PATHS.nextVisitSuggestion,
      { params: { employerOrganisationId } },
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
