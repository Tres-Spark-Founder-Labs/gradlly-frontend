import { MessageSquare } from "lucide-react";

import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

const TEAM = [
  { role: "Tutor", name: "Sarah Chen", initials: "SC", color: "primary" },
  { role: "Line manager", name: "David Okoro", initials: "DO", color: "info" },
  {
    role: "Skills coach",
    name: "Assigned at gateway",
    initials: "—",
    color: "neutral",
  },
];

const AV = {
  primary: "bg-primary-100 text-primary-800",
  info: "bg-info-100 text-info-800",
  neutral: "bg-neutral-100 text-neutral-500",
};

export function DashboardSupport() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-neutral-800">
          Support &amp; next review
        </h2>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Next review banner */}
        <div className="rounded-lg bg-primary-50 border border-primary-100 p-3.5 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-primary-800">
                Next progress review
              </p>
              <p className="text-xs text-primary-700 mt-0.5">
                10 April 2025 · Tripartite
              </p>
              <p className="text-xs text-primary-500 mt-0.5">
                Jamie · Sarah Chen · David Okoro
              </p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              Prepare
            </Button>
          </div>
          <p className="text-xs text-primary-400 border-t border-primary-100 pt-1.5">
            Last review: 15 Jan 2025 — &ldquo;On track&rdquo;
          </p>
        </div>

        {/* Support team */}
        <div>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
            Your team
          </p>
          <div className="space-y-2.5">
            {TEAM.map((p) => (
              <div key={p.role} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    AV[p.color],
                  )}
                >
                  {p.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-800">
                    {p.name}
                  </p>
                  <p className="text-xs text-neutral-400">{p.role}</p>
                </div>
                {p.color !== "neutral" && (
                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    <MessageSquare size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
