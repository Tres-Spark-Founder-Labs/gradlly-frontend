import { cn } from "@gradlly/utils";

import type { PropsWithChildren } from "react";

interface AuthFooterProps extends PropsWithChildren {
  className?: string;
}

export function AuthFooter({ className, children }: AuthFooterProps) {
  return (
    <footer
      className={cn(
        "mt-6 text-sm text-[var(--color-text-secondary)]",
        className,
      )}
    >
      {children}
    </footer>
  );
}
