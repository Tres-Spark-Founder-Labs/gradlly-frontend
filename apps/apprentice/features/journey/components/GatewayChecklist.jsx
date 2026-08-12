// @ts-check
"use client";

import { AlertTriangle, Check, Lock, ShieldCheck } from "lucide-react";

import { cn, formatDate } from "@/utils/helper";

import { CRITERION_PRESENTATION, CRITERION_STATUS } from "../constants";

/**
 * F3.2.2 — Gateway readiness checklist.
 *
 * AC1 all criteria for the standard · AC2 complete / in progress / not started
 * · AC3 blocked criteria show the blocker · AC4 completion percentage as a
 * progress bar · AC5 "Gateway Ready" badge when all complete.
 *
 * **AC3 is built but cannot fire yet.** The API models dependencies
 * (`GatewayCriterionDefinition.dependsOn`, status `blocked`, and a `blockedBy`
 * list on the response) and this component renders them. No criterion declares
 * a dependency, because nobody has told us which gateway requirement blocks
 * which — client question Q1, tracked as OQ-12. Criteria with no declared
 * dependency display as normally available, which is the agreed fallback.
 * When the list arrives it is a data change with no code change here.
 *
 * @param {{ items?: Array<object>, completionPercent?: number, ready?: boolean, readyAt?: string|null, className?: string }} props
 */
export function GatewayChecklist({
  items = [],
  completionPercent = 0,
  ready = false,
  readyAt = null,
  className,
}) {
  const titleFor = (code) => items.find((i) => i.code === code)?.title ?? code;

  if (!items.length) {
    return (
      <p className="py-8 text-center text-sm text-neutral-500">
        Your gateway criteria will appear here once your programme is active.
      </p>
    );
  }

  return (
    <div className={className}>
      {/* AC5 — the badge, shown only when every criterion is complete. */}
      {ready && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-success-200 bg-success-50 p-4">
          <ShieldCheck
            className="mt-0.5 size-5 shrink-0 text-success-600"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-success-800">
              Gateway Ready
            </p>
            <p className="mt-0.5 text-xs text-success-700">
              You have met every gateway criterion
              {readyAt ? ` on ${formatDate(readyAt)}` : ""}. Your training
              provider has been notified and will put you forward for end-point
              assessment.
            </p>
          </div>
        </div>
      )}

      {/* AC4 — completion as a progress bar. */}
      <div className="mb-5">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Gateway readiness
          </span>
          <span className="text-sm font-semibold tabular-nums text-neutral-900">
            {completionPercent}%
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-neutral-200"
          role="progressbar"
          aria-valuenow={completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Gateway readiness completion"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              ready ? "bg-success-500" : "bg-primary-500",
            )}
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* AC1 + AC2 */}
      <ul className="space-y-2.5">
        {items.map((item) => (
          <CriterionRow key={item.code} item={item} titleFor={titleFor} />
        ))}
      </ul>
    </div>
  );
}

function CriterionRow({ item, titleFor }) {
  const tone =
    CRITERION_PRESENTATION[item.status] ??
    CRITERION_PRESENTATION[CRITERION_STATUS.NOT_STARTED];

  const isComplete = item.status === CRITERION_STATUS.COMPLETE;
  const isBlocked = item.status === CRITERION_STATUS.BLOCKED;
  const blockers = Array.isArray(item.blockedBy) ? item.blockedBy : [];

  return (
    <li
      className={cn(
        "flex gap-3 rounded-xl border p-3.5 transition",
        isBlocked
          ? "border-warning-200 bg-warning-50/50"
          : "border-neutral-200 bg-white",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
          isComplete
            ? "border-success-500 bg-success-500"
            : isBlocked
              ? "border-warning-400 bg-warning-100"
              : "border-neutral-300 bg-white",
        )}
        aria-hidden="true"
      >
        {isComplete && <Check className="size-3 text-white" strokeWidth={3} />}
        {isBlocked && <Lock className="size-2.5 text-warning-700" />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-neutral-900">{item.title}</p>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[11px] font-medium",
              tone.chip,
            )}
          >
            {tone.label}
          </span>
        </div>

        {item.description && (
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">
            {item.description}
          </p>
        )}

        {/* AC3 — name what is holding this criterion up, not just that it is
            held up. A "Blocked" chip on its own tells the apprentice nothing
            they can act on. */}
        {isBlocked && blockers.length > 0 && (
          <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-warning-800">
            <AlertTriangle
              className="mt-0.5 size-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>
              Waiting on:{" "}
              {blockers.map((code, i) => (
                <span key={code}>
                  {i > 0 && ", "}
                  {titleFor(code)}
                </span>
              ))}
            </span>
          </p>
        )}
      </div>
    </li>
  );
}
