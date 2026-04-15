import { DashboardLayout, StatCard } from "@gradlly/ui";

export default function HomePage(): React.ReactNode {
  return (
    <DashboardLayout appName="employer">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open vacancies" value="57" hint="Across all regions" />
        <StatCard label="Interviews" value="129" hint="This sprint" />
        <StatCard label="Offers sent" value="23" hint="Awaiting response" />
        <StatCard label="Time to hire" value="18 days" hint="Median value" />
      </div>
    </DashboardLayout>
  );
}
