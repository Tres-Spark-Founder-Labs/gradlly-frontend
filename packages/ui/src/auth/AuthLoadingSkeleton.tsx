export function AuthLoadingSkeleton() {
  return (
    <div className="w-full max-w-md animate-pulse space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-0)] p-6">
      <div className="h-6 w-1/2 rounded bg-[var(--color-surface-3)]" />
      <div className="h-4 w-4/5 rounded bg-[var(--color-surface-3)]" />
      <div className="mt-4 h-10 w-full rounded-xl bg-[var(--color-surface-2)]" />
      <div className="h-px w-full bg-[var(--color-border)]" />
      <div className="space-y-3">
        <div className="h-10 w-full rounded-xl bg-[var(--color-surface-2)]" />
        <div className="h-10 w-full rounded-xl bg-[var(--color-surface-2)]" />
      </div>
      <div className="h-10 w-full rounded-xl bg-[var(--color-surface-3)]" />
    </div>
  );
}
