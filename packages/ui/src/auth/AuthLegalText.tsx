import { cn } from "@gradlly/utils";

import type { PropsWithChildren } from "react";

interface AuthLegalTextProps extends PropsWithChildren {
  className?: string;
}

export function AuthLegalText({ className, children }: AuthLegalTextProps) {
  return (
    <p
      className={cn(
        "mt-4 text-xs text-[var(--color-text-tertiary)]",
        className,
      )}
    >
      {children}
    </p>
  );
}
