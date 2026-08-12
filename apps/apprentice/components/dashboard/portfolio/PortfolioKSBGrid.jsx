"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  KSB_STRENGTH,
  summariseByKind,
} from "@/features/portfolio/utils/ksb-summary";
import { cn } from "@/utils/helper";

/**
 * F3.3.2 — KSB coverage heatmap.
 *
 * Previously read `KSB_DATA`, a 218-line hardcoded list in which every KSB
 * carried an invented coverage state, alongside hardcoded group totals
 * ("Knowledge: 8 of 12 evidenced"). Every apprentice saw the same portfolio
 * (OQ-15). It now renders the cells returned by `GET /portfolio/ksb-heatmap`.
 *
 * The three states below are the API's `strength` values, not a local
 * vocabulary: `adequate` / `low` / `none`. The previous four-state scheme
 * ("strong / covered / in progress / not started") had no counterpart in the
 * API at all, which is part of how it went unnoticed that nothing was wired.
 */
const STRENGTH_PRESENTATION = {
  [KSB_STRENGTH.ADEQUATE]: {
    cell: "bg-primary-600 text-white border-primary-700 hover:bg-primary-700",
    dot: "bg-primary-600",
    label: "Evidenced",
  },
  [KSB_STRENGTH.LOW]: {
    cell: "bg-warning-100 text-warning-800 border-warning-200 hover:bg-warning-200",
    dot: "bg-warning-400",
    label: "Needs more",
  },
  [KSB_STRENGTH.NONE]: {
    cell: "bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200",
    dot: "bg-neutral-300",
    label: "Not started",
  },
};

const LEGEND = [KSB_STRENGTH.ADEQUATE, KSB_STRENGTH.LOW, KSB_STRENGTH.NONE];

/** Optimistic bumps map to `low` — some evidence, not yet assessed adequate. */
function strengthOf(cell, ksbUpdates) {
  if (ksbUpdates[cell.code]) return KSB_STRENGTH.LOW;
  return cell.strength && STRENGTH_PRESENTATION[cell.strength]
    ? cell.strength
    : KSB_STRENGTH.NONE;
}

export function PortfolioKSBGrid({
  cells = [],
  isLoading = false,
  activeKSB,
  onSelect,
  ksbUpdates = {},
}) {
  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />;
  }

  if (!cells.length) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-neutral-500">
          Your KSB coverage appears here once your apprenticeship standard is
          loaded. Nothing is shown until then.
        </CardContent>
      </Card>
    );
  }

  const groups = summariseByKind(cells);
  const active = cells.find((c) => c.code === activeKSB);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">
              KSB coverage heatmap
            </h2>
            <p className="mt-0.5 text-xs text-neutral-400">
              Tap any KSB to filter the evidence library below
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {LEGEND.map((state) => (
              <span
                key={state}
                className="flex items-center gap-1.5 text-xs text-neutral-500"
              >
                <span
                  className={cn(
                    "size-2.5 rounded-sm",
                    STRENGTH_PRESENTATION[state].dot,
                  )}
                />
                {STRENGTH_PRESENTATION[state].label}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {groups
          .filter((g) => g.total > 0)
          .map((g) => (
            <div key={g.key}>
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  {g.label}
                </p>
                {/* Derived, not hardcoded. */}
                <span className="text-xs font-medium tabular-nums text-neutral-400">
                  {g.evidenced} / {g.total} evidenced
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.cells.map((ksb) => {
                  const isActive = activeKSB === ksb.code;
                  const strength = strengthOf(ksb, ksbUpdates);
                  return (
                    <button
                      key={ksb.code}
                      type="button"
                      title={ksb.title}
                      aria-pressed={isActive}
                      onClick={() => onSelect(isActive ? null : ksb.code)}
                      className={cn(
                        "rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all duration-150",
                        STRENGTH_PRESENTATION[strength].cell,
                        isActive &&
                          "scale-105 shadow-md ring-2 ring-primary-500 ring-offset-1",
                      )}
                    >
                      {ksb.code}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

        {activeKSB && (
          <div className="flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 p-3">
            <p className="text-xs font-medium text-primary-700">
              Filtering by <strong>{activeKSB}</strong>
              {active?.title ? ` — ${active.title}` : null}
            </p>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-800"
            >
              Clear ×
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
