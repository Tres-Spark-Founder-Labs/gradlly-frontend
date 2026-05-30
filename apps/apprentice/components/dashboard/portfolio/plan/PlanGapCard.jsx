"use client";

import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { cn } from "@/utils/helper";

const UPCOMING = [
  { value: "sprint", label: "Current sprint work" },
  { value: "project", label: "Work-based project" },
  { value: "review", label: "Next progress review" },
  { value: "workshop", label: "Upcoming workshop/training" },
];

const TYPES = [
  "Code",
  "Reflection",
  "Witness testimony",
  "Document",
  "Presentation",
];

const INPUT =
  "w-full text-xs rounded-lg border border-neutral-200 px-2.5 py-2 text-neutral-700 placeholder:text-neutral-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-colors";

const GATEWAY = new Date("2025-12-15");

export function PlanGapCard({ ksb, suggestion, onAdd, planned }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    description: suggestion ?? "",
    work: "",
    date: "",
    type: "",
  });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const afterGateway = form.date && new Date(form.date) > GATEWAY;
  const canAdd = form.description.trim() && form.date && !afterGateway;

  if (planned) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-success-50 border border-success-200 mb-2">
        <CheckCircle size={15} className="text-success-600 shrink-0" />
        <span className="text-xs font-bold text-success-800">{ksb.code}</span>
        <span className="text-xs text-success-700 flex-1 truncate">
          {ksb.label}
        </span>
        <span className="text-xs text-success-600 shrink-0 font-medium">
          {planned.date} · Planned
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border mb-2 overflow-hidden transition-all duration-200",
        open ? "border-primary-200 shadow-sm" : "border-warning-200",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-neutral-50 transition-colors"
      >
        <span className="px-2 py-0.5 bg-warning-100 text-warning-800 border border-warning-200 rounded text-xs font-bold shrink-0">
          {ksb.code}
        </span>
        <span className="text-xs font-medium text-neutral-700 flex-1 leading-snug">
          {ksb.label}
        </span>
        <span className="text-xs text-warning-600 font-medium shrink-0">
          Not started
        </span>
        {open ? (
          <ChevronUp size={14} className="text-neutral-400 shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-neutral-400 shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-neutral-100">
          <div>
            <label className="text-xs font-medium text-neutral-600 block mb-1">
              How will you evidence this?
            </label>
            <input
              type="text"
              value={form.description}
              onChange={set("description")}
              className={INPUT}
              placeholder="Describe your approach..."
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-neutral-600 block mb-1">
                Linked work
              </label>
              <select
                value={form.work}
                onChange={set("work")}
                className={INPUT}
              >
                <option value="">Select...</option>
                {UPCOMING.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600 block mb-1">
                Target date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={set("date")}
                className={INPUT}
              />
              {afterGateway && (
                <p className="text-xs text-warning-600 mt-1">
                  ⚠ After your gateway — bring it forward.
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-600 block mb-1">
              Evidence type
            </label>
            <select value={form.type} onChange={set("type")} className={INPUT}>
              <option value="">Select type...</option>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <Button
            size="sm"
            className="shrink-0"
            disabled={!canAdd}
            onClick={() => {
              onAdd({ code: ksb.code, label: ksb.label, ...form });
              setOpen(false);
            }}
          >
            Add to plan
          </Button>
        </div>
      )}
    </div>
  );
}
