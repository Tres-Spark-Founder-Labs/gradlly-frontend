// @ts-check
"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { cn, formatDate } from "@/utils/helper";

import { MILESTONE_PRESENTATION, MILESTONE_STATUS } from "../constants";

/**
 * F3.2.1 — Programme timeline.
 *
 * AC1 all milestones in chronological order · AC2 complete / current /
 * upcoming marking · AC3 tapping a milestone shows its detail · AC4 scrolls
 * vertically on mobile, single screen on desktop.
 *
 * Order comes from the API, which emits enrolment → induction → reviews →
 * gateway → EPA → completion and sources the review entries from reviews that
 * actually exist (client decision Q2). The component does not re-sort: a
 * client-side sort would silently disagree with the server the first time a
 * review was rescheduled.
 *
 * @param {{ milestones?: Array<object>, className?: string }} props
 */
export function ProgrammeTimeline({ milestones = [], className }) {
  const [selected, setSelected] = useState(null);

  if (!milestones.length) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">
        Your programme timeline will appear here once your enrolment is active.
      </p>
    );
  }

  return (
    <>
      {/*
        AC4 — on mobile this is one scrolling column. On desktop (lg+) it
        becomes two columns so a typical 12-inch screen holds the whole
        programme without scrolling. Whether it *actually* fits is a browser
        assertion, not a source one; see OPEN_QUESTIONS OQ-16.
      */}
      <ol
        className={cn(
          "relative grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-x-10",
          className,
        )}
      >
        {milestones.map((m, index) => (
          <MilestoneRow
            key={m.code ?? index}
            milestone={m}
            isLast={index === milestones.length - 1}
            onSelect={() => setSelected(m)}
          />
        ))}
      </ol>

      <MilestoneDetailModal
        milestone={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function MilestoneRow({ milestone, isLast, onSelect }) {
  const tone =
    MILESTONE_PRESENTATION[milestone.status] ??
    MILESTONE_PRESENTATION[MILESTONE_STATUS.UPCOMING];

  const isComplete = milestone.status === MILESTONE_STATUS.COMPLETE;
  const isCancelled = milestone.status === MILESTONE_STATUS.CANCELLED;

  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      {/* Rail. Hidden on the final row so the line does not dangle. */}
      {!isLast && (
        <span
          className="absolute left-[11px] top-6 h-full w-px bg-neutral-200"
          aria-hidden="true"
        />
      )}

      {/* AC2 — the status marker. */}
      <span
        className={cn(
          "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition",
          tone.dot,
        )}
        aria-hidden="true"
      >
        {isComplete && (
          <Check className="size-3.5 text-white" strokeWidth={3} />
        )}
        {isCancelled && (
          <X className="size-3 text-neutral-400" strokeWidth={3} />
        )}
      </span>

      {/* AC3 — the whole row is the tap target. A button, not a div with a
          click handler, so it is reachable by keyboard and announced as
          actionable. */}
      <button
        type="button"
        onClick={onSelect}
        className="min-w-0 flex-1 rounded-lg px-2 py-1 text-left transition hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <span className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "text-sm font-semibold",
              isCancelled
                ? "text-neutral-400 line-through"
                : "text-neutral-900",
            )}
          >
            {milestone.title}
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[11px] font-medium",
              tone.chip,
            )}
          >
            {tone.label}
          </span>
        </span>

        <span className="mt-0.5 block text-xs text-neutral-500">
          {milestone.date ? formatDate(milestone.date) : "Date to be confirmed"}
        </span>
      </button>
    </li>
  );
}

/**
 * AC3 — date, description, associated documents and sign-off status.
 *
 * Documents and sign-off are **not** in the journey payload today. Rather than
 * invent them, this states plainly that they are not available here and points
 * at the screens that do hold them. Showing a fabricated document list would
 * be the exact failure recorded as OQ-15.
 */
function MilestoneDetailModal({ milestone, onClose }) {
  if (!milestone) return null;

  const tone =
    MILESTONE_PRESENTATION[milestone.status] ??
    MILESTONE_PRESENTATION[MILESTONE_STATUS.UPCOMING];

  return (
    <Modal
      open={!!milestone}
      onClose={onClose}
      title={milestone.title}
      size="md"
      hideCancel={false}
      cancelLabel="Close"
    >
      <dl className="space-y-4 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Status
          </dt>
          <dd className="mt-1">
            <span
              className={cn(
                "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
                tone.chip,
              )}
            >
              {tone.label}
            </span>
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Date
          </dt>
          <dd className="mt-1 text-neutral-900">
            {milestone.date ? formatDate(milestone.date) : "Not yet scheduled"}
          </dd>
        </div>

        {milestone.description && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Description
            </dt>
            <dd className="mt-1 text-neutral-700">{milestone.description}</dd>
          </div>
        )}

        <div className="rounded-lg bg-neutral-50 p-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Documents and sign-off
          </dt>
          <dd className="mt-1 text-xs text-neutral-600">
            Signed records are not attached to timeline milestones yet. Review
            records are in{" "}
            <a
              href="/progress"
              className="font-medium text-primary-600 underline"
            >
              your reviews
            </a>
            , and signed agreements are in{" "}
            <a
              href="/profile"
              className="font-medium text-primary-600 underline"
            >
              your documents
            </a>
            .
          </dd>
        </div>
      </dl>
    </Modal>
  );
}
