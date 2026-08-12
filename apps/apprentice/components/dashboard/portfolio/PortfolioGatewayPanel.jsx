"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";
import {
  ksbGaps,
  summariseKsbCoverage,
} from "@/features/portfolio/utils/ksb-summary";

/** Enough to be actionable without becoming a wall of codes. */
const GAPS_SHOWN = 8;

/**
 * F3.3.2 — what is still outstanding before gateway.
 *
 * **This component previously hardcoded `GAPS = ["K11","S12","S15","S16","B8"]`
 * and `LOGGED = 22 / TOTAL = 38`.** It named five specific standards to every
 * apprentice as still to evidence, whoever they were and whatever they had
 * uploaded. It was the most serious instance of OQ-15: an apprentice would
 * reasonably act on a list of exactly which standards stood between them and
 * their end-point assessment, and the list was fiction.
 *
 * Everything below is derived from the KSB heatmap. A learner with no gaps is
 * told they have no gaps; a learner with no standard loaded is told that, and
 * is shown nothing else.
 *
 * @param {{ cells?: Array<object>, isLoading?: boolean }} props
 */
export function PortfolioGatewayPanel({ cells = [], isLoading = false }) {
  const s = summariseKsbCoverage(cells);
  const gaps = ksbGaps(cells);
  const shown = gaps.slice(0, GAPS_SHOWN);
  const remaining = gaps.length - shown.length;

  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-2xl bg-neutral-100" />;
  }

  if (s.total === 0) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-neutral-500">
          Your gateway coverage appears here once your apprenticeship standard
          is loaded.
        </CardContent>
      </Card>
    );
  }

  if (gaps.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-start gap-3 p-5">
          <CheckCircle2
            className="mt-0.5 size-5 shrink-0 text-success-600"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              Every KSB has evidence
            </p>
            <p className="mt-0.5 text-xs text-neutral-600">
              All {s.total} knowledge, skills and behaviours on your standard
              have evidence recorded. Your tutor reviews it before gateway.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-warning-600"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900">
              {gaps.length} {gaps.length === 1 ? "KSB" : "KSBs"} still to
              evidence
            </p>
            <p className="mt-0.5 text-xs text-neutral-600">
              You have evidence against {s.evidenced} of {s.total}. These have
              nothing recorded yet:
            </p>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {shown.map((code) => (
                <li
                  key={code}
                  className="rounded-md border border-warning-200 bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-800"
                >
                  {code}
                </li>
              ))}
              {remaining > 0 && (
                <li className="px-1 py-0.5 text-xs text-neutral-500">
                  and {remaining} more
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
