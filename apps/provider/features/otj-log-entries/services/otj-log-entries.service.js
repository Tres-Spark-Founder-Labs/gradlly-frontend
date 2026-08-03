"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { OTJ_PATHS } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

export async function listOtjEntries({
  page = 1,
  perPage = 20,
  status,
  apprenticeId,
  enrolmentId,
  category,
  from,
  to,
} = {}) {
  try {
    const params = { page, perPage };
    if (status) params.status = status;
    if (apprenticeId) params.apprenticeId = apprenticeId;
    if (enrolmentId) params.enrolmentId = enrolmentId;
    if (category) params.category = category;
    if (from) params.from = from;
    if (to) params.to = to;

    const result = await $apiClient.get(OTJ_PATHS.BASE, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getOtjEntry(id) {
  try {
    const result = await $apiClient.get(OTJ_PATHS.byId(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listOtjCategories() {
  try {
    const result = await $apiClient.get(OTJ_PATHS.categories);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// Bulk endpoints return 201 with a per-id results[] even on partial failure, so
// we surface the full BulkOtjActionResponseDto for the caller to inspect.
export async function bulkApproveOtj({ ids }) {
  try {
    const result = await $apiClient.post(OTJ_PATHS.bulkApprove, { ids });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function bulkRejectOtj({ ids, reason }) {
  try {
    const body = { ids };
    if (reason) body.reason = reason;
    const result = await $apiClient.post(OTJ_PATHS.bulkReject, body);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// ─── Tutor flag (F2.2.4 AC3) ─────────────────────────────────────────────────
//
// Distinct from approve/reject: those are the employer deciding whether the
// hours count. A flag keeps the hours and asks a question about them.

export async function flagOtjEntry({ id, note }) {
  try {
    const result = await $apiClient.post(OTJ_PATHS.flag(id), { note });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function unflagOtjEntry(id) {
  try {
    const result = await $apiClient.post(OTJ_PATHS.unflag(id), {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
