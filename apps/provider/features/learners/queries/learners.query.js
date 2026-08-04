"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { LEARNER_QUERY_KEYS } from "./keys";
import { INTERVENTION_QUEUE_REFRESH_MS } from "../constants";
import {
  assignTutorInBulk,
  downloadCohortCsv,
  exportCohortPdf,
  getCohortFilterOptions,
  getInterventionQueue,
  getLearnerProfile,
  getTutorCaseload,
  listCohort,
  logIntervention,
} from "../services/learners.service";

export function useCohort(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEARNER_QUERY_KEYS.cohort(orgId, params),
    queryFn: () => listCohort(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      entries: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

/**
 * F2.2.2 AC4 — "queue updates in real time as underlying data changes".
 *
 * Read as: a tutor who leaves this open sees the queue change without
 * reloading. Polling, not push — nothing in this platform has a socket or an
 * event stream, and building one for a list that turns over on the order of
 * hours would be a large piece of infrastructure for no extra freshness that
 * anyone could act on. This matches the client's answered decision 6 on what
 * "real time" means here.
 *
 * `refetchIntervalInBackground` stays false deliberately: a hidden tab
 * polling all afternoon spends the request budget on a queue nobody is
 * looking at, and window focus already triggers a refetch on return.
 */
export function useInterventionQueue(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEARNER_QUERY_KEYS.interventionQueue(orgId, params),
    queryFn: () => getInterventionQueue(params),
    enabled: !!orgId,
    refetchInterval: INTERVENTION_QUEUE_REFRESH_MS,
    refetchIntervalInBackground: false,
    // Anything older than the refresh cycle is stale by definition; without
    // this the interval fires and react-query serves the cache instead.
    staleTime: 0,
    select: (data) => ({
      atRiskCount: data?.atRiskCount ?? 0,
      items: data?.items ?? [],
    }),
    ...options,
  });
}

export function useLearnerProfile(enrolmentId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEARNER_QUERY_KEYS.profile(orgId, enrolmentId),
    queryFn: () => getLearnerProfile(enrolmentId),
    enabled: !!orgId && !!enrolmentId,
    ...options,
  });
}

export function useLogIntervention() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ enrolmentId, payload }) =>
      logIntervention({ enrolmentId, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Intervention logged.");
      // Refresh the queue (severity may change) and any learner views.
      qc.invalidateQueries({ queryKey: LEARNER_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

/** F2.2.1 AC5 — CSV of the whole filtered cohort, not the visible page. */
export function useDownloadCohortCsv() {
  return useMutation({
    mutationFn: (filters) => downloadCohortCsv(filters),
    onError: (error) => toastError(error.message),
  });
}

/** F2.2.1 AC5 — queues the cohort PDF through the shared job pipeline. */
export function useExportCohortPdf() {
  return useMutation({
    mutationFn: (filters) => exportCohortPdf(filters),
    onError: (error) => toastError(error.message),
  });
}

/** F2.2.1 AC2 — employer, standard and tutor options for the filter bar. */
export function useCohortFilterOptions(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEARNER_QUERY_KEYS.cohortFilterOptions(orgId),
    queryFn: getCohortFilterOptions,
    enabled: !!orgId,
    select: (data) => ({
      employers: data?.employers ?? [],
      standards: data?.standards ?? [],
      tutors: data?.tutors ?? [],
    }),
    ...options,
  });
}

// ─── Tutor caseload (F2.2.5) ─────────────────────────────────────────────────

export function useTutorCaseload(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEARNER_QUERY_KEYS.caseload(orgId),
    queryFn: getTutorCaseload,
    enabled: !!orgId,
    ...options,
  });
}

export function useAssignTutorInBulk() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ enrolmentIds, tutorUserId }) =>
      assignTutorInBulk({ enrolmentIds, tutorUserId }),
    onSuccess: (data) => {
      /**
       * The API reports how many it actually reassigned. Saying "12 learners
       * reassigned" when the server wrote 9 — because three ids were not
       * found — is the kind of quiet lie this project keeps finding, so the
       * toast reports the server's number rather than the selection size.
       */
      const updated = data?.updated ?? 0;
      toastSuccess(
        updated === 1
          ? "1 learner reassigned."
          : `${updated} learners reassigned.`,
      );
      // The cohort table shows the tutor column, and the caseload and
      // intervention queue both bucket by tutor.
      qc.invalidateQueries({ queryKey: LEARNER_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}
