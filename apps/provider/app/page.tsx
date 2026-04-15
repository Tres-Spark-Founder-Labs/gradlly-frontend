import { DashboardLayout, StatCard } from "@gradlly/ui";

export default function HomePage(): React.ReactNode {
  return (
    <DashboardLayout appName="provider">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Providers" value="74" hint="Certified partners" />
        <StatCard label="Courses live" value="219" hint="Across domains" />
        <StatCard label="Audits pending" value="11" hint="Action needed" />
        <StatCard label="Quality score" value="4.8/5" hint="Last 30 days" />
      </div>
    </DashboardLayout>
  );
}
