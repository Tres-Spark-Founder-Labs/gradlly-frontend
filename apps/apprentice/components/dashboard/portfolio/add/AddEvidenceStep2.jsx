"use client";

import { useState } from "react";
import { useWatch } from "react-hook-form";

import { useKsbCells } from "@/features/portfolio/queries/useKsbCells";
import {
  KSB_KINDS,
  KSB_STRENGTH,
} from "@/features/portfolio/utils/ksb-summary";
import { cn } from "@/utils/helper";

const TABS = KSB_KINDS.map(({ key, label }) => ({ key, label }));

/** How many unevidenced KSBs to name before summarising the rest. */
const NUDGE_LIMIT = 6;

function KsbChip({ ksb, selected, onToggle }) {
  return (
    <button
      type="button"
      title={ksb.title}
      onClick={() => onToggle(ksb.code)}
      className={cn(
        "px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all",
        selected
          ? "bg-primary-700 border-primary-700 text-white shadow-sm"
          : "bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700",
      )}
    >
      {ksb.code}
    </button>
  );
}

export function AddEvidenceStep2({ control, setValue, errors }) {
  const [tab, setTab] = useState(TABS[0].key);
  /**
   * The real KSBs for this learner's standard. Previously a hardcoded list,
   * which meant the picker offered KSB codes that might not exist on the
   * standard the apprentice is actually enrolled on (OQ-15).
   */
  const { cells, isLoading } = useKsbCells();
  const notStarted = cells
    .filter((k) => !k.strength || k.strength === KSB_STRENGTH.NONE)
    .map((k) => k.code);

  const selected = useWatch({ control, name: "ksbDefinitionIds" }) ?? [];

  function toggle(code) {
    const updated = selected.includes(code)
      ? selected.filter((x) => x !== code)
      : [...selected, code];
    setValue("ksbDefinitionIds", updated, { shouldValidate: true });
  }

  const tabKsbs = cells.filter((k) => k.kind === tab);
  const selectedInTab = selected.filter(
    (c) => cells.find((k) => k.code === c)?.kind === tab,
  );
  const nudge = notStarted.filter((c) => !selected.includes(c));

  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-24 animate-pulse rounded-lg bg-neutral-100" />
      </div>
    );
  }

  if (!cells.length) {
    // Better to say the standard has not loaded than to present an empty
    // picker that looks like "this standard has no KSBs".
    return (
      <p className="rounded-lg bg-neutral-50 p-4 text-xs text-neutral-600">
        We could not load the KSBs for your apprenticeship standard. You can
        still upload the evidence and map it later.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500 leading-relaxed">
        Tap every KSB this evidence demonstrates. Don&apos;t over-tag — the
        assessor will question you on each one you map.
      </p>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-1.5 text-xs font-semibold rounded-md transition-colors",
              tab === t.key
                ? "bg-white text-neutral-800 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700",
            )}
          >
            {t.label} ({cells.filter((k) => k.kind === t.key).length})
          </button>
        ))}
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5 min-h-[72px]">
        {tabKsbs.map((ksb) => (
          <KsbChip
            key={ksb.code}
            ksb={ksb}
            selected={selected.includes(ksb.code)}
            onToggle={toggle}
          />
        ))}
      </div>

      {/* Selected descriptions */}
      {selectedInTab.length > 0 && (
        <div className="space-y-1.5 p-3 rounded-lg bg-primary-50 border border-primary-100">
          {selectedInTab.map((code) => {
            const ksb = cells.find((k) => k.code === code);
            return (
              <p key={code} className="text-xs text-primary-700 leading-snug">
                <strong>{code}</strong> — {ksb?.title}
              </p>
            );
          })}
        </div>
      )}

      {/* Counter / validation */}
      {errors.ksbDefinitionIds ? (
        <p className="text-xs font-medium text-danger-600">
          {errors.ksbDefinitionIds.message}
        </p>
      ) : selected.length > 0 ? (
        <p className="text-xs font-medium text-primary-700">
          {selected.length} KSB{selected.length !== 1 ? "s" : ""} selected:{" "}
          {selected.join(", ")}
        </p>
      ) : (
        <p className="text-xs font-medium text-warning-600">
          ⚠ Select at least one KSB to continue.
        </p>
      )}

      {/*
        Smart nudge. Capped, because this list used to come from a hardcoded
        set of five and now comes from the learner's real coverage — an
        apprentice at the start of their programme has every KSB unevidenced,
        and naming all forty is noise rather than a nudge.
      */}
      {selected.length > 0 && nudge.length > 0 && (
        <div className="p-3 rounded-lg bg-info-50 border border-info-100">
          <p className="text-xs text-info-700 leading-snug">
            💡 <strong>{nudge.slice(0, NUDGE_LIMIT).join(", ")}</strong>
            {nudge.length > NUDGE_LIMIT
              ? ` and ${nudge.length - NUDGE_LIMIT} more`
              : ""}{" "}
            still have no evidence — does this piece cover any of them too?
          </p>
        </div>
      )}
    </div>
  );
}
