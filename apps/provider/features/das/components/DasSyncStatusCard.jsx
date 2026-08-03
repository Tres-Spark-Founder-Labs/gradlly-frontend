"use client";

import { AlertTriangle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";

import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { formatDateTime } from "@/utils/helper";

import {
  DAS_SYNC_HEALTH,
  DAS_SYNC_HEALTH_CLASSES,
  DAS_SYNC_HEALTH_LABELS,
} from "../constants";
import { useDasSyncStatus, useTriggerDasSync } from "../queries/das.query";

const HEALTH_ICONS = {
  [DAS_SYNC_HEALTH.GREEN]: CheckCircle2,
  [DAS_SYNC_HEALTH.AMBER]: AlertTriangle,
  [DAS_SYNC_HEALTH.RED]: XCircle,
};

/**
 * F2.3.1 AC5 — "sync status indicator shows: last sync time, sync health
 * (green / amber / red), and error count".
 *
 * The band comes from the API and is rendered as-is. Recomputing it here from
 * lastSyncAt and errorCount would eventually disagree with the backend, and a
 * health indicator that contradicts the log beneath it is worse than none.
 */
export function DasSyncStatusCard() {
  const { can } = useRoleAccess();
  const canSync = can("admin");

  const { data: status, isLoading } = useDasSyncStatus();
  const { mutate: triggerSync, isPending } = useTriggerDasSync();

  if (isLoading || !status) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-neutral-400">
          Checking DAS sync status…
        </CardContent>
      </Card>
    );
  }

  const health = status.health ?? DAS_SYNC_HEALTH.RED;
  const Icon = HEALTH_ICONS[health] ?? XCircle;
  const tone = DAS_SYNC_HEALTH_CLASSES[health] ?? DAS_SYNC_HEALTH_CLASSES.red;

  return (
    <Card>
      <CardContent className="space-y-4 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}
            >
              <Icon className="size-3.5" aria-hidden />
              {DAS_SYNC_HEALTH_LABELS[health] ?? health}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-neutral-700">
                {/*
                 * "Never" is a distinct state from "a while ago", and the one
                 * worth saying plainly: an integration that has never synced
                 * is not merely stale.
                 */}
                {status.lastSyncAt
                  ? `Last synced ${formatDateTime(status.lastSyncAt)}`
                  : "Never synced successfully"}
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">
                {status.errorCount === 0
                  ? `No errors in the last ${status.windowHours} hours`
                  : `${status.errorCount} error${
                      status.errorCount === 1 ? "" : "s"
                    } in the last ${status.windowHours} hours`}
                {status.lastAttemptAt && !status.lastSyncAt
                  ? ` · last attempted ${formatDateTime(status.lastAttemptAt)}`
                  : ""}
              </p>
            </div>
          </div>

          {/* F2.3.1 AC6 — manual sync trigger for programme managers. */}
          {canSync ? (
            <Button
              size="sm"
              color="black"
              variant="outline"
              startIcon={<RefreshCw className="size-4" />}
              onClick={() => triggerSync()}
              loading={isPending}
              disabled={isPending}
            >
              Sync now
            </Button>
          ) : null}
        </div>

        {status.lastErrorMessage ? (
          <p className="rounded-lg bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-600">
            {status.lastErrorMessage}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
