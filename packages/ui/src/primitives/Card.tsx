import { cn } from "@gradlly/utils";

import type { PropsWithChildren } from "react";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ className, children }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </article>
  );
}
