import { AuthBrandPanel, AuthIllustration, AuthShell } from "@gradlly/ui";
import { createPageMetadata } from "@gradlly/utils";

import { providerAuthContent } from "./login-content";
import { LoginForm } from "./LoginForm";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Sign in",
  description: "Secure sign in for Gradlly Provider Portal.",
  portalName: providerAuthContent.portalName,
  path: "/login",
});

export default function ProviderLoginPage() {
  return (
    <AuthShell
      brandPanel={
        <AuthBrandPanel
          portalName={providerAuthContent.portalName}
          headline={providerAuthContent.headline}
          description={providerAuthContent.description}
          bullets={providerAuthContent.heroBullets}
          accentLabel={providerAuthContent.accentLabel}
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
