// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { ENROLMENT_PATHS } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

function unwrap(result) {
  return result.data?.data ?? result.data;
}

// ─── Reads ────────────────────────────────────────────────────────────────────

export async function listEnrolments({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.BASE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function lookupCounterpartOrganisation(ukprn) {
  try {
    const result = await $apiClient.get(
      ENROLMENT_PATHS.counterpartOrganisationLookup,
      { params: { ukprn } },
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getEnrolment(id) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.byId(id));
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getParticipantOptions(enrolmentId) {
  try {
    const result = await $apiClient.get(
      ENROLMENT_PATHS.participantOptions(enrolmentId),
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getEnrolmentJourney(id) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.journey(id));
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createEnrolment(payload) {
  try {
    const result = await $apiClient.post(ENROLMENT_PATHS.BASE, payload);
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Sub-resource PATCH endpoints ────────────────────────────────────────────

export async function setEnrolmentJourney({ id, payload }) {
  try {
    const result = await $apiClient.patch(ENROLMENT_PATHS.journey(id), payload);
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function setEnrolmentParticipants({ id, payload }) {
  try {
    const result = await $apiClient.patch(
      ENROLMENT_PATHS.participants(id),
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function setEnrolmentOrganisationLinks({ id, payload }) {
  try {
    const result = await $apiClient.patch(
      ENROLMENT_PATHS.organisationLinks(id),
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Lifecycle actions (POST, no body) ───────────────────────────────────────

export async function activateEnrolment(id) {
  try {
    const result = await $apiClient.post(ENROLMENT_PATHS.activate(id), {});
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function acceptProviderEnrolment(id) {
  try {
    const result = await $apiClient.post(
      ENROLMENT_PATHS.acceptProvider(id),
      {},
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function completeEnrolment(id) {
  try {
    const result = await $apiClient.post(ENROLMENT_PATHS.complete(id), {});
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function cancelEnrolment(id) {
  try {
    const result = await $apiClient.post(ENROLMENT_PATHS.cancel(id), {});
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function recordEpaOutcome({ id, payload }) {
  try {
    const result = await $apiClient.post(
      ENROLMENT_PATHS.epaOutcome(id),
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Break in learning (F2.2.4 AC6) ──────────────────────────────────────────

export async function listBreaksInLearning(id) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.breakInLearning(id));
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function recordBreakInLearning({ id, payload }) {
  try {
    const result = await $apiClient.post(
      ENROLMENT_PATHS.breakInLearning(id),
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function endBreakInLearning({ id, payload }) {
  try {
    const result = await $apiClient.post(
      ENROLMENT_PATHS.breakInLearningEnd(id),
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
