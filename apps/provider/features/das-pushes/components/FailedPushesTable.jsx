"use client";

import { Eye, RotateCcw, Send } from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import { cn } from "@/utils/helper";

import { PushDetailModal } from "./PushDetailModal";
import { PushStatusBadge } from "./PushStatusBadge";
import { PIPELINES, PUSH_TRIGGER_LABELS } from "../constants";
import { useFailedPushes, useRetryPush } from "../queries/das-pushes.query";

function PushCell({ push, config }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <Send className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          {config?.hasTrigger
            ? (PUSH_TRIGGER_LABELS[push.trigger] ?? push.trigger)
            : `${config?.label} push`}
        </p>
        <p className="truncate font-mono text-xs text-neutral-400">
          {push.enrolmentId ?? "—"}
        </p>
      </div>
    </div>
  );
}

function RowActions({ push, onView, onRetry, retrying }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onView(push)}
        title="View push"
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      >
        <Eye className="size-3.5" aria-hidden />
        View
      </button>
      <button
        type="button"
        onClick={() => onRetry(push.id)}
        disabled={retrying}
        title="Retry delivery"
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50 disabled:opacity-50"
      >
        <RotateCcw className="size-3.5" aria-hidden />
        Retry
      </button>
    </div>
  );
}

/**
 * Failed pushes for one pipeline, with inline retry + a detail modal.
 * @param {string} pipeline  PUSH_PIPELINE key
 */
export function FailedPushesTable({ pipeline }) {
  const config = PIPELINES[pipeline];
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [viewTarget, setViewTarget] = useState(null);

  const params = useMemo(() => ({ page, perPage }), [page, perPage]);
  const { data, isLoading, isFetching } = useFailedPushes(pipeline, params);
  const pushes = data?.pushes ?? [];
  const meta = data?.meta ?? null;

  const retry = useRetryPush(pipeline);

  const changePerPage = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "push",
      header: "Push",
      primary: true,
      cell: (row) => <PushCell push={row} config={config} />,
    },
    {
      key: "attempts",
      header: "Attempts",
      mobileLabel: "Attempts",
      cell: (row) => (
        <span className="tabular-nums text-neutral-600">{row.attempts}</span>
      ),
    },
    {
      key: "lastError",
      header: "Last error",
      mobileLabel: "Last error",
      cell: (row) => (
        <span
          className="line-clamp-2 max-w-xs text-xs text-danger-600"
          title={row.lastError ?? ""}
        >
          {row.lastError || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      cell: (row) => <PushStatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      mobileLabel: "Actions",
      cell: (row) => (
        <RowActions
          push={row}
          onView={setViewTarget}
          onRetry={(id) => retry.mutate(id)}
          retrying={retry.isPending}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={pushes}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        onRowClick={setViewTarget}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={changePerPage}
        empty={{
          icon: Send,
          title: "No failed pushes",
          description: `All ${config?.label?.toLowerCase()} pushes have delivered — nothing to retry.`,
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />

      <PushDetailModal
        pipeline={pipeline}
        pushId={viewTarget?.id}
        open={Boolean(viewTarget)}
        onClose={() => setViewTarget(null)}
      />
    </div>
  );
}
