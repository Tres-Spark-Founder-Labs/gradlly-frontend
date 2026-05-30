import { CheckCircle, Clock } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full mb-2">
          <Clock size={11} />
          Thursday, 20 March 2025 · Week 54 of 104
        </span>
        <h1 className="text-2xl font-bold text-neutral-900">
          Good morning, Jamie 👋
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Software Developer L4 · ST0116 v1.1 · Birmingham Met College /
          Midlands Engineering
        </p>
      </div>
      <span
        className="inline-flex items-center gap-1.5 self-start shrink-0 text-sm font-semibold text-success-700 bg-success-50 border border-success-200 px-3 py-1.5 rounded-full"
        style={{ animation: "slide-up 300ms var(--ease-out) both" }}
      >
        <CheckCircle size={14} />
        On track
      </span>
    </div>
  );
}
