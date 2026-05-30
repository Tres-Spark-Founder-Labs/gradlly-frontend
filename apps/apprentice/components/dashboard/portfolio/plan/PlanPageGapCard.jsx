"use client";

import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { cn } from "@/utils/helper";

const WORK_OPTIONS = [
  "Sprint 14",
  "Sprint 15",
  "Payments feature build",
  "Reporting dashboard project",
  "Work-based project (EPA)",
  "Self-directed study",
];
const EV_TYPES = [
  "Code / repo",
  "Document",
  "Reflective account",
  "Presentation / demo",
  "Witness testimony",
  "Screenshot / image",
  "Link / URL",
];
const GATEWAY = new Date("2025-12-15");
const INPUT =
  "w-full text-xs rounded-lg border border-neutral-200 px-2.5 py-2 text-neutral-700 placeholder:text-neutral-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-colors";

const BADGE = {
  unplanned: "bg-warning-100 text-warning-800 border-warning-200",
  planned: "bg-primary-100 text-primary-800 border-primary-200",
  done: "bg-success-100 text-success-800 border-success-200",
};

function PlanPageGapForm({
  form,
  setField,
  afterGateway,
  canAdd,
  editing,
  planItem,
  handleAdd,
  setEditing,
}) {
  return (
    <div className="px-4 pb-4 pt-2 space-y-3 border-t border-neutral-100">
      <div>
        <label className="text-xs font-medium text-neutral-600 block mb-1">
          How will you evidence this?
        </label>
        <input
          type="text"
          value={form.description}
          onChange={setField("description")}
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
            onChange={setField("work")}
            className={INPUT}
          >
            <option value="">Select...</option>
            {WORK_OPTIONS.map((w) => (
              <option key={w}>{w}</option>
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
            onChange={setField("date")}
            className={INPUT}
          />
          {afterGateway && (
            <p className="text-xs text-warning-600 mt-1">
              ⚠ After gateway — bring forward.
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-neutral-600 block mb-1">
          Evidence type
        </label>
        <select value={form.type} onChange={setField("type")} className={INPUT}>
          <option value="">Select type...</option>
          {EV_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" disabled={!canAdd} onClick={handleAdd}>
          Add to plan
        </Button>
        {editing && planItem && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-xs text-neutral-500 hover:text-neutral-700"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export function PlanPageGapCard({
  ksb,
  suggestion,
  status,
  planItem,
  onAdd,
  onRemove,
  onUpdate: _onUpdate,
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    description: suggestion ?? "",
    work: "",
    date: "",
    type: "",
  });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const afterGateway = form.date && new Date(form.date) > GATEWAY;
  const canAdd = form.description.trim() && form.date && !afterGateway;
  const isHigh = ksb.state === "not_started";

  function handleAdd() {
    onAdd({
      title: form.description,
      ksbs: [ksb.code],
      type: form.type,
      work: form.work,
      date: form.date,
    });
    setOpen(false);
    setEditing(false);
  }

  const setField = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  if (status !== "unplanned" && !editing) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3.5 rounded-xl border mb-2",
          status === "done"
            ? "bg-success-50 border-success-200"
            : "bg-primary-50 border-primary-200",
        )}
      >
        <CheckCircle
          size={15}
          className={
            status === "done"
              ? "text-success-600 shrink-0"
              : "text-primary-600 shrink-0"
          }
        />
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-bold shrink-0",
            BADGE[status],
            "border",
          )}
        >
          {ksb.code}
        </span>
        <span className="text-xs font-medium text-neutral-700 flex-1 truncate">
          {planItem?.title ?? ksb.label}
        </span>
        <span className="text-xs text-neutral-400 shrink-0">
          {planItem?.date}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {status !== "done" && (
            <button
              type="button"
              title="Edit"
              onClick={() => {
                setEditing(true);
                setForm({
                  description: planItem?.title ?? "",
                  work: planItem?.work ?? "",
                  date: planItem?.date ?? "",
                  type: planItem?.type ?? "",
                });
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <Pencil size={12} />
            </button>
          )}
          <button
            type="button"
            title="Remove"
            onClick={() => planItem && onRemove(planItem.id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border mb-2 overflow-hidden",
        open || editing
          ? "border-primary-200"
          : isHigh
            ? "border-warning-200"
            : "border-neutral-200",
      )}
    >
      <button
        type="button"
        onClick={() => {
          setEditing(false);
          setOpen((o) => !o);
        }}
        className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-neutral-50 transition-colors"
      >
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-bold shrink-0 border",
            BADGE.unplanned,
          )}
        >
          {ksb.code}
        </span>
        <span className="text-xs font-medium text-neutral-700 flex-1 leading-snug min-w-0">
          {ksb.label}
        </span>
        <span
          className={cn(
            "text-xs font-medium shrink-0",
            isHigh ? "text-warning-600" : "text-neutral-400",
          )}
        >
          {isHigh ? "Priority" : "Strengthen"}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-neutral-400 shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-neutral-400 shrink-0" />
        )}
      </button>
      {(open || editing) && (
        <>
          <p className="px-4 py-2 text-xs text-primary-700 bg-primary-50 border-t border-primary-100">
            💡 {suggestion}
          </p>
          <PlanPageGapForm
            form={form}
            setField={setField}
            afterGateway={afterGateway}
            canAdd={canAdd}
            editing={editing}
            planItem={planItem}
            handleAdd={handleAdd}
            setEditing={setEditing}
          />
        </>
      )}
    </div>
  );
}
