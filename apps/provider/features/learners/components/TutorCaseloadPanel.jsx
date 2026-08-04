"use client";

import { AlertTriangle, Users } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

import { useTutorCaseload } from "../queries/learners.query";

/**
 * F2.2.5 AC2 — "caseload dashboard shows: learner count per tutor, at-risk
 * count per tutor, review compliance rate per tutor".
 *
 * The API sorts worst-first and decides which tutors breach the threshold, so
 * this renders the order and the flag it is given. Re-sorting or re-deriving
 * the flag here would let the screen disagree with the alert emails sent from
 * the same numbers.
 */
function CaseloadRow({ tutor }) {
  const isUnassigned = tutor.tutorUserId === null;

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-sm font-medium",
            isUnassigned ? "text-amber-700" : "text-neutral-800",
          )}
        >
          {tutor.tutorName}
        </p>
        <p className="text-xs text-neutral-400">
          {tutor.learnerCount} learner{tutor.learnerCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-neutral-400">
            At risk
          </p>
          <p
            className={cn(
              "tabular-nums text-sm font-semibold",
              tutor.exceedsAtRiskThreshold
                ? "text-rose-700"
                : tutor.atRiskCount > 0
                  ? "text-amber-700"
                  : "text-neutral-500",
            )}
          >
            {tutor.atRiskCount}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-neutral-400">
            Review compliance
          </p>
          {/*
           * Null means no reviews scheduled at all, which is not the same as
           * 100% and is the more worrying of the two. Said in words rather
           * than shown as a dash.
           */}
          <p className="tabular-nums text-sm text-neutral-600">
            {tutor.reviewComplianceRate === null
              ? "No reviews"
              : `${tutor.reviewComplianceRate}%`}
          </p>
        </div>

        {tutor.exceedsAtRiskThreshold ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
            <AlertTriangle className="size-3" aria-hidden />
            Over threshold
          </span>
        ) : null}
      </div>
    </li>
  );
}

export function TutorCaseloadPanel() {
  const { data, isLoading } = useTutorCaseload();

  const tutors = data?.tutors ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-neutral-400" aria-hidden />
          <h2 className="text-base font-semibold text-neutral-900">
            Tutor caseload
          </h2>
        </div>
        {data ? (
          <p className="text-xs text-neutral-400">
            {data.totalAtRisk} at risk of {data.totalLearners} · flagged above{" "}
            {data.atRiskThreshold}
          </p>
        ) : null}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="py-6 text-sm text-neutral-400">Loading caseload…</p>
        ) : tutors.length ? (
          <ul className="divide-y divide-neutral-100">
            {tutors.map((tutor) => (
              <CaseloadRow
                key={tutor.tutorUserId ?? "unassigned"}
                tutor={tutor}
              />
            ))}
          </ul>
        ) : (
          <p className="py-6 text-sm text-neutral-400">
            No active learners yet, so there is no caseload to balance.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
