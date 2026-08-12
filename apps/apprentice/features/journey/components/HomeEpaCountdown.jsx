// @ts-check
"use client";

import { EpaCountdownCard } from "./EpaCountdownCard";
import { useEnrolmentJourney } from "../queries/journey.query";

/**
 * F3.2.3 AC1 — the countdown on the home screen.
 *
 * A thin wrapper so `DashboardHome` does not need to know how the journey is
 * fetched. Renders nothing at all while loading, on error, or with no
 * enrolment: a countdown is a secondary card on this screen, and a broken
 * skeleton or an error box sitting in the sidebar of the home page is worse
 * than its absence. `/journey` is where those states are reported properly.
 *
 * It does **not** fall back to a placeholder number. Nothing on this screen
 * may show a figure that is not the learner's own (OQ-15).
 */
export function HomeEpaCountdown() {
  const { data, isLoading, isError, hasNoEnrolment } = useEnrolmentJourney();

  if (isLoading || isError || hasNoEnrolment || !data) return null;

  return (
    <EpaCountdownCard
      band={data.epaCountdownBand}
      daysToEpa={data.daysToEpa}
      epaDate={data.epaDate}
    />
  );
}
