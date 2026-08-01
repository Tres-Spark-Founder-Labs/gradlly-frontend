/**
 * Commitment status board presentation (F1.3.1).
 *
 * The three-state party status is derived server-side, because "Not sent" is
 * the absence of a signature row rather than a stored value and every client
 * would otherwise have to know that. This module only maps those states to
 * the colours AC2 specifies, and holds the small amount of view logic worth
 * testing on its own.
 */

import { T } from "@/components/dashboard/levy/tokens";

/** Mirrors CommitmentPartyStatus on the API. */
export const PARTY_STATUS = Object.freeze({
  SIGNED: "signed",
  PENDING: "pending",
  NOT_SENT: "not_sent",
});

/**
 * F1.3.1 AC2 — "Signed (green) / Pending (amber) / Not sent (grey)".
 *
 * An unrecognised value falls back to the grey "not sent" treatment rather
 * than a fourth style, so a new state added on the API side degrades to the
 * most conservative reading instead of rendering as "Unknown" — the failure
 * that hid every critically-behind apprentice in F1.2.4.
 */
export function partyStatusMeta(status) {
  if (status === PARTY_STATUS.SIGNED) {
    return { label: "Signed", color: T.green, bg: T.greenLight };
  }
  if (status === PARTY_STATUS.PENDING) {
    return { label: "Pending", color: T.amber, bg: T.amberLight };
  }
  return { label: "Not sent", color: T.muted, bg: T.card };
}

/** Statement-level status, shown alongside the three party pills. */
export const STATEMENT_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  submitted: "Submitted",
  awaiting_signatures: "Awaiting signatures",
  signed: "Signed",
  superseded: "Superseded",
  cancelled: "Cancelled",
});

export function statementStatusLabel(status) {
  return STATEMENT_STATUS_LABELS[status] ?? status ?? "—";
}

/**
 * Filter options derived from the rows on screen, so the dropdowns can only
 * ever offer values that exist — the same approach as the apprentice roster,
 * where hardcoded options offered choices that matched nothing.
 */
export function deriveBoardFilterOptions(rows = []) {
  const distinct = (idKey, labelKey) => {
    const seen = new Map();
    for (const row of rows) {
      const id = row?.[idKey];
      if (id && !seen.has(id)) seen.set(id, row?.[labelKey] || id);
    }
    return [...seen.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label)));
  };

  const statuses = [...new Set(rows.map((r) => r?.statementStatus))]
    .filter(Boolean)
    .sort()
    .map((value) => ({ value, label: statementStatusLabel(value) }));

  return {
    providers: distinct("providerOrganisationId", "providerName"),
    standards: distinct("standardId", "standardName"),
    statuses,
  };
}

/**
 * Strips empty values so they are not sent as `?status=` — the API treats an
 * empty string as a value and would filter everything out.
 */
export function cleanBoardFilters(filters = {}) {
  const out = {};
  for (const [key, value] of Object.entries(filters)) {
    if (
      value !== "" &&
      value !== null &&
      value !== undefined &&
      value !== false
    ) {
      out[key] = value;
    }
  }
  return out;
}

/** "3 statements need your signature" — plain, and correct at 1. */
export function actionSummary(count) {
  if (!count) return "Nothing is waiting for your signature.";
  return count === 1
    ? "1 statement needs your signature."
    : `${count} statements need your signature.`;
}
