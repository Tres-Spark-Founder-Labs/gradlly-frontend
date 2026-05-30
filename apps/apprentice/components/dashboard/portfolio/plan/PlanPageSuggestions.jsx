import { ArrowRight, FileText, Lightbulb, MessageSquare } from "lucide-react";

import { cn } from "@/utils/helper";

import { PROJECT_KSBS } from "./usePlanPageState";

export function PlanPageSuggestions({
  projOpen,
  setProjOpen,
  projSelected,
  setProjSelected,
  onAddProject,
  sessions,
  onConvert,
  testimonyDone,
  onRequestTestimony,
}) {
  function toggleProj(code) {
    setProjSelected((p) => {
      const next = new Set(p);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-info-400" />
        <h3 className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
          Smart suggestions
        </h3>
      </div>
      <div className="space-y-3">
        {/* Work-based project */}
        <div className="p-4 rounded-xl border border-primary-100 bg-primary-50/40">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-primary-100 shrink-0">
              <Lightbulb size={14} className="text-primary-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-neutral-700 leading-relaxed">
                Your work-based project could cover up to 9 KSBs at once —
                choosing the right area closes most gaps.
              </p>
              <button
                type="button"
                onClick={() => setProjOpen((o) => !o)}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-900 transition-colors"
              >
                Plan project area <ArrowRight size={11} />
              </button>
            </div>
          </div>
          {projOpen && (
            <div className="mt-3 pt-3 border-t border-primary-100 space-y-3">
              <p className="text-xs font-medium text-neutral-700">
                Select KSBs this project will cover:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PROJECT_KSBS.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => toggleProj(code)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors",
                      projSelected.has(code)
                        ? "bg-primary-700 border-primary-700 text-white"
                        : "bg-white border-neutral-200 text-neutral-600 hover:border-primary-300",
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={onAddProject}
                className="inline-flex items-center h-8 px-3 text-xs font-semibold text-white bg-primary-700 rounded-lg hover:bg-primary-800 transition-colors"
              >
                Add project to plan ({projSelected.size} KSBs)
              </button>
            </div>
          )}
        </div>

        {/* Unconverted OTJ sessions */}
        {sessions.length > 0 && (
          <div className="p-4 rounded-xl border border-info-100 bg-info-50/40">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-info-100 shrink-0">
                <FileText size={14} className="text-info-700" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <p className="text-xs text-neutral-700">
                  {sessions.length} OTJ session
                  {sessions.length !== 1 ? "s" : ""} not yet turned into
                  evidence — convert {sessions.length !== 1 ? "them" : "it"}?
                </p>
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 p-2.5 bg-white rounded-lg border border-info-100"
                  >
                    <div>
                      <p className="text-xs font-medium text-neutral-700">
                        {s.title}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {s.ksbs.join(", ")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onConvert(s)}
                      className="inline-flex items-center h-7 px-2.5 text-xs font-semibold text-info-700 bg-info-100 rounded-lg hover:bg-info-200 transition-colors shrink-0"
                    >
                      Convert
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Witness testimony */}
        {!testimonyDone && (
          <div className="p-4 rounded-xl border border-success-100 bg-success-50/40">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-success-100 shrink-0">
                <MessageSquare size={14} className="text-success-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-neutral-700 leading-relaxed">
                  A witness testimony from your line manager could cover B6 and
                  B7 quickly.
                </p>
                <button
                  type="button"
                  onClick={onRequestTestimony}
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-success-700 hover:text-success-900 transition-colors"
                >
                  Request testimony <ArrowRight size={11} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
