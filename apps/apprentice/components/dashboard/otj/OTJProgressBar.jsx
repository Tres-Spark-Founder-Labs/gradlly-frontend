import { cn } from "@/utils/helper";

const MILESTONES = [
  { label: "25%", pct: 25 },
  { label: "50%", pct: 50 },
  { label: "75%", pct: 75 },
  { label: "Gateway", pct: 100 },
];

export function OTJProgressBar({ data }) {
  const { hours } = data;
  const pct = hours.percent;

  return (
    <div className="surface-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-sm font-semibold text-neutral-800">
            {hours.logged}h of {hours.minimum}h logged
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {hours.remaining}h remaining to meet your standard minimum
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-3xl font-bold text-primary-700">{pct}%</span>
          <p className="text-xs text-neutral-400">complete</p>
        </div>
      </div>

      <div className="relative h-3 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <span className="text-xs text-neutral-400">0h</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-500 inline-block" />
          <span className="text-xs text-neutral-500">
            {hours.logged}h logged
          </span>
        </div>
        <span className="text-xs text-neutral-400">
          {hours.minimum}h minimum
        </span>
      </div>

      <div className="flex items-center gap-6 mt-5 pt-4 border-t border-neutral-100 flex-wrap">
        {MILESTONES.map((m) => (
          <div key={m.label} className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                pct >= m.pct ? "bg-primary-500" : "bg-neutral-200",
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                pct >= m.pct ? "text-primary-700" : "text-neutral-400",
              )}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
