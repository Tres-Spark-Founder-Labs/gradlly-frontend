import { Suspense } from "react";

import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Reset password",
  description: "Set a new password for your Gradlly Provider account.",
  path: "/reset-password",
  noIndex: true,
});

function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-16 rounded-xl bg-neutral-100" />
      <div className="h-16 rounded-xl bg-neutral-100" />
      <div className="h-10 rounded-lg bg-neutral-100" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <div className="mb-6 sm:mb-8">
        <p className="mb-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#2d7a50]">
          Account recovery
        </p>
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] leading-tight">
          Set a new password
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#6b7280]">
          Choose a strong password. You&apos;ll use it to log in going forward.
        </p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
