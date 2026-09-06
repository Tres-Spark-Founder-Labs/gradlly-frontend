"use client";

import { AlertCircle, Loader2 } from "lucide-react";

import { T } from "./tokens";

/**
 * Loading, error and empty states, rendered inside the tab rather than over it.
 *
 * ── WHY EACH TAB OWNS ITS OWN ───────────────────────────────────────────────
 *
 * One request feeds all seven tabs, so it would be simpler for the panel to
 * gate everything on it and render nothing until it settles. That is worse for
 * the reader: a failed profile request would blank the whole drawer including
 * the header, and the employer would be looking at an empty panel with no way
 * to tell whether the learner has no data or the request fell over.
 *
 * Failing inside the tab keeps the header, the tab bar and every other tab
 * usable, and puts the explanation where the reader is already looking.
 */
export function ProfileTabState({
  unavailable,
  isLoading,
  isError,
  error,
  isEmpty,
  emptyTitle,
  emptyDetail,
  children,
}) {
  /**
   * No enrolment id, so the profile was never requested.
   *
   * Distinct from empty on purpose: "no reviews scheduled" is a fact about the
   * apprentice, and saying it when nothing was ever fetched would be an
   * assertion the app cannot support.
   */
  if (unavailable) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm font-semibold" style={{ color: T.subtle }}>
          Not available for this apprentice
        </p>
        <p className="text-xs mt-1" style={{ color: T.muted }}>
          This record has no enrolment, so there is no learner profile to read.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <p
        className="flex items-center justify-center gap-2 text-xs py-10"
        style={{ color: T.muted }}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        Loading…
      </p>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex items-start gap-2 rounded-xl p-4"
        style={{
          backgroundColor: T.redLight,
          border: `1px solid ${T.border}`,
          color: T.red,
        }}
      >
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
        <div>
          <p className="text-xs font-bold">This section could not be loaded</p>
          <p className="text-[11px] mt-0.5">
            {error?.message ||
              "The learner profile request failed. The other tabs may still work."}
          </p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    // Names the missing thing. "No data" tells an employer nothing they can act
    // on; "no reviews have been scheduled" tells them who to ring.
    return (
      <div className="py-8 text-center">
        <p className="text-sm font-semibold" style={{ color: T.subtle }}>
          {emptyTitle}
        </p>
        {emptyDetail ? (
          <p className="text-xs mt-1" style={{ color: T.muted }}>
            {emptyDetail}
          </p>
        ) : null}
      </div>
    );
  }

  return children;
}
