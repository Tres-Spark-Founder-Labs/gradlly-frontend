"use client";

import { PREVIOUS_GOAL_OUTCOME_LABELS } from "@/features/learners/constants";
import { useReviewRecord } from "@/features/reviews/queries/reviews.query";
import { formatDate } from "@/utils/helper";

import { T } from "./tokens";

/**
 * F1.2.2 AC4 — "review history with dates, outcomes, and action points".
 *
 * `GET /reviews/:id/record` returns 200 to an employer with the outcome, the
 * agreed actions and the SMART goals. The reviews tab showed only dates,
 * status and signatures — the record was served and never asked for. This is
 * the record, section by section, and only the sections the record carries.
 *
 * A 404 is a state, not a fault: a scheduled review has no record until the
 * tutor writes one. It is said so, in those words.
 */

const isText = (value) => typeof value === "string" && value.trim() !== "";

function Section({ title, children }) {
  return (
    <div>
      <p
        className="text-[10px] font-bold uppercase tracking-wide"
        style={{ color: T.muted }}
      >
        {title}
      </p>
      <div className="text-xs mt-0.5" style={{ color: T.ink }}>
        {children}
      </div>
    </div>
  );
}

function NoRecord() {
  return (
    <p className="text-xs" style={{ color: T.muted }}>
      No record has been written for this review yet.
    </p>
  );
}

export function ProfileReviewRecord({ reviewId }) {
  const { data, isLoading, isError, error } = useReviewRecord(reviewId);

  if (isLoading) {
    return (
      <p className="text-xs" style={{ color: T.muted }}>
        Loading record…
      </p>
    );
  }
  if (isError) {
    if (error?.status === 404) return <NoRecord />;
    return (
      <p className="text-xs" style={{ color: T.red }} role="alert">
        {error?.message}
      </p>
    );
  }

  const payload = data?.payload ?? null;
  if (!payload) return <NoRecord />;

  const goals = Array.isArray(payload.smartGoals) ? payload.smartGoals : [];
  const previous = Array.isArray(payload.previousGoalProgress)
    ? payload.previousGoalProgress
    : [];
  const wellbeing = payload.wellbeing ?? null;
  const wellbeingScore =
    typeof wellbeing?.score === "number" && Number.isFinite(wellbeing.score)
      ? wellbeing.score
      : null;
  const submittedOn = isText(data?.submittedAt)
    ? formatDate(data.submittedAt)
    : null;

  const hasAnything =
    isText(payload.progressSummary) ||
    isText(payload.actionsAgreed) ||
    goals.length > 0 ||
    previous.length > 0 ||
    isText(payload.otjDiscussion) ||
    wellbeingScore !== null ||
    isText(wellbeing?.notes) ||
    isText(payload.employerComments);

  if (!hasAnything) {
    return (
      <p className="text-xs" style={{ color: T.muted }}>
        The record carries no summary, actions or goals.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {isText(payload.progressSummary) ? (
        <Section title="Progress summary">{payload.progressSummary}</Section>
      ) : null}

      {isText(payload.actionsAgreed) ? (
        <Section title="Actions agreed">{payload.actionsAgreed}</Section>
      ) : null}

      {goals.length > 0 ? (
        <Section title="SMART goals">
          <ol className="space-y-1.5 list-decimal pl-4">
            {goals.map((goal, i) => (
              <li key={`${goal?.objective ?? "goal"}-${i}`}>
                {isText(goal?.objective) ? (
                  <p className="font-semibold">{goal.objective}</p>
                ) : null}
                <dl className="mt-0.5 grid grid-cols-[auto_1fr] gap-x-2 text-[11px]">
                  {[
                    ["Measurable", goal?.measurable],
                    ["Achievable", goal?.achievable],
                    ["Relevant", goal?.relevant],
                    ["Time-bound", goal?.timeBound],
                  ].map(([label, value]) =>
                    isText(value) ? (
                      <div key={label} className="contents">
                        <dt style={{ color: T.muted }}>{label}</dt>
                        <dd style={{ color: T.subtle }}>{value}</dd>
                      </div>
                    ) : null,
                  )}
                </dl>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {previous.length > 0 ? (
        <Section title="Previous goals">
          <ul className="space-y-1">
            {previous.map((item, i) => (
              <li
                key={`${item?.objective ?? "previous"}-${i}`}
                className="flex items-start justify-between gap-2"
              >
                <span className="min-w-0">
                  {isText(item?.objective) ? item.objective : null}
                  {isText(item?.notes) ? (
                    <span
                      className="block text-[11px]"
                      style={{ color: T.subtle }}
                    >
                      {item.notes}
                    </span>
                  ) : null}
                </span>
                {isText(item?.outcome) ? (
                  <span
                    className="text-[10px] font-bold shrink-0"
                    style={{ color: T.muted }}
                  >
                    {PREVIOUS_GOAL_OUTCOME_LABELS[item.outcome] ?? item.outcome}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {isText(payload.otjDiscussion) ? (
        <Section title="Off-the-job discussion">
          {payload.otjDiscussion}
        </Section>
      ) : null}

      {wellbeingScore !== null || isText(wellbeing?.notes) ? (
        <Section title="Wellbeing">
          {wellbeingScore !== null ? (
            <p className="tabular-nums">{`${wellbeingScore} / 10`}</p>
          ) : null}
          {isText(wellbeing?.notes) ? (
            <p style={{ color: T.subtle }}>{wellbeing.notes}</p>
          ) : null}
        </Section>
      ) : null}

      {isText(payload.employerComments) ? (
        <Section title="Employer comments">{payload.employerComments}</Section>
      ) : null}

      {submittedOn ? (
        <p className="text-[11px]" style={{ color: T.muted }}>
          {`Submitted ${submittedOn}`}
        </p>
      ) : null}
    </div>
  );
}
