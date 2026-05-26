import { SignupForm } from "@/features/auth/components/SignupForm";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Create account",
  description:
    "Join training providers using Gradlly to streamline learner management, reviews, and compliance workflows.",
  path: "/signup",
  noIndex: true,
});

export default function SignupPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <div className="mb-6 sm:mb-8">
        <p className="mb-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#2d7a50]">
          Get started: it&apos;s free
        </p>
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] leading-tight">
          Create your account
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#6b7280]">
          Join training providers using Gradlly to streamline learner
          management, reviews, and compliance workflows.
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
