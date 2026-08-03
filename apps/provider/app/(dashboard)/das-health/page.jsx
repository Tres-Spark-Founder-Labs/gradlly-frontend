import { Activity } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { DasActivityLog } from "@/features/das/components/DasActivityLog";
import { DasSyncStatusCard } from "@/features/das/components/DasSyncStatusCard";
import { DasPushesView } from "@/features/das-pushes/components/DasPushesView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "DAS Delivery Health",
  description:
    "Monitor failed DAS pushes across the enrolment, completion, and withdrawal pipelines, and re-queue them.",
  path: "/das-health",
  noIndex: true,
});

export default function DasHealthPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Activity}
        eyebrow="Funding"
        title="DAS delivery health"
        description="Sync health, every call made to the ESFA, and failed pushes across the three pipelines."
      />
      {/* F2.3.1 AC5 — the indicator goes first: it answers "is this working"
          before the page asks the reader to interpret a list. */}
      <DasSyncStatusCard />
      <DasPushesView />
      {/* F2.3.1 AC7 */}
      <DasActivityLog />
    </div>
  );
}
