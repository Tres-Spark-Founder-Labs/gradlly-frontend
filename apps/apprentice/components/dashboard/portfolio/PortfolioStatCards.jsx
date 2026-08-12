"use client";

import { CheckCircle2, CircleDashed, FileText, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";
import { summariseKsbCoverage } from "@/features/portfolio/utils/ksb-summary";
import { cn } from "@/utils/helper";

/**
 * F3.3.2 — portfolio coverage headline.
 *
 * Previously rendered constants: "22 / 38 KSBs evidenced", "58%", "8 strong",
 * "11 in progress" — identical for every apprentice regardless of what they had
 * uploaded (OQ-15). Every figure now comes from the KSB heatmap the API
 * returns, and an empty portfolio reports zeroes rather than a plausible
 * baseline.
 *
 * @param {{ cells?: Array<object>, isLoading?: boolean }} props
 */
export function PortfolioStatCards({ cells = [], isLoading = false }) {
  const s = summariseKsbCoverage(cells);

  const stats = [
    {
      id: "evidenced",
      icon: FileText,
      label: "KSBs evidenced",
      value: s.total > 0 ? `${s.evidenced} / ${s.total}` : "—",
      sub:
        s.percentEvidenced === null
          ? "No standard loaded yet"
          : `${s.percentEvidenced}% · ${s.notStarted} still to evidence`,
      tone: "text-primary-600",
    },
    {
      id: "adequate",
      icon: CheckCircle2,
      label: "Strong coverage",
      value: String(s.adequate),
      sub: "Enough evidence recorded",
      tone: "text-success-600",
    },
    {
      id: "low",
      icon: TrendingUp,
      label: "Needs more",
      value: String(s.low),
      sub: "Some evidence, not enough yet",
      tone: "text-warning-600",
    },
    {
      id: "not-started",
      icon: CircleDashed,
      label: "Not started",
      value: String(s.notStarted),
      sub: "No evidence uploaded",
      tone: "text-neutral-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="h-28 animate-pulse rounded-2xl bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ id, icon: Icon, label, value, sub, tone }) => (
        <Card key={id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Icon className={cn("size-4", tone)} aria-hidden="true" />
              <p className="text-xs font-medium text-neutral-500">{label}</p>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-neutral-900">
              {value}
            </p>
            <p className="mt-0.5 text-[11px] text-neutral-500">{sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
