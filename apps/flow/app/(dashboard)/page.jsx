import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Dashboard",
  description:
    "Your Gradlly Flow dashboard — build and manage automation flows, monitor activity, and review logs.",
  path: "/",
  noIndex: true,
});

export default function DashboardHomePage() {
  return <DashboardHome />;
}
