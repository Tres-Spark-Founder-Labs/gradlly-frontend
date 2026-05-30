import { ArrowRight, FileText, Lightbulb, MessageSquare } from "lucide-react";

import { cn } from "@/utils/helper";

const NUDGES = [
  {
    icon: Lightbulb,
    color: "primary",
    body: "Your work-based project could cover up to 9 KSBs at once — choosing the right area closes most gaps.",
    cta: "Plan project area",
  },
  {
    icon: FileText,
    color: "info",
    body: "3 OTJ sessions aren't yet evidence. 'REST API research' could map to K7, S11, S17.",
    cta: "Convert to evidence",
  },
  {
    icon: MessageSquare,
    color: "success",
    body: "A witness testimony from your line manager could cover B5 and B7 quickly.",
    cta: "Request testimony",
  },
];

const C = {
  primary: {
    wrap: "border-primary-100 bg-primary-50/40",
    iconBg: "bg-primary-100",
    icon: "text-primary-700",
    cta: "text-primary-700 hover:text-primary-900",
  },
  info: {
    wrap: "border-info-100 bg-info-50/40",
    iconBg: "bg-info-100",
    icon: "text-info-700",
    cta: "text-info-700 hover:text-info-900",
  },
  success: {
    wrap: "border-success-100 bg-success-50/40",
    iconBg: "bg-success-100",
    icon: "text-success-700",
    cta: "text-success-700 hover:text-success-900",
  },
};

export function PlanSmartPanel() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-info-400" />
        <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
          Smart suggestions
        </h3>
      </div>
      <div className="space-y-2">
        {NUDGES.map((n) => {
          const c = C[n.color];
          return (
            <div
              key={n.cta}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-xl border",
                c.wrap,
              )}
            >
              <div className={cn("p-1.5 rounded-lg shrink-0 mt-0.5", c.iconBg)}>
                <n.icon size={14} className={c.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {n.body}
                </p>
                <button
                  type="button"
                  className={cn(
                    "mt-1.5 inline-flex items-center gap-1 text-xs font-semibold transition-colors",
                    c.cta,
                  )}
                >
                  {n.cta} <ArrowRight size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
