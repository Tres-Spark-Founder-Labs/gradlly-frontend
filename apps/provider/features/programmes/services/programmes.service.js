// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { PROGRAMME_PATHS } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

export async function listProgrammes({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(PROGRAMME_PATHS.BASE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getProgramme(id) {
  try {
    const result = await $apiClient.get(PROGRAMME_PATHS.byId(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createProgramme(payload) {
  try {
    const result = await $apiClient.post(PROGRAMME_PATHS.BASE, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateProgramme({ id, payload }) {
  try {
    const result = await $apiClient.patch(PROGRAMME_PATHS.byId(id), payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function deleteProgramme(id) {
  try {
    await $apiClient.delete(PROGRAMME_PATHS.byId(id));
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
