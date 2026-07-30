"use client";

import { Filter, Plus, Search, X } from "lucide-react";
import { useState } from "react";

import { T } from "./tokens";

/**
 * F1.2.4 AC5.
 *
 * "Overdue" now matches something: the mapper translates the API's
 * `off_track` to `overdue`, where before this pill filtered on a string
 * nothing in the system produced and so always returned an empty roster.
 *
 * "EPA Ready" was removed for the same reason and not replaced like-for-like.
 * It was never a pace level — it came from the mock fixtures — and nothing in
 * the API can set it, so no amount of translation would make it match. The
 * EPA view that does exist is the derived "under 90 days" filter, which the
 * stat card already triggers, so the pill now points at that.
 */
const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "on_track", label: "On track" },
  { key: "at_risk", label: "At risk" },
  { key: "overdue", label: "Overdue" },
  { key: "epa_imminent", label: "EPA < 90d" },
];

const selStyle = {
  backgroundColor: T.surface,
  color: T.subtle,
  borderColor: T.border,
  fontSize: "0.75rem",
  fontWeight: 500,
  outline: "none",
};

/**
 * A dropdown whose empty value means "no filter". Disabled when the roster
 * offers nothing to choose from, so an employer with a single provider is not
 * given a control that cannot change anything.
 */
function FilterSelect({ label, value, options, onChange }) {
  return (
    <select
      aria-label={label}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value || null)}
      disabled={options.length === 0}
      className="px-3 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
      style={selStyle}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function RosterToolbar({
  filter,
  search,
  onFilter,
  onSearch,
  onEnrol,
  onExportCsv,
  exportCount = 0,
  advanced = {},
  onAdvancedChange,
  options = { providers: [], standards: [], epaMonths: [], cohorts: [] },
}) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="space-y-2">
      {/* Primary row — always visible */}
      <div className="flex items-center gap-2">
        {/* Status filter pills — scrollable strip */}
        <div
          className="flex-1 inline-flex rounded-xl overflow-x-auto min-w-0"
          style={{
            border: `1px solid ${T.border}`,
            backgroundColor: T.card,
            flexShrink: 1,
          }}
        >
          {STATUS_FILTERS.map((f, i) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => onFilter?.(f.key)}
                className="px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: active ? T.ink : "transparent",
                  color: active ? "#fff" : T.subtle,
                  borderRight:
                    i < STATUS_FILTERS.length - 1
                      ? `1px solid ${T.border}`
                      : "none",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Filters toggle */}
        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shrink-0 hover:opacity-80 transition-opacity"
          style={{
            borderColor: moreOpen ? T.blue : T.border,
            color: moreOpen ? T.blue : T.subtle,
            backgroundColor: moreOpen ? T.blueLight : T.surface,
          }}
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filters</span>
        </button>

        {/* Enrol */}
        <button
          type="button"
          onClick={onEnrol}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity shrink-0"
          style={{ backgroundColor: T.blue, color: "#fff" }}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Enrol</span>
        </button>
      </div>

      {/* Search row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
            style={{ color: T.muted }}
          />
          <input
            type="text"
            placeholder="Search by name, standard, provider or employee ID"
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-100"
            style={{
              backgroundColor: T.surface,
              borderColor: T.border,
              color: T.ink,
            }}
          />
        </div>
        {/* F1.2.1 AC6. Both buttons previously had no onClick at all — they
            were styled elements that did nothing when pressed. */}
        <button
          type="button"
          onClick={onExportCsv}
          disabled={!exportCount}
          title={
            exportCount
              ? `Export ${exportCount} apprentice${exportCount === 1 ? "" : "s"} as CSV`
              : "Nothing to export"
          }
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#f5f4f2",
            color: T.subtle,
            border: `1px solid ${T.border}`,
          }}
        >
          ↓ CSV
        </button>
        {/* PDF export needs a server-side template that does not exist yet
            (the same gap as the levy charts). Disabled rather than left
            looking clickable — an inert control is a broken promise. */}
        <button
          type="button"
          disabled
          title="PDF export is not available yet"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 opacity-40 cursor-not-allowed"
          style={{
            backgroundColor: "#f5f4f2",
            color: T.subtle,
            border: `1px solid ${T.border}`,
          }}
        >
          ↓ PDF
        </button>
      </div>

      {/* Expanded filters panel */}
      {moreOpen && (
        <div
          className="rounded-xl p-3 flex flex-wrap gap-2 items-center"
          style={{
            backgroundColor: T.card,
            border: `1px solid ${T.border}`,
            animation: "slide-up 150ms ease both",
          }}
        >
          {/* F1.2.1 AC4. Options are derived from the roster on screen; these
              were previously hardcoded invented names with no onChange, so
              they offered choices matching nothing and did nothing. */}
          <FilterSelect
            label="All providers"
            value={advanced.provider}
            options={options.providers.map((p) => ({ value: p, label: p }))}
            onChange={(v) => onAdvancedChange?.({ ...advanced, provider: v })}
          />
          <FilterSelect
            label="All cohorts"
            value={advanced.cohort}
            options={options.cohorts}
            onChange={(v) => onAdvancedChange?.({ ...advanced, cohort: v })}
          />
          <FilterSelect
            label="All standards"
            value={advanced.standard}
            options={options.standards.map((s) => ({ value: s, label: s }))}
            onChange={(v) => onAdvancedChange?.({ ...advanced, standard: v })}
          />
          <FilterSelect
            label="All EPA months"
            value={advanced.epaMonth}
            options={options.epaMonths}
            onChange={(v) => onAdvancedChange?.({ ...advanced, epaMonth: v })}
          />
          <button
            type="button"
            onClick={() => setMoreOpen(false)}
            className="ml-auto p-1 rounded-lg hover:bg-neutral-100"
            style={{ color: T.muted }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
