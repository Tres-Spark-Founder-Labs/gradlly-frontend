"use client";

import { useCallback } from "react";

import { DONOR_LINK_STATUSES } from "@/features/levy/constants";
import {
  useDonorLinks,
  useSyncDonorLink,
} from "@/features/levy/queries/levy.query";

import { fmtAgo, fmtSyncedAt } from "./helpers";

export function useDasSync() {
  const { data: donorLinks = [], isLoading } = useDonorLinks();
  const syncMutation = useSyncDonorLink();

  const activeLink =
    donorLinks.find((l) => l.status === DONOR_LINK_STATUSES.ACTIVE) ??
    donorLinks[0] ??
    null;

  // Whether a DAS account is connected at all. Distinct from "degraded":
  // no link means nothing to sync, which is an onboarding state, not a fault.
  const hasLink = donorLinks.length > 0;

  // F1.1.1 AC4. Changed from every() to some(): with several linked DAS
  // accounts, one failing sync already makes the displayed total stale, and
  // silently under-reporting a levy balance is the costlier error on a finance
  // dashboard. Judgment call — over-warn rather than under-warn.
  const isDegraded =
    !isLoading &&
    hasLink &&
    donorLinks.some((l) => l.status === DONOR_LINK_STATUSES.ERROR);

  // F1.1.1 AC1/AC2. The authoritative levy balance is the DAS-sourced
  // lastBalance on each linked account, summed across accounts. It is NOT
  // availableSurplus from /levy-exchange/surplus — that is Gradlly's derived
  // transfer headroom (balance minus commitments minus transfers), not the
  // figure DAS reports. Amounts arrive as numeric(14,2) strings.
  const balance = hasLink
    ? donorLinks.reduce((total, l) => {
        const v = Number(l?.lastBalance);
        return Number.isFinite(v) ? total + v : total;
      }, 0)
    : null;

  /**
   * Whether any part of the displayed balance was typed in rather than synced.
   *
   * `.some()`, matching isDegraded above and for the same reason. The balance
   * is a SUM across accounts: if one account's figure was entered by hand, the
   * total is not a DAS-sourced number, and labelling it "DAS synced" is the
   * false claim being removed. Over-disclose rather than under-disclose.
   */
  const isManual =
    hasLink && donorLinks.some((l) => l.status === DONOR_LINK_STATUSES.MANUAL);

  // Most recent successful sync across all linked accounts.
  const lastSynced = donorLinks.reduce((latest, l) => {
    if (!l?.lastSyncedAt) return latest;
    const d = new Date(l.lastSyncedAt);
    return !latest || d > latest ? d : latest;
  }, null);

  const activeLinkId = activeLink?.id ?? null;

  const sync = useCallback(() => {
    if (!activeLinkId || syncMutation.isPending) return;
    syncMutation.mutate(activeLinkId);
  }, [activeLinkId, syncMutation]);

  return {
    syncState: syncMutation.isPending
      ? "syncing"
      : syncMutation.isSuccess
        ? "done"
        : syncMutation.isError
          ? "error"
          : "idle",
    isDegraded,
    isManual,
    hasLink,
    balance,
    sync,
    lastSynced,
    fmtLastSynced: () => fmtAgo(lastSynced),
    fmtSyncedAt: () => fmtSyncedAt(lastSynced),
    isLoading,
  };
}
