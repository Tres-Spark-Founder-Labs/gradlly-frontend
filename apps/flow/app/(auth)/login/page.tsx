import { AuthBrandPanel, AuthIllustration, AuthShell } from "@gradlly/ui";
import { createPageMetadata } from "@gradlly/utils";

import { flowAuthContent } from "./login-content";
import { LoginForm } from "./LoginForm";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Sign in",
  description: "Secure sign in for Gradlly Flow Portal.",
  portalName: flowAuthContent.portalName,
  path: "/login",
});

export default function FlowLoginPage() {
  return (
    <AuthShell
      brandPanel={
        <AuthBrandPanel
          portalName={flowAuthContent.portalName}
          headline={flowAuthContent.headline}
          description={flowAuthContent.description}
          bullets={flowAuthContent.heroBullets}
          accentLabel={flowAuthContent.accentLabel}
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
