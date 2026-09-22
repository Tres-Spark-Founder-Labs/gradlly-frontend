"use client";

import { $apiClient } from "@/lib/api/client";
import { API_MAX_PER_PAGE, fetchAllPages } from "@/lib/api/fetch-all-pages";
import { normalizeApiClientError } from "@/lib/errors";

import { APPRENTICE_PATHS } from "../constants";

function buildHeaders(orgId) {
  if (!orgId) return {};
  return { "x-organisation-id": orgId };
}

export async function getApprentices({ orgId, page = 1, perPage = 100 } = {}) {
  try {
    const result = await $apiClient.get(
      `${APPRENTICE_PATHS.LIST}?page=${page}&perPage=${perPage}`,
      { headers: buildHeaders(orgId) },
    );
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F1.2.1 AC6 — queues the roster as a PDF. `body` is the screen state from
 * `toRosterExportQuery`, so the document is the table on screen.
 */
export async function exportRosterPdf({ orgId, body }) {
  try {
    const result = await $apiClient.post(APPRENTICE_PATHS.ROSTER_EXPORT, body, {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * F1.2.1 AC7 — every apprentice, not page 1. See `fetchAllPages` for why
 * this is five parallel pages at 500 rather than one large request.
 */
export function getAllApprentices({ orgId } = {}) {
  return fetchAllPages((page) =>
    getApprentices({ orgId, page, perPage: API_MAX_PER_PAGE }),
  );
}

export async function getApprentice({ orgId, id }) {
  try {
    const result = await $apiClient.get(APPRENTICE_PATHS.detail(id), {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createApprentice({ orgId, body }) {
  try {
    const result = await $apiClient.post(APPRENTICE_PATHS.LIST, body, {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
