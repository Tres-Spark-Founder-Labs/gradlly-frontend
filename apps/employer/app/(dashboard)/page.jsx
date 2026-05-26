import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Dashboard",
  description:
    "Your Gradlly Employer dashboard — manage apprentices, track progress, and oversee your workforce development.",
  path: "/",
  noIndex: true,
});

export default function DashboardHomePage() {
  return <DashboardHome />;
}
