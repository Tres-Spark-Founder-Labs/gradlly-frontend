"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { REPORTING_QUERY_KEYS } from "@/features/reporting/queries/reporting.query";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { EMPLOYER_VISIT_QUERY_KEYS } from "./keys";
import {
  createEmployerVisit,
  getNextVisitSuggestion,
  listEmployerVisits,
} from "../services/employer-visits.service";

export function useEmployerVisits(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: EMPLOYER_VISIT_QUERY_KEYS.list(orgId, params),
    queryFn: () => listEmployerVisits(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      visits: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

/**
 * F2.4.2 AC4 — the date the form should offer for the next visit.
 *
 * Only fetched once an employer is chosen, because the suggestion is counted
 * from that employer's own last visit.
 */
export function useNextVisitSuggestion(employerOrganisationId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: EMPLOYER_VISIT_QUERY_KEYS.nextSuggestion(
      orgId,
      employerOrganisationId,
    ),
    queryFn: () => getNextVisitSuggestion(employerOrganisationId),
    enabled: !!orgId && !!employerOrganisationId,
    ...options,
  });
}

export function useCreateEmployerVisit() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createEmployerVisit(payload),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Visit recorded.");
      qc.invalidateQueries({ queryKey: EMPLOYER_VISIT_QUERY_KEYS.all() });
      /**
       * The employer directory's `lastVisitDate` is derived from these rows,
       * so it goes stale the moment a visit is logged. Invalidating only the
       * visit list would leave the directory still saying "Never visited" for
       * an employer just visited.
       */
      qc.invalidateQueries({ queryKey: REPORTING_QUERY_KEYS.all() });
    },
    // Forms render field errors themselves via applyServerErrors.
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}
