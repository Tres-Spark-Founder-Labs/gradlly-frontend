"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { DAS_QUERY_KEYS } from "./keys";
import { DEFAULT_HORIZON_MONTHS } from "../constants";
import {
  getDasSyncStatus,
  getLevyBalance,
  getLevyForecast,
  listDasActivity,
  listFundingPayments,
  triggerDasSync,
} from "../services/das.service";

/**
 * Latest levy balance. Pass `pollWhileSyncing` to refetch every few seconds so
 * the UI picks up fresh data after a manual sync (there's no sync-job poll
 * endpoint — we watch lastSyncedAt/lastSyncStatus instead).
 */
export function useLevyBalance({ pollWhileSyncing = false, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: DAS_QUERY_KEYS.levyBalance(orgId),
    queryFn: getLevyBalance,
    enabled: !!orgId,
    refetchInterval: pollWhileSyncing ? 4000 : false,
    ...options,
  });
}

export function useLevyForecast(
  horizonMonths = DEFAULT_HORIZON_MONTHS,
  options = {},
) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: DAS_QUERY_KEYS.levyForecast(orgId, horizonMonths),
    queryFn: () => getLevyForecast({ horizonMonths }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useFundingPayments(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: DAS_QUERY_KEYS.fundingPayments(orgId, params),
    queryFn: () => listFundingPayments(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      payments: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useTriggerDasSync() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => triggerDasSync(),
    onSuccess: (data) => {
      toastSuccess(data?.message || "DAS sync queued — refreshing shortly.");
      // Fresh data lands async; nudge the DAS views to refetch.
      qc.invalidateQueries({ queryKey: DAS_QUERY_KEYS.all() });
    },
    onError: (error) => toastError(error.message),
  });
}

// ─── Sync health and API activity (F2.3.1 AC5 / AC7) ─────────────────────────

/**
 * F2.3.1 AC5 — the integration health band.
 *
 * Polled while the page is open, at the same 60s cadence as the intervention
 * queue. A health indicator that only updates on reload is the one thing a
 * health indicator must not be: someone watching it after a manual sync needs
 * to see it change without knowing to refresh.
 */
export function useDasSyncStatus({ refreshMs = 60_000, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: DAS_QUERY_KEYS.syncStatus(orgId),
    queryFn: getDasSyncStatus,
    enabled: !!orgId,
    refetchInterval: refreshMs,
    ...options,
  });
}

export function useDasActivity(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: DAS_QUERY_KEYS.activity(orgId, params),
    queryFn: () => listDasActivity(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      entries: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}
