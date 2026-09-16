"use client";

import { useLearnerOtjWeekly } from "@/features/learners/queries/learners.query";

import { T } from "./tokens";

/**
 * F1.2.2 AC3 — "OTJ hours chart showing weekly logged hours over the
 * programme lifetime".
 *
 * ── WHERE THE NUMBERS COME FROM ─────────────────────────────────────────────
 *
 * `GET /learners/:enrolmentId/otj/weekly`, which the API groups by ISO week
 * over the whole programme. Not `profile.otj.recentEntries`: that list is
 * capped at 500 and silently truncates a long programme, so a chart drawn
 * from it would end early and look complete. Nothing is bucketed here.
 *
 * ── THE CONVENTIONS ARE THE APPRENTICE PORTAL'S ─────────────────────────────
 *
 * apps/apprentice draws this chart for the learner (OtjWeeklyChart.jsx), and
 * two charts of the same data that disagree would be worse than one chart in
 * one place. So the same rules, without importing across apps:
 *
 *   - a bar is one ISO week, Monday-start;
 *   - approved and pending render as separate stacked segments, never one
 *     bar (client decision D2) — approved is what counts, pending is what is
 *     waiting on the provider;
 *   - an empty week is a real zero-height bar, not a gap that closes up;
 *   - the legend reads "Approved" and "Awaiting approval".
 *
 * The one difference is scale: the apprentice sees the last eight weeks, the
 * employer the lifetime, so the bars sit in a strip that scrolls and the
 * labels mark month boundaries rather than every week.
 */

const BAR_WIDTH_PX = 14;
const BAR_GAP_PX = 4;
const MONTH_LABEL = { month: "short", year: "2-digit", timeZone: "UTC" };

const isText = (value) => typeof value === "string" && value.trim() !== "";
const isMinutes = (value) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

const hoursLabel = (minutes) => `${Math.round((minutes / 60) * 10) / 10} h`;

/** The week's month, when it is the first week shown in that month. */
function monthLabel(weekStart, previousWeekStart) {
  const month = weekStart.slice(0, 7);
  if (previousWeekStart && previousWeekStart.slice(0, 7) === month) {
    return null;
  }
  return new Date(`${weekStart}T00:00:00Z`).toLocaleDateString(
    "en-GB",
    MONTH_LABEL,
  );
}

export function ProfileOtjChart({ enrolmentId, unavailable }) {
  const query = useLearnerOtjWeekly(enrolmentId);

  // The Activity tab's own state already explains a missing enrolment id.
  if (unavailable) return null;

  if (query.isLoading) {
    return (
      <p className="text-xs" style={{ color: T.muted }}>
        Loading weekly hours…
      </p>
    );
  }
  if (query.isError) {
    return (
      <p className="text-xs" style={{ color: T.red }} role="alert">
        {query.error?.message}
      </p>
    );
  }

  const weeks = (
    Array.isArray(query.data?.weeks) ? query.data.weeks : []
  ).filter(
    (week) =>
      isText(week?.weekStart) &&
      isMinutes(week?.approvedMinutes) &&
      isMinutes(week?.pendingMinutes),
  );

  if (weeks.length === 0) {
    return (
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
      >
        <p className="text-xs font-bold" style={{ color: T.ink }}>
          No weeks to chart
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
          The API returned no programme start date and no logged sessions for
          this enrolment.
        </p>
      </div>
    );
  }

  // Never zero, so a programme with nothing logged still draws empty bars.
  const peak = Math.max(
    60,
    ...weeks.map((week) => week.approvedMinutes + week.pendingMinutes),
  );
  const approvedTotal = weeks.reduce(
    (sum, week) => sum + week.approvedMinutes,
    0,
  );
  const pendingTotal = weeks.reduce(
    (sum, week) => sum + week.pendingMinutes,
    0,
  );
  const hasAnything = approvedTotal > 0 || pendingTotal > 0;

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-bold" style={{ color: T.ink }}>
          Weekly off-the-job hours
        </p>
        <p className="text-[11px] tabular-nums" style={{ color: T.muted }}>
          {`${hoursLabel(approvedTotal)} approved over ${weeks.length} ${
            weeks.length === 1 ? "week" : "weeks"
          }`}
        </p>
      </div>

      <div className="mt-3 overflow-x-auto">
        <div
          className="flex items-end"
          style={{ gap: `${BAR_GAP_PX}px`, minWidth: "100%" }}
          role="img"
          aria-label={`Weekly off-the-job hours, ${weeks.length} weeks`}
        >
          {weeks.map((week, i) => {
            const approvedPct = (week.approvedMinutes / peak) * 100;
            const pendingPct = (week.pendingMinutes / peak) * 100;
            const label = monthLabel(
              week.weekStart,
              i > 0 ? weeks[i - 1].weekStart : null,
            );

            return (
              <div
                key={week.weekStart}
                className="flex shrink-0 flex-col items-center gap-1"
                style={{ width: `${BAR_WIDTH_PX}px` }}
              >
                <div
                  className="flex h-24 w-full flex-col justify-end overflow-hidden rounded-sm"
                  style={{ backgroundColor: T.border }}
                  title={`Week beginning ${week.weekStart}: ${hoursLabel(
                    week.approvedMinutes,
                  )} approved, ${hoursLabel(week.pendingMinutes)} awaiting approval`}
                >
                  {pendingPct > 0 ? (
                    <div
                      className="w-full"
                      style={{
                        height: `${pendingPct}%`,
                        backgroundColor: T.amber,
                      }}
                    />
                  ) : null}
                  {approvedPct > 0 ? (
                    <div
                      className="w-full"
                      style={{
                        height: `${approvedPct}%`,
                        backgroundColor: T.blue,
                      }}
                    />
                  ) : null}
                </div>
                <span
                  className="h-3 whitespace-nowrap text-[9px]"
                  style={{ color: T.muted }}
                >
                  {label ?? ""}
                </span>
                <span className="sr-only">
                  {`Week beginning ${week.weekStart}: ${hoursLabel(
                    week.approvedMinutes,
                  )} approved, ${hoursLabel(week.pendingMinutes)} awaiting approval`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="mt-2 flex items-center gap-4 text-[11px]"
        style={{ color: T.muted }}
      >
        <span className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: T.blue }}
            aria-hidden
          />
          Approved
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: T.amber }}
            aria-hidden
          />
          Awaiting approval
        </span>
      </div>

      {!hasAnything ? (
        <p className="mt-2 text-[11px]" style={{ color: T.muted }}>
          No off-the-job training has been logged in this programme.
        </p>
      ) : null}

      {query.data?.truncated === true ? (
        <p className="mt-2 text-[11px]" style={{ color: T.amber }}>
          The programme spans more than 520 weeks; the oldest weeks are not
          shown.
        </p>
      ) : null}
    </div>
  );
}
