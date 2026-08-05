// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

const ORG_PATHS = {
  CREATE: "/api/v1/organisations",
  byId: (id) => `/api/v1/organisations/${id}`,
};

export async function createOrganization(payload) {
  try {
    const result = await $apiClient.post(ORG_PATHS.CREATE, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// orgId identifies the resource in the URL path. The active organisation still
// travels globally on the X-Organisation-Id header (see lib/api/client).
export async function updateOrganization({ orgId, payload }) {
  try {
    const result = await $apiClient.patch(ORG_PATHS.byId(orgId), payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
