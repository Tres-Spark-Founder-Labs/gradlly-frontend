"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { LEVY_ROI_BREAKDOWN_GROUP } from "@/features/reporting/constants";
import { useLevyRoiBreakdown } from "@/features/reporting/queries/reporting.query";

function metricColor(value, { good = 80, warn = 60 } = {}) {
  if (value === null || value === undefined) return "text-neutral-400";
  if (value >= good) return "text-emerald-600";
  if (value >= warn) return "text-amber-600";
  return "text-red-600";
}

function Metric({ label, value, suffix = "%", colorFn }) {
  const hasValue = value !== null && value !== undefined;
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-neutral-500">{label}</span>
      <span
        className={`text-xs font-semibold tabular-nums ${
          hasValue
            ? colorFn
              ? colorFn(value)
              : "text-neutral-800"
            : "text-neutral-400"
        }`}
      >
        {hasValue ? `${value}${suffix}` : "Not yet available"}
      </span>
    </div>
  );
}

function ProviderRow({ row }) {
  return (
    <div className="rounded-xl border border-neutral-200 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-neutral-900">
          {row.label}
        </p>
        <span className="shrink-0 text-xs text-neutral-500">
          {row.activeApprenticeCount} active · {row.completionCount} completed
        </span>
      </div>
      <div className="mt-2 divide-y divide-neutral-100">
        <Metric
          label="Average OTJ %"
          value={row.averageOtjPercent}
          colorFn={(v) => metricColor(v)}
        />
        <Metric
          label="Review compliance"
          value={row.reviewComplianceRate}
          colorFn={(v) => metricColor(v)}
        />
        <Metric
          label="Withdrawal rate"
          value={row.withdrawalRate}
          colorFn={(v) => metricColor(100 - v)}
        />
        {/* EPA pass rate depends on an EPA-outcomes entity not yet built on the
            backend — shown as an honest "not yet available" state, matching
            the rest of this report's known-stub fields, rather than a
            fabricated number. */}
        <Metric label="EPA pass rate" value={null} />
      </div>
    </div>
  );
}

/** F1.4.2 — per-provider performance comparison. */
export function ProviderPerformanceView() {
  const { data: rows = [], isLoading } = useLevyRoiBreakdown(
    LEVY_ROI_BREAKDOWN_GROUP.PROVIDER,
  );

  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-neutral-900">
          Provider performance
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500">
          Calculated from live platform data, not self-reported by providers.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <p className="text-sm text-neutral-400">Loading…</p>}
        {!isLoading && rows.length === 0 && (
          <p className="text-sm text-neutral-500">
            No linked providers with active or completed apprentices yet.
          </p>
        )}
        {rows.map((row) => (
          <ProviderRow key={row.groupId} row={row} />
        ))}
      </CardContent>
    </Card>
  );
}
