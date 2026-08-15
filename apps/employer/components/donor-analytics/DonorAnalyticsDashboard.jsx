"use client";

// @ts-check

import { Info, Loader2 } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import {
  useDonorAnalytics,
  useDonorAnalyticsBreakdown,
} from "@/features/levy/queries/levy.query";

/**
 * F4.1.4 — Donor Analytics Portal.
 *
 * ── FORM CHOICES, AND WHY ───────────────────────────────────────────────────
 *
 * The five headline figures are single values with no series, so they are stat
 * tiles rather than charts. There is nothing to plot: a bar chart of five
 * unrelated measures on one axis would be meaningless, and each number is
 * already the answer.
 *
 * The three breakdowns are one measure — amount — across categories. That is a
 * *magnitude* job, so every bar uses a single hue. Categorical colour would
 * imply the categories are identities being tracked across views; they are not,
 * they are a ranking. Colouring a ranking with a rainbow is the most common
 * chart mistake there is, and it also makes the palette need CVD validation it
 * does not otherwise need.
 *
 * One series means no legend is required — the section heading names the
 * measure. Every bar is directly labelled with its amount, so identity is never
 * carried by colour alone.
 */

/** Validated against the light surface: lightness, chroma and ≥3:1 contrast. */
const BAR_HUE = T.green;

function formatMoney(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * A null rate is not zero. The API returns null when nothing has been funded or
 * assessed yet, and rendering that as "0%" would report a donor who has just
 * started as one whose learners all failed.
 */
function formatPercent(value) {
  if (value === null || value === undefined) return "Not yet available";
  return `${value}%`;
}

/**
 * `pending` renders the value as an absence rather than a figure.
 *
 * "Not yet available" set at the same 2xl weight as £27,000 competes with the
 * real numbers for attention and wraps to two lines, leaving the tiles ragged.
 * A missing value should be quiet: smaller, muted, and visibly not a
 * quantity — while still never being shown as "0%", which would be a false
 * statement rather than a quiet one.
 */
function StatTile({ label, value, hint, pending = false }) {
  return (
    <div
      className="flex flex-col rounded-2xl border p-4"
      style={{ borderColor: T.border, backgroundColor: T.surface }}
    >
      <p className="text-xs font-semibold" style={{ color: T.subtle }}>
        {label}
      </p>
      <p
        className={
          pending
            ? "mt-1 text-sm font-medium"
            : "mt-1 text-2xl font-extrabold tabular-nums"
        }
        style={{ color: pending ? T.muted : T.ink }}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-auto pt-1 text-xs" style={{ color: T.muted }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/**
 * Horizontal bars for amount-by-category.
 *
 * Horizontal rather than vertical because the labels are long free-text values
 * ("Engineering & Manufacturing", "Yorkshire and the Humber") — vertical bars
 * would force them to rotate, which is markedly harder to read.
 *
 * Bars are proportional to the largest value rather than to the total: this
 * answers "which is biggest and by how much", not "what share of the whole",
 * and a share reading would be wrong anyway when the categories are ranked
 * rather than exhaustive slices.
 */
function BreakdownBars({ title, rows, emptyLabel }) {
  const [hovered, setHovered] = useState(null);

  if (!rows || rows.length === 0) {
    return (
      <section>
        <h3 className="text-sm font-semibold" style={{ color: T.ink }}>
          {title}
        </h3>
        <p className="mt-2 text-sm" style={{ color: T.muted }}>
          {emptyLabel}
        </p>
      </section>
    );
  }

  const max = Math.max(...rows.map((r) => r.amount), 1);

  return (
    <section>
      <h3 className="text-sm font-semibold" style={{ color: T.ink }}>
        {title}
      </h3>
      <ul className="mt-3 space-y-3">
        {rows.map((row) => {
          const pct = Math.max((row.amount / max) * 100, 1.5);
          return (
            <li
              key={row.label}
              onMouseEnter={() => setHovered(row.label)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(row.label)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              className="rounded focus:outline-none focus:ring-2"
              style={{ outlineColor: BAR_HUE }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm" style={{ color: T.ink }}>
                  {row.label}
                </span>
                {/* Direct label — the value is always visible, never hover-only. */}
                <span
                  className="text-sm font-semibold tabular-nums"
                  style={{ color: T.ink }}
                >
                  {formatMoney(row.amount)}
                </span>
              </div>
              <div
                className="mt-1 h-2.5 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: T.border }}
                role="img"
                aria-label={`${row.label}: ${formatMoney(row.amount)}`}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: BAR_HUE,
                    opacity: hovered && hovered !== row.label ? 0.55 : 1,
                    transition:
                      "width 700ms cubic-bezier(0.16,1,0.3,1), opacity 150ms",
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function DonorAnalyticsDashboard() {
  const summary = useDonorAnalytics();
  const breakdown = useDonorAnalyticsBreakdown();

  if (summary.isLoading) {
    return (
      <div
        className="flex items-center gap-2 rounded-2xl border p-6"
        style={{ borderColor: T.border, backgroundColor: T.surface }}
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span style={{ color: T.subtle }}>Loading your donor analytics…</span>
      </div>
    );
  }

  if (summary.isError) {
    return (
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: T.border, backgroundColor: T.redLight }}
      >
        <p style={{ color: T.red }}>
          Could not load your donor analytics.
          {summary.error?.message ? ` ${summary.error.message}` : ""}
        </p>
      </div>
    );
  }

  const d = summary.data ?? {};
  const b = breakdown.data ?? {};

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs" style={{ color: T.muted }}>
          Levy Exchange
        </p>
        <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
          Donor analytics
        </h1>
        <p className="mt-1 text-sm" style={{ color: T.subtle }}>
          Your transfers, the SMEs they reached, and how those learners are
          progressing.
        </p>
      </div>

      {/* AC1 — the five headline figures. */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatTile
          label="Transferred to date"
          value={formatMoney(d.totalTransferred)}
          hint="Confirmed and active transfers"
        />
        <StatTile label="SMEs funded" value={d.smesFunded ?? "—"} />
        <StatTile
          label="Learners funded"
          value={d.learnersFunded ?? "—"}
          hint="Counted once each"
        />
        <StatTile
          label="Completion rate"
          value={formatPercent(d.completionRate)}
          pending={d.completionRate === null || d.completionRate === undefined}
          hint={
            typeof d.completedCount === "number"
              ? `${d.completedCount} completed`
              : undefined
          }
        />
        <StatTile
          label="EPA pass rate"
          value={formatPercent(d.epaPassRate)}
          pending={d.epaPassRate === null || d.epaPassRate === undefined}
          hint={
            typeof d.epaAssessedCount === "number"
              ? `${d.epaAssessedCount} assessed`
              : undefined
          }
        />
      </div>

      {/*
        AC3 — the ESG impact card. Rendered as a stated absence rather than
        omitted: a donor told this report feeds their ESG reporting should be
        able to see that the section exists and why it is empty, instead of
        wondering whether we forgot.
      */}
      {d.esgImpact === null && (
        <div
          className="flex items-start gap-2 rounded-2xl border p-4"
          style={{ borderColor: T.border, backgroundColor: T.card }}
          role="status"
        >
          <Info
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: T.subtle }}
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold" style={{ color: T.ink }}>
              ESG impact summary — not yet available
            </p>
            <p className="mt-0.5 text-sm" style={{ color: T.subtle }}>
              Productivity uplift and social mobility scoring need an agreed
              methodology before we publish a figure. We will not estimate one,
              because this report is designed to be included in your annual ESG
              reporting.
            </p>
          </div>
        </div>
      )}

      {/* AC2 — breakdowns. */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: T.border, backgroundColor: T.surface }}
      >
        <h2 className="text-sm font-bold" style={{ color: T.ink }}>
          Amount transferred by category
        </h2>

        {breakdown.isLoading ? (
          <p className="mt-3 text-sm" style={{ color: T.muted }}>
            Loading breakdowns…
          </p>
        ) : breakdown.isError ? (
          <p className="mt-3 text-sm" style={{ color: T.red }}>
            Could not load the breakdowns.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <BreakdownBars
              title="By sector"
              rows={b.bySector}
              emptyLabel="No transfers yet."
            />
            <BreakdownBars
              title="By region"
              rows={b.byRegion}
              emptyLabel="No transfers yet."
            />
            <BreakdownBars
              title="By programme"
              rows={b.byProgrammeType}
              emptyLabel="No transfers yet."
            />
          </div>
        )}
      </div>
    </div>
  );
}
