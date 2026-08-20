"use client";

import { TrendingUp } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { OtjProgressPanel } from "@/features/journey/components/OtjProgressPanel";
import { OtjLogTable } from "@/features/otj/components/OtjLogTable";

/**
 * The `/otj-logs` screen — PRD §5.2.1 OTJ Tracker.
 *
 * Previously composed `OTJStatCards`, `OTJWeeklyChart`, `OTJProgressBar` and
 * `OTJSessionsList` — four components that rendered hardcoded constants
 * ("198h logged", "45% to minimum", a fabricated weekly chart) to every
 * apprentice regardless of what they had done. All four are deleted; this now
 * shows the real figures (F3.1.2) above the real session list (F3.1.3).
 *
 * ── ON THE "TWO OTJ IMPLEMENTATIONS" ────────────────────────────────────────
 *
 * There was only ever one. `/progress` rendered `OtjLogTable` — the same
 * component imported below, from the same `features/otj` slice — with a
 * `PageSubheader` above it. This file is a composition wrapper, not a second
 * implementation, so there was nothing to merge and no data fetched by one
 * that the other lacked.
 *
 * `/otj-logs` is the strict superset: it adds `OtjProgressPanel` (F3.1.2
 * visualisation, over `useLearnerSummary` and `useEnrolmentJourney`) above the
 * shared table. The only thing `/progress` owned was the subheader, ported
 * here so nothing is lost when that route is retired.
 */
export function OTJLogs() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={TrendingUp}
        eyebrow="My Learning"
        title="Off-the-job training"
        description="Log off-the-job training entries, track submission status, and see your progress against the 20% target."
      />
      <OtjProgressPanel />
      <OtjLogTable />
    </div>
  );
}
