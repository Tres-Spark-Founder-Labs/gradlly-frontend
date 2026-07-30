"use client";

import { useMemo } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { ChartExportButton, useChartPng } from "./ChartExportButton";
import { fmtGBP } from "./helpers";
import { T } from "./tokens";

const CHART_H = 180;
const PAIR_GAP = 4;

/** "2026-01" -> "Jan". Falls back to the raw value if it isn't a YYYY-MM. */
export function shortMonth(month) {
  if (typeof month !== "string") return "";
  const m = /^(\d{4})-(\d{2})$/.exec(month);
  if (!m) return month;
  const date = new Date(Number(m[1]), Number(m[2]) - 1, 1);
  if (Number.isNaN(date.getTime())) return month;
  return date.toLocaleDateString("en-GB", { month: "short" });
}

/**
 * F1.1.3 AC2 — normalise the 12-month series for rendering.
 *
 * Sorted ascending because the API orders months newest-first in places, and a
 * time series running right-to-left misreads at a glance. Trimmed to the most
 * recent 12 points, which is what the requirement asks for.
 */
export function prepareMonthlySeries(series) {
  const rows = (series ?? [])
    .filter((p) => p && typeof p.month === "string")
    .map((p) => ({
      month: p.month,
      contributions: Number(p.contributions) || 0,
      spend: Number(p.spend) || 0,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const last12 = rows.slice(-12);
  const max = Math.max(
    ...last12.flatMap((r) => [r.contributions, r.spend]),
    1, // never divide by zero
  );
  return { rows: last12, max };
}

function Legend() {
  return (
    <div className="flex items-center gap-4">
      {[
        { label: "Contributions", color: T.blue },
        { label: "Spend", color: T.amber },
      ].map((s) => (
        <span key={s.label} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: s.color }}
            aria-hidden
          />
          <span className="text-[11px] font-medium" style={{ color: T.subtle }}>
            {s.label}
          </span>
        </span>
      ))}
    </div>
  );
}

export function MonthlyChart({ monthlySeries, isLoading }) {
  const { rows, max } = useMemo(
    () => prepareMonthlySeries(monthlySeries),
    [monthlySeries],
  );
  const {
    ref: pngRef,
    download: downloadPng,
    busy: pngBusy,
  } = useChartPng("levy-monthly-flow");

  const slot = rows.length > 0 ? 100 / rows.length : 100;
  const barW = Math.max((slot - PAIR_GAP) / 2, 1);

  return (
    <Card ref={pngRef}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Monthly Levy Flow</p>
            <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
              Contributions vs spend
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Legend />
            {rows.length > 0 && (
              <ChartExportButton onClick={downloadPng} busy={pngBusy} />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm py-10 text-center" style={{ color: T.muted }}>
            Loading monthly figures…
          </p>
        ) : rows.length === 0 ? (
          <p className="text-sm py-10 text-center" style={{ color: T.muted }}>
            No monthly levy history yet.
          </p>
        ) : (
          <figure
            data-chart="monthly-levy-flow"
            aria-label={`Monthly levy contributions versus spend for the last ${rows.length} months`}
          >
            <svg
              width="100%"
              height={CHART_H + 28}
              viewBox={`0 0 100 ${CHART_H + 28}`}
              preserveAspectRatio="none"
              role="img"
            >
              {/* Gridlines at 0 / 50% / max for readability. */}
              {[0, 0.5, 1].map((f) => (
                <line
                  key={f}
                  x1="0"
                  x2="100"
                  y1={CHART_H - f * CHART_H}
                  y2={CHART_H - f * CHART_H}
                  stroke={T.border}
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {rows.map((row, i) => {
                const x = i * slot;
                const cH = (row.contributions / max) * CHART_H;
                const sH = (row.spend / max) * CHART_H;
                return (
                  <g key={row.month}>
                    <rect
                      x={x + PAIR_GAP / 2}
                      y={CHART_H - cH}
                      width={barW}
                      height={cH}
                      fill={T.blue}
                      rx="0.5"
                    >
                      <title>
                        {`${row.month} contributions: ${fmtGBP(row.contributions)}`}
                      </title>
                    </rect>
                    <rect
                      x={x + PAIR_GAP / 2 + barW}
                      y={CHART_H - sH}
                      width={barW}
                      height={sH}
                      fill={T.amber}
                      rx="0.5"
                    >
                      <title>{`${row.month} spend: ${fmtGBP(row.spend)}`}</title>
                    </rect>
                    <text
                      x={x + slot / 2}
                      y={CHART_H + 18}
                      textAnchor="middle"
                      fontSize="7"
                      fill={T.muted}
                    >
                      {shortMonth(row.month)}
                    </text>
                  </g>
                );
              })}
            </svg>
            <figcaption className="sr-only">
              Peak monthly value {fmtGBP(max)}.
            </figcaption>
          </figure>
        )}
      </CardContent>
    </Card>
  );
}
