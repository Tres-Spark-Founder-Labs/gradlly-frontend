"use client";

import { T } from "@/components/dashboard/levy/tokens";
import { actionSummary } from "@/features/commitments/utils/board";

const selStyle = {
  backgroundColor: T.surface,
  color: T.subtle,
  borderColor: T.border,
  fontSize: "0.75rem",
  fontWeight: 500,
  outline: "none",
};

/**
 * Disabled when there is nothing to choose from, so an employer working with
 * a single provider is not offered a control that cannot change anything.
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

/** F1.3.1 AC4 — filter by status, provider and standard. */
export function CommitmentBoardFilters({
  filters = {},
  onChange,
  options = { providers: [], standards: [], statuses: [] },
  actionRequiredCount = 0,
}) {
  const set = (key, value) => onChange?.({ ...filters, [key]: value });

  return (
    <div className="space-y-2">
      {/* AC5's count, restated in words. The badge in the nav is easy to miss
          if you arrived here by a direct link. */}
      {actionRequiredCount > 0 && (
        <button
          type="button"
          onClick={() =>
            set("actionRequiredOnly", !filters.actionRequiredOnly || null)
          }
          className="w-full text-left rounded-xl px-4 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: filters.actionRequiredOnly ? T.blue : T.blueLight,
            color: filters.actionRequiredOnly ? "#fff" : T.blue,
            border: `1px solid ${T.blue}25`,
          }}
        >
          {actionSummary(actionRequiredCount)}{" "}
          <span style={{ opacity: 0.85 }}>
            {filters.actionRequiredOnly
              ? "· showing only these — tap to show all"
              : "· tap to show only these"}
          </span>
        </button>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <FilterSelect
          label="All statuses"
          value={filters.status}
          options={options.statuses}
          onChange={(v) => set("status", v)}
        />
        <FilterSelect
          label="All providers"
          value={filters.providerOrganisationId}
          options={options.providers}
          onChange={(v) => set("providerOrganisationId", v)}
        />
        <FilterSelect
          label="All standards"
          value={filters.standardId}
          options={options.standards}
          onChange={(v) => set("standardId", v)}
        />
        {(filters.status ||
          filters.providerOrganisationId ||
          filters.standardId ||
          filters.actionRequiredOnly) && (
          <button
            type="button"
            onClick={() => onChange?.({})}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-75 transition-opacity"
            style={{ color: T.muted }}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
