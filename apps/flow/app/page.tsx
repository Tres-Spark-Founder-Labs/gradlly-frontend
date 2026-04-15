import { DashboardLayout, StatCard } from "@gradlly/ui";

export default function HomePage(): React.ReactNode {
  return (
    <DashboardLayout appName="flow">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Automations" value="143" hint="Running now" />
        <StatCard label="Failures" value="2" hint="Investigating" />
        <StatCard label="Queued jobs" value="39" hint="Expected spike" />
        <StatCard label="Avg latency" value="132ms" hint="System healthy" />
      </div>
    </DashboardLayout>
  );
}
