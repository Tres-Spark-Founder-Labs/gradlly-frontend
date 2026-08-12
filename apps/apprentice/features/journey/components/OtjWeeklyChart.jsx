// @ts-check
"use client";

import { peakWeeklyMinutes } from "../utils/weekly-hours";

const WEEKDAY_LABEL = { month: "short", day: "numeric", timeZone: "UTC" };

/**
 * F3.1.2 AC4 — hours logged per week for the last 8 weeks.
 *
 * Approved and pending render as separate stacked segments, never as one bar
 * (client decision D2). A learner can see both what counts and what is waiting
 * on their provider, without the two being conflated.
 *
 * @param {{ weeks?: Array<{weekStart: string, approvedMinutes: number, pendingMinutes: number}>, className?: string }} props
 */
export function OtjWeeklyChart({ weeks = [], className }) {
  if (!weeks.length) return null;

  const peak = peakWeeklyMinutes(weeks);
  const hasAnything = weeks.some(
    (w) => w.approvedMinutes > 0 || w.pendingMinutes > 0,
  );

  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-1.5 sm:gap-2.5">
        {weeks.map((week) => {
          const approvedPct = (week.approvedMinutes / peak) * 100;
          const pendingPct = (week.pendingMinutes / peak) * 100;
          const totalHours =
            Math.round(
              ((week.approvedMinutes + week.pendingMinutes) / 60) * 10,
            ) / 10;

          return (
            <div
              key={week.weekStart}
              className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
            >
              <div className="flex h-28 w-full max-w-10 flex-col justify-end overflow-hidden rounded-md bg-neutral-100">
                {pendingPct > 0 && (
                  <div
                    className="w-full bg-warning-300 transition-all duration-500"
                    style={{ height: `${pendingPct}%` }}
                  />
                )}
                {approvedPct > 0 && (
                  <div
                    className="w-full bg-primary-500 transition-all duration-500"
                    style={{ height: `${approvedPct}%` }}
                  />
                )}
              </div>

              <span className="truncate text-[10px] font-medium text-neutral-500">
                {new Date(`${week.weekStart}T00:00:00Z`).toLocaleDateString(
                  "en-GB",
                  WEEKDAY_LABEL,
                )}
              </span>

              <span className="sr-only">
                Week beginning {week.weekStart}: {totalHours} hours logged
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm bg-primary-500"
            aria-hidden="true"
          />
          Approved
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm bg-warning-300"
            aria-hidden="true"
          />
          Awaiting approval
        </span>
      </div>

      {!hasAnything && (
        <p className="mt-3 text-center text-xs text-neutral-500">
          No off-the-job training logged in the last 8 weeks.
        </p>
      )}
    </div>
  );
}
