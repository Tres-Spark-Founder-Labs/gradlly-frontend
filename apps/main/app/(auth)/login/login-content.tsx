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

export const mainAuthContent: PortalAuthContent = {
  portalName: "Main Portal",
  headline: "Unified access for the Gradlly platform.",
  description:
    "Sign in to manage cross-portal operations, data visibility, and team-wide governance.",
  heroBullets: [
    "Coordinate activity across every Gradlly portal.",
    "Review performance and compliance at a glance.",
    "Maintain secure, role-aware administration controls.",
  ],
  accentLabel: "Central workspace for platform teams",
  accentIcon: (
    <span className="text-lg" aria-hidden="true">
      ✦
    </span>
  ),
  legalText:
    "By continuing, you agree to Gradlly terms and platform administration policy.",
  supportText: "Need support? Contact Gradlly platform operations.",
};
