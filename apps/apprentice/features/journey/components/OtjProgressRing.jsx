// @ts-check
"use client";

import { cn } from "@/utils/helper";

import { PROGRESS_BAND, PROGRESS_BAND_PRESENTATION } from "../constants";

/** Whole hours from minutes, for display only. */
function hours(minutes) {
  return Math.round((minutes ?? 0) / 60);
}

/**
 * F3.1.2 — OTJ progress ring.
 *
 * AC1 hours logged, hours required and percentage complete · AC2 the ring
 * colour band · AC3 a horizontal bar with exact hour counts beneath it.
 *
 * **The band is not computed here.** `progressBand` arrives evaluated from
 * `src/otj/otj-progress.ts`, where the 70/50 thresholds sit with tests on both
 * sides of each boundary.
 *
 * **Approved and pending are never added together** (client decision D2).
 * Approved is the ring and the headline; pending is shown beside it as hours
 * awaiting approval, so a learner who has logged but not been approved can see
 * why the ring has not moved — without the headline overstating their
 * compliance position.
 *
 * @param {{ percentOfTarget?: number|null, band?: string, approvedMinutes?: number, pendingMinutes?: number, totalTargetMinutes?: number, className?: string }} props
 */
export function OtjProgressRing({
  percentOfTarget = null,
  band = PROGRESS_BAND.UNKNOWN,
  approvedMinutes = 0,
  pendingMinutes = 0,
  totalTargetMinutes = 0,
  className,
}) {
  const tone =
    PROGRESS_BAND_PRESENTATION[band] ??
    PROGRESS_BAND_PRESENTATION[PROGRESS_BAND.UNKNOWN];

  const approvedHours = hours(approvedMinutes);
  const pendingHours = hours(pendingMinutes);
  const targetHours = hours(totalTargetMinutes);
  const hasTarget = targetHours > 0 && percentOfTarget !== null;

  const RADIUS = 52;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const fraction = hasTarget ? Math.min(percentOfTarget, 100) / 100 : 0;

  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <div className="relative">
        <svg viewBox="0 0 128 128" className="size-40 -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            className="stroke-current text-neutral-200"
          />
          <circle
            cx="64"
            cy="64"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
            className={cn(
              "stroke-current transition-all duration-700",
              tone.ring,
            )}
          />
        </svg>

        {/* AC1 — the percentage, centred in the ring. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {hasTarget ? (
            <>
              <span
                className={cn("text-3xl font-bold tabular-nums", tone.value)}
              >
                {Math.round(percentOfTarget)}%
              </span>
              <span className="text-[11px] font-medium text-neutral-500">
                of target
              </span>
            </>
          ) : (
            <span className="px-4 text-center text-xs font-medium text-neutral-500">
              Target not set
            </span>
          )}
        </div>
      </div>

      <div className="w-full">
        {/* AC3 — the horizontal bar with exact counts. */}
        <div className="mb-1.5 flex items-baseline justify-between text-xs">
          <span className="font-medium text-neutral-600">
            {/* AC1 — hours logged and hours required, as numbers not just a ring. */}
            <span className="tabular-nums font-semibold text-neutral-900">
              {approvedHours}h
            </span>{" "}
            approved
          </span>
          <span className="tabular-nums text-neutral-500">
            {hasTarget ? `of ${targetHours}h required` : "no target set"}
          </span>
        </div>

        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200"
          role="progressbar"
          aria-valuenow={hasTarget ? Math.round(percentOfTarget) : 0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Off-the-job training: ${approvedHours} approved hours of ${targetHours} required`}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              tone.bar,
            )}
            style={{ width: `${fraction * 100}%` }}
          />
        </div>

        {/*
          D2 — pending is visible and separate, never folded into the headline.
          A learner who logs hours and sees nothing change concludes the app is
          broken and stops logging.
        */}
        {pendingHours > 0 && (
          <p className="mt-2 text-xs text-neutral-500">
            <span className="font-semibold tabular-nums text-neutral-700">
              {pendingHours}h
            </span>{" "}
            awaiting approval from your provider — not yet counted above.
          </p>
        )}
      </div>
    </div>
  );
}
