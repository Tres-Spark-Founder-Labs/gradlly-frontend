import { cn } from "@/utils/helper";

const FILTERS = [
  { key: "all", label: "All gaps" },
  { key: "not_started", label: "Not started" },
  { key: "in_progress", label: "In progress" },
];

export function PlanBand({ planCount, filter, onFilter }) {
  const planned = planCount ?? 0;
  const remaining = 16 - planned;

  return (
    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 mb-6 space-y-3">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-neutral-800">
            16 KSBs to go before gateway
          </p>
          <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
            <span className="text-xs text-warning-600 font-medium">
              5 Not started — priority
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-xs text-neutral-500">
              11 In progress — need stronger evidence
            </span>
          </div>
        </div>
        {planned > 0 && (
          <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-full shrink-0">
            {planned} planned
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
          <span>22 / 38 evidenced</span>
          <span className="text-primary-700 font-medium">Goal: 38 / 38</span>
        </div>
        <div className="relative h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
            style={{ width: "57.9%" }}
          />
          {planned > 0 && (
            <div
              className="absolute inset-y-0 rounded-full bg-primary-200"
              style={{ left: "57.9%", width: `${(planned / 38) * 100}%` }}
            />
          )}
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          {planned > 0 ? `${planned} planned · ` : ""}
          {remaining} still to plan
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onFilter(f.key)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
              filter === f.key
                ? "bg-primary-700 border-primary-700 text-white"
                : "bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-700",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
