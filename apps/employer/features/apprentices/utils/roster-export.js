/**
 * Roster filtering and CSV export (F1.2.1 AC1, AC5, AC6).
 *
 * The filter predicate lives here rather than inside the table because two
 * places need the same answer: the table decides what to show, and the export
 * decides what to write. When those drifted apart, "Export CSV" would have
 * silently produced rows the user could not see on screen.
 */

/** Status filter pills. `epa_imminent` is a derived view, not a stored status. */
export function matchesRosterFilter(apprentice, filter) {
  if (!filter || filter === "all") return true;
  if (filter === "epa_imminent") {
    const days = apprentice?.epaDaysLeft;
    return typeof days === "number" && days < 90;
  }
  return apprentice?.status === filter;
}

/** F1.2.1 AC5 — name or employee ID (plus standard/provider, which are free). */
export function matchesRosterSearch(apprentice, query) {
  const q = (query ?? "").trim().toLowerCase();
  if (q === "") return true;
  return [
    apprentice?.name,
    apprentice?.standard,
    apprentice?.provider,
    apprentice?.employeeId,
  ].some((field) =>
    String(field ?? "")
      .toLowerCase()
      .includes(q),
  );
}

/** "2026-10" from an ISO date, or null. Used to group by EPA month / cohort. */
export function monthKey(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** "Oct 2026" for display. */
export function monthLabel(key) {
  if (!key) return "";
  const [year, month] = key.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  if (Number.isNaN(date.getTime())) return key;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/**
 * F1.2.1 AC4 — provider, standard, EPA month, cohort start.
 *
 * Every option is derived from the roster actually on screen rather than a
 * hardcoded list. The previous dropdowns were populated with invented names
 * ("Birmingham Met College", "Software Developer L4"), so they offered
 * choices that matched nothing and, having no onChange, did nothing either.
 */
export function deriveFilterOptions(roster) {
  const rows = roster ?? [];

  const distinct = (read) =>
    [...new Set(rows.map(read).filter((v) => v && v !== "—"))].sort((a, b) =>
      String(a).localeCompare(String(b)),
    );

  const months = (read) =>
    [...new Set(rows.map((r) => monthKey(read(r))).filter(Boolean))]
      .sort()
      .map((key) => ({ value: key, label: monthLabel(key) }));

  return {
    providers: distinct((r) => r.provider),
    standards: distinct((r) => r.standard),
    epaMonths: months((r) => r.epaDateIso),
    cohorts: months((r) => r.startDateIso),
  };
}

export function matchesAdvancedFilters(apprentice, advanced = {}) {
  const { provider, standard, epaMonth, cohort } = advanced;
  if (provider && apprentice?.provider !== provider) return false;
  if (standard && apprentice?.standard !== standard) return false;
  if (epaMonth && monthKey(apprentice?.epaDateIso) !== epaMonth) return false;
  if (cohort && monthKey(apprentice?.startDateIso) !== cohort) return false;
  return true;
}

export function filterRoster(roster, { filter, search, advanced } = {}) {
  return (roster ?? []).filter(
    (a) =>
      matchesRosterFilter(a, filter) &&
      matchesRosterSearch(a, search) &&
      matchesAdvancedFilters(a, advanced),
  );
}

// ─── Sorting (F1.2.1 AC1) ───────────────────────────────────────────────────

/**
 * Sort keys map to the visible columns. Dates read the raw ISO value, not the
 * formatted string — sorting "12 Oct 2026" as text puts April before January.
 */
const SORT_ACCESSORS = {
  name: (a) => a?.name,
  standard: (a) => a?.standard,
  provider: (a) => a?.provider,
  otjActual: (a) => a?.otjActual,
  epaDate: (a) => a?.epaDateIso,
  attendance: (a) => a?.attendance,
  lastActivity: (a) => a?.lastActivity,
  status: (a) => a?.status,
};

export const SORTABLE_COLUMNS = Object.keys(SORT_ACCESSORS);

const isEmpty = (v) => v === null || v === undefined || v === "" || v === "—";

/**
 * Stable sort with blanks always last.
 *
 * Blanks sink regardless of direction rather than flipping to the top on
 * ascending. Three columns are currently unpopulated for employers (OTJ,
 * attendance, last activity), so a naive sort would fill the first screen with
 * empty rows and look broken.
 */
export function sortRoster(rows, { sortBy, sortOrder = "asc" } = {}) {
  const list = [...(rows ?? [])];
  const read = SORT_ACCESSORS[sortBy];
  if (!read) return list;

  const direction = sortOrder === "desc" ? -1 : 1;

  return list.sort((a, b) => {
    const left = read(a);
    const right = read(b);

    const leftEmpty = isEmpty(left);
    const rightEmpty = isEmpty(right);
    if (leftEmpty && rightEmpty) return 0;
    if (leftEmpty) return 1;
    if (rightEmpty) return -1;

    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * direction;
    }
    return String(left).localeCompare(String(right)) * direction;
  });
}

/** Click behaviour: same column toggles direction, a new column starts ascending. */
export function nextSortState(current, column) {
  if (current?.sortBy !== column) return { sortBy: column, sortOrder: "asc" };
  return {
    sortBy: column,
    sortOrder: current.sortOrder === "asc" ? "desc" : "asc",
  };
}

// ─── CSV ────────────────────────────────────────────────────────────────────

/** Columns mirror the on-screen table, so the file matches what was exported. */
const COLUMNS = [
  ["Name", (a) => a.name],
  ["Employee ID", (a) => a.employeeId],
  ["Standard", (a) => a.standard],
  ["Provider", (a) => a.provider],
  ["OTJ progress %", (a) => a.otjActual],
  ["EPA date", (a) => a.epaDate],
  ["Status", (a) => a.status],
  ["Last activity", (a) => a.lastActivity],
  ["Start date", (a) => a.startDate],
];

/**
 * Escapes a value for CSV.
 *
 * The leading-character guard is deliberate: a value beginning = + - or @ is
 * interpreted as a formula by Excel and Sheets, so an apprentice name or
 * employer-supplied employee ID could execute on open. Prefixing with a single
 * quote neutralises it. This matters more than usual here because employee IDs
 * are free text typed by the employer.
 */
export function escapeCsvValue(value) {
  if (value === null || value === undefined) return "";
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  if (/[",\n\r]/.test(text)) text = `"${text.replaceAll('"', '""')}"`;
  return text;
}

export function toRosterCsv(rows) {
  const header = COLUMNS.map(([label]) => escapeCsvValue(label)).join(",");
  const body = (rows ?? []).map((row) =>
    COLUMNS.map(([, read]) => escapeCsvValue(read(row))).join(","),
  );
  return [header, ...body].join("\r\n");
}

/** Byte-order mark: without it Excel on Windows renders UTF-8 names as mojibake. */
const BOM = String.fromCharCode(0xfeff);

/** Triggers a browser download. Returns false when there is nothing to write. */
export function downloadRosterCsv(rows, filename = "apprentices") {
  if (!rows?.length) return false;

  const csv = toRosterCsv(rows);
  // BOM so Excel opens UTF-8 names (e.g. "Siân") correctly rather than as
  // mojibake — a common complaint with plain UTF-8 CSV on Windows.
  const blob = new Blob([BOM, csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  return true;
}
