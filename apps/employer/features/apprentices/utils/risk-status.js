/**
 * At-risk status vocabulary (F1.2.4 AC5).
 *
 * The API's `otjPaceAlertLevel` has three values: `on_track`, `at_risk` and
 * `off_track`. The employer UI was written against a different set —
 * `on_track`, `at_risk`, `overdue`, `epa_ready` — which came from the mock
 * fixtures in `components/apprentices/data.js`, not from any endpoint. That
 * file has since been deleted; the vocabulary it introduced is why this
 * translation layer exists.
 *
 * The consequence was not cosmetic. `off_track` is the most serious level
 * (F1.2.4 AC3: more than 30% behind), and because nothing in the UI knew that
 * string:
 *
 *   - `statusMeta("off_track")` fell through to "Unknown" in grey
 *   - the red accent bar on the row keyed off `"overdue"` and never appeared
 *   - the "Overdue" filter pill matched nothing
 *   - the stat cards counted neither, so the worst cases were invisible
 *
 * An apprentice 40% behind their off-the-job target rendered exactly like one
 * who was fine. This module is the single translation point, so the two
 * vocabularies cannot drift apart again.
 *
 * The UI keeps the PRD's word "Overdue" for the 30% level because that is what
 * F1.2.4 AC3 calls it. Note that the provider portal's `LearnerStatusBadge`
 * uses "overdue" to mean an overdue *review* — a genuine collision in the
 * product's language, recorded in EMPLOYER-PORTAL-IMPLEMENTATION.md rather
 * than silently resolved here.
 */

/**
 * What the employer UI displays.
 *
 * The 30%-behind level is `critically_behind`, not `overdue`. The PRD uses
 * "Overdue" in three different senses — an apprentice behind on off-the-job
 * hours (F1.2.4 AC3), a review not completed within three days of its
 * scheduled date (F2.3.x), and an incomplete quality-improvement action
 * (F2.2.x). Client decision, 31 July 2026: "Overdue" keeps the review meaning
 * across the platform, and the off-the-job flag is renamed here.
 *
 * The stored value changed too, not just the label, so the collision cannot
 * come back through a string comparison somewhere.
 */
export const PACE_STATUS = Object.freeze({
  ON_TRACK: "on_track",
  AT_RISK: "at_risk",
  CRITICALLY_BEHIND: "critically_behind",
  /**
   * No pace level to show: see `normalisePaceStatus`. Never a flag, never
   * green. Not in F1.2.1 AC3 — deviation D-01 (graddly-api
   * docs/prd/DEVIATIONS.md), shared with the provider cohort badge.
   */
  UNKNOWN: "unknown",
});

/** What `GET /enrolments` actually returns for `otjPaceAlertLevel`. */
export const API_PACE_LEVEL = Object.freeze({
  ON_TRACK: "on_track",
  AT_RISK: "at_risk",
  OFF_TRACK: "off_track",
});

const API_TO_UI = Object.freeze({
  [API_PACE_LEVEL.ON_TRACK]: PACE_STATUS.ON_TRACK,
  [API_PACE_LEVEL.AT_RISK]: PACE_STATUS.AT_RISK,
  [API_PACE_LEVEL.OFF_TRACK]: PACE_STATUS.CRITICALLY_BEHIND,
});

/**
 * Translates an API pace level into the UI vocabulary.
 *
 * ── ABSENT MEANS ABSENT ─────────────────────────────────────────────────────
 *
 * A missing level is `UNKNOWN`, which the badge prints as "Pace unknown" —
 * never `ON_TRACK`. It used to be on track, on the argument that a red flag
 * for missing programme dates would blame the apprentice for the data. The
 * trouble is that "missing" has more than one cause, and one of them was the
 * roster itself: it read only the first page of enrolments, so above 100 an
 * apprentice's enrolment — and their pace level with it — fell off the page,
 * and an at-risk apprentice rendered green. The same fault class as the
 * hardcoded `commitmentSigned: false`: a value the screen did not have,
 * stated as if it did.
 *
 * Grey "unknown" answers the original concern without the lie: it is not a
 * flag (`isFlagged` is false, so it is in neither the at-risk card nor the
 * alert banner), and it is not green. An unrecognised level is unknown for
 * the same reason.
 */
export function normalisePaceStatus(level) {
  if (!level) return PACE_STATUS.UNKNOWN;
  return API_TO_UI[level] ?? PACE_STATUS.UNKNOWN;
}

/** True when the apprentice carries either off-the-job flag (AC5). */
export function isFlagged(status) {
  return (
    status === PACE_STATUS.AT_RISK || status === PACE_STATUS.CRITICALLY_BEHIND
  );
}

/**
 * The more serious of the two levels — outranks at-risk when ordering or
 * picking an accent colour.
 *
 * Named `isCriticallyBehind` rather than `isOverdue` so the employer-side
 * concept cannot be confused with an overdue review, which is what "overdue"
 * means everywhere else in the platform.
 */
export function isCriticallyBehind(status) {
  return status === PACE_STATUS.CRITICALLY_BEHIND;
}

/**
 * How far behind, as a percentage, for display next to the badge.
 * Null when the API did not supply it.
 */
export function behindPercentLabel(percent) {
  if (percent === null || percent === undefined) return null;
  const value = Number(percent);
  if (!Number.isFinite(value) || value <= 0) return null;
  return `${Math.round(value)}% behind`;
}
