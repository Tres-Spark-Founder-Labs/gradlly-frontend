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

export const apprenticeAuthContent: PortalAuthContent = {
  portalName: "Apprentice Portal",
  headline: "Welcome back to your learning journey.",
  description:
    "Sign in to continue your pathway, connect with mentors, and track every milestone.",
  heroBullets: [
    "Stay on top of coursework and deadlines.",
    "Join mentor sessions from one secure space.",
    "Track your progress with clear feedback loops.",
  ],
  accentLabel: "Built to support learners every step of the way",
  accentIcon: (
    <span className="text-lg" aria-hidden="true">
      ✦
    </span>
  ),
  legalText:
    "By continuing, you agree to Gradlly terms and apprentice privacy commitments.",
  supportText:
    "Need support? Talk to your mentor or contact apprentice support.",
};
