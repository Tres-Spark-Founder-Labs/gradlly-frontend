import type { ReactNode } from "react";

export interface PortalAuthContent {
  accentIcon: ReactNode;
  accentLabel: string;
  description: string;
  headline: string;
  heroBullets: string[];
  legalText: string;
  portalName: string;
  supportText: string;
}

export const flowAuthContent: PortalAuthContent = {
  portalName: "Flow Portal",
  headline: "Power every workflow from one dynamic command center.",
  description:
    "Sign in to monitor automations, resolve bottlenecks, and drive operational growth.",
  heroBullets: [
    "Track active jobs and throughput in real time.",
    "Spot incidents early with smart operational visibility.",
    "Scale high-impact workflow automation confidently.",
  ],
  accentLabel: "Built for fast-moving teams and growth-focused operations",
  accentIcon: (
    <span className="text-lg" aria-hidden="true">
      ✦
    </span>
  ),
  legalText:
    "By continuing, you agree to Gradlly terms and Flow platform usage policy.",
  supportText: "Need help? Contact Flow platform support.",
};
