import { AuthBrandPanel, AuthIllustration, AuthShell } from "@gradlly/ui";
import { createPageMetadata } from "@gradlly/utils";

import { mainAuthContent } from "./login-content";
import { LoginForm } from "./LoginForm";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Sign in",
  description: "Secure sign in for Gradlly Main Portal.",
  portalName: mainAuthContent.portalName,
  path: "/login",
});

export default function MainLoginPage() {
  return (
    <AuthShell
      brandPanel={
        <AuthBrandPanel
          portalName={mainAuthContent.portalName}
          headline={mainAuthContent.headline}
          description={mainAuthContent.description}
          bullets={mainAuthContent.heroBullets}
          accentLabel={mainAuthContent.accentLabel}
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
