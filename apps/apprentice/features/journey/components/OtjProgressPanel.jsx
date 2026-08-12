// @ts-check
"use client";

import { AlertCircle, CalendarCheck, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useOtjLogEntries } from "@/features/otj/queries/otj.query";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { formatDate } from "@/utils/helper";

import { OtjProgressRing } from "./OtjProgressRing";
import { OtjWeeklyChart } from "./OtjWeeklyChart";
import { useEnrolmentJourney } from "../queries/journey.query";
import { buildWeeklyHours } from "../utils/weekly-hours";

/**
 * F3.1.2 — OTJ progress visualisation.
 *
 * AC1 ring with logged / required / percentage · AC2 ring colour band · AC3
 * horizontal bar with exact counts · AC4 weekly chart for the last 8 weeks ·
 * AC5 projected completion date.
 *
 * This is the screen that replaces `OTJStatCards`, `OTJWeeklyChart` and
 * `OTJProgressBar`, all three of which rendered constants — "198h logged",
 * "45%", a fabricated bar chart — to every apprentice regardless of what they
 * had actually done (OQ-15). Every number below comes from the API or is
 * absent.
 */
export function OtjProgressPanel() {
  const journey = useEnrolmentJourney();
  const summary = useLearnerSummary();
  /**
   * A wide page so eight weeks of entries land in one response. The weekly
   * chart buckets what it is given; if the window ever outgrows a page the
   * chart would under-report rather than fail loudly, so this is sized well
   * clear of it and revisited if the API gains a date filter on this hook.
   */
  const entries = useOtjLogEntries({ perPage: 100 });

  const pace = journey.data?.pace;
  /**
   * Pending lives on the learner summary, not on the journey payload. Read
   * from there rather than duplicated into the journey DTO — react-query has
   * already fetched it for the enrolment id, so this costs no extra request.
   */
  const pendingMinutes = summary.data?.otjPace?.pendingMinutes ?? 0;

  if (journey.isLoading) return <ProgressSkeleton />;

  if (journey.hasNoEnrolment) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-neutral-500">
          Your off-the-job progress appears here once your enrolment is active.
        </CardContent>
      </Card>
    );
  }

  if (journey.isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <AlertCircle className="size-7 text-error-500" aria-hidden="true" />
          <p className="text-sm font-semibold text-neutral-900">
            We could not load your progress
          </p>
          <p className="max-w-sm text-xs text-neutral-600">
            {journey.error?.message ??
              "Something went wrong. Your logged hours are safe."}
          </p>
          <button
            type="button"
            onClick={() => journey.refetch()}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </CardContent>
      </Card>
    );
  }

  const weeks = buildWeeklyHours(entries.data?.entries ?? []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-neutral-900">
            Off-the-job training
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Approved hours count towards your apprenticeship. Hours awaiting
            your provider&apos;s approval are shown separately.
          </p>
        </CardHeader>
        <CardContent className="pb-6">
          <OtjProgressRing
            percentOfTarget={pace?.percentOfTarget ?? null}
            band={pace?.progressBand}
            approvedMinutes={pace?.approvedMinutes ?? 0}
            pendingMinutes={pendingMinutes}
            totalTargetMinutes={pace?.totalTargetMinutes ?? 0}
          />

          {/* AC5 — projection, or an explicit reason there isn't one. */}
          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-neutral-50 p-3.5">
            <CalendarCheck
              className="mt-0.5 size-4 shrink-0 text-neutral-500"
              aria-hidden="true"
            />
            <p className="text-xs text-neutral-600">
              {pace?.projectedCompletionDate ? (
                <>
                  At your current pace you will reach your target around{" "}
                  <span className="font-semibold text-neutral-900">
                    {formatDate(pace.projectedCompletionDate)}
                  </span>
                  .
                </>
              ) : (
                <>
                  We cannot project a completion date yet — that needs some
                  approved hours to measure your pace against.
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp
              className="size-4 text-neutral-500"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold text-neutral-900">
              Last 8 weeks
            </h2>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          {entries.isLoading ? (
            <div className="h-36 animate-pulse rounded-xl bg-neutral-100" />
          ) : (
            <OtjWeeklyChart weeks={weeks} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProgressSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading your off-the-job progress</span>
      <div className="h-80 animate-pulse rounded-2xl bg-neutral-100" />
      <div className="h-56 animate-pulse rounded-2xl bg-neutral-100" />
    </div>
  );
}
