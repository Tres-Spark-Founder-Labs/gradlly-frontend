// @ts-check
"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { pipelinePaths } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client). All three push pipelines share the same 3
// endpoints, so these helpers are parameterised by the pipeline base path.

export async function listFailedPushes(base, { page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(pipelinePaths(base).failed, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getPush(base, id) {
  try {
    const result = await $apiClient.get(pipelinePaths(base).byId(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// 204 No Content — re-queues delivery; the record returns to queued/processing.
export async function retryPush(base, id) {
  try {
    await $apiClient.post(pipelinePaths(base).retry(id), {});
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
