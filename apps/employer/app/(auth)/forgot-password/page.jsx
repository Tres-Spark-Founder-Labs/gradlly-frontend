import { Suspense } from "react";

import { ForgotPasswordView } from "@/features/auth/components/ForgotPasswordView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Forgot password",
  description:
    "Request a password reset link for your Gradlly Provider account.",
  path: "/forgot-password",
  noIndex: true,
});

function ViewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 rounded-xl bg-neutral-100" />
      <div className="h-10 w-full rounded-lg bg-neutral-100" />
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <Suspense fallback={<ViewSkeleton />}>
        <ForgotPasswordView />
      </Suspense>
    </div>
  );
}
