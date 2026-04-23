interface AuthDividerProps {
  label?: string;
}

export function AuthDivider({ label = "or continue with" }: AuthDividerProps) {
  return (
    <div
      className="my-5 flex items-center gap-3"
      role="separator"
      aria-label={label}
    >
      <span className="h-px flex-1 bg-[var(--color-border)]" />
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  );
}
