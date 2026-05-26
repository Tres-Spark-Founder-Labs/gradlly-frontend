"use client";

import { prettifyField } from "@/utils/helper";

/**
 * Renders the backend error envelope: error (category), message, and field errors.
 *
 * Accepts an ApiClientError (or any object with the same shape).
 *
 * Props:
 *   error        — ApiClientError instance (or null/undefined to render nothing)
 *   showFieldList — render per-field errors as a bullet list (default false)
 *   onDismiss    — if provided, shows a dismiss button
 *   className    — extra classes on the wrapper
 */
export function ServerErrorAlert({
  error,
  showFieldList = false,
  onDismiss,
  className = "",
}) {
  if (!error) return null;

  // error.error  → backend's "error" field, e.g. "Unauthorized", "Unprocessable Entity"
  // error.message → human-readable description,  e.g. "Invalid credentials"
  // error.fieldErrors → per-field validation map, e.g. { email: "must be an email" }
  const errorCategory = error.error ?? null;
  const message = error.message ?? null;
  const fieldErrors = error.fieldErrors ?? error.errors ?? null;
  const hasList =
    showFieldList && fieldErrors && Object.keys(fieldErrors).length > 0;

  if (!errorCategory && !message && !hasList) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          {/* "Unauthorized" / "Unprocessable Entity" — HTTP error category */}
          {errorCategory && (
            <p className="font-semibold text-red-800">{errorCategory}</p>
          )}

          {/* "Invalid credentials" / "Validation Error" — human-readable description */}
          {message && (
            <p
              className={
                errorCategory ? "text-red-700" : "font-medium text-red-700"
              }
            >
              {message}
            </p>
          )}

          {/* Per-field validation errors */}
          {hasList && (
            <ul className="mt-1 list-inside list-disc space-y-0.5 text-red-600">
              {Object.entries(fieldErrors).map(([field, msg]) => (
                <li key={field}>
                  <span className="font-medium">{prettifyField(field)}:</span>{" "}
                  {msg}
                </li>
              ))}
            </ul>
          )}
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="mt-0.5 shrink-0 p-0.5 leading-none text-red-400 transition-colors hover:text-red-700"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
