import { ReportsDashboard } from "@/features/reporting/components/ReportsDashboard";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Reports",
  description: "Levy ROI, utilisation, and provider performance.",
  path: "/reports",
  noIndex: true,
});

export default function ReportsPage() {
  return <ReportsDashboard />;
}
