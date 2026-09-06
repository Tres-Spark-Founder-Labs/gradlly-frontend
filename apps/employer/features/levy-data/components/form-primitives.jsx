"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { cn } from "@/utils/helper";

/**
 * The small pieces the four levy forms share.
 *
 * Kept local to the feature rather than promoted to components/ui: they encode
 * decisions specific to entering money by hand — that absent is shown as absent
 * rather than as zero, and that a save reports what it actually did.
 */

export function Field({ label, hint, error, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-800">
        {label}
        {required ? (
          <span className="ml-0.5 text-red-600" aria-hidden>
            *
          </span>
        ) : null}
      </span>
      {children}
      {hint && !error ? (
        <span className="mt-1 block text-xs text-neutral-500">{hint}</span>
      ) : null}
      {error ? (
        <span className="mt-1 block text-xs font-medium text-red-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function TextInput({ className, invalid, ...props }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full rounded-lg border px-3 py-2 text-sm text-neutral-900",
        "placeholder:text-neutral-400 focus:outline-none focus:ring-2",
        invalid
          ? "border-red-400 focus:ring-red-200"
          : "border-neutral-300 focus:border-neutral-400 focus:ring-neutral-200",
        className,
      )}
    />
  );
}

/**
 * The result of the last save.
 *
 * A save that changed nothing still says so. Silence after pressing a button is
 * indistinguishable from a failure, and the reflex it produces — press it again
 * — is exactly wrong when the write is replace-all.
 */
export function SaveStatus({ error, success }) {
  if (error) {
    return (
      <p
        role="alert"
        className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100"
      >
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>{error}</span>
      </p>
    );
  }
  if (success) {
    return (
      <p
        role="status"
        className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 ring-1 ring-emerald-100"
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>{success}</span>
      </p>
    );
  }
  return null;
}

/**
 * What the form is showing before anything is stored.
 *
 * Names the missing thing rather than rendering a placeholder figure. A zero or
 * a dash in a money field is read as a value, and an employer who reads "£0"
 * as their balance has been misinformed by the UI rather than by the data.
 */
export function NothingStoredYet({ children }) {
  return (
    <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-100">
      {children}
    </p>
  );
}

export function LoadingRow({ label }) {
  return (
    <p className="flex items-center gap-2 text-sm text-neutral-500">
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label}
    </p>
  );
}

/** The message an API error should show, without leaking a stack. */
export function errorText(error, fallback) {
  return error?.message || fallback;
}
