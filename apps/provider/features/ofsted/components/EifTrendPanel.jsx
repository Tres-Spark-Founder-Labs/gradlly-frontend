"use client";

import { LineChart, Loader2 } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

import { ragStyles } from "./OfstedBadges";
import { EIF_RAG } from "../constants";
import { useEifScoreTrend } from "../queries/ofsted.query";

const VIEW_BOX = { width: 320, height: 96 };

function formatDay(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

/**
 * A plain SVG sparkline.
 *
 * Deliberately not a charting library: this is one series of at most 365
 * points with no interaction beyond a tooltip, and adding a dependency for it
 * would cost more than it returns.
 *
 * The y-axis is pinned to 0–100 rather than fitted to the data. An EIF score
 * is a percentage against a fixed scale, and auto-fitting would turn a
 * three-point wobble between 78% and 81% into a dramatic climb — the chart
 * would be technically accurate and read as a lie.
 */
function Sparkline({ points, rag }) {
  const styles = ragStyles(rag);
  if (points.length < 2) return null;

  const stepX = VIEW_BOX.width / (points.length - 1);
  const toY = (percent) =>
    VIEW_BOX.height -
    (Math.max(0, Math.min(100, percent)) / 100) * VIEW_BOX.height;

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${toY(p.percent)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      className="h-24 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Score movement from ${points[0].percent}% to ${
        points[points.length - 1].percent
      }%`}
    >
      {/* 60% and 80% are the RAG boundaries, so they are the lines worth
          seeing behind the series. */}
      {[60, 80].map((threshold) => (
        <line
          key={threshold}
          x1="0"
          x2={VIEW_BOX.width}
          y1={toY(threshold)}
          y2={toY(threshold)}
          className="stroke-neutral-200"
          strokeWidth="1"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path
        d={path}
        fill="none"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        className={cn("stroke-current", styles.bar.replace("bg-", "text-"))}
      />
    </svg>
  );
}

function TrendRow({ series }) {
  const points = series.points ?? [];
  const latest = points[points.length - 1];
  const first = points[0];
  const movement = points.length >= 2 ? latest.percent - first.percent : null;

  return (
    <div className="rounded-xl border border-neutral-200 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-neutral-700">
          {series.label}
        </span>
        <span className="flex shrink-0 items-center gap-2 text-xs">
          {latest ? (
            <span className="font-semibold tabular-nums text-neutral-800">
              {latest.percent}%
            </span>
          ) : (
            <span className="text-neutral-400">No data</span>
          )}
          {movement !== null ? (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 font-semibold tabular-nums",
                movement > 0
                  ? "bg-emerald-50 text-emerald-700"
                  : movement < 0
                    ? "bg-danger-50 text-danger-600"
                    : "bg-neutral-100 text-neutral-600",
              )}
            >
              {movement > 0 ? "+" : ""}
              {movement} pts
            </span>
          ) : null}
        </span>
      </div>

      {points.length >= 2 ? (
        <>
          <div className="mt-2">
            <Sparkline points={points} rag={latest?.rag ?? EIF_RAG.RED} />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-neutral-400">
            <span>{formatDay(first.capturedOn)}</span>
            <span>{formatDay(latest.capturedOn)}</span>
          </div>
        </>
      ) : (
        <p className="mt-2 text-xs text-neutral-500">
          {points.length === 1
            ? "One reading so far — a trend needs at least two."
            : "Not yet recorded."}
        </p>
      )}
    </div>
  );
}

/**
 * F2.1.1 AC5 — "historical trend chart is available per criterion showing last
 * 12 months of score movement".
 *
 * The scores themselves are computed live and cached for an hour, so nothing
 * in the platform ever retained one for longer than that. This reads the
 * nightly snapshot instead, which is why the panel can be honest about having
 * very little history rather than implying a year of it.
 */
export function EifTrendPanel() {
  const { data, isLoading, isError } = useEifScoreTrend();
  const [showAll, setShowAll] = useState(false);

  const criteria = data?.criteria ?? [];
  const visible = showAll ? criteria : criteria.slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <LineChart className="size-4 text-neutral-400" aria-hidden />
          <h3 className="text-sm font-semibold text-neutral-900">
            Score movement
          </h3>
        </div>
        <p className="mt-0.5 text-xs text-neutral-500">
          Last {data?.windowMonths ?? 12} months, captured nightly.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading trend…
          </div>
        ) : isError ? (
          <p className="text-sm text-neutral-500">
            Score history is unavailable right now.
          </p>
        ) : !data?.hasTrendData ? (
          /*
           * Said plainly rather than drawn as a flat line. History accrues in
           * wall-clock time and cannot be back-filled — the score depended on
           * data that has since moved on — so a new provider genuinely has
           * nothing to plot, and pretending otherwise on a compliance screen
           * would be worse than an empty state.
           */
          <div className="rounded-xl bg-neutral-50 px-4 py-3">
            <p className="text-sm font-medium text-neutral-700">
              Not enough history yet
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {data?.pointCount === 1
                ? "One day has been recorded. The chart appears once there are at least two."
                : "Scores are recorded once a night. The chart appears once there are at least two days."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((series) => (
              <TrendRow key={series.slug} series={series} />
            ))}
            {criteria.length > visible.length || showAll ? (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="text-xs font-semibold text-primary-700 transition-opacity hover:opacity-75"
              >
                {showAll
                  ? "Show fewer"
                  : `Show all ${criteria.length} criteria`}
              </button>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
