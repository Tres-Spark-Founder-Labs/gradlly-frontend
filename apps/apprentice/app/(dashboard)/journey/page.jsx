import { Route } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { JourneyView } from "@/features/journey/components/JourneyView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo({
  title: "My journey",
  description:
    "Your programme timeline, gateway readiness checklist and countdown to end-point assessment.",
  path: "/journey",
  noIndex: true,
});

export default function JourneyPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Route}
        eyebrow="Programme"
        title="My journey"
        description="Every milestone from enrolment to end-point assessment, and what is left before gateway."
      />
      <JourneyView />
    </div>
  );
}
