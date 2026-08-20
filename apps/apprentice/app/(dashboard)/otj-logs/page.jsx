import { OTJLogs } from "@/components/dashboard/otj/OTJLogs";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Off-the-job training",
  // Was "... for the Software Developer apprenticeship standard" — a standard
  // hardcoded for every apprentice regardless of what they are enrolled on.
  description:
    "Track and log your off-the-job training hours against your apprenticeship standard.",
  path: "/otj-logs",
  noIndex: true,
});

export default function OTJLogsPage() {
  return <OTJLogs />;
}
