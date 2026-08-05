// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { REVIEW_PATHS } from "../constants";

export async function listReviews({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(REVIEW_PATHS.BASE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
