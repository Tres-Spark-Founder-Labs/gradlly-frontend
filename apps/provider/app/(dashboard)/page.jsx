import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Dashboard",
  description:
    "Your Gradlly Provider dashboard — manage cohorts, reviews, ILR submissions, and Ofsted readiness.",
  path: "/",
  noIndex: true,
});

export default function DashboardHomePage() {
  return <DashboardHome />;
}
