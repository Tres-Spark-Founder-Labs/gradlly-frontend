"use client";

import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { AnimatedBar } from "./AnimatedBar";
import { ChartExportButton, useChartPng } from "./ChartExportButton";
import { fmtGBP } from "./helpers";
import { T } from "./tokens";

function Pill({ label, value, color, bg, onClick }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="flex flex-col items-center gap-1 rounded-xl py-3 px-2 text-center transition-opacity hover:opacity-80"
      style={{
        backgroundColor: bg,
        border: `1px solid ${color}18`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <span className="text-sm font-extrabold tabular-nums" style={{ color }}>
        {value}
      </span>
      <span
        className="text-[10px] font-bold uppercase tracking-wide"
        style={{ color: T.muted }}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * F1.1.3 AC1. The three segments are reported by DAS itself
 * (`used` / `expiringWithin90Days` / `available`) and are treated as disjoint
 * parts of the pot, so the total is their sum. Deriving the total any other way
 * would disagree with DAS the moment its figures move.
 */
export function segmentTotals(segments) {
  if (!segments) return null;
  const used = Number(segments.used);
  const expiring = Number(segments.expiringWithin90Days);
  const available = Number(segments.available);
  if (![used, expiring, available].every(Number.isFinite)) return null;

  const total = used + expiring + available;
  return {
    used,
    expiring,
    available,
    total,
    // Guard against divide-by-zero for a brand-new employer with an empty pot.
    usedPct: total > 0 ? Math.round((used / total) * 100) : 0,
  };
}

export function LevyUtilisation({ segments, isLoading, onExpiryModal }) {
  const totals = segmentTotals(segments);
  // Destructured rather than kept as an object: react-hooks/refs flags
  // property access on a value that holds a ref during render.
  const {
    ref: pngRef,
    download: downloadPng,
    busy: pngBusy,
  } = useChartPng("levy-utilisation");

  if (isLoading || !totals) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <p className="eyebrow">Annual Levy Utilisation</p>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm" style={{ color: T.muted }}>
            {isLoading
              ? "Loading utilisation…"
              : "Utilisation data is not available yet."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col" ref={pngRef}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Annual Levy Utilisation</p>
            <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
              {fmtGBP(totals.total)} total
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: T.blueLight, color: T.blue }}
            >
              {totals.usedPct}% used
            </span>
            <ChartExportButton onClick={downloadPng} busy={pngBusy} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 flex-1">
        <AnimatedBar pct={totals.usedPct} color={T.blue} height={12} />
        <div className="grid grid-cols-3 gap-3">
          <Pill
            label="Used"
            value={fmtGBP(totals.used)}
            color={T.blue}
            bg={T.blueLight}
          />
          <Pill
            label="Expiring 90d"
            value={fmtGBP(totals.expiring)}
            color={T.amber}
            bg={T.amberLight}
            onClick={onExpiryModal}
          />
          <Pill
            label="Available"
            value={fmtGBP(totals.available)}
            color={T.green}
            bg={T.greenLight}
          />
        </div>
        <div
          className="rounded-xl p-4 space-y-3"
          style={{
            backgroundColor: T.blueLight,
            border: `1px solid ${T.blue}18`,
          }}
        >
          {/* Judgment call: the previous "projected utilisation" bar lived here
              and was computed from phantom fields, duplicating the adjacent
              forecast card (AC3). Projection now belongs solely to that card,
              which has real forecast data; this card owns AC1's segments. */}
          <p className="text-xs font-medium" style={{ color: T.blue }}>
            {fmtGBP(totals.expiring)} of your balance expires within 90 days.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: T.subtle }}>
              Review expiry schedule
            </span>
            <button
              type="button"
              onClick={onExpiryModal}
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: T.blue, color: "#fff" }}
            >
              Optimise <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
