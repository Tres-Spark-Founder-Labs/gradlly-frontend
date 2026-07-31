"use client";

import { APPRENTICE_PATHS } from "@/features/apprentices/constants";
import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { ENROLMENT_PATHS } from "../constants";

function buildHeaders(orgId) {
  if (!orgId) return {};
  return { "x-organisation-id": orgId };
}

export async function getEnrolments({ orgId, page = 1, perPage = 100 } = {}) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.LIST, {
      params: { page, perPage },
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listEnrolments({ page = 1, perPage = 20, orgId } = {}) {
  return getEnrolments({ orgId, page, perPage });
}

export async function getEnrolment({ orgId, id }) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.detail(id), {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getEnrolmentJourney({ orgId, id }) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.journey(id), {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createEnrolment({ orgId, body }) {
  try {
    const result = await $apiClient.post(ENROLMENT_PATHS.LIST, body, {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Enrolment linking and activation (F1.2.5) ──────────────────────────────

/** AC2 — providers that have accepted a previous enrolment from this employer. */
export async function listLinkedProviders({ orgId } = {}) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.LINKED_PROVIDERS, {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data ?? [];
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** AC1 — users who can be named as the line manager. */
export async function listEmployerManagerOptions({ orgId } = {}) {
  try {
    const result = await $apiClient.get(
      ENROLMENT_PATHS.EMPLOYER_MANAGER_OPTIONS,
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data ?? [];
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** AC2 — attach the employer and the chosen training provider. */
export async function updateEnrolmentOrganisationLinks({ orgId, id, body }) {
  try {
    const result = await $apiClient.patch(
      ENROLMENT_PATHS.organisationLinks(id),
      body,
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/** AC1 — attach the line manager, who receives the at-risk alerts (F1.2.4). */
export async function updateEnrolmentParticipants({ orgId, id, body }) {
  try {
    const result = await $apiClient.patch(
      ENROLMENT_PATHS.participants(id),
      body,
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * AC3/AC4/AC5 — activation is what actually starts the enrolment.
 *
 * It sends the apprentice their magic-link invitation, notifies the provider
 * that acceptance is pending, and moves the pipeline to `invited`. Creating
 * the enrolment alone leaves a draft that does none of those things.
 */
export async function activateEnrolment({ orgId, id }) {
  try {
    const result = await $apiClient.post(
      ENROLMENT_PATHS.activate(id),
      {},
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listApprentices({ page = 1, perPage = 100, orgId } = {}) {
  try {
    const result = await $apiClient.get(APPRENTICE_PATHS.LIST, {
      params: { page, perPage },
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
