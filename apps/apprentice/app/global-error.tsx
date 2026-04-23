"use client";

import { AuthCard } from "@gradlly/ui";
import Link from "next/link";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({
  error: _error,
  reset,
}: GlobalErrorPageProps) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-[var(--color-surface-1)] px-4 py-10">
        <main className="mx-auto flex min-h-[80dvh] max-w-3xl items-center justify-center">
          <AuthCard>
            <div className="mb-4 inline-flex rounded-full bg-[var(--color-error-subtle)] p-3 text-[var(--color-error)]">
              <span aria-hidden="true">⛔</span>
            </div>
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              We're having trouble right now
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              The Apprentice Portal is temporarily unavailable. Please retry or
              return to the home page.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={reset}
                className="rounded-xl bg-[var(--portal-accent)] px-4 py-2 text-sm font-medium text-[var(--portal-accent-fg)]"
              >
                Retry
              </button>
              <Link
                href="/"
                className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)]"
              >
                Go home
              </Link>
            </div>
          </AuthCard>
        </main>
      </body>
    </html>
  );
}
