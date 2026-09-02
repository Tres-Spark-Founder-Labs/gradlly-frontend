import { BarChart3 } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { ProviderPerformanceView } from "@/features/reporting/components/ProviderPerformanceView";
import { createPageSeo } from "@/utils/metadata";

/**
 * F1.4.2 Provider Performance Comparison.
 *
 * `ProviderPerformanceView` was complete — it calls
 * `useDownloadProviderComparisonCsv` and `useExportProviderComparisonPdf`
 * against endpoints that exist — and nothing rendered it. This route held an
 * `EmptyPage` instead, so a built feature with a working backend looked unbuilt.
 *
 * Retitled from "Team Performance": the PRD has no team-performance concept,
 * and the comparison is between training providers, not teams.
 */
export const { metadata } = createPageSeo({
  title: "Provider performance",
  description:
    "Compare your training providers on completion, achievement and off-the-job compliance.",
  path: "/analytics/performance",
  noIndex: true,
});

export default function ProviderPerformancePage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={BarChart3}
        eyebrow="Levy"
        title="Provider performance"
        description="Compare your training providers on completion, achievement and off-the-job compliance."
      />
      <ProviderPerformanceView />
    </div>
  );
}
