import { FileText } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { PortfolioView } from "@/features/portfolio/components/PortfolioView";
import { createPageSeo } from "@/utils/metadata";

/**
 * F3.3.1 Evidence Library and F3.3.2 KSB Coverage Heatmap.
 *
 * This route was `/curriculum`, titled "Design and organise programme
 * curriculum" — authoring-tool language on a screen where an apprentice reads
 * their own evidence. PRD §5.2.3 calls it the Portfolio, so it is named that.
 *
 * A second `/portfolio` route existed and has been deleted rather than merged.
 * It rendered a hardcoded EVIDENCE array concatenated with the learner's real
 * items and a coverage total hardcoded to start at 31. `PortfolioView` below
 * reads `useEvidenceItems` and `useKsbHeatmap`, so nothing was lost by removing
 * it — the working implementation was always this one.
 */
export const { metadata } = createPageSeo({
  title: "Portfolio",
  description:
    "Your evidence library, mapped to the knowledge, skills and behaviours in your apprenticeship standard.",
  path: "/portfolio",
  noIndex: true,
});

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FileText}
        eyebrow="My Learning"
        title="Portfolio"
        description="Your evidence library, mapped to the knowledge, skills and behaviours in your apprenticeship standard."
      />
      <PortfolioView />
    </div>
  );
}
