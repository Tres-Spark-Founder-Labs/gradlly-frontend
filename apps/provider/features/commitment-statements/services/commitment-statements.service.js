// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { COMMITMENT_PATHS } from "../constants";

/** @typedef {import("@/types/api").paths["/commitment-statements"]["get"]["parameters"]["query"]} CommitmentStatementsQuery */

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

/** @param {CommitmentStatementsQuery} [options] */
export async function listCommitmentStatements({
  page = 1,
  perPage = 20,
  enrolmentId,
  status,
} = {}) {
  try {
    const params = { page, perPage };
    if (enrolmentId) params.enrolmentId = enrolmentId;
    if (status) params.status = status;

    const result = await $apiClient.get(COMMITMENT_PATHS.BASE, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getCommitmentStatement(id) {
  try {
    const result = await $apiClient.get(COMMITMENT_PATHS.byId(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createCommitmentStatement(payload) {
  try {
    const result = await $apiClient.post(COMMITMENT_PATHS.BASE, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateCommitmentStatement({ id, payload }) {
  try {
    const result = await $apiClient.patch(COMMITMENT_PATHS.byId(id), payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// groupId — not the version id. Creates a fresh draft version for the group.
export async function createCommitmentVersion({ groupId, payload }) {
  try {
    const result = await $apiClient.post(
      COMMITMENT_PATHS.versions(groupId),
      payload,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function publishCommitmentStatement(id) {
  try {
    const result = await $apiClient.post(COMMITMENT_PATHS.publish(id), {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function cancelCommitmentStatement(id) {
  try {
    const result = await $apiClient.post(COMMITMENT_PATHS.cancel(id), {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function signCommitmentStatement({
  id,
  party,
  signatureImageKey,
}) {
  try {
    const result = await $apiClient.post(COMMITMENT_PATHS.sign(id), {
      party,
      signatureImageKey,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
