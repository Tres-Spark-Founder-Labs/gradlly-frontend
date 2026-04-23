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

export const providerAuthContent: PortalAuthContent = {
  portalName: "Provider Portal",
  headline: "Deliver high-quality outcomes with confidence.",
  description:
    "Sign in to manage cohorts, maintain compliance, and coordinate programme delivery.",
  heroBullets: [
    "Monitor learners and programme performance in real time.",
    "Keep compliance records organised and accessible.",
    "Coordinate with employers and stakeholders effortlessly.",
  ],
  accentLabel: "Secure access for accredited training providers",
  accentIcon: (
    <span className="text-lg" aria-hidden="true">
      ✦
    </span>
  ),
  legalText:
    "By continuing, you agree to Gradlly terms and provider compliance policy.",
  supportText: "Need support? Contact provider operations support.",
};
