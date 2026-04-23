"use client";

import { AuthCard, AuthShell } from "@gradlly/ui";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error: _error, reset }: ErrorPageProps) {
  return (
    <AuthShell>
      <AuthCard>
        <div className="mb-4 inline-flex rounded-full bg-[var(--color-warning-subtle)] p-3 text-[var(--color-warning)]">
          <span aria-hidden="true">⚠️</span>
        </div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          We hit a temporary issue in the Provider Portal. Please try again.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={reset}
            className="rounded-xl bg-[var(--portal-accent)] px-4 py-2 text-sm font-medium text-[var(--portal-accent-fg)]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)]"
          >
            Go home
          </Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
