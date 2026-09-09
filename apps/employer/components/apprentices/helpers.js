import { T } from "./tokens";

/**
 * `off_track` is accepted alongside `overdue` (F1.2.4 AC5).
 *
 * The mapper normalises the API's `off_track` to `overdue` before anything
 * reaches here, so this should never see the raw value — but it did before,
 * and the result was the most serious flag in the product rendering as a grey
 * "Unknown" badge. Accepting both makes that class of miss impossible rather
 * than merely unlikely: any code path that skips the mapper still gets a red
 * "Overdue" instead of silently degrading.
 */
export const statusMeta = (s) =>
  s === "on_track"
    ? { label: "On track", color: T.green, bg: T.greenLight }
    : s === "at_risk"
      ? { label: "At risk", color: T.amber, bg: T.amberLight }
      : s === "critically_behind" || s === "off_track" || s === "overdue"
        ? { label: "Critically behind", color: T.red, bg: T.redLight }
        : s === "epa_ready"
          ? { label: "EPA Ready", color: "#1847d4", bg: "#e8eefb" }
          : s === "epa_imminent"
            ? { label: "EPA imminent", color: T.red, bg: T.redLight }
            : { label: "Unknown", color: T.muted, bg: T.card };

/**
 * Is this a number we can compare to a threshold?
 *
 * ── WHY EVERY HELPER BELOW STARTS WITH THIS ─────────────────────────────────
 *
 * `normalizeApprentice` hands most of these figures over as `null`, and every
 * relational operator coerces `null` to `0`. So `null < 60` is true, `null >= 90`
 * is false, and `null - null >= 0` is true — each helper below answered
 * confidently about a figure that does not exist, and each answered
 * differently.
 *
 * Guarding here rather than only at the call sites is the point. A caller that
 * forgets is the normal case, not the exceptional one: RosterRow.jsx guarded
 * `isEpaNear` on line 53 and then called `epaDays` unguarded on line 54, one
 * line apart, and shipped a red "nulld" chip on every roster row without an EPA
 * date. The learner profile DTO notes an EPAO is usually appointed part-way
 * through rather than at enrolment, so that was the common state.
 */
function isComparableNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * OTJ progress against target.
 *
 * Both arguments are guarded: `null - null` is `0`, and `0 >= 0` returned
 * green, so an apprentice with no OTJ data anywhere rendered as comfortably on
 * track. Its only caller (OtjBar) already checks, so this is defence in depth
 * rather than a live fix — but it is the same shape as the epaDays fault, and
 * the next caller is the one that will forget.
 */
export const otjColor = (actual, expected) => {
  if (!isComparableNumber(actual) || !isComparableNumber(expected)) {
    return T.muted;
  }
  const gap = actual - expected;
  return gap >= 0 ? T.green : gap >= -15 ? T.amber : T.red;
};

/**
 * Attendance banding.
 *
 * `null >= 90` and `null >= 80` are both false, so an unmeasured attendance
 * fell through to red — the most alarming band, for the one case where nothing
 * is known. Both call sites already guard, so this too is defence in depth.
 */
export const attendanceColor = (p) =>
  !isComparableNumber(p)
    ? T.muted
    : p >= 90
      ? T.green
      : p >= 80
        ? T.amber
        : T.red;

/**
 * Days-to-EPA chip, or nothing.
 *
 * `null < 60` is true, so this returned `{ color: red, label: "nulld" }` and
 * RosterRow rendered a red chip reading "nulld" on every row with no EPA date.
 * Returning `null` is the existing contract for "no chip" — it is what the
 * far-future branch already did — so callers need no change.
 */
export const epaDays = (days) =>
  !isComparableNumber(days)
    ? null
    : days < 60
      ? { color: T.red, label: `${days}d` }
      : days < 180
        ? { color: T.amber, label: `${days}d` }
        : null;
