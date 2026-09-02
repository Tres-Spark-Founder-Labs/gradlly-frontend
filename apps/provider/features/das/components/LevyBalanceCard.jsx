"use client";

import {
  AlertTriangle,
  Loader2,
  PlugZap,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

import { DAS_SYNC_STATUS, DAS_SYNC_STATUS_LABELS } from "../constants";
import { useLevyBalance, useTriggerDasSync } from "../queries/das.query";

function money(value, currency = "GBP") {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "GBP",
  }).format(n);
}

function relativeTime(iso) {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const diffMin = Math.round((Date.now() - then) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.round(diffH / 24)}d ago`;
}

export function LevyBalanceCard() {
  // While a sync is in flight we poll the balance until lastSyncedAt advances.
  const [syncing, setSyncing] = useState(false);
  const syncedAtBefore = useRef(null);

  const { data: balance } = useLevyBalance({ pollWhileSyncing: syncing });
  const sync = useTriggerDasSync();

  // Detect fresh data landing: stop polling when lastSyncedAt advances past the
  // value captured at sync time (or the status flips to failed).
  useEffect(() => {
    if (!syncing) return;
    const now = balance?.lastSyncedAt ?? null;
    const advanced = now && now !== syncedAtBefore.current;
    const failed = balance?.lastSyncStatus === DAS_SYNC_STATUS.FAILED;
    if (advanced || failed) setSyncing(false);
  }, [syncing, balance]);

  const handleSync = async () => {
    syncedAtBefore.current = balance?.lastSyncedAt ?? null;
    try {
      await sync.mutateAsync();
      setSyncing(true);
    } catch {
      // toast via mutation
    }
  };

  const status = balance?.lastSyncStatus ?? DAS_SYNC_STATUS.IDLE;
  const isIdle = status === DAS_SYNC_STATUS.IDLE;
  const isFailed = status === DAS_SYNC_STATUS.FAILED;
  // A hand-entered figure is neither a success nor a failure. It gets a neutral
  // tone so the badge does not read as a green tick over data nobody synced.
  const isManual = status === DAS_SYNC_STATUS.MANUAL;
  const formatted = money(balance?.balance, balance?.currency);
  const busy = sync.isPending || syncing;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 text-neutral-400" aria-hidden />
          <h2 className="text-base font-semibold text-neutral-900">
            Levy balance
          </h2>
        </div>
        <Button
          size="sm"
          color="black"
          variant="neutral"
          loading={busy}
          disabled={busy}
          startIcon={<RefreshCw className="size-4" />}
          onClick={handleSync}
        >
          {syncing ? "Syncing…" : "Sync now"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isIdle ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
              <PlugZap className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                DAS not synced yet
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Sync to pull your levy balance from the apprenticeship service.
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-3xl font-bold tracking-tight text-neutral-900">
              {formatted ?? "—"}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ring-1 ring-inset",
                  isFailed
                    ? "bg-danger-50 text-danger-600 ring-danger-200"
                    : isManual
                      ? "bg-neutral-100 text-neutral-600 ring-neutral-200"
                      : "bg-emerald-50 text-emerald-700 ring-emerald-200",
                )}
              >
                {syncing ? (
                  <Loader2 className="size-3 animate-spin" aria-hidden />
                ) : null}
                {DAS_SYNC_STATUS_LABELS[status] ?? status}
              </span>
              {balance?.lastSyncedAt ? (
                <span className="text-neutral-400">
                  {relativeTime(balance.lastSyncedAt)}
                </span>
              ) : null}
              {balance?.accountId ? (
                <span className="text-neutral-400">
                  Account {balance.accountId}
                </span>
              ) : null}
            </div>

            {isFailed && balance?.lastErrorMessage ? (
              <div className="flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{balance.lastErrorMessage}</span>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
