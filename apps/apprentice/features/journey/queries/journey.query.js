// @ts-check
"use client";

import { useQuery } from "@tanstack/react-query";

import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";

import { JOURNEY_QUERY_KEYS } from "./keys";
import { getEnrolmentJourney } from "../services/journey.service";

/**
 * The learner's own journey.
 *
 * The apprentice never types an enrolment id — it comes from
 * `GET /learners/me/summary`, which resolves the caller's own active
 * enrolment. That indirection is deliberate: client decision D3 says no
 * learner may see another learner's progress, and an id the client chooses is
 * an id the client can change. The API enforces this independently
 * (`LearnerScopeService`), so this is defence in depth rather than the only
 * guard.
 */
export function useEnrolmentJourney(options = {}) {
  const summary = useLearnerSummary();
  const enrolmentId = summary.data?.activeEnrolmentId ?? null;

  const query = useQuery({
    queryKey: JOURNEY_QUERY_KEYS.detail(enrolmentId),
    queryFn: () => getEnrolmentJourney(/** @type {string} */ (enrolmentId)),
    enabled: !!enrolmentId,
    ...options,
  });

  return {
    ...query,
    /**
     * True while either request is in flight. Without this the screen renders
     * its "no enrolment" empty state during the first paint, because the
     * summary has not resolved an id yet — a flash of "you have no programme"
     * at every page load.
     */
    isLoading: summary.isLoading || (!!enrolmentId && query.isLoading),
    enrolmentId,
    /** No active enrolment at all — a real state, not an error. */
    hasNoEnrolment: !summary.isLoading && !summary.isError && !enrolmentId,
  };
}
