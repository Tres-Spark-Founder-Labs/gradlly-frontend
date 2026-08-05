// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { APPRENTICE_PATHS } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

export async function listApprentices({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(APPRENTICE_PATHS.BASE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getApprentice(id) {
  try {
    const result = await $apiClient.get(APPRENTICE_PATHS.byId(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createApprentice(payload) {
  try {
    const result = await $apiClient.post(APPRENTICE_PATHS.BASE, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateApprentice({ id, payload }) {
  try {
    const result = await $apiClient.patch(APPRENTICE_PATHS.byId(id), payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function deleteApprentice(id) {
  try {
    await $apiClient.delete(APPRENTICE_PATHS.byId(id));
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
