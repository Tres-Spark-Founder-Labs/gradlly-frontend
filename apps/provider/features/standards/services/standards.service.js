// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { STANDARD_PATHS } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

export async function listStandards({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(STANDARD_PATHS.BASE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getStandard(id) {
  try {
    const result = await $apiClient.get(STANDARD_PATHS.byId(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createStandard(payload) {
  try {
    const result = await $apiClient.post(STANDARD_PATHS.BASE, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateStandard({ id, payload }) {
  try {
    const result = await $apiClient.patch(STANDARD_PATHS.byId(id), payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function deleteStandard(id) {
  try {
    await $apiClient.delete(STANDARD_PATHS.byId(id));
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
