"use client";

import { AlertTriangle, Loader2, Plus, RefreshCw } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

import { ragStyles, RagBadge } from "./OfstedBadges";
import { EIF_RAG } from "../constants";
import { useEifScores } from "../queries/ofsted.query";

function OverallGauge({ percent, rag }) {
  const styles = ragStyles(rag);
  const pct = Math.max(0, Math.min(100, percent ?? 0));
  // Conic gauge.
  return (
    <div className="flex items-center gap-4">
      <div
        className="relative flex size-24 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(var(--gauge-color) ${pct * 3.6}deg, var(--color-neutral-100) 0deg)`,
        }}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-white">
          <span className="text-xl font-bold text-neutral-900">{pct}%</span>
        </div>
        {/* gauge colour via CSS var keyed to RAG */}
        <span
          className={cn("absolute inset-0 rounded-full", styles.dot)}
          style={{ display: "none" }}
          aria-hidden
        />
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500">
          Overall readiness
        </p>
        <div className="mt-1">
          <RagBadge rag={rag} />
        </div>
      </div>
    </div>
  );
}

function CriterionBar({ criterion, onCreateAction }) {
  const styles = ragStyles(criterion.rag);
  const pct = Math.max(0, Math.min(100, criterion.percent ?? 0));
  const low = criterion.rag !== EIF_RAG.GREEN;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-neutral-700">
          {criterion.label}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-semibold tabular-nums text-neutral-800">
            {pct}%
          </span>
          {low ? (
            <button
              type="button"
              onClick={() => onCreateAction?.(criterion.slug)}
              title="Create a QIP action for this criterion"
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-primary-700 transition-colors hover:bg-primary-50"
            >
              <Plus className="size-3" aria-hidden />
              Action
            </button>
          ) : null}
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={cn("h-full rounded-full transition-all", styles.bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * EIF readiness dashboard: overall gauge + seven criterion bars + alert banner.
 * @param {(slug: string) => void} [onCreateAction]  prefill a QIP action
 */
export function EifScoresDashboard({ onCreateAction }) {
  const { data, isLoading, isFetching, refetch } = useEifScores();

  const criteria = data?.criteria ?? [];

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            EIF readiness
          </h2>
          {data?.calculatedAt ? (
            <p className="mt-0.5 text-xs text-neutral-400">
              Updated {new Date(data.calculatedAt).toLocaleString("en-GB")}
              {data.cached ? " · cached" : ""}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          title="Refresh scores"
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
        >
          <RefreshCw
            className={cn("size-3.5", isFetching && "animate-spin")}
            aria-hidden
          />
          Refresh
        </button>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-neutral-500">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading scores…
          </p>
        ) : !data ? (
          <p className="text-sm text-neutral-400">No score data yet.</p>
        ) : (
          <>
            {data.alertBanner ? (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                One or more criteria are below 75%. Address them via QIP actions
                to improve inspection readiness.
              </div>
            ) : null}

            <div
              style={{
                "--gauge-color":
                  data.overallRag === EIF_RAG.GREEN
                    ? "var(--color-success-500, #2f8a52)"
                    : data.overallRag === EIF_RAG.AMBER
                      ? "#f59e0b"
                      : "var(--color-danger-500, #c0392b)",
              }}
            >
              <OverallGauge
                percent={data.overallPercent}
                rag={data.overallRag}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-neutral-100 pt-5 sm:grid-cols-2">
              {criteria.map((c) => (
                <CriterionBar
                  key={c.slug}
                  criterion={c}
                  onCreateAction={onCreateAction}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
