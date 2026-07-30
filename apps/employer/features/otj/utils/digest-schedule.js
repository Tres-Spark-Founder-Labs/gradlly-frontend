/**
 * Next-digest calculation (F1.2.3 AC6/AC7).
 *
 * The drawer previously displayed a hardcoded "Monday 07 Apr 2025 · 08:00 GMT"
 * — a date in the past that never changed and had no relationship to the
 * user's actual setting. This derives it.
 *
 * The API sends at 08:00 in the digest timezone, so the times shown here are
 * expressed in that zone rather than the browser's. A manager in another
 * region should be told when the email is actually sent, not when 08:00 would
 * occur locally.
 */

export const DIGEST_HOUR = 8;
export const DIGEST_TIME_ZONE = "Europe/London";

/** Weekday index (0 = Sunday) as observed in `timeZone`. */
function weekdayIndexIn(date, timeZone) {
  const name = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
  }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

/** Hour of day (0-23) as observed in `timeZone`. */
function hourIn(date, timeZone) {
  const value = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "numeric",
    hour12: false,
  }).format(date);
  return Number(value);
}

/**
 * The next date a digest will be sent, or null when the digest is off.
 *
 * Returns a plain `Date` at local midnight of the target day — callers format
 * the day, and the time is always 08:00 in the digest zone, so carrying an
 * exact instant would imply a precision this does not have.
 */
export function nextDigestDate(frequency, from = new Date()) {
  if (frequency === "off") return null;

  const dayOffsetFor = () => {
    const alreadySentToday = hourIn(from, DIGEST_TIME_ZONE) >= DIGEST_HOUR;

    if (frequency === "daily") {
      return alreadySentToday ? 1 : 0;
    }

    // Weekly — the next Monday. If today is Monday and 08:00 has passed, the
    // next one is a week away, not today.
    const weekday = weekdayIndexIn(from, DIGEST_TIME_ZONE);
    const daysUntilMonday = (1 - weekday + 7) % 7;
    if (daysUntilMonday === 0) {
      return alreadySentToday ? 7 : 0;
    }
    return daysUntilMonday;
  };

  const target = new Date(from);
  target.setDate(target.getDate() + dayOffsetFor());
  target.setHours(0, 0, 0, 0);
  return target;
}

export function formatNextDigest(frequency, from = new Date()) {
  const date = nextDigestDate(frequency, from);
  if (!date) return null;

  const day = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${day} · 08:00 UK time`;
}

/** Copy describing what each cadence does. Matches the cron, which runs every day. */
export function describeFrequency(frequency) {
  if (frequency === "daily") return "Sent every morning at 08:00 UK time.";
  if (frequency === "weekly") return "Sent every Monday at 08:00 UK time.";
  return "You will not receive email reminders about pending OTJ approvals.";
}
