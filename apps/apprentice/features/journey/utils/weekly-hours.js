// @ts-check

import { OTJ_WEEKS_SHOWN } from "../constants";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * F3.1.2 AC4 — hours logged per week for the last 8 weeks.
 *
 * Grouping, not a business rule, which is why it lives in the client: it
 * buckets entries the API already returned. No threshold, target or pace is
 * computed here — those all come from the server, where they are tested.
 *
 * **Approved and pending are kept apart** (client decision D2). The chart
 * returns both per week so the bar can show them as distinct segments; it never
 * returns a combined total, because a single "hours this week" figure that
 * silently includes unapproved time is the padded number D2 exists to prevent.
 */

/** Monday 00:00 UTC of the week containing `date`. */
export function startOfWeek(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  // getUTCDay: 0 = Sunday. Shift so Monday is the first day.
  const offset = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - offset);
  return d;
}

/**
 * @param {Array<{date?: string, activityDate?: string, minutes?: number, status?: string}>} entries
 * @param {{ now?: Date, weeks?: number }} [options]
 * @returns {Array<{ weekStart: string, approvedMinutes: number, pendingMinutes: number }>}
 */
export function buildWeeklyHours(entries = [], options = {}) {
  const now = options.now ?? new Date();
  const weeks = options.weeks ?? OTJ_WEEKS_SHOWN;

  // Seed every bucket so a week with no logging renders as a real zero rather
  // than vanishing — a gap in the chart is the signal a learner needs to see.
  const thisWeek = startOfWeek(now);
  const buckets = new Map();
  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(thisWeek.getTime() - i * 7 * MS_PER_DAY);
    buckets.set(start.toISOString().slice(0, 10), {
      weekStart: start.toISOString().slice(0, 10),
      approvedMinutes: 0,
      pendingMinutes: 0,
    });
  }

  for (const entry of entries) {
    const raw = entry?.date ?? entry?.activityDate;
    if (!raw) continue;
    const when = new Date(raw);
    if (Number.isNaN(when.getTime())) continue;

    const key = startOfWeek(when).toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) continue; // outside the window

    const minutes = Number(entry.minutes) || 0;
    if (entry.status === "approved") bucket.approvedMinutes += minutes;
    else if (entry.status === "pending" || entry.status === "submitted")
      bucket.pendingMinutes += minutes;
  }

  return [...buckets.values()];
}

/** The tallest bar in the set, used to scale the chart. Never zero. */
export function peakWeeklyMinutes(weeklyHours = []) {
  return Math.max(
    60,
    ...weeklyHours.map((w) => w.approvedMinutes + w.pendingMinutes),
  );
}
