// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { ESIGNATURE_PATHS } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

export async function createSignatureRecord(payload) {
  try {
    const result = await $apiClient.post(ESIGNATURE_PATHS.records, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getSignatureRecord(id) {
  try {
    const result = await $apiClient.get(ESIGNATURE_PATHS.recordById(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// Returns SignSignatureRecordResponseDto. Note: 200 (not 201), idempotent on
// success — re-signing a signed record returns the existing signed result.
export async function signSignatureRecord(id) {
  try {
    const result = await $apiClient.post(ESIGNATURE_PATHS.sign(id), {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
