"use client";

import { Paperclip } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

// Derive a stable display colour from the last chars of any UUID-like string.
const AVATAR_PALETTE = [
  "#1847d4",
  "#0d7a52",
  "#b85c0a",
  "#7c3aed",
  "#c0356a",
  "#0e7490",
];
function avatarColor(id = "") {
  const code = id.charCodeAt(id.length - 1) + id.charCodeAt(id.length - 2);
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}

// Show first + last segment of a UUID so the card is readable without a name lookup.
function formatApprenticeId(id = "") {
  const parts = id.split("-");
  if (parts.length >= 2) return `${parts[0]}…${parts[parts.length - 1]}`;
  return id.slice(0, 12);
}

/**
 * F1.2.3 AC1 — the queue lists the apprentice's name.
 *
 * The card used to render a truncated UUID here, because the API only exposed
 * `apprenticeId`. It now returns `apprenticeName`; the id remains the fallback
 * for rows where the relation was not loaded, so the card degrades to the old
 * behaviour rather than showing an empty space.
 */
export function displayApprentice(entry) {
  return (
    entry?.apprenticeName?.trim() || formatApprenticeId(entry?.apprenticeId)
  );
}

/** Initials for the avatar; falls back to the id when there is no name. */
export function apprenticeInitials(entry) {
  const name = entry?.apprenticeName?.trim();
  if (!name)
    return formatApprenticeId(entry?.apprenticeId).slice(0, 2).toUpperCase();
  const parts = name.split(/\s+/);
  const letters =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.slice(0, 2);
  return letters.toUpperCase();
}

/**
 * AC1's "submission date" — when it arrived for approval, not when the
 * learning happened (`loggedDate`) which is what the card used to show.
 */
export function formatSubmitted(entry) {
  const iso = entry?.submittedAt;
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** "Taught learning" from "taught_learning". */
export function formatCategory(category = "") {
  if (!category) return "";
  const spaced = String(category).replaceAll("_", " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function formatDate(iso = "") {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Avatar({ entry }) {
  const color = avatarColor(entry?.apprenticeId ?? "");
  const label = apprenticeInitials(entry);
  return (
    <div
      className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
  );
}

export function OTJQueueCard({
  entry,
  selected,
  onSelect,
  onApprove,
  onReject,
  onEvidence,
  index,
  isApproving,
  isRejecting,
}) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const hours = entry.minutes ? (entry.minutes / 60).toFixed(1) : "0";
  const atRisk = entry.paceFlag !== null && entry.paceFlag !== undefined;
  const hasEvidence = !!entry.evidence;
  const isActing = isApproving || isRejecting;
  const submitted = formatSubmitted(entry);

  const confirmReject = () => {
    if (reason.trim().length < 10) return;
    onReject(entry.id, reason);
    setRejecting(false);
    setReason("");
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        animation: `slide-up 280ms var(--ease-out) ${index * 80}ms both`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-start gap-3 p-4 flex-wrap sm:flex-nowrap">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="mt-1 shrink-0"
          style={{ accentColor: "#1847d4" }}
        />
        <Avatar entry={entry} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              {/* AC1 — apprentice name, no longer a truncated UUID. */}
              <p className="text-sm font-bold" style={{ color: T.ink }}>
                {displayApprentice(entry)}
              </p>
              {atRisk && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1"
                  style={{ backgroundColor: T.amberLight, color: T.amber }}
                >
                  ⚠ At risk · OTJ behind pace
                </span>
              )}
            </div>
            {/* AC1 — submission date. Both dates are shown because they answer
                different questions: when the learning happened, and how long
                this has been waiting on the manager. */}
            <div className="text-right shrink-0">
              {submitted && (
                <p
                  className="text-[11px] tabular-nums"
                  style={{ color: T.muted }}
                >
                  Submitted {submitted}
                </p>
              )}
              <p
                className="text-[11px] tabular-nums"
                style={{ color: T.muted }}
              >
                Logged {formatDate(entry.loggedDate)}
              </p>
            </div>
          </div>

          {/* AC1 — activity description. `activityName` is the activity
              itself; `note` is optional extra commentary. Only the note was
              rendered, so the queue showed nothing at all for the many entries
              that have no note. */}
          {entry.activityName && (
            <p className="text-xs mt-2 font-semibold" style={{ color: T.ink }}>
              {entry.activityName}
            </p>
          )}
          {entry.note && (
            <p className="text-xs mt-1" style={{ color: T.subtle }}>
              {entry.note}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span
              className="text-sm font-extrabold tabular-nums"
              style={{ color: "#1847d4" }}
            >
              {hours} hrs
            </span>
            {/* AC1 — category. Was not rendered anywhere. */}
            {entry.category && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: T.card, color: T.subtle }}
              >
                {formatCategory(entry.category)}
              </span>
            )}
            {hasEvidence && (
              <button
                type="button"
                onClick={() => onEvidence(entry)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
                style={{ color: T.blue }}
              >
                <Paperclip className="h-3 w-3" /> Evidence attached
              </button>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col flex-row gap-2 shrink-0 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={() => onApprove(entry.id)}
            disabled={isActing}
            className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity whitespace-nowrap disabled:opacity-40"
            style={{ backgroundColor: T.green, color: "#fff" }}
          >
            ✓ Approve
          </button>
          <button
            type="button"
            onClick={() => setRejecting((r) => !r)}
            disabled={isActing}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border hover:opacity-80 transition-opacity whitespace-nowrap disabled:opacity-40"
            style={{ borderColor: T.red, color: T.red }}
          >
            ✗ Reject
          </button>
        </div>
      </div>

      {rejecting && (
        <div
          className="px-4 pb-4 pt-0 space-y-2"
          style={{
            borderTop: `1px solid ${T.border}`,
            animation: "slide-up 250ms ease-out both",
          }}
        >
          <textarea
            placeholder="Reason for rejection (required, 10+ characters)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl text-xs border focus:outline-none resize-none"
            style={{
              borderColor:
                reason.length < 10 && reason.length > 0 ? T.red : T.border,
              backgroundColor: T.card,
              color: T.ink,
            }}
          />
          <p
            className="text-[10px]"
            style={{ color: reason.length >= 10 ? T.green : T.muted }}
          >
            {reason.length} / 10 minimum
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={confirmReject}
              disabled={reason.trim().length < 10 || isRejecting}
              className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: T.red, color: "#fff" }}
            >
              Confirm rejection
            </button>
            <button
              type="button"
              onClick={() => setRejecting(false)}
              className="text-xs"
              style={{ color: T.muted }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
