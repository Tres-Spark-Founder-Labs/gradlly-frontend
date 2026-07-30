"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { ENROLMENT_PATHS } from "../constants";

export async function listEnrolments({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.BASE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getEnrolmentJourney(id) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.journey(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
