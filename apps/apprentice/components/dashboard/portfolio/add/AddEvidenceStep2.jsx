"use client";

import { useState } from "react";

import { KSB_DATA } from "@/data/portfolio.data";
import { cn } from "@/utils/helper";

const TABS = [
  { key: "K", label: "Knowledge" },
  { key: "S", label: "Skills" },
  { key: "B", label: "Behaviours" },
];

const NOT_STARTED = KSB_DATA.filter((k) => k.state === "not_started").map(
  (k) => k.code,
);

function KsbChip({ ksb, selected, onToggle }) {
  return (
    <button
      type="button"
      title={ksb.label}
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

export function AddEvidenceStep2({ ksbs, onChange }) {
  const [tab, setTab] = useState("K");
  const toggle = (code) =>
    onChange((p) =>
      p.includes(code) ? p.filter((x) => x !== code) : [...p, code],
    );

  const tabKsbs = KSB_DATA.filter((k) => k.group === tab);
  const selectedInTab = ksbs.filter(
    (c) => KSB_DATA.find((k) => k.code === c)?.group === tab,
  );
  const nudge = NOT_STARTED.filter((c) => !ksbs.includes(c));

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
            {t.label} ({KSB_DATA.filter((k) => k.group === t.key).length})
          </button>
        ))}
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5 min-h-[72px]">
        {tabKsbs.map((ksb) => (
          <KsbChip
            key={ksb.code}
            ksb={ksb}
            selected={ksbs.includes(ksb.code)}
            onToggle={toggle}
          />
        ))}
      </div>

      {/* Selected descriptions */}
      {selectedInTab.length > 0 && (
        <div className="space-y-1.5 p-3 rounded-lg bg-primary-50 border border-primary-100">
          {selectedInTab.map((code) => {
            const ksb = KSB_DATA.find((k) => k.code === code);
            return (
              <p key={code} className="text-xs text-primary-700 leading-snug">
                <strong>{code}</strong> — {ksb?.label}
              </p>
            );
          })}
        </div>
      )}

      {/* Counter / validation */}
      {ksbs.length === 0 ? (
        <p className="text-xs font-medium text-warning-600">
          ⚠ Select at least one KSB to continue.
        </p>
      ) : (
        <p className="text-xs font-medium text-primary-700">
          {ksbs.length} KSB{ksbs.length !== 1 ? "s" : ""} selected:{" "}
          {ksbs.join(", ")}
        </p>
      )}

      {/* Smart nudge */}
      {ksbs.length > 0 && nudge.length > 0 && (
        <div className="p-3 rounded-lg bg-info-50 border border-info-100">
          <p className="text-xs text-info-700 leading-snug">
            💡 <strong>{nudge.join(", ")}</strong> still have no evidence — does
            this piece cover any of them too?
          </p>
        </div>
      )}
    </div>
  );
}
