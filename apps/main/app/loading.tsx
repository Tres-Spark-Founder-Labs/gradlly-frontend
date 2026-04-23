import { AuthLoadingSkeleton, AuthShell } from "@gradlly/ui";

export default function Loading() {
  return (
    <AuthShell>
      <AuthLoadingSkeleton />
    </AuthShell>
  );
}
