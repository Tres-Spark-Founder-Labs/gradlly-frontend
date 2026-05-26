import { LoginForm } from "@/features/auth/components/LoginForm";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Log in",
  description:
    "Sign in to your Gradlly Apprentice account to access your learning dashboard.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <div className="mb-6 sm:mb-8">
        <p className="mb-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#2d7a50]">
          Welcome back
        </p>
        <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] leading-tight">
          Log in to Gradlly
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#6b7280]">
          Enter your credentials to access your learning dashboard.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
