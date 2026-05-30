import { CalendarDays, Trash2, Zap } from "lucide-react";

import { cn } from "@/utils/helper";

const GATEWAY = new Date("2025-12-15");
const TODAY = new Date("2025-03-20");
const STATUSES = ["planned", "in_progress", "done"];
const STATUS_LABEL = {
  planned: "Planned",
  in_progress: "In progress",
  done: "Done",
};

function fmtMonth(str) {
  try {
    return new Date(str).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Unscheduled";
  }
}

function TimelineItem({ item, onUpdate, onRemove }) {
  const overdue =
    item.date && new Date(item.date) < TODAY && item.status !== "done";
  const afterGateway = item.date && new Date(item.date) > GATEWAY;

  return (
    <div
      className={cn(
        "p-3.5 rounded-xl border bg-white transition-all",
        item.status === "done"
          ? "border-success-200 bg-success-50/30"
          : overdue
            ? "border-warning-200 bg-warning-50/30"
            : "border-neutral-200",
      )}
    >
      <div className="flex items-start gap-3">
        <CalendarDays size={14} className="text-neutral-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-neutral-800 leading-snug">
            {item.title}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {item.type && (
              <span className="text-xs text-neutral-400">{item.type}</span>
            )}
            {item.work && (
              <>
                <span className="text-neutral-200">·</span>
                <span className="text-xs text-neutral-400">{item.work}</span>
              </>
            )}
          </div>
          {item.ksbs?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {item.ksbs.map((k) => (
                <span
                  key={k}
                  className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-1.5 py-0.5 rounded font-medium"
                >
                  {k}
                </span>
              ))}
            </div>
          )}
          {overdue && (
            <p className="text-xs text-warning-600 font-medium mt-1">
              Overdue — reschedule or evidence now.
            </p>
          )}
          {afterGateway && (
            <p className="text-xs text-warning-600 font-medium mt-1">
              ⚠ After gateway — bring this forward.
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <input
            type="date"
            value={item.date ?? ""}
            onChange={(e) => onUpdate(item.id, { date: e.target.value })}
            className="text-xs rounded-lg border border-neutral-200 px-2 py-1 text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          <button
            type="button"
            title="Remove"
            onClick={() => onRemove(item.id)}
            className="p-1.5 rounded-lg text-neutral-300 hover:text-danger-600 hover:bg-danger-50 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Segmented status + Evidence now */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <div className="flex p-0.5 bg-neutral-100 rounded-lg gap-0.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onUpdate(item.id, { status: s })}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                item.status === s
                  ? "bg-white text-neutral-800 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700",
              )}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        {item.status !== "done" && (
          <button
            type="button"
            onClick={() => onUpdate(item.id, { status: "done" })}
            className="inline-flex items-center gap-1 h-7 px-2.5 text-xs font-semibold text-success-700 bg-success-100 rounded-lg hover:bg-success-200 transition-colors"
          >
            <Zap size={11} />
            Evidence now
          </button>
        )}
      </div>
    </div>
  );
}

export function PlanPageTimeline({ items, onUpdate, onRemove }) {
  const unplanned = 16 - new Set(items.flatMap((i) => i.ksbs)).size;

  const byMonth = items.reduce((acc, item) => {
    const m = item.date ? fmtMonth(item.date) : "Unscheduled";
    if (!acc[m]) acc[m] = [];
    acc[m].push(item);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success-400" />
          <h3 className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Your evidence plan
          </h3>
        </div>
        <span className="text-xs text-neutral-400">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="p-3.5 rounded-xl bg-primary-50 border border-primary-100 mb-4">
        <p className="text-xs text-primary-700 font-medium">
          Plan ~2 KSBs per fortnight to finish with a buffer before gateway.
        </p>
        {unplanned > 0 && (
          <p className="text-xs text-warning-600 mt-0.5">
            ⚠ {unplanned} KSB{unplanned !== 1 ? "s" : ""} still have no plan.
          </p>
        )}
      </div>

      {Object.entries(byMonth).map(([month, monthItems]) => (
        <div key={month} className="mb-5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
            {month}
          </p>
          <div className="space-y-2">
            {monthItems.map((item) => (
              <TimelineItem
                key={item.id}
                item={item}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
