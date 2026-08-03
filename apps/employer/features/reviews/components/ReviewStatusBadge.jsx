"use client";

import { cn } from "@/utils/helper";

import { REVIEW_STATUS_LABELS } from "../constants";

const TONE = {
  scheduled: "bg-sky-50 text-sky-700 ring-sky-200",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-neutral-100 text-neutral-500 ring-neutral-200",
};

export function ReviewStatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE[status] ?? TONE.cancelled,
      )}
    >
      {REVIEW_STATUS_LABELS[status] ?? status}
    </span>
  );
}
