"use client";

import {
  Eye,
  Mail,
  Megaphone,
  RefreshCw,
  ShieldAlert,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { CheckboxField } from "@/components/form/CheckboxField";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { cn } from "@/utils/helper";

import { FlagChip, SeverityBadge } from "./LearnerBadges";
import { LogInterventionModal } from "./LogInterventionModal";
import { useInterventionQueue } from "../queries/learners.query";

function QueueRow({ item, canManage, onLog }) {
  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <SeverityBadge score={item.severityScore} />
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">
            {item.learnerName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {(item.flagReasons ?? []).map((r) => (
              <FlagChip key={r} reason={r} />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-400">
            {item.tutorName ? (
              <span className="inline-flex items-center gap-1">
                <User className="size-3" aria-hidden />
                {item.tutorName}
              </span>
            ) : null}
            {item.employerName ? <span>{item.employerName}</span> : null}
            <span>{item.daysSinceLastActivity}d since activity</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {item.employerContactEmail ? (
          <a
            href={`mailto:${item.employerContactEmail}`}
            title={`Email ${item.employerContactName ?? "employer"}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <Mail className="size-3.5" aria-hidden />
            Notify employer
          </a>
        ) : null}
        {canManage ? (
          <Button
            size="xs"
            color="green"
            startIcon={<Megaphone className="size-3.5" />}
            onClick={() => onLog(item)}
          >
            Log
          </Button>
        ) : null}
        <Link
          href={`/learners/${item.enrolmentId}`}
          title="View learner"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <Eye className="size-3.5" aria-hidden />
          View
        </Link>
      </div>
    </li>
  );
}

export function InterventionQueue() {
  const { can } = useRoleAccess();
  const canManage = can("admin");

  const [mine, setMine] = useState(false);
  const [logTarget, setLogTarget] = useState(null);

  const { data, isLoading, isFetching, dataUpdatedAt, refetch } =
    useInterventionQueue({
      mine: mine ? "true" : undefined,
    });
  const items = data?.items ?? [];

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-danger-500" aria-hidden />
            <h2 className="text-base font-semibold text-neutral-900">
              At-risk queue
            </h2>
            {data?.atRiskCount ? (
              <span className="inline-flex items-center rounded-full bg-danger-50 px-2 py-0.5 text-xs font-bold text-danger-600 ring-1 ring-inset ring-danger-200">
                {data.atRiskCount}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {/* F2.2.2 AC4. The queue refreshes itself, but a tutor deciding
                who to ring next deserves to know how old the list is rather
                than assuming it is live to the second. */}
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh now"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-60"
            >
              <RefreshCw
                className={cn("size-3.5", isFetching && "animate-spin")}
                aria-hidden
              />
              {isFetching
                ? "Updating…"
                : dataUpdatedAt
                  ? `Updated ${new Date(dataUpdatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Refresh"}
            </button>
            <CheckboxField
              name="mine"
              label="My caseload"
              checked={mine}
              onChange={(e) => setMine(e.target.checked)}
            />
          </div>
        </div>

        {isLoading ? (
          <p className="py-6 text-center text-sm text-neutral-400">
            Loading queue…
          </p>
        ) : items.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="No learners need intervention"
            description="At-risk learners ranked by severity will appear here."
          />
        ) : (
          <ul className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200">
            {items.map((item) => (
              <QueueRow
                key={item.enrolmentId}
                item={item}
                canManage={canManage}
                onLog={setLogTarget}
              />
            ))}
          </ul>
        )}
      </CardContent>

      {logTarget ? (
        <LogInterventionModal
          enrolmentId={logTarget.enrolmentId}
          learnerName={logTarget.learnerName}
          open={Boolean(logTarget)}
          onClose={() => setLogTarget(null)}
        />
      ) : null}
    </Card>
  );
}
