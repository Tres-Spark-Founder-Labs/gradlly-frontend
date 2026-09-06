"use client";

import { Flag } from "lucide-react";

import {
  INTERVENTION_ACTION_LABELS,
  OTJ_STATUS_LABELS,
} from "@/features/learners/constants";
import { buildRecentActivity } from "@/features/learners/utils/programme-milestones";
import { formatDate } from "@/utils/helper";

import { ProfileTabState } from "./ProfileTabState";
import { T } from "./tokens";

/**
 * What has actually happened on this enrolment.
 *
 * ── WHAT WAS HERE BEFORE ────────────────────────────────────────────────────
 *
 * `recentActivity` was hardcoded to `[]` in normalizeApprentice, so this tab
 * rendered an empty list for every apprentice — indistinguishable from a
 * learner who had done nothing at all, while their off-the-job log sat in the
 * profile response.
 *
 * ── WHAT COUNTS AS ACTIVITY ─────────────────────────────────────────────────
 *
 * The two things the API timestamps: off-the-job sessions
 * (`otj.recentEntries`) and provider interventions
 * (`breakInLearning.recentInterventions`). Nothing else in the aggregate has an
 * event time, so nothing else appears here.
 */

function minutesLabel(minutes) {
  if (typeof minutes !== "number" || !Number.isFinite(minutes)) return null;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours && rest) return `${hours}h ${rest}m`;
  if (hours) return `${hours}h`;
  return `${rest}m`;
}

function OtjRow({ item }) {
  const duration = minutesLabel(item.minutes);

  return (
    <>
      <p className="text-sm" style={{ color: T.ink }}>
        {item.title}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
        Off-the-job
        {duration ? ` · ${duration}` : ""}
        {item.status
          ? ` · ${OTJ_STATUS_LABELS[item.status] ?? item.status}`
          : ""}
      </p>
      {item.flaggedAt ? (
        <p
          className="inline-flex items-start gap-1 text-[11px] mt-1"
          style={{ color: T.amber }}
        >
          <Flag className="h-3 w-3 mt-0.5 shrink-0" aria-hidden />
          {/* A flag is a query, not a rejection — the hours still stand. */}
          <span>
            Flagged for discussion
            {item.flagNote ? `: ${item.flagNote}` : ""}
          </span>
        </p>
      ) : null}
    </>
  );
}

function InterventionRow({ item }) {
  return (
    <>
      <p className="text-sm" style={{ color: T.ink }}>
        {INTERVENTION_ACTION_LABELS[item.actionType] ?? item.actionType}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
        Provider intervention
      </p>
      {item.notes ? (
        <p className="text-xs mt-1" style={{ color: T.subtle }}>
          {item.notes}
        </p>
      ) : null}
    </>
  );
}

export function ProfileActivity({
  profile,
  isLoading,
  isError,
  error,
  unavailable,
}) {
  const items = buildRecentActivity(profile);
  const truncated = profile?.otj?.truncated;
  const totalCount = profile?.otj?.totalCount;
  const shown = profile?.otj?.recentEntries?.length ?? 0;

  return (
    <ProfileTabState
      unavailable={unavailable}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!isLoading && !isError && items.length === 0}
      emptyTitle="No activity recorded"
      emptyDetail="No off-the-job sessions have been logged and no provider interventions have been raised."
    >
      <div className="space-y-1">
        {items.map((item, i) => (
          <div
            key={item.key}
            className="flex items-start gap-3 py-3"
            style={{
              borderBottom:
                i < items.length - 1 ? `1px solid ${T.border}` : "none",
            }}
          >
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 tabular-nums whitespace-nowrap"
              style={{
                backgroundColor: T.card,
                color: item.at ? T.muted : T.amber,
                border: `1px solid ${T.border}`,
              }}
            >
              {item.at ? formatDate(item.at) : "No date"}
            </span>
            <div className="min-w-0 flex-1">
              {item.kind === "otj" ? (
                <OtjRow item={item} />
              ) : (
                <InterventionRow item={item} />
              )}
            </div>
          </div>
        ))}

        {/* Says how much of the log is on screen. The API caps recentEntries,
            and showing 500 of 812 without saying so is a quiet understatement
            of how much the apprentice has done. */}
        {typeof totalCount === "number" && shown > 0 ? (
          <p className="text-[11px] pt-3" style={{ color: T.muted }}>
            {truncated
              ? `Showing the ${shown} most recent of ${totalCount} off-the-job sessions.`
              : `All ${totalCount} off-the-job sessions.`}
          </p>
        ) : null}
      </div>
    </ProfileTabState>
  );
}
