"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { LEVY_EXCHANGE_QUERY_KEYS } from "./keys";
import {
  MATCH_APPLICATION_STATUS,
  MATCH_APPLICATIONS_PAGE_SIZE,
} from "../constants";
import {
  checkLevyEligibility,
  createMatchApplication,
  getRecipientProfile,
  listMatchApplications,
  saveRecipientProfile,
  searchMatches,
} from "../services/levy-exchange.service";

// Public eligibility self-assessment. No cache/invalidation — it's an anonymous,
// stateless POST whose result the UI holds locally.
export function useCheckLevyEligibility(options = {}) {
  return useMutation({
    mutationFn: checkLevyEligibility,
    ...options,
  });
}

// ─── Recipient side ───────────────────────────────────────────────────────────

/** `data` is null when the SME has no profile yet (the API's 404). */
export function useRecipientProfile(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_EXCHANGE_QUERY_KEYS.recipientProfile(orgId),
    queryFn: getRecipientProfile,
    enabled: !!orgId,
    ...options,
  });
}

export function useSaveRecipientProfile({ onSuccess, ...options } = {}) {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: saveRecipientProfile,
    onSuccess: (profile, ...rest) => {
      // The PUT returns the stored profile, so it replaces the cache directly.
      qc.setQueryData(
        LEVY_EXCHANGE_QUERY_KEYS.recipientProfile(orgId),
        profile,
      );
      toastSuccess("Recipient profile saved.");
      onSuccess?.(profile, ...rest);
    },
    onError: (error) => toastError(error.message),
    ...options,
  });
}

/**
 * A mutation, not a query: the search writes. When nothing matches, the
 * service inserts this organisation into the waiting pool, so it must run when
 * asked and never on a refetch.
 */
export function useSearchMatches(options = {}) {
  return useMutation({
    mutationFn: searchMatches,
    ...options,
  });
}

/**
 * Applications this SME has sent, newest first. `role: recipient` stops an
 * organisation that is also a donor from seeing applications made to it.
 */
export function useRecipientMatchApplications(options = {}) {
  const { orgId } = useAuthUser();
  const params = { role: "recipient", perPage: MATCH_APPLICATIONS_PAGE_SIZE };

  return useQuery({
    queryKey: LEVY_EXCHANGE_QUERY_KEYS.matchApplications(orgId, params),
    queryFn: () => listMatchApplications(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      applications: Array.isArray(response?.data) ? response.data : [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useCreateMatchApplication({ onSuccess, ...options } = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createMatchApplication,
    onSuccess: (application, ...rest) => {
      // The returned status decides the message: a donor with open matching
      // confirms automatically (F4.2.3 AC4); everyone else reviews it first.
      const status = application?.status;
      if (status === MATCH_APPLICATION_STATUS.CONFIRMED) {
        toastSuccess(
          "Match confirmed — this donor accepts applications automatically.",
        );
      } else if (status === MATCH_APPLICATION_STATUS.PENDING) {
        toastSuccess("Application sent. The donor will review it.");
      } else {
        toastSuccess("Application sent.");
      }
      qc.invalidateQueries({
        queryKey: [...LEVY_EXCHANGE_QUERY_KEYS.all(), "match-applications"],
      });
      onSuccess?.(application, ...rest);
    },
    onError: (error) => toastError(error.message),
    ...options,
  });
}
