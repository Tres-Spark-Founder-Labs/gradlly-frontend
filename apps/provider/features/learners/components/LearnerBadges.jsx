import {
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  Clock,
  PauseCircle,
  Sparkles,
  XCircle,
} from "lucide-react";

import { cn } from "@/utils/helper";

import {
  FLAG_REASON_LABELS,
  LEARNER_STATUS,
  LEARNER_STATUS_LABELS,
  severityBand,
} from "../constants";

// ─── Learner status badge ────────────────────────────────────────────────────
const STATUS_STYLES = {
  [LEARNER_STATUS.ON_TRACK]: {
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  [LEARNER_STATUS.AT_RISK]: {
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: AlertTriangle,
  },
  [LEARNER_STATUS.OVERDUE]: {
    className: "bg-danger-50 text-danger-600 ring-danger-200",
    icon: Clock,
  },
  [LEARNER_STATUS.BREAK_IN_LEARNING]: {
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: PauseCircle,
  },
  [LEARNER_STATUS.WITHDRAWN]: {
    className: "bg-neutral-100 text-neutral-600 ring-neutral-200",
    icon: XCircle,
  },
  [LEARNER_STATUS.EPA_READY]: {
    className: "bg-violet-50 text-violet-700 ring-violet-200",
    icon: Sparkles,
  },
  // Deviation D-01: grey, because nothing is known to be wrong or right.
  [LEARNER_STATUS.PACE_UNKNOWN]: {
    className: "bg-neutral-100 text-neutral-500 ring-neutral-200",
    icon: CircleHelp,
  },
};

export function LearnerStatusBadge({ status }) {
  // An unrecognised status is not a green "On track" either: it used to fall
  // back to that style, which is the same claim D-01 removes from the API.
  const style =
    STATUS_STYLES[status] ?? STATUS_STYLES[LEARNER_STATUS.PACE_UNKNOWN];
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        style.className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {LEARNER_STATUS_LABELS[status] ?? status}
    </span>
  );
}

// ─── Intervention flag chip ──────────────────────────────────────────────────
export function FlagChip({ reason }) {
  return (
    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
      {FLAG_REASON_LABELS[reason] ?? reason}
    </span>
  );
}

// ─── Severity badge (queue) ──────────────────────────────────────────────────
const SEVERITY_STYLES = {
  high: "bg-danger-50 text-danger-600 ring-danger-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  low: "bg-neutral-100 text-neutral-600 ring-neutral-200",
};

export function SeverityBadge({ score }) {
  const band = severityBand(score);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ring-1 ring-inset",
        SEVERITY_STYLES[band],
      )}
      title={`Severity score ${score}`}
    >
      {score}
    </span>
  );
}
