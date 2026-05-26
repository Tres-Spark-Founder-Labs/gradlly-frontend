import { Suspense } from "react";

import { VerifyEmailForm } from "@/features/auth/components/VerifyEmailForm";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Verify your email",
  description:
    "Check your inbox for a verification link to activate your Gradlly account.",
  path: "/verify-email",
  noIndex: true,
});

function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-14 rounded-xl bg-neutral-100" />
      <div className="h-9 w-52 mx-auto rounded-lg bg-neutral-100" />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <div className="mb-6 sm:mb-8">
        <p className="mb-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#2d7a50]">
          One last step
        </p>
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] leading-tight">
          Verify your email
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#6b7280]">
          We&apos;ve sent a verification link to your email. Click the link to
          activate your account, if you&apos;ve already clicked it, we&apos;ll
          verify you automatically.
        </p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
