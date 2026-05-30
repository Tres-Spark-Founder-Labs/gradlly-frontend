import { TrendingUp } from "lucide-react";

import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { RATINGS_DATA } from "@/data/ratings.data";
import { cn } from "@/utils/helper";

const STATIC = { K: 3.6, S: 3.4, B: 3.9 };
const BASELINES = { K: 2.1, S: 1.8, B: 2.5 };
const COLOR = {
  K: { track: "bg-primary-100", fill: "bg-primary-500" },
  S: { track: "bg-info-100", fill: "bg-info-500" },
  B: { track: "bg-success-100", fill: "bg-success-500" },
};
const LABELS = { K: "Knowledge", S: "Skills", B: "Behaviours" };

function liveAvg(groupKey, savedRatings) {
  if (!savedRatings) return STATIC[groupKey];
  const codes = RATINGS_DATA.filter((r) => r.group === groupKey).map(
    (r) => r.code,
  );
  const vals = codes.map((c) => savedRatings[c]).filter(Boolean);
  return vals.length
    ? +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)
    : STATIC[groupKey];
}

function ScorecardRow({ groupKey, savedRatings }) {
  const c = COLOR[groupKey];
  const current = liveAvg(groupKey, savedRatings);
  const baseline = BASELINES[groupKey];
  const gain = +(current - baseline).toFixed(1);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-700">
          {LABELS[groupKey]}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">{baseline} →</span>
          <span className="text-xs font-bold text-neutral-800">{current}</span>
          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded border",
              gain > 0
                ? "text-success-700 bg-success-50 border-success-100"
                : "text-neutral-400 bg-neutral-50 border-neutral-100",
            )}
          >
            {gain > 0 ? `+${gain}` : gain}
          </span>
        </div>
      </div>
      <div
        className={cn("relative h-2.5 rounded-full overflow-hidden", c.track)}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full opacity-30",
            c.fill,
          )}
          style={{ width: `${(baseline / 5) * 100}%` }}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
            c.fill,
          )}
          style={{ width: `${(current / 5) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-neutral-400">
        <span>1 — not confident</span>
        <span>5 — could coach</span>
      </div>
    </div>
  );
}

export function PortfolioScorecard({ savedRatings, onUpdate }) {
  const lastUpdated = savedRatings ? "Just now" : "15 Jan 2025";
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-success-50 shrink-0">
            <TrendingUp size={16} className="text-success-700" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-800">
              Self-assessment scorecard
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Last updated {lastUpdated} · 1–5 confidence scale
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {["K", "S", "B"].map((key) => (
          <ScorecardRow key={key} groupKey={key} savedRatings={savedRatings} />
        ))}
        <p className="text-xs text-neutral-400 leading-relaxed border-t border-neutral-100 pt-3">
          Rate your confidence against each KSB — your tutor sees this before
          each review.
        </p>
        <Button variant="outline" size="sm" fullWidth onClick={onUpdate}>
          Update my ratings
        </Button>
      </CardContent>
    </Card>
  );
}
