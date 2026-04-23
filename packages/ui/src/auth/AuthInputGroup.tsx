import { cn } from "@gradlly/utils";

import type { InputHTMLAttributes } from "react";

interface AuthInputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
  containerClassName?: string;
}

export function AuthInputGroup({
  label,
  id,
  error,
  containerClassName,
  className,
  ...props
}: AuthInputGroupProps) {
  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--color-text-primary)]"
      >
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--portal-accent)]",
          error
            ? "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]"
            : "border-[var(--color-border)]",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
