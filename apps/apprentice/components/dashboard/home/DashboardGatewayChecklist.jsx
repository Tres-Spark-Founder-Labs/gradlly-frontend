"use client";

import { CheckCircle, Circle, Clock, Lock } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { useEnrolmentJourney } from "@/features/enrolments/queries/enrolments.query";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { cn } from "@/utils/helper";

const STATUS_ICON = {
  complete: CheckCircle,
  in_progress: Clock,
  not_started: Circle,
  blocked: Lock,
};

function CheckRow({ criterion }) {
  const Icon = STATUS_ICON[criterion.status] ?? Circle;
  const isDone = criterion.status === "complete";
  const isPartial = criterion.status === "in_progress";
  const isBlocked = criterion.status === "blocked";

  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-neutral-100 last:border-0">
      <Icon
        size={17}
        className={cn(
          "shrink-0 mt-0.5",
          isDone && "text-success-600",
          isPartial && "text-warning-500",
          isBlocked && "text-danger-500",
          !isDone && !isPartial && !isBlocked && "text-neutral-300",
        )}
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium leading-snug",
            criterion.status === "not_started"
              ? "text-neutral-400"
              : "text-neutral-800",
          )}
        >
          {criterion.title}
        </p>
        {(criterion.description || isBlocked) && (
          <p
            className={cn(
              "text-xs mt-0.5",
              isDone
                ? "text-success-600 font-medium"
                : isPartial
                  ? "text-warning-600"
                  : isBlocked
                    ? "text-danger-600"
                    : "text-neutral-400",
            )}
          >
            {isBlocked && criterion.blockedBy?.length
              ? `Blocked by: ${criterion.blockedBy.join(", ")}`
              : criterion.description}
          </p>
        )}
      </div>
    </div>
  );
}

export function DashboardGatewayChecklist() {
  const { data: summary } = useLearnerSummary();
  const enrolmentId = summary?.activeEnrolmentId ?? null;
  const { data: journey, isLoading } = useEnrolmentJourney(enrolmentId);

  if (!enrolmentId) return null;
  if (isLoading || !journey) return null;

  const checklist = journey.gatewayChecklist ?? [];
  const doneCount = checklist.filter((c) => c.status === "complete").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">
              Gateway readiness
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              All criteria must be met before your gateway review
            </p>
          </div>
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full border",
              journey.gatewayReady
                ? "text-success-700 bg-success-50 border-success-200"
                : "text-warning-700 bg-warning-50 border-warning-200",
            )}
          >
            {journey.gatewayReady
              ? "Gateway ready"
              : `${doneCount} of ${checklist.length} ready`}
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-0 pb-1">
        {checklist.length === 0 && (
          <p className="text-sm text-neutral-400 py-3.5">
            No gateway criteria yet.
          </p>
        )}
        {checklist.map((criterion) => (
          <CheckRow key={criterion.code} criterion={criterion} />
        ))}
      </CardContent>
    </Card>
  );
}
