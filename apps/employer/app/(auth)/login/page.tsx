import { AuthBrandPanel, AuthIllustration, AuthShell } from "@gradlly/ui";
import { createPageMetadata } from "@gradlly/utils";

import { employerAuthContent } from "./login-content";
import { LoginForm } from "./LoginForm";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Sign in",
  description: "Secure sign in for Gradlly Employer Portal.",
  portalName: employerAuthContent.portalName,
  path: "/login",
});

export default function EmployerLoginPage() {
  return (
    <AuthShell
      brandPanel={
        <AuthBrandPanel
          portalName={employerAuthContent.portalName}
          headline={employerAuthContent.headline}
          description={employerAuthContent.description}
          bullets={employerAuthContent.heroBullets}
          accentLabel={employerAuthContent.accentLabel}
        />
      }
    >
      <div className="w-full max-w-md space-y-4">
        <div className="lg:hidden">
          <AuthIllustration />
        </div>
        <LoginForm />
      </div>
    </AuthShell>
  );
}
