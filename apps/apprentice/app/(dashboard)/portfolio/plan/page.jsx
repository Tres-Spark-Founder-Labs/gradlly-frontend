import { PlanPage } from "@/components/dashboard/portfolio/plan/PlanPage";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Plan your evidence",
  description:
    "Build a dated action plan for the 16 KSBs still needed before your December gateway.",
  path: "/portfolio/plan",
  noIndex: true,
});

export default function PlanEvidencePage() {
  return <PlanPage />;
}
