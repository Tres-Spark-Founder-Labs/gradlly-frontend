"use client";

import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-16">
      {/* Brand */}
      <Link
        href="/"
        aria-label="Go to Gradlly home"
        className="mb-12 flex items-center gap-2.5 rounded focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-4"
      >
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary-800 ring-1 ring-primary-700/30 shadow-sm">
          <span
            aria-hidden="true"
            className="text-base font-bold leading-none text-white"
          >
            G
          </span>
        </div>
        <span className="text-[17px] font-semibold tracking-tight text-neutral-800">
          Gradlly
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white px-8 py-10 text-center shadow-[0_4px_40px_rgba(0,0,0,0.06)]">
        {/* Icon */}
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-danger-50 ring-1 ring-danger-100">
          <AlertTriangle
            aria-hidden="true"
            className="size-7 text-danger-500"
            strokeWidth={1.5}
          />
        </div>

        <h1 className="mb-2 text-xl font-semibold tracking-tight text-neutral-900">
          Something went wrong
        </h1>

        <p className="mb-8 text-sm leading-relaxed text-neutral-500">
          {error?.message ||
            "An unexpected error occurred. Our team has been notified. You can"}{" "}
          try again or return to the dashboard.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-2"
          >
            <RotateCcw
              aria-hidden="true"
              className="size-3.5"
              strokeWidth={2}
            />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-2"
          >
            <Home aria-hidden="true" className="size-3.5" strokeWidth={2} />
            Go to dashboard
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs text-neutral-400">
        If this keeps happening,{" "}
        <a
          href="mailto:support@gradlly.com"
          className="font-medium text-primary-700 underline-offset-2 hover:underline"
        >
          contact support
        </a>
      </p>
    </div>
  );
}
