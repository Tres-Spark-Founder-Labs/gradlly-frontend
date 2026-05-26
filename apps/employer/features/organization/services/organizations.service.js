"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

const ORG_PATHS = {
  CREATE: "/api/v1/organisations",
};

export async function createOrganization(payload) {
  try {
    const result = await $apiClient.post(ORG_PATHS.CREATE, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
