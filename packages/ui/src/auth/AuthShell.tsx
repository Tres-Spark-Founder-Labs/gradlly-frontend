import { cn } from "@gradlly/utils";

import type { PropsWithChildren, ReactNode } from "react";

interface AuthShellProps extends PropsWithChildren {
  brandPanel?: ReactNode;
  className?: string;
  contentClassName?: string;
  "data-testid"?: string;
}

export function AuthShell({
  brandPanel,
  className,
  contentClassName,
  children,
  "data-testid": dataTestId,
}: AuthShellProps) {
  return (
    <main
      className={cn(
        "relative min-h-dvh bg-[var(--color-surface-1)] px-4 py-6 sm:px-6 sm:py-10 lg:px-10",
        className,
      )}
      data-testid={dataTestId}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--portal-accent-subtle),transparent_50%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl items-stretch gap-5 lg:grid-cols-[1fr_1.1fr]">
        {brandPanel ? (
          <aside className="hidden lg:block">{brandPanel}</aside>
        ) : null}
        <section
          className={cn(
            "flex min-h-[75dvh] items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-0)]/90 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-sm sm:p-8",
            contentClassName,
          )}
        >
          {children}
        </section>
      </div>
    </main>
  );
}
