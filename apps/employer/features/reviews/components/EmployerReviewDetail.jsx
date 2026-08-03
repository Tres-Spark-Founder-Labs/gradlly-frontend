"use client";

import { CalendarDays, FileText, Target } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { GoBackButton } from "@/components/ui/GoBackButton";
import { formatDateTime } from "@/utils/helper";

import { ReviewStatusBadge } from "./ReviewStatusBadge";
import { PREVIOUS_GOAL_OUTCOME_LABELS } from "../constants";
import { useReview, useReviewRecord } from "../queries/reviews.query";

function Section({ title, children }) {
  if (!children) return null;
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      <p className="whitespace-pre-wrap text-sm text-neutral-600">{children}</p>
    </div>
  );
}

/**
 * F2.2.3 AC6 — "employer ... can view the full record".
 *
 * Everything the tutor and learner signed: progress against the previous
 * review's goals, the off-the-job discussion, this review's SMART goals, the
 * wellbeing check and the actions agreed.
 *
 * Read-only. There is no edit or sign control because the API refuses both
 * for a non-owning organisation, and a button that returns 403 reads as a
 * broken product rather than as a boundary.
 */
export function EmployerReviewDetail({ id }) {
  const { data: review, isLoading } = useReview(id);
  const {
    data: record,
    isLoading: recordLoading,
    isError,
  } = useReviewRecord(id);

  if (isLoading) {
    return <p className="text-sm text-neutral-400">Loading review…</p>;
  }
  if (!review) {
    return (
      <div className="space-y-4">
        <GoBackButton />
        <p className="text-sm text-neutral-500">
          This review is not available to your organisation.
        </p>
      </div>
    );
  }

  const payload = record?.payload;
  const goals = payload?.smartGoals ?? [];
  const previous = payload?.previousGoalProgress ?? [];

  return (
    <div className="space-y-5">
      <GoBackButton />

      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-neutral-400" aria-hidden />
            <h2 className="text-base font-semibold text-neutral-900">
              {review.title || "Progress review"}
            </h2>
            <ReviewStatusBadge status={review.status} />
          </div>
          <span className="text-sm text-neutral-500">
            {formatDateTime(review.scheduledAt)}
          </span>
        </CardHeader>

        <CardContent className="space-y-5">
          {recordLoading ? (
            <p className="text-sm text-neutral-400">Loading record…</p>
          ) : isError || !payload ? (
            /* A scheduled review simply has no record yet. Saying so beats an
               error state for something that is not wrong. */
            <p className="text-sm text-neutral-500">
              No record has been written for this review yet. It appears here
              once your training provider completes it.
            </p>
          ) : (
            <>
              {previous.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Progress against previous goals
                  </h3>
                  <ul className="space-y-2">
                    {previous.map((item) => (
                      <li
                        key={item.objective}
                        className="border-l-2 border-neutral-200 pl-3"
                      >
                        <p className="text-sm text-neutral-800">
                          {item.objective}
                        </p>
                        <p className="text-xs font-medium text-neutral-500">
                          {PREVIOUS_GOAL_OUTCOME_LABELS[item.outcome] ??
                            item.outcome}
                        </p>
                        {item.notes ? (
                          <p className="mt-0.5 text-sm text-neutral-600">
                            {item.notes}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <Section title="Off-the-job hours discussion">
                {payload.otjDiscussion}
              </Section>
              <Section title="Progress summary">
                {payload.progressSummary}
              </Section>

              {goals.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
                    <Target className="size-3.5 text-neutral-400" aria-hidden />
                    SMART goals
                  </h3>
                  <ul className="space-y-2">
                    {goals.map((goal) => (
                      <li
                        key={goal.objective}
                        className="rounded-lg border border-neutral-200 p-3"
                      >
                        <p className="text-sm font-medium text-neutral-900">
                          {goal.objective}
                        </p>
                        <dl className="mt-1 grid grid-cols-1 gap-x-4 gap-y-0.5 text-xs text-neutral-500 sm:grid-cols-2">
                          {[
                            ["Measurable", goal.measurable],
                            ["Achievable", goal.achievable],
                            ["Relevant", goal.relevant],
                            ["Time-bound", goal.timeBound],
                          ].map(([label, value]) =>
                            value ? (
                              <div key={label}>
                                <dt className="inline font-medium">
                                  {label}:{" "}
                                </dt>
                                <dd className="inline">{value}</dd>
                              </div>
                            ) : null,
                          )}
                        </dl>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {payload.wellbeing?.score || payload.wellbeing?.notes ? (
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Wellbeing
                  </h3>
                  {payload.wellbeing?.score ? (
                    <p className="text-sm text-neutral-600">
                      Score: {payload.wellbeing.score}/10
                    </p>
                  ) : null}
                  {payload.wellbeing?.notes ? (
                    <p className="whitespace-pre-wrap text-sm text-neutral-600">
                      {payload.wellbeing.notes}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <Section title="Actions agreed">{payload.actionsAgreed}</Section>
              <Section title="Employer comments">
                {payload.employerComments}
              </Section>

              <p className="flex items-center gap-1.5 border-t border-neutral-100 pt-3 text-xs text-neutral-400">
                <FileText className="size-3.5" aria-hidden />
                Recorded by your training provider. Contact them if anything
                here looks wrong.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
