import { PlusCircle } from "lucide-react";

import { cn } from "@/utils/helper";

const STATE_CHIP = {
  strong: "bg-primary-600 text-white",
  covered: "bg-primary-100 text-primary-800",
  in_progress: "bg-warning-100 text-warning-800",
  not_started: "bg-neutral-100 text-neutral-500",
};

const SCALE_TIP = [
  "",
  "No experience",
  "Aware / observed",
  "With support",
  "Independently",
  "Could coach",
];

function Trend({ last, today }) {
  if (today > last)
    return <span className="text-success-600 text-[11px] font-bold">▲</span>;
  if (today < last)
    return <span className="text-danger-500 text-[11px] font-bold">▼</span>;
  return <span className="text-neutral-300 text-[11px]">▬</span>;
}

export function RatingsRow({ item, onRate }) {
  const isGap = item.ksbState === "not_started";
  const dropped = item.today < item.last;
  const confident = item.today >= 4 && item.evidenceCount === 0;

  return (
    <div
      className={cn(
        "p-3 rounded-lg mb-1 transition-colors",
        isGap
          ? "bg-warning-50/60 border border-warning-100"
          : "hover:bg-neutral-50",
      )}
    >
      {/* Top row */}
      <div className="flex items-start gap-2.5 flex-wrap sm:flex-nowrap">
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-bold shrink-0 mt-0.5 min-w-[36px] text-center",
            STATE_CHIP[item.ksbState],
          )}
        >
          {item.code}
        </span>
        <p className="text-xs text-neutral-700 flex-1 min-w-0 leading-snug pt-0.5">
          {item.label}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-neutral-300" title="Baseline">
            {item.baseline}
          </span>
          <span className="text-[10px] text-neutral-400" title="Last rating">
            {item.last}
          </span>
          <Trend last={item.last} today={item.today} />
          {item.evidenceCount > 0 && (
            <span className="text-[10px] bg-primary-50 text-primary-700 border border-primary-100 px-1.5 py-0.5 rounded-full font-medium">
              {item.evidenceCount} ev
            </span>
          )}
        </div>
      </div>

      {/* Segmented 1–5 control */}
      <div className="flex gap-1 mt-2 ml-0 sm:ml-[46px]">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            title={SCALE_TIP[n]}
            onClick={() => onRate(item.code, n)}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-md border transition-all",
              item.today === n
                ? "bg-primary-600 border-primary-600 text-white shadow-sm"
                : "bg-white border-neutral-200 text-neutral-500 hover:border-primary-300 hover:text-primary-700",
            )}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Inline helpers */}
      {dropped && (
        <p className="text-xs text-neutral-400 mt-1.5 ml-0 sm:ml-[46px]">
          Dropped since last time — add a note for your tutor in the reflection
          below.
        </p>
      )}
      {confident && !dropped && (
        <div className="flex items-center gap-1.5 mt-1.5 ml-0 sm:ml-[46px]">
          <PlusCircle size={11} className="text-primary-500 shrink-0" />
          <p className="text-xs text-primary-600">
            Feeling confident on {item.code} — add evidence to prove it.
          </p>
        </div>
      )}
    </div>
  );
}
