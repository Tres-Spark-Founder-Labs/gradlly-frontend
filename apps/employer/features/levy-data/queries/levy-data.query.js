"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { LEVY_QUERY_KEYS } from "@/features/levy/queries/keys";
import { REPORTING_QUERY_KEYS } from "@/features/reporting/queries/keys";

import {
  createDonorLink,
  getDonorLinks,
  getStoredBalance,
  getStoredFundingPayments,
  getStoredMonthly,
  getStoredTranches,
  replaceMonthlySeries,
  replaceTranches,
  saveFundingPayment,
  saveLevyBalance,
} from "../services/levy-data.service";

export const LEVY_DATA_KEYS = {
  all: () => ["levy-data"],
  donorLinks: (orgId) => ["levy-data", "donor-links", orgId],
  balance: (orgId) => ["levy-data", "balance", orgId],
  monthly: (orgId) => ["levy-data", "monthly", orgId],
  tranches: (orgId, donorLinkId) => [
    "levy-data",
    "tranches",
    orgId,
    donorLinkId,
  ],
  fundingPayments: (orgId) => ["levy-data", "funding-payments", orgId],
};

/**
 * Everything the levy dashboard reads, invalidated after any manual write.
 *
 * ── WHY THIS MATTERS MORE THAN IT LOOKS ─────────────────────────────────────
 *
 * `useDonorLinks` polls on a 15-minute `refetchInterval` (DAS_BALANCE_POLL_MS).
 * Without invalidation an operator enters a balance, returns to the dashboard,
 * still sees an em dash — because the cached empty result has up to fifteen
 * minutes left — and reasonably concludes the save failed. So they enter it
 * again. The write was fine both times; only the cache was stale.
 *
 * `LEVY_QUERY_KEYS.all()` is `["levy"]`, and React Query matches by key prefix,
 * so it covers surplus, expiry calendar, donor links and donor analytics in one
 * call. The monthly series lives under the reporting keys and is invalidated
 * separately.
 */
function useInvalidateLevyViews() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return () => {
    qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.all() });
    qc.invalidateQueries({
      queryKey: REPORTING_QUERY_KEYS.levyUtilisation(orgId),
    });
    // Prefix match: covers donor links, and every form's own stored-row read,
    // so a form re-opened after a save shows what was actually written rather
    // than what was submitted.
    qc.invalidateQueries({ queryKey: LEVY_DATA_KEYS.all() });
  };
}

/** The DAS accounts tranches can be attached to. */
export function useManualDonorLinks() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_DATA_KEYS.donorLinks(orgId),
    queryFn: getDonorLinks,
    enabled: !!orgId,
    select: (rows) => (Array.isArray(rows) ? rows : []),
  });
}

export function useSaveLevyBalance() {
  const invalidate = useInvalidateLevyViews();
  return useMutation({
    mutationFn: saveLevyBalance,
    onSuccess: invalidate,
  });
}

export function useReplaceMonthlySeries() {
  const invalidate = useInvalidateLevyViews();
  return useMutation({
    mutationFn: (months) => replaceMonthlySeries(months),
    onSuccess: invalidate,
  });
}

export function useReplaceTranches() {
  const invalidate = useInvalidateLevyViews();
  return useMutation({
    mutationFn: ({ donorLinkId, tranches }) =>
      replaceTranches(donorLinkId, tranches),
    onSuccess: invalidate,
  });
}

export function useSaveFundingPayment() {
  const invalidate = useInvalidateLevyViews();
  return useMutation({
    mutationFn: saveFundingPayment,
    onSuccess: invalidate,
  });
}

export function useCreateDonorLink() {
  const invalidate = useInvalidateLevyViews();
  return useMutation({
    mutationFn: createDonorLink,
    onSuccess: invalidate,
  });
}

/* ── Stored values, for pre-populating the forms ──────────────────────────────
 *
 * Every write on this screen is replace-all, so a blank form is a trap: an
 * operator opening it to correct one month would submit a set of one and
 * delete the rest. These reads exist so the form opens showing what is stored.
 *
 * They deliberately do not reuse the dashboard's queries. Those endpoints round
 * and derive for display, and saving one back unchanged would quietly overwrite
 * the real rows — a no-op that is not one. `das-manual-roundtrip.e2e-spec.ts`
 * asserts the round trip per form.
 */

export function useStoredBalance() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_DATA_KEYS.balance(orgId),
    queryFn: getStoredBalance,
    enabled: !!orgId,
  });
}

export function useStoredMonthly() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_DATA_KEYS.monthly(orgId),
    queryFn: getStoredMonthly,
    enabled: !!orgId,
    select: (rows) => (Array.isArray(rows) ? rows : []),
  });
}

export function useStoredTranches(donorLinkId) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_DATA_KEYS.tranches(orgId, donorLinkId),
    queryFn: () => getStoredTranches(donorLinkId),
    // No link chosen yet means there is nothing to scope a read to — not an
    // empty result.
    enabled: !!orgId && !!donorLinkId,
    select: (rows) => (Array.isArray(rows) ? rows : []),
  });
}

export function useStoredFundingPayments() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_DATA_KEYS.fundingPayments(orgId),
    queryFn: getStoredFundingPayments,
    enabled: !!orgId,
    select: (rows) => (Array.isArray(rows) ? rows : []),
  });
}
