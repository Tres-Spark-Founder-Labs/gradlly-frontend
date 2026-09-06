"use client";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CircleSlash,
  HelpCircle,
} from "lucide-react";

import { DATE_NOT_RECORDED } from "@/features/learners/constants";
import { buildProgrammeMilestones } from "@/features/learners/utils/programme-milestones";
import { formatDate } from "@/utils/helper";

import { ProfileTabState } from "./ProfileTabState";
import { T } from "./tokens";

/**
 * Programme milestones, derived from the profile aggregate.
 *
 * Previously fed by `a.milestones`, which normalizeApprentice hardcoded to an
 * empty array — so this tab was permanently blank for every apprentice while
 * the API had the dates all along.
 */

const STATUS = {
  complete: {
    icon: CheckCircle2,
    color: T.green,
    label: "Complete",
  },
  overdue: {
    icon: AlertTriangle,
    color: T.red,
    label: "Overdue",
  },
  scheduled: {
    icon: CalendarClock,
    color: T.blue,
    label: "Scheduled",
  },
  // Deliberately not "complete". A planned date that has passed with nothing
  // confirming the event is exactly what an employer needs to chase, and
  // calling it complete would hide it.
  passed: {
    icon: CalendarClock,
    color: T.amber,
    label: "Date passed",
  },
  cancelled: {
    icon: CircleSlash,
    color: T.muted,
    label: "Cancelled",
  },
  unknown: {
    icon: HelpCircle,
    color: T.muted,
    label: "Not recorded",
  },
};

export function ProfileMilestones({
  profile,
  isLoading,
  isError,
  error,
  unavailable,
}) {
  const milestones = buildProgrammeMilestones(profile);

  return (
    <ProfileTabState
      unavailable={unavailable}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!isLoading && !isError && milestones.length === 0}
      emptyTitle="No programme milestones recorded"
      emptyDetail="This enrolment has no planned dates and no reviews on the API."
    >
      <div className="space-y-1">
        {milestones.map((m) => {
          const s = STATUS[m.status] ?? STATUS.unknown;
          const Icon = s.icon;

          return (
            <div
              key={m.key}
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
                  {m.label}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: m.date ? T.muted : T.amber }}
                >
                  {m.date ? formatDate(m.date) : DATE_NOT_RECORDED}
                </p>
                {m.detail ? (
                  <p className="text-[11px] mt-0.5" style={{ color: T.subtle }}>
                    {m.detail}
                  </p>
                ) : null}
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: `${s.color}12`, color: s.color }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </ProfileTabState>
  );
}
