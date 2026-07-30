import { T } from "./tokens";

export const fmt = (n) => "£" + n.toLocaleString("en-GB");

/**
 * Currency formatter for DAS-sourced money values (F1.1.1 AC1: GBP, 2dp).
 *
 * Deliberately separate from `fmt`, which renders whole-pound summary figures.
 * Two differences that matter:
 *  - Always emits exactly two decimals, so a levy balance reads "£50,000.00".
 *  - Coerces via Number() first. The API returns numeric(14,2) columns as
 *    strings (e.g. lastBalance: "12345.67"); calling .toLocaleString() on a
 *    string silently returns it unformatted, losing separators entirely.
 */
export const fmtGBP = (n) => {
  // Guard before Number(): Number(null), Number(undefined ?? "") and Number("")
  // all coerce to 0, which would render "unknown" as a confident £0.00 — the
  // exact failure this requirement exists to prevent. Caught by unit test.
  if (n === null || n === undefined || n === "") return "—";
  const value = Number(n);
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/** Calendar date, no time component (F1.1.2 AC3 requires the expiry date). */
export function fmtDate(value) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Absolute last-synced timestamp (F1.1.1 AC3 asks for a timestamp, not "5m ago"). */
export function fmtSyncedAt(date) {
  if (!date) return "never";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function scoreColor(s) {
  if (s < 40) return T.red;
  if (s < 70) return T.amber;
  return T.green;
}

export function urgencyStyle(u) {
  const map = {
    urgent: { bg: T.red, light: T.redLight },
    warning: { bg: T.amber, light: T.amberLight },
    scheduled: { bg: "#9ca3af", light: "#f3f4f6" },
    future: { bg: "#c8c5bf", light: T.bg },
  };
  return map[u] ?? null;
}

export function statusColors(c) {
  if (c === "green") return { bg: T.greenLight, text: T.green };
  if (c === "amber") return { bg: T.amberLight, text: T.amber };
  return { bg: T.redLight, text: T.red };
}

export function fmtAgo(date) {
  if (!date) return "—";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}
