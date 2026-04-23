import { AuthCard, AuthShell } from "@gradlly/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <AuthShell>
      <AuthCard className="text-center">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-[var(--portal-accent-subtle)] p-3 text-[var(--portal-accent)]">
          <span aria-hidden="true">🧭</span>
        </div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          We couldn't find that page in the Employer Portal.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-[var(--portal-accent)] px-4 py-2 text-sm font-medium text-[var(--portal-accent-fg)]"
          >
            Go home
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)]"
          >
            Sign in
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
