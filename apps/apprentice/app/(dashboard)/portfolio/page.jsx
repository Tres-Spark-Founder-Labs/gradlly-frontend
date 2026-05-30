import { Portfolio } from "@/components/dashboard/portfolio/Portfolio";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Portfolio & KSBs",
  description:
    "Your evidence library mapped to the knowledge, skills and behaviours in your Software Developer apprenticeship standard.",
  path: "/portfolio",
  noIndex: true,
});

export default function PortfolioPage() {
  return <Portfolio />;
}
