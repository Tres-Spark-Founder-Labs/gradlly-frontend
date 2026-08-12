// @ts-check
"use client";

import { AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

import { EpaCountdownCard } from "./EpaCountdownCard";
import { GatewayChecklist } from "./GatewayChecklist";
import { ProgrammeTimeline } from "./ProgrammeTimeline";
import { useEnrolmentJourney } from "../queries/journey.query";

/**
 * The `/journey` screen — F3.2.1 timeline, F3.2.2 gateway checklist and the
 * F3.2.3 countdown, all from the one `GET /enrolments/:id/journey` call.
 *
 * Every state below is a real state with its own rendering: loading, no
 * enrolment, request failed, and loaded. None of them falls back to sample
 * data — an apprentice who cannot load their progress must be told that,
 * not shown a plausible number (OQ-15).
 */
export function JourneyView() {
  const { data, isLoading, isError, error, refetch, hasNoEnrolment } =
    useEnrolmentJourney();

  if (isLoading) return <JourneySkeleton />;

  if (hasNoEnrolment) {
    return (
      <EmptyState
        title="No active programme"
        description="Your journey appears here once your training provider activates your enrolment."
      />
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <AlertCircle className="size-8 text-error-500" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              We could not load your journey
            </p>
            <p className="mt-1 text-xs text-neutral-600">
              {error?.message ?? "Something went wrong."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <EpaCountdownCard
        band={data?.epaCountdownBand}
        daysToEpa={data?.daysToEpa}
        epaDate={data?.epaDate}
      />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-neutral-900">
            Your programme
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Every stage from enrolment to completion. Select a milestone for
            detail.
          </p>
        </CardHeader>
        <CardContent>
          <ProgrammeTimeline milestones={data?.milestones ?? []} />
        </CardContent>
      </Card>

      {/* The countdown links to #gateway, so this anchor is part of F3.2.3 AC4. */}
      <Card id="gateway" className="scroll-mt-20">
        <CardHeader>
          <h2 className="text-base font-semibold text-neutral-900">
            Gateway readiness
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            What you need to complete before you can be put forward for
            end-point assessment.
          </p>
        </CardHeader>
        <CardContent>
          <GatewayChecklist
            items={data?.gatewayChecklist ?? []}
            completionPercent={data?.gatewayCompletionPercent ?? 0}
            ready={!!data?.gatewayReady}
            readyAt={data?.gatewayReadyAt ?? null}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function JourneySkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading your journey</span>
      <div className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
      <div className="h-72 animate-pulse rounded-2xl bg-neutral-100" />
      <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
    </div>
  );
}
