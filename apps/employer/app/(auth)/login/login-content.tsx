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

export const employerAuthContent: PortalAuthContent = {
  portalName: "Employer Portal",
  headline: "Trusted hiring operations, in one place.",
  description:
    "Sign in to coordinate vacancies, interviews, and apprenticeship outcomes with confidence.",
  heroBullets: [
    "Manage roles and candidate pipelines with audit-ready records.",
    "Track interviews and offers across every region.",
    "Collaborate securely with providers and internal teams.",
  ],
  accentLabel: "Secure access for employer hiring teams",
  accentIcon: (
    <span className="text-lg" aria-hidden="true">
      ✦
    </span>
  ),
  legalText:
    "By continuing, you agree to Gradlly terms and employer data processing policy.",
  supportText: "Need help? Contact employer support.",
};
