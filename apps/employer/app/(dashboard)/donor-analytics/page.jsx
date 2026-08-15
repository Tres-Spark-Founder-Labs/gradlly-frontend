import { DonorAnalyticsDashboard } from "@/components/donor-analytics/DonorAnalyticsDashboard";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Donor Analytics",
  description:
    "The impact of your levy transfers: amount transferred, SMEs funded, learners supported and their outcomes.",
  path: "/donor-analytics",
  noIndex: true,
});

export default function DonorAnalyticsPage() {
  return <DonorAnalyticsDashboard />;
}
