import type { ReactNode } from "react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}

export function AuthHeader({ title, subtitle, icon }: AuthHeaderProps) {
  return (
    <header className="mb-6 space-y-2">
      {icon ? (
        <div className="inline-flex rounded-xl bg-[var(--portal-accent-subtle)] p-2 text-[var(--portal-accent)]">
          {icon}
        </div>
      ) : null}
      <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
        {title}
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
    </header>
  );
}
