import { cn } from "@gradlly/utils";

import type { PropsWithChildren } from "react";

interface AuthCardProps extends PropsWithChildren {
  className?: string;
  "data-testid"?: string;
}

export function AuthCard({
  className,
  children,
  "data-testid": dataTestId,
}: AuthCardProps) {
  return (
    <article
      className={cn(
        "w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-0)] p-5 shadow-sm sm:p-7",
        className,
      )}
      data-testid={dataTestId}
    >
      {children}
    </article>
  );
}
