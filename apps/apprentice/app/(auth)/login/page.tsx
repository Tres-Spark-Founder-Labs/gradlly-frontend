import { AuthBrandPanel, AuthIllustration, AuthShell } from "@gradlly/ui";
import { createPageMetadata } from "@gradlly/utils";

import { apprenticeAuthContent } from "./login-content";
import { LoginForm } from "./LoginForm";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Sign in",
  description: "Secure sign in for Gradlly Apprentice Portal.",
  portalName: apprenticeAuthContent.portalName,
  path: "/login",
});

export default function ApprenticeLoginPage() {
  return (
    <AuthShell
      brandPanel={
        <AuthBrandPanel
          portalName={apprenticeAuthContent.portalName}
          headline={apprenticeAuthContent.headline}
          description={apprenticeAuthContent.description}
          bullets={apprenticeAuthContent.heroBullets}
          accentLabel={apprenticeAuthContent.accentLabel}
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
