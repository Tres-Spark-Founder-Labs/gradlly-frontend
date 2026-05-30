import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { KSB_DATA } from "@/data/portfolio.data";
import { cn } from "@/utils/helper";

const STATE = {
  strong: {
    cell: "bg-primary-600 text-white border-primary-700 hover:bg-primary-700",
    dot: "bg-primary-600",
  },
  covered: {
    cell: "bg-primary-100 text-primary-800 border-primary-200 hover:bg-primary-200",
    dot: "bg-primary-300",
  },
  in_progress: {
    cell: "bg-warning-100 text-warning-800 border-warning-200 hover:bg-warning-200",
    dot: "bg-warning-400",
  },
  not_started: {
    cell: "bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200",
    dot: "bg-neutral-300",
  },
};

const LEGEND = [
  { state: "strong", label: "Strong" },
  { state: "covered", label: "Covered" },
  { state: "in_progress", label: "In progress" },
  { state: "not_started", label: "Not started" },
];

const GROUPS = [
  { key: "K", label: "Knowledge", total: 12, evidenced: 8 },
  { key: "S", label: "Skills", total: 17, evidenced: 9 },
  { key: "B", label: "Behaviours", total: 9, evidenced: 5 },
];

export function PortfolioKSBGrid({ activeKSB, onSelect, ksbUpdates = {} }) {
  const merged = KSB_DATA.map((k) =>
    ksbUpdates[k.code] ? { ...k, state: ksbUpdates[k.code] } : k,
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800">
              KSB coverage heatmap
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Tap any KSB to filter the evidence library below
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {LEGEND.map((l) => (
              <span
                key={l.state}
                className="flex items-center gap-1.5 text-xs text-neutral-500"
              >
                <span
                  className={cn("w-2.5 h-2.5 rounded-sm", STATE[l.state].dot)}
                />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {GROUPS.map((g) => (
          <div key={g.key}>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                {g.label}
              </p>
              <span className="text-xs font-medium text-neutral-400">
                {g.evidenced} / {g.total} evidenced
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {merged
                .filter((k) => k.group === g.key)
                .map((ksb) => {
                  const isActive = activeKSB === ksb.code;
                  return (
                    <button
                      key={ksb.code}
                      type="button"
                      title={ksb.label}
                      onClick={() => onSelect(isActive ? null : ksb.code)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150",
                        STATE[ksb.state].cell,
                        isActive &&
                          "ring-2 ring-offset-1 ring-primary-500 scale-105 shadow-md",
                      )}
                    >
                      {ksb.code}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}

        {activeKSB && (
          <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-100 rounded-lg">
            <p className="text-xs text-primary-700 font-medium">
              Filtering by <strong>{activeKSB}</strong> —{" "}
              {KSB_DATA.find((k) => k.code === activeKSB)?.label}
            </p>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
            >
              Clear ×
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
