// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { AI_PROGRAMME_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function listAiProgrammeCatalogue() {
  try {
    const result = await $apiClient.get(AI_PROGRAMME_PATHS.CATALOGUE);
    return unwrap(result) ?? [];
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getAiProgramme(programmeId) {
  try {
    const result = await $apiClient.get(AI_PROGRAMME_PATHS.byId(programmeId));
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createAiProgrammeEnrolment(payload) {
  try {
    const result = await $apiClient.post(
      AI_PROGRAMME_PATHS.ENROLMENTS,
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getAiProgrammeProgress(enrolmentId) {
  try {
    const result = await $apiClient.get(
      AI_PROGRAMME_PATHS.progress(enrolmentId),
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateAiProgrammeProgress({ enrolmentId, ...payload }) {
  try {
    const result = await $apiClient.post(
      AI_PROGRAMME_PATHS.progress(enrolmentId),
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function completeAiProgramme(enrolmentId) {
  try {
    const result = await $apiClient.post(
      AI_PROGRAMME_PATHS.complete(enrolmentId),
      {},
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
