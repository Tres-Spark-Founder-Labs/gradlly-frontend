"use client";

import { Download, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { AnimatedBar } from "./AnimatedBar";
import { ChartExportButton, useChartPng } from "./ChartExportButton";
import { fmtGBP } from "./helpers";
import { T } from "./tokens";

/**
 * F1.1.3 AC3 — projected spend over the forecast horizon.
 *
 * The API supplies a monthly run-rate (`projectedMonthlySpend`) derived from
 * active programmes plus the horizon it applies to, rather than a single
 * pre-multiplied total. Multiplying here keeps the horizon explicit, so the
 * card can state "over the next N months" truthfully if the backend ever
 * changes it from 12.
 */
export function projectHorizonSpend(forecast) {
  if (!forecast) return null;
  const monthly = Number(forecast.projectedMonthlySpend);
  const months = Number(forecast.horizonMonths);
  if (!Number.isFinite(monthly) || !Number.isFinite(months)) return null;
  return monthly * months;
}

function Row({ label, value, color = T.ink }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs" style={{ color: T.subtle }}>
        {label}
      </span>
      <span className="text-sm font-bold tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

export function YearEndForecast({ forecast, segments, isLoading, onExport }) {
  const horizonSpend = projectHorizonSpend(forecast);
  const {
    ref: pngRef,
    download: downloadPng,
    busy: pngBusy,
  } = useChartPng("levy-forecast");

  if (isLoading || horizonSpend === null) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <p className="eyebrow">Spend Forecast</p>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm" style={{ color: T.muted }}>
            {isLoading
              ? "Loading forecast…"
              : "Forecast is unavailable until DAS data has synced."}
          </p>
        </CardContent>
      </Card>
    );
  }

  const months = Number(forecast.horizonMonths);
  const available = Number(segments?.available);

  // How much of the currently-available balance the forecast would consume.
  // Capped at 100 for the bar; the figure itself is still reported honestly.
  const coveragePct =
    Number.isFinite(available) && available > 0
      ? Math.min(Math.round((horizonSpend / available) * 100), 100)
      : 0;

  const overspend =
    Number.isFinite(available) && horizonSpend > available && available > 0;

  return (
    <Card className="h-full flex flex-col" ref={pngRef}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Spend Forecast</p>
            <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
              Next {months} months
            </h2>
          </div>
          <ChartExportButton onClick={downloadPng} busy={pngBusy} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5 flex-1">
        <div className="space-y-2">
          <Row
            label={`Projected spend (${months} months)`}
            value={fmtGBP(horizonSpend)}
            color={T.blue}
          />
          <Row
            label="Monthly run rate"
            value={fmtGBP(forecast.projectedMonthlySpend)}
          />
          <Row
            label="Available balance"
            value={fmtGBP(segments?.available)}
            color={T.green}
          />
          <Row
            label="Completion liability"
            value={fmtGBP(forecast.projectedCompletionLiability)}
          />
        </div>

        <div className="space-y-1.5">
          <AnimatedBar
            pct={coveragePct}
            color={overspend ? T.red : T.blue}
            height={14}
          />
          <p className="text-xs" style={{ color: T.subtle }}>
            {overspend
              ? "Forecast spend exceeds the available balance."
              : `Forecast uses ${coveragePct}% of the available balance.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-3 flex items-center gap-2"
            style={{ backgroundColor: T.blueLight }}
          >
            <Users className="h-4 w-4 shrink-0" style={{ color: T.blue }} />
            <div className="min-w-0">
              <p
                className="text-sm font-bold tabular-nums"
                style={{ color: T.blue }}
              >
                {forecast.activeEnrolmentCount ?? 0}
              </p>
              <p
                className="text-[10px] font-bold uppercase tracking-wide"
                style={{ color: T.muted }}
              >
                Active programmes
              </p>
            </div>
          </div>
          <div
            className="rounded-xl p-3 flex items-center gap-2"
            style={{ backgroundColor: T.greenLight }}
          >
            <TrendingUp
              className="h-4 w-4 shrink-0"
              style={{ color: T.green }}
            />
            <div className="min-w-0">
              <p
                className="text-sm font-bold tabular-nums"
                style={{ color: T.green }}
              >
                {/* Null runway means spend is zero, so the balance never
                    depletes — "n/a" is truthful where "0 months" would alarm. */}
                {forecast.estimatedRunwayMonths === null ||
                forecast.estimatedRunwayMonths === undefined
                  ? "n/a"
                  : `${forecast.estimatedRunwayMonths} mo`}
              </p>
              <p
                className="text-[10px] font-bold uppercase tracking-wide"
                style={{ color: T.muted }}
              >
                Estimated runway
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity self-start"
          style={{ backgroundColor: T.blue, color: "#fff" }}
        >
          <Download className="h-3.5 w-3.5" /> Export forecast
        </button>
      </CardContent>
    </Card>
  );
}
