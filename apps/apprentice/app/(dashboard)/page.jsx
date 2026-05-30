import Dashboard from "@/components/dashboard/home/Dashboard";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Dashboard",
  description:
    "Your Gradlly Apprentice dashboard — track your learning, view assessments, and monitor your progress.",
  path: "/",
  noIndex: true,
});

export default function DashboardHomePage() {
  return <Dashboard />;
}
