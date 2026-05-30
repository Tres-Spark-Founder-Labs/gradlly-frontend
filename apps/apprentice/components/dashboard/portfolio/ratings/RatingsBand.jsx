import { cn } from "@/utils/helper";

const COLORS = {
  K: { track: "bg-primary-100", fill: "bg-primary-500" },
  S: { track: "bg-info-100", fill: "bg-info-500" },
  B: { track: "bg-success-100", fill: "bg-success-500" },
  O: { track: "bg-neutral-100", fill: "bg-neutral-500" },
};

const SCALE = [
  "No experience",
  "Aware / observed",
  "With support",
  "Independently",
  "Could coach others",
];

function groupAvg(items, key) {
  const vals = items.map((i) => Number(i[key])).filter(Boolean);
  return vals.length
    ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)
    : "—";
}

function BandItem({ label, colorKey, baseline, today }) {
  const c = COLORS[colorKey];
  const todayNum = parseFloat(today);
  const baseNum = parseFloat(baseline);
  const delta =
    isNaN(todayNum) || isNaN(baseNum) ? null : +(todayNum - baseNum).toFixed(1);

  return (
    <div className="flex-1 min-w-0 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-700">{label}</span>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-neutral-400">{baseline}</span>
          <span className="text-neutral-300">→</span>
          <span className="font-bold text-neutral-800">{today}</span>
          {delta !== null && (
            <span
              className={cn(
                "font-semibold px-1 rounded",
                delta > 0
                  ? "text-success-700 bg-success-50"
                  : delta < 0
                    ? "text-danger-600 bg-danger-50"
                    : "text-neutral-400 bg-neutral-100",
              )}
            >
              {delta > 0 ? `+${delta}` : delta}
            </span>
          )}
        </div>
      </div>
      <div className={cn("relative h-2 rounded-full overflow-hidden", c.track)}>
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full opacity-30",
            c.fill,
          )}
          style={{ width: `${(baseNum / 5) * 100}%` }}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
            c.fill,
          )}
          style={{ width: `${(todayNum / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function RatingsBand({ enriched }) {
  const k = enriched.filter((r) => r.group === "K");
  const s = enriched.filter((r) => r.group === "S");
  const b = enriched.filter((r) => r.group === "B");

  return (
    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 mb-6 space-y-4">
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
        Live averages — baseline → today
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
        <BandItem
          label="Knowledge"
          colorKey="K"
          baseline={groupAvg(k, "baseline")}
          today={groupAvg(k, "today")}
        />
        <BandItem
          label="Skills"
          colorKey="S"
          baseline={groupAvg(s, "baseline")}
          today={groupAvg(s, "today")}
        />
        <BandItem
          label="Behaviours"
          colorKey="B"
          baseline={groupAvg(b, "baseline")}
          today={groupAvg(b, "today")}
        />
        <BandItem
          label="Overall"
          colorKey="O"
          baseline={groupAvg(enriched, "baseline")}
          today={groupAvg(enriched, "today")}
        />
      </div>
      <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-neutral-100">
        {SCALE.map((label, i) => (
          <span key={i} className="text-xs text-neutral-400">
            <strong className="text-neutral-600 mr-0.5">{i + 1}</strong>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
