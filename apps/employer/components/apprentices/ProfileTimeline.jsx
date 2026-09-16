"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { useEnrolmentJourney } from "@/features/enrolments/queries/enrolments.query";
import {
  DATE_NOT_RECORDED,
  GATEWAY_STATUS_LABELS,
  JOURNEY_MILESTONE_STATUS_LABELS,
} from "@/features/learners/constants";
import { formatDate } from "@/utils/helper";

import { ProfileTabState } from "./ProfileTabState";
import { T } from "./tokens";

/**
 * The programme timeline, as the API reports it.
 *
 * ── WHAT THIS REPLACES, TWICE ───────────────────────────────────────────────
 *
 * First a fixture: a six-milestone ladder dated March 2024 to January 2026,
 * identical for every apprentice. Then, once that was removed, a chronology
 * built on the client from programme dates, reviews and any open break —
 * because the profile aggregate carried no milestones. That was right at the
 * time and is wrong now: `GET /enrolments/:id/journey` returns 200 to an
 * employer with milestone statuses and a gateway checklist, and
 * `useEnrolmentJourney` sat in the enrolments feature with no caller.
 *
 * The journey is the source. Where it returns nothing, this tab says so and
 * does not fall back to the constructed version: a constructed timeline that
 * looks like a real one is the fabrication class this folder has spent three
 * tasks removing.
 *
 * ── STATUSES ARE THE API'S ──────────────────────────────────────────────────
 *
 * `complete`, `current`, `upcoming`, `overdue`, `cancelled` — the API decides
 * (client decision Q2 makes a review whose date passed without being held
 * `overdue`, not `upcoming`). Nothing here infers a status from a date.
 */
const STATUS_COLOR = {
  complete: T.green,
  current: T.blue,
  upcoming: T.muted,
  overdue: T.red,
  cancelled: T.muted,
};

const GATEWAY_COLOR = {
  complete: T.green,
  in_progress: T.blue,
  not_started: T.muted,
  blocked: T.red,
};

const isText = (value) => typeof value === "string" && value.trim() !== "";

function StatusChip({ label, color }) {
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
      style={{ backgroundColor: `${color}12`, color }}
    >
      {label}
    </span>
  );
}

export function ProfileTimeline({ enrolmentId, unavailable }) {
  const [active, setActive] = useState(null);
  const journey = useEnrolmentJourney(enrolmentId);
  const data = journey.data ?? null;

  const milestones = Array.isArray(data?.milestones) ? data.milestones : [];
  const checklist = Array.isArray(data?.gatewayChecklist)
    ? data.gatewayChecklist
    : [];

  const dated = milestones
    .filter((m) => isText(m?.date))
    .sort((a, b) => a.date.localeCompare(b.date));
  const undated = milestones.filter((m) => !isText(m?.date));

  const percent = data?.gatewayCompletionPercent;
  const hasPercent = typeof percent === "number" && Number.isFinite(percent);

  return (
    <ProfileTabState
      unavailable={unavailable}
      isLoading={journey.isLoading}
      isError={journey.isError}
      error={journey.error}
      isEmpty={
        !journey.isLoading &&
        !journey.isError &&
        milestones.length === 0 &&
        checklist.length === 0
      }
      emptyTitle="No programme journey on the API"
      emptyDetail="The journey endpoint returned no milestones and no gateway checklist for this enrolment. Nothing is inferred in their place."
    >
      <div className="space-y-5">
        {milestones.length === 0 ? (
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
          >
            <p className="text-xs font-bold" style={{ color: T.ink }}>
              No milestones returned
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
              The journey endpoint returned no milestones for this enrolment.
            </p>
          </div>
        ) : null}

        {dated.length > 0 ? (
          <ol className="relative space-y-0">
            {dated.map((m, i) => {
              const color = STATUS_COLOR[m.status] ?? T.muted;
              const key = m.code ?? `${m.title}-${m.date}`;
              const isOpen = active === key;

              return (
                <li key={key} className="relative flex gap-3 pb-4">
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
                    onClick={() => setActive(isOpen ? null : key)}
                    aria-expanded={isOpen}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-bold" style={{ color: T.ink }}>
                        {m.title}
                      </p>
                      {isText(m.status) ? (
                        <StatusChip
                          label={
                            JOURNEY_MILESTONE_STATUS_LABELS[m.status] ??
                            m.status
                          }
                          color={color}
                        />
                      ) : null}
                    </div>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: T.muted }}
                    >
                      {formatDate(m.date)}
                    </p>
                    {isOpen && isText(m.description) ? (
                      <p
                        className="text-xs mt-1.5 rounded-lg p-2"
                        style={{
                          color: T.subtle,
                          backgroundColor: T.card,
                          border: `1px solid ${T.border}`,
                        }}
                      >
                        {m.description}
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
              Not yet dated
            </p>
            <p className="text-[11px] mt-0.5 mb-2" style={{ color: T.muted }}>
              These milestones have no date on the API, so they cannot be placed
              on the timeline.
            </p>
            <ul className="space-y-1">
              {undated.map((m) => (
                <li
                  key={m.code ?? m.title}
                  className="flex items-baseline justify-between gap-2 text-xs"
                >
                  <span style={{ color: T.subtle }}>{m.title}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    {isText(m.status) ? (
                      <StatusChip
                        label={
                          JOURNEY_MILESTONE_STATUS_LABELS[m.status] ?? m.status
                        }
                        color={STATUS_COLOR[m.status] ?? T.muted}
                      />
                    ) : null}
                    <span className="text-[11px]" style={{ color: T.amber }}>
                      {DATE_NOT_RECORDED}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* F1.2.2 AC2 — the gateway checklist the API returns beside the
            milestones. Each criterion carries its own status; the percentage
            and the ready flag are the API's, not a count taken here. */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-bold" style={{ color: T.ink }}>
              Gateway checklist
            </p>
            <span className="flex items-center gap-2">
              {data?.gatewayReady === true ? (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold"
                  style={{ color: T.green }}
                >
                  <CheckCircle2 className="h-3 w-3" aria-hidden /> Ready
                </span>
              ) : null}
              {hasPercent ? (
                <span
                  className="text-[11px] tabular-nums"
                  style={{ color: T.muted }}
                >
                  {`${percent}% complete`}
                </span>
              ) : null}
            </span>
          </div>
          {checklist.length === 0 ? (
            <p className="text-[11px] mt-1" style={{ color: T.muted }}>
              The journey endpoint returned no gateway criteria for this
              enrolment.
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {checklist.map((item) => (
                <li
                  key={item.code ?? item.title}
                  className="flex items-start justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <p style={{ color: T.ink }}>{item.title}</p>
                    {isText(item.description) ? (
                      <p className="text-[11px]" style={{ color: T.muted }}>
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  {isText(item.status) ? (
                    <StatusChip
                      label={GATEWAY_STATUS_LABELS[item.status] ?? item.status}
                      color={GATEWAY_COLOR[item.status] ?? T.muted}
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ProfileTabState>
  );
}
