"use client";

import { useState } from "react";

import { DATE_NOT_RECORDED } from "@/features/learners/constants";
import { buildProgrammeMilestones } from "@/features/learners/utils/programme-milestones";
import { formatDate } from "@/utils/helper";

import { ProfileTabState } from "./ProfileTabState";
import { T } from "./tokens";

/**
 * The programme as a chronology, built from programme dates, reviews and any
 * open break in learning.
 *
 * ── WHAT WAS HERE BEFORE ────────────────────────────────────────────────────
 *
 * This component took the apprentice prop and threw it away (`{ a: _a }`). It
 * rendered a six-milestone ladder with dates from March 2024 to January 2026
 * and notes like "Progressing well. OTJ on pace." — the same for every
 * apprentice, including one enrolled yesterday. A progress bar computed a
 * percentage from those fixed statuses, so it always read 33%.
 *
 * ── WHY THE PROGRESS BAR IS GONE ────────────────────────────────────────────
 *
 * It measured completed-fixtures over total-fixtures. There is no equivalent
 * real number: the API reports OTJ percentage (on the Overview tab) and review
 * states, but nothing that means "fraction of programme complete". Rebuilding
 * the bar would have meant inventing a denominator, so the chronology carries
 * the information instead and the bar is not replaced by a plausible one.
 *
 * ── UNDATED MILESTONES ──────────────────────────────────────────────────────
 *
 * A milestone with no date cannot be placed in a chronology, and interpolating
 * one from its neighbours is precisely the fabrication being removed. They are
 * listed separately, marked as not recorded.
 */
const STATUS_COLOR = {
  complete: T.green,
  overdue: T.red,
  scheduled: T.blue,
  passed: T.amber,
  cancelled: T.muted,
  unknown: T.muted,
};

const STATUS_LABEL = {
  complete: "Complete",
  overdue: "Overdue",
  scheduled: "Scheduled",
  passed: "Date passed",
  cancelled: "Cancelled",
  unknown: "Not recorded",
};

export function ProfileTimeline({
  profile,
  isLoading,
  isError,
  error,
  unavailable,
}) {
  const [active, setActive] = useState(null);

  const milestones = buildProgrammeMilestones(profile);
  const dated = milestones
    .filter((m) => m.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const undated = milestones.filter((m) => !m.date);

  return (
    <ProfileTabState
      unavailable={unavailable}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!isLoading && !isError && milestones.length === 0}
      emptyTitle="Nothing to plot yet"
      emptyDetail="This enrolment has no programme dates and no reviews on the API."
    >
      <div className="space-y-5">
        {dated.length > 0 ? (
          <ol className="relative space-y-0">
            {dated.map((m, i) => {
              const color = STATUS_COLOR[m.status] ?? T.muted;
              const isOpen = active === m.key;

              return (
                <li key={m.key} className="relative flex gap-3 pb-4">
                  {/* The connector stops at the last item rather than trailing
                      off into a future the API has not described. */}
                  {i < dated.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute left-[7px] top-4 bottom-0 w-px"
                      style={{ backgroundColor: T.border }}
                    />
                  ) : null}

                  <span
                    aria-hidden
                    className="relative z-[1] mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2"
                    style={{
                      backgroundColor:
                        m.status === "complete" ? color : T.surface,
                      borderColor: color,
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setActive(isOpen ? null : m.key)}
                    aria-expanded={isOpen}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-bold" style={{ color: T.ink }}>
                        {m.label}
                      </p>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: `${color}12`,
                          color,
                        }}
                      >
                        {STATUS_LABEL[m.status] ?? m.status}
                      </span>
                    </div>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: T.muted }}
                    >
                      {formatDate(m.date)}
                    </p>
                    {isOpen && m.detail ? (
                      <p
                        className="text-xs mt-1.5 rounded-lg p-2"
                        style={{
                          color: T.subtle,
                          backgroundColor: T.card,
                          border: `1px solid ${T.border}`,
                        }}
                      >
                        {m.detail}
                      </p>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ol>
        ) : null}

        {undated.length > 0 ? (
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
          >
            <p className="text-xs font-bold" style={{ color: T.ink }}>
              Not yet scheduled
            </p>
            <p className="text-[11px] mt-0.5 mb-2" style={{ color: T.muted }}>
              These have no date on the API, so they cannot be placed on the
              timeline.
            </p>
            <ul className="space-y-1">
              {undated.map((m) => (
                <li
                  key={m.key}
                  className="flex items-baseline justify-between gap-2 text-xs"
                >
                  <span style={{ color: T.subtle }}>{m.label}</span>
                  <span
                    className="text-[11px] shrink-0"
                    style={{ color: T.amber }}
                  >
                    {DATE_NOT_RECORDED}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </ProfileTabState>
  );
}
