"use client";

import { OtjProgressPanel } from "@/features/journey/components/OtjProgressPanel";
import { OtjLogTable } from "@/features/otj/components/OtjLogTable";

/**
 * The `/otj-logs` screen.
 *
 * Previously composed `OTJStatCards`, `OTJWeeklyChart`, `OTJProgressBar` and
 * `OTJSessionsList` — four components that rendered hardcoded constants
 * ("198h logged", "45% to minimum", a fabricated weekly chart) to every
 * apprentice regardless of what they had done. All four are deleted; this now
 * shows the real figures (F3.1.2) above the real session list (F3.1.3).
 */
export function OTJLogs() {
  return (
    <div className="space-y-6">
      <OtjProgressPanel />
      <OtjLogTable />
    </div>
  );
}
