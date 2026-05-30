import { OTJLogs } from "@/components/dashboard/otj/OTJLogs";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "Off-the-job training",
  description:
    "Track and log your off-the-job training hours for the Software Developer apprenticeship standard.",
  path: "/otj-logs",
  noIndex: true,
});

export default function OTJLogsPage() {
  return <OTJLogs />;
}
