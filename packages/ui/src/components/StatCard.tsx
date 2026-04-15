import { Card } from "../primitives/Card";

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[var(--dashboard-text)]">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </Card>
  );
}
