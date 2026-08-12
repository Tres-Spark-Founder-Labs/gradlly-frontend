// @ts-check
"use client";

import { CalendarClock, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/Card";
import { cn, formatDate } from "@/utils/helper";

import {
  EPA_BAND,
  EPA_BAND_PRESENTATION,
  EPA_DATE_UNSET_MESSAGE,
} from "../constants";

/**
 * F3.2.3 — EPA countdown.
 *
 * AC1 large number on the home screen · AC2 colour band · AC3 placeholder when
 * no date is set · AC4 tapping opens the gateway readiness checklist.
 *
 * **The band is not computed here.** `epaCountdownBand` arrives evaluated from
 * the API. The thresholds (≥90 green, 30–89 amber, ≤29 red) live in
 * `src/enrolments/epa-countdown.ts` with tests on both sides of every
 * boundary. Re-deriving them from `daysToEpa` in the client would put the rule
 * in two places, and the last time that happened day 90 landed in the wrong
 * band.
 *
 * @param {{ band?: string, daysToEpa?: number|null, epaDate?: string|null, className?: string }} props
 */
export function EpaCountdownCard({
  band = EPA_BAND.UNSET,
  daysToEpa = null,
  epaDate = null,
  className,
}) {
  const tone =
    EPA_BAND_PRESENTATION[band] ?? EPA_BAND_PRESENTATION[EPA_BAND.UNSET];
  const isUnset = band === EPA_BAND.UNSET || daysToEpa === null;
  const isOverdue = band === EPA_BAND.OVERDUE;
  const isToday = !isUnset && !isOverdue && daysToEpa === 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className={cn("border-l-4 p-5", tone.surface)}>
        <Link
          href="/journey#gateway"
          aria-label="End-point assessment countdown. Opens your gateway readiness checklist."
          className="group flex items-center justify-between gap-4 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-neutral-500">
              <CalendarClock className="size-3.5" aria-hidden="true" />
              End-point assessment
            </p>

            {isUnset ? (
              /* AC3 — the PRD specifies this copy exactly. */
              <p className="mt-2 max-w-xs text-sm font-medium text-neutral-600">
                {EPA_DATE_UNSET_MESSAGE}
              </p>
            ) : (
              <>
                <p className="mt-1 flex items-baseline gap-2">
                  {isOverdue ? (
                    <span className={cn("text-2xl font-bold", tone.value)}>
                      Date passed
                    </span>
                  ) : isToday ? (
                    /* Decision Q4a — the day itself reads as "Today", not a
                       countdown of zero. */
                    <span className={cn("text-4xl font-bold", tone.value)}>
                      Today
                    </span>
                  ) : (
                    <>
                      {/* AC1 — days remaining as a large number. */}
                      <span
                        className={cn(
                          "text-4xl font-bold tabular-nums",
                          tone.value,
                        )}
                      >
                        {daysToEpa}
                      </span>
                      <span className="text-sm font-medium text-neutral-500">
                        {daysToEpa === 1 ? "day to go" : "days to go"}
                      </span>
                    </>
                  )}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {isOverdue
                    ? "Your EPA date has passed and no completion has been recorded. Speak to your tutor."
                    : epaDate
                      ? formatDate(epaDate)
                      : null}
                </p>
              </>
            )}

            {/* AC4 discoverability — the tap target is the whole card, but a
                sighted user needs to be told it goes somewhere. */}
            <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:underline">
              View gateway checklist
              <ChevronRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </p>
          </div>

          <CountdownRing band={band} daysToEpa={daysToEpa} tone={tone} />
        </Link>
      </CardContent>
    </Card>
  );
}

/**
 * A ring that fills as the date approaches. Decorative — every value it
 * encodes is already stated in text beside it, so it carries `aria-hidden`
 * rather than duplicating the number for a screen reader.
 */
function CountdownRing({ band, daysToEpa, tone }) {
  const RADIUS = 26;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Full ring a year out, empty at the date. Purely presentational.
  const fraction =
    daysToEpa === null || band === EPA_BAND.UNSET
      ? 0
      : Math.max(0, Math.min(1, 1 - Math.min(daysToEpa, 365) / 365));

  return (
    <svg
      viewBox="0 0 64 64"
      className="size-16 shrink-0 -rotate-90"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="32"
        cy="32"
        r={RADIUS}
        fill="none"
        strokeWidth="6"
        className="stroke-current text-neutral-200"
      />
      <circle
        cx="32"
        cy="32"
        r={RADIUS}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
        className={cn("stroke-current transition-all", tone.ring)}
      />
    </svg>
  );
}
