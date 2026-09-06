"use client";

import { Check, X } from "lucide-react";

import {
  REVIEW_STATUS,
  REVIEW_STATUS_LABELS,
} from "@/features/learners/constants";
import { formatDateTime } from "@/utils/helper";

import { ProfileTabState } from "./ProfileTabState";
import { T } from "./tokens";

/**
 * Progress reviews from `profile.reviews`.
 *
 * ── WHAT WAS HERE BEFORE ────────────────────────────────────────────────────
 *
 * `<ProfileReviews />` was rendered with no props at all and displayed one
 * hardcoded review: "01 Sep 2024 · Progressing well — all targets met", with
 * invented SMART goals, invented action points, and "Signed by: Marcus Reid
 * (Tutor) · David Osei (Employer)". Every apprentice in the roster showed the
 * same review signed by the same two people.
 *
 * ── WHAT THE API ACTUALLY RETURNS ───────────────────────────────────────────
 *
 * `LearnerProfileReviewItemDto` carries id, status, scheduledAt, isOverdue,
 * tutorSigned and apprenticeSigned. It does not carry outcome text, SMART goals
 * or action points — so those sections are gone rather than filled with
 * plausible sentences. What replaced them is the signature state, which is real
 * and is the thing an employer chases.
 */

function SignatureRow({ label, signed }) {
  const Icon = signed ? Check : X;
  const color = signed ? T.green : T.muted;

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px]"
      style={{ color }}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label} {signed ? "signed" : "not signed"}
    </span>
  );
}

function statusTone(review) {
  if (review.status === REVIEW_STATUS.COMPLETED) {
    return { bg: T.greenLight, fg: T.green };
  }
  if (review.isOverdue) return { bg: T.redLight, fg: T.red };
  if (review.status === REVIEW_STATUS.CANCELLED) {
    return { bg: T.card, fg: T.muted };
  }
  return { bg: T.blueLight, fg: T.blue };
}

function ReviewCard({ review, index }) {
  const tone = statusTone(review);

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {/* Numbered, not named. The API does not say which review is the
              "6-month" one, and deriving it from the start date would be a
              guess presented as a label. */}
          <p className="text-xs font-bold" style={{ color: T.ink }}>
            Review {index + 1}
          </p>
          <p className="text-[11px]" style={{ color: T.muted }}>
            {formatDateTime(review.scheduledAt)}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {review.isOverdue && review.status !== REVIEW_STATUS.COMPLETED ? (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: T.redLight, color: T.red }}
            >
              Overdue
            </span>
          ) : null}
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: tone.bg, color: tone.fg }}
          >
            {REVIEW_STATUS_LABELS[review.status] ?? review.status}
          </span>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-1"
        style={{ borderTop: `1px solid ${T.border}`, paddingTop: "8px" }}
      >
        <SignatureRow label="Tutor" signed={review.tutorSigned} />
        <SignatureRow label="Apprentice" signed={review.apprenticeSigned} />
      </div>
    </div>
  );
}

export function ProfileReviews({
  profile,
  isLoading,
  isError,
  error,
  unavailable,
}) {
  const reviews = Array.isArray(profile?.reviews) ? profile.reviews : [];
  const ordered = reviews
    .slice()
    .sort((a, b) => String(a.scheduledAt).localeCompare(String(b.scheduledAt)));

  return (
    <ProfileTabState
      unavailable={unavailable}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!isLoading && !isError && ordered.length === 0}
      emptyTitle="No reviews scheduled"
      emptyDetail="The provider has not scheduled a progress review for this apprentice."
    >
      <div className="space-y-4">
        {ordered.map((review, i) => (
          <ReviewCard key={review.id} review={review} index={i} />
        ))}
      </div>
    </ProfileTabState>
  );
}
