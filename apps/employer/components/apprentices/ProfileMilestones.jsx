"use client";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CircleSlash,
  Clock,
  HelpCircle,
} from "lucide-react";

import { useEnrolmentJourney } from "@/features/enrolments/queries/enrolments.query";
import {
  DATE_NOT_RECORDED,
  JOURNEY_MILESTONE_STATUS_LABELS,
} from "@/features/learners/constants";
import { formatDate } from "@/utils/helper";

import { ProfileTabState } from "./ProfileTabState";
import { T } from "./tokens";

/**
 * Programme milestones, as the journey endpoint reports them.
 *
 * ── WHAT THIS REPLACES, TWICE ───────────────────────────────────────────────
 *
 * First `a.milestones`, which normalizeApprentice hardcoded to an empty array,
 * so the tab was blank for every apprentice. Then a list derived on the
 * client from programme dates and reviews — right while the aggregate carried
 * no milestones, and wrong once the Timeline beside it read
 * `GET /enrolments/:id/journey`: two tabs in one drawer disagreeing about the
 * same programme, one reading the endpoint and one inventing it. Worse than
 * either state alone, and a user would see it.
 *
 * ── ONE REQUEST FOR BOTH TABS ───────────────────────────────────────────────
 *
 * The same `useEnrolmentJourney` the Timeline calls, so the same query key:
 * react-query serves both tabs from one fetch, and opening the drawer does
 * not ask twice. Where the journey returns nothing, this tab says so, as the
 * Timeline does, and infers nothing in its place.
 */

const STATUS = {
  complete: { icon: CheckCircle2, color: T.green },
  current: { icon: Clock, color: T.blue },
  upcoming: { icon: CalendarClock, color: T.muted },
  // Client decision Q2: a review whose date passed without being held is
  // overdue, and the API says so. Nothing here reads a date to decide it.
  overdue: { icon: AlertTriangle, color: T.red },
  cancelled: { icon: CircleSlash, color: T.muted },
};

const UNKNOWN_STATUS = { icon: HelpCircle, color: T.muted };

const isText = (value) => typeof value === "string" && value.trim() !== "";

export function ProfileMilestones({ enrolmentId, unavailable }) {
  const journey = useEnrolmentJourney(enrolmentId);
  const milestones = Array.isArray(journey.data?.milestones)
    ? journey.data.milestones
    : [];

  return (
    <ProfileTabState
      unavailable={unavailable}
      isLoading={journey.isLoading}
      isError={journey.isError}
      error={journey.error}
      isEmpty={
        !journey.isLoading && !journey.isError && milestones.length === 0
      }
      emptyTitle="No programme milestones on the API"
      emptyDetail="The journey endpoint returned no milestones for this enrolment. Nothing is inferred in their place."
    >
      <div className="space-y-1">
        {milestones.map((m) => {
          const s = STATUS[m.status] ?? UNKNOWN_STATUS;
          const Icon = s.icon;
          const hasDate = isText(m.date);

          return (
            <div
              key={m.code ?? `${m.title}-${m.date}`}
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{
                backgroundColor: T.card,
                border: `1px solid ${T.border}`,
              }}
            >
              <span className="mt-0.5 shrink-0">
                <Icon
                  className="h-4 w-4"
                  style={{ color: s.color }}
                  aria-hidden
                />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: T.ink }}>
                  {m.title}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: hasDate ? T.muted : T.amber }}
                >
                  {hasDate ? formatDate(m.date) : DATE_NOT_RECORDED}
                </p>
                {isText(m.description) ? (
                  <p className="text-[11px] mt-0.5" style={{ color: T.subtle }}>
                    {m.description}
                  </p>
                ) : null}
              </div>
              {isText(m.status) ? (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: `${s.color}12`, color: s.color }}
                >
                  {JOURNEY_MILESTONE_STATUS_LABELS[m.status] ?? m.status}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </ProfileTabState>
  );
}
