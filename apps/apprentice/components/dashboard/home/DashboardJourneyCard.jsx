"use client";

import { CheckCircle2, GraduationCap } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { useEnrolmentJourney } from "@/features/enrolments/queries/enrolments.query";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { cn, formatDate } from "@/utils/helper";

const COUNTDOWN_COLOR = {
  green: "text-success-700 bg-success-50 border-success-200",
  amber: "text-warning-700 bg-warning-50 border-warning-200",
  red: "text-danger-700 bg-danger-50 border-danger-200",
  unset: "text-neutral-500 bg-neutral-50 border-neutral-200",
};

function StepIcon({ status }) {
  if (status === "complete") {
    return <CheckCircle2 size={16} className="text-white" />;
  }
  return (
    <GraduationCap
      size={14}
      className={status === "current" ? "text-white" : "text-neutral-400"}
    />
  );
}

export function DashboardJourneyCard() {
  const { data: summary } = useLearnerSummary();
  const enrolmentId = summary?.activeEnrolmentId ?? null;
  const { data: journey, isLoading } = useEnrolmentJourney(enrolmentId);

  if (!enrolmentId) return null;

  if (isLoading || !journey) {
    return (
      <Card>
        <CardContent className="space-y-3 py-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-4 w-full animate-pulse rounded-md bg-neutral-100"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  const milestones = journey.milestones ?? [];
  const completedCount = milestones.filter(
    (m) => m.status === "complete",
  ).length;
  const trackPct =
    milestones.length > 1
      ? (completedCount / (milestones.length - 1)) * 100
      : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">
              {journey.epaDate
                ? `EPA on ${formatDate(journey.epaDate)}`
                : "EPA date not yet confirmed — speak to your tutor"}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Your journey to qualification
            </p>
          </div>
          {journey.daysToEpa !== null && journey.daysToEpa !== undefined && (
            <span
              className={cn(
                "text-xs font-semibold border px-2.5 py-1 rounded-full",
                COUNTDOWN_COLOR[journey.epaCountdownBand] ??
                  COUNTDOWN_COLOR.unset,
              )}
            >
              {journey.daysToEpa} days to EPA
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {milestones.length > 0 ? (
          <div className="relative flex items-start justify-between pt-1">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-neutral-100 z-0">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-primary-300 rounded-full"
                style={{ width: `${Math.max(0, Math.min(100, trackPct))}%` }}
              />
            </div>
            {milestones.map((m) => (
              <div
                key={m.code}
                className="relative z-10 flex flex-col items-center gap-2 flex-1 min-w-0"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white transition-colors",
                    m.status === "complete" &&
                      "border-primary-600 bg-primary-600",
                    m.status === "current" &&
                      "border-primary-600 bg-primary-600 shadow-md",
                    m.status === "upcoming" && "border-neutral-200",
                  )}
                >
                  <StepIcon status={m.status} />
                </div>
                <p
                  className={cn(
                    "text-xs font-semibold text-center leading-tight",
                    m.status === "upcoming"
                      ? "text-neutral-400"
                      : "text-primary-700",
                  )}
                >
                  {m.title}
                </p>
                {m.date && (
                  <p className="text-xs text-neutral-400 text-center">
                    {formatDate(m.date)}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400">No milestones yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
