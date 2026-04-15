import { DashboardLayout, StatCard } from "@gradlly/ui";

export default function HomePage(): React.ReactNode {
  return (
    <DashboardLayout appName="apprentice">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Learning paths" value="42" hint="6 added recently" />
        <StatCard label="Assessments" value="314" hint="Due this week" />
        <StatCard label="Mentor sessions" value="88" hint="Scheduled today" />
        <StatCard label="Completion rate" value="91%" hint="Cohort average" />
      </div>
    </DashboardLayout>
  );
}
