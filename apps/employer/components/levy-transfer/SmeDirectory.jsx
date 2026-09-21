"use client";

import { Building2, Search, X } from "lucide-react";
import { useState } from "react";

import { fmtGBP } from "@/components/dashboard/levy/helpers";
import { T } from "@/components/dashboard/levy/tokens";
import {
  useLevyVocabulary,
  useRecipientDirectory,
} from "@/features/levy/queries/levy.query";

/**
 * F1.1.4 AC2 — search or browse SME transfer recipients.
 *
 * Shows only SMEs that opted in to the directory; the backend enforces that
 * with a dedicated RLS policy, so an SME that has not opted in is invisible
 * here regardless of what this component asks for.
 *
 * All three filters are optional, which is what makes this both a search
 * ("find manufacturing SMEs in the West Midlands") and a browse ("show me
 * everyone available").
 *
 * ── THE FILTERS SPEAK THE VOCABULARY ────────────────────────────────────────
 *
 * The directory compares each filter exactly, as matching does, so a filter
 * is only useful if it holds a value a recipient's profile can hold. The
 * values come from GET /levy-exchange/vocabulary, the same source as the
 * preferences screen and the SME's own profile:
 *
 *   region                    CLOSED — a select over closed.region
 *   sector, programmeType     OPEN — free text, with open.sector /
 *                             open.programmeType offered as suggestions
 *
 * These were free-text boxes, and the sector placeholder suggested
 * "Manufacturing", which is not a vocabulary value — typed as shown, it
 * returned nothing once the directory went exact, with no word as to why.
 *
 * Nothing is written here, so if the vocabulary cannot be loaded the
 * directory still browses and the open fields still search; only the region
 * select is left without options, and says so.
 */

const asList = (value) => (Array.isArray(value) ? value : []);
const FIELD_STYLE = {
  borderColor: T.border,
  color: T.ink,
  backgroundColor: T.card,
};

/** An open vocabulary field: free text, with the served suggestions. */
function OpenFilter({ id, label, placeholder, value, onChange, suggestions }) {
  const listId = `${id}-suggestions`;
  return (
    <label className="block">
      <span
        className="block text-[10px] font-bold uppercase tracking-wide mb-1"
        style={{ color: T.muted }}
      >
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        list={listId}
        autoComplete="off"
        className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        style={FIELD_STYLE}
      />
      <datalist id={listId}>
        {suggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    </label>
  );
}

export function SmeDirectory() {
  const [filters, setFilters] = useState({
    sector: "",
    region: "",
    programmeType: "",
  });

  // Only send filters that have a value: empty strings would be sent as
  // `sector=` and match nothing rather than being ignored.
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v.trim() !== ""),
  );

  const { data, isLoading, isError } = useRecipientDirectory(params);
  const vocabularyQuery = useLevyVocabulary();
  const regions = asList(vocabularyQuery.data?.closed?.region);
  const sectorSuggestions = asList(vocabularyQuery.data?.open?.sector);
  const programmeTypeSuggestions = asList(
    vocabularyQuery.data?.open?.programmeType,
  );
  // Only an open field can hold a value no profile shares, so only those make
  // "no matches" worth explaining.
  const openFilterUsed = Boolean(params.sector || params.programmeType);
  const recipients = data?.recipients ?? [];
  const total = data?.meta?.total ?? recipients.length;
  const hasFilters = Object.keys(params).length > 0;

  const setField = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const clear = () => setFilters({ sector: "", region: "", programmeType: "" });

  return (
    <section
      className="rounded-2xl p-5 space-y-4"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" style={{ color: T.blue }} />
            <h2 className="text-sm font-bold" style={{ color: T.ink }}>
              Find SME recipients
            </h2>
          </div>
          <p className="text-xs mt-0.5" style={{ color: T.muted }}>
            SMEs who have opted in to receive levy transfers.
          </p>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:opacity-80"
            style={{ color: T.subtle }}
          >
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <OpenFilter
          id="directory-sector"
          label="Sector"
          placeholder="Any sector"
          value={filters.sector}
          onChange={setField("sector")}
          suggestions={sectorSuggestions}
        />
        <label className="block">
          <span
            className="block text-[10px] font-bold uppercase tracking-wide mb-1"
            style={{ color: T.muted }}
          >
            Region
          </span>
          <select
            value={filters.region}
            onChange={setField("region")}
            className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={FIELD_STYLE}
          >
            <option value="">Any region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {vocabularyQuery.isError && (
            <span className="block text-[10px] mt-1" style={{ color: T.red }}>
              Region options could not be loaded.
            </span>
          )}
        </label>
        <OpenFilter
          id="directory-programme-type"
          label="Programme type"
          placeholder="Any programme type"
          value={filters.programmeType}
          onChange={setField("programmeType")}
          suggestions={programmeTypeSuggestions}
        />
      </div>

      {isLoading ? (
        <p className="text-sm py-6 text-center" style={{ color: T.muted }}>
          Searching…
        </p>
      ) : isError ? (
        <p className="text-sm py-6 text-center" style={{ color: T.red }}>
          The recipient directory could not be loaded.
        </p>
      ) : recipients.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 py-8 text-center">
          <Search className="h-4 w-4" style={{ color: T.muted }} />
          <p className="text-sm font-semibold" style={{ color: T.ink }}>
            {hasFilters ? "No SMEs match those filters" : "No listed SMEs yet"}
          </p>
          <p className="text-xs max-w-[280px]" style={{ color: T.muted }}>
            {hasFilters
              ? "Try widening your search, or clear the filters to browse everyone."
              : "SMEs appear here once they opt in to the directory from their FlowPortal profile."}
          </p>
          {openFilterUsed && (
            <p className="text-xs max-w-[320px]" style={{ color: T.muted }}>
              Sector and programme type match an SME&rsquo;s wording exactly,
              including capitals — the same way matching compares them. Pick a
              suggestion to use the wording SMEs are offered.
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs" style={{ color: T.muted }}>
            {total} SME{total === 1 ? "" : "s"} available
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipients.map((r) => (
              <li
                key={r.id}
                className="rounded-xl p-3.5 space-y-2"
                style={{
                  backgroundColor: T.card,
                  border: `1px solid ${T.border}`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p
                      className="text-sm font-bold truncate"
                      style={{ color: T.ink }}
                    >
                      {r.sector}
                    </p>
                    <p className="text-xs" style={{ color: T.muted }}>
                      {r.region} · {r.employeeCountBand} employees
                    </p>
                  </div>
                  {r.hasDasAccount && (
                    <span
                      className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: T.greenLight,
                        color: T.green,
                      }}
                      title="Already has a DAS account, so transfers can start sooner"
                    >
                      DAS ready
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs" style={{ color: T.subtle }}>
                    {r.programmeType}
                  </span>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: T.blue }}
                  >
                    {fmtGBP(r.transferAmountRequired)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
