import { CalendarDays } from "lucide-react";

const _GATEWAY = new Date("2025-12-15");

function fmtMonth(dateStr) {
  if (!dateStr) return "Unscheduled";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Unscheduled";
  }
}

export function PlanTimeline({ items }) {
  const byMonth = items.reduce((acc, item) => {
    const m = fmtMonth(item.date);
    if (!acc[m]) acc[m] = [];
    acc[m].push(item);
    return acc;
  }, {});

  const unplanned = 16 - items.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success-400" />
          <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
            Your evidence plan
          </h3>
        </div>
        <span className="text-xs text-neutral-400">
          {items.length} of 16 planned
        </span>
      </div>

      <div className="p-3.5 rounded-xl bg-primary-50 border border-primary-100 mb-4 space-y-1">
        <p className="text-xs text-primary-700 font-medium">
          Plan ~2 KSBs per fortnight to finish with a buffer before gateway.
        </p>
        {unplanned > 0 && (
          <p className="text-xs text-warning-600">
            ⚠ {unplanned} KSB{unplanned !== 1 ? "s" : ""} still have no plan.
          </p>
        )}
      </div>

      {Object.entries(byMonth).map(([month, monthItems]) => (
        <div key={month} className="mb-4">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
            {month}
          </p>
          <div className="space-y-1.5">
            {monthItems.map((item) => {
              const overdue =
                item.date &&
                new Date(item.date) < new Date() &&
                item.status !== "done";
              return (
                <div
                  key={item.code}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border ${overdue ? "border-warning-200 bg-warning-50/30" : "border-neutral-100 bg-white"}`}
                >
                  <CalendarDays
                    size={13}
                    className="text-neutral-400 shrink-0"
                  />
                  <span className="text-xs bg-primary-50 text-primary-700 border border-primary-100 px-1.5 py-0.5 rounded font-bold shrink-0">
                    {item.code}
                  </span>
                  <span className="text-xs text-neutral-700 flex-1 min-w-0 truncate">
                    {item.description}
                  </span>
                  <span className="text-xs text-neutral-400 shrink-0 whitespace-nowrap">
                    {item.date}
                  </span>
                  {overdue && (
                    <span className="text-xs text-warning-600 font-medium shrink-0">
                      Overdue
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
