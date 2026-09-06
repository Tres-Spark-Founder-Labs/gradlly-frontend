"use client";

import { useMemo } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { ChartExportButton, useChartPng } from "./ChartExportButton";
import { fmtGBP } from "./helpers";
import { T } from "./tokens";

/** A levy year. The chart axis is always this wide, however many months exist. */
const MONTHS_IN_LEVY_YEAR = 12;

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

  /**
   * The axis is always a full levy year, even when the series is shorter.
   *
   * This used to be `100 / rows.length`, which spread whatever months existed
   * across the whole width. Seven months then drew an identical chart to
   * twelve — same bar width, same spacing, axis full — so an employer part-way
   * through a levy year saw what looked like a complete one, and a trend
   * covering seven months read as covering twelve.
   *
   * Fixing the divisor at twelve leaves the remaining slots empty, which is
   * what a part-year looks like. A gap renders as a gap.
   */
  const slot = 100 / MONTHS_IN_LEVY_YEAR;
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
            aria-label={`Monthly levy contributions versus spend, ${rows.length} of ${MONTHS_IN_LEVY_YEAR} months recorded`}
          >
            <svg
              width="100%"
              height={CHART_H}
              viewBox={`0 0 100 ${CHART_H}`}
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
                  </g>
                );
              })}
            </svg>

            {/*
              ── WHY THE AXIS LABELS ARE HTML, NOT SVG ─────────────────────────

              They were <text> inside an svg with preserveAspectRatio="none".
              That stretches the drawing to the container width on a different
              scale from the height, and glyphs stretch with it — so the labels
              were both distorted and wider than the 100/12 = 8.33 user units a
              month slot has. Three-letter names ran into their neighbours at
              every width, which at the default one read as a single unbroken
              line of characters.

              In HTML each label owns a cell exactly one twelfth of the axis
              wide, with its own overflow. A label cannot encroach on the next
              one no matter how narrow the viewport gets, because the boxes do
              not overlap — the guarantee is structural rather than a font size
              that happens to fit. Text also renders at its true aspect ratio.

              Twelve cells are always laid out, not rows.length: the bars are
              positioned against a fixed twelve-month axis, so the labels have
              to be too, or a seven-month series would spread its labels across
              the full width beneath bars that stop at seven twelfths.
            */}
            <div
              className="flex w-full"
              aria-hidden
              data-testid="monthly-chart-axis"
            >
              {Array.from({ length: MONTHS_IN_LEVY_YEAR }, (_, i) => (
                <span
                  key={rows[i]?.month ?? `empty-${i}`}
                  data-axis-cell
                  /* 8px at the narrowest viewport, where a cell is only 320/12 = 26.7px
                     wide. Nine left "Sep" with no headroom under a conservative
                     glyph estimate, and a label that only just fits is one
                     rounding away from clipping. */
                  className="overflow-hidden text-ellipsis whitespace-nowrap text-center text-[8px] leading-4 sm:text-[9px]"
                  style={{
                    width: `${100 / MONTHS_IN_LEVY_YEAR}%`,
                    color: T.muted,
                  }}
                >
                  {rows[i] ? shortMonth(rows[i].month) : ""}
                </span>
              ))}
            </div>

            <figcaption className="sr-only">
              Peak monthly value {fmtGBP(max)}.
            </figcaption>
          </figure>
        )}
      </CardContent>
    </Card>
  );
}
