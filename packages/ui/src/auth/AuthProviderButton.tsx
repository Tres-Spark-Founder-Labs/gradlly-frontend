import { cn } from "@gradlly/utils";

import type { ButtonHTMLAttributes } from "react";

interface AuthProviderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  providerLabel: string;
  className?: string;
}

export function AuthProviderButton({
  providerLabel,
  className,
  ...props
}: AuthProviderButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--portal-accent)] focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">🛡️</span>
      {providerLabel}
    </button>
  );
}
