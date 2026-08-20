"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { PORTFOLIO_PATHS } from "../constants";

/**
 * F3.3.4 EPA Evidence Pack Export — the apprentice's side.
 *
 * The endpoints are the ones the provider portal already calls. Nothing new is
 * added to the API here; the feature was missing a route and a component, not a
 * backend.
 */

/** Queues the build. Returns the job so the caller can poll it. */
export async function createEpaPackJob(enrolmentId) {
  try {
    const result = await $apiClient.post(PORTFOLIO_PATHS.EPA_PACK_JOBS, {
      enrolmentId,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

/**
 * Polls one job.
 *
 * The response carries `status`, `manifest` and — once complete — `downloadUrl`
 * and `downloadExpiresAt`. The manifest is what the finished pack actually
 * contains, as opposed to the preview's estimate of what it will contain.
 */
export async function getEpaPackJob(id) {
  try {
    const result = await $apiClient.get(PORTFOLIO_PATHS.epaPackJobById(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
