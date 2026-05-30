import { AlertCircle, Download, MapPin } from "lucide-react";

import Button from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

const GAPS = ["K11", "S12", "S15", "S16", "B8"];
const LOGGED = 22;
const TOTAL = 38;
const PCT = Math.round((LOGGED / TOTAL) * 100);

export function PortfolioGatewayPanel({ onPlanGaps }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-warning-50 shrink-0">
            <AlertCircle size={16} className="text-warning-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-800">
              Gateway readiness
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              16 KSBs still need evidence before your December 2025 gateway
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            startIcon={<Download size={13} />}
          >
            Export showcase
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-medium text-neutral-700">
              {LOGGED} / {TOTAL} KSBs evidenced
            </span>
            <span className="font-bold text-primary-700">{PCT}%</span>
          </div>
          <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-700"
              style={{ width: `${PCT}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1.5 text-neutral-400">
            <span>0</span>
            <span className="text-warning-600 font-medium">
              Need 38 for gateway
            </span>
            <span>38</span>
          </div>
        </div>

        {/* Priority gaps */}
        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-3">
          <p className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
            <MapPin size={12} className="text-warning-500" />
            Priority gaps — not started
          </p>
          <div className="flex flex-wrap gap-1.5">
            {GAPS.map((k) => (
              <span
                key={k}
                className="px-2.5 py-1 text-xs font-semibold text-warning-800 bg-warning-100 border border-warning-200 rounded-full"
              >
                {k}
              </span>
            ))}
          </div>
          <Button variant="outline" size="sm" href="/portfolio/plan">
            Plan evidence for gaps
          </Button>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          The <strong className="text-neutral-600">export showcase</strong> is a
          read-only evidence collection you can share with your EPAO before the
          professional discussion.
        </p>
      </CardContent>
    </Card>
  );
}
