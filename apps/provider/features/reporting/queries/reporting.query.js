"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { INTERVENTION_QUEUE_REFRESH_MS } from "@/features/learners/constants";

import {
  getProviderDashboard,
  listEmployerDirectory,
} from "../services/reporting.service";

export const REPORTING_QUERY_KEYS = {
  all: () => ["reporting"],
  providerDashboard: (orgId) => ["reporting", "provider-dashboard", orgId],
  employerDirectory: (orgId, params = {}) => [
    "reporting",
    "employer-directory",
    orgId,
    params,
  ],
};

/**
 * Also backs the sidebar at-risk badge (F2.2.1 AC6), which is why it refreshes
 * on the same cycle as the intervention queue (F2.2.2 AC4). A badge that keeps
 * claiming four when the queue it links to shows two teaches people to
 * distrust both numbers.
 *
 * Not polled in a background tab — window focus already refetches on return.
 */
export function useProviderDashboard(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.providerDashboard(orgId),
    queryFn: getProviderDashboard,
    enabled: !!orgId,
    refetchInterval: INTERVENTION_QUEUE_REFRESH_MS,
    refetchIntervalInBackground: false,
    staleTime: 0,
    ...options,
  });
}

export function useEmployerDirectory(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.employerDirectory(orgId, params),
    queryFn: () => listEmployerDirectory(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      employers: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

// Linked employers as { value, text } options for select inputs (e.g. the
// enrolment "link employer organisation" modal). Reuses the employer directory
// endpoint and pulls a wide page so every linked employer is selectable.
export function useLinkedEmployerOptions(options = {}) {
  const { orgId } = useAuthUser();
  const params = { page: 1, perPage: 200 };

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.employerDirectory(orgId, params),
    queryFn: () => listEmployerDirectory(params),
    enabled: !!orgId,
    select: (response) =>
      (response?.data ?? []).map((row) => ({
        value: row.employerOrganisationId,
        text: row.organisationName,
      })),
    ...options,
  });
}
