import { Users } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { SmeApprenticeRoster } from "@/features/reporting/components/SmeApprenticeRoster";
import { createPageSeo } from "@/utils/metadata";

/**
 * F4.3.1 — the SME's apprentices.
 *
 * The sidebar has linked here as "Apprentices" all along; the route rendered an
 * `EmptyPage`, so the one nav item an SME employer is most likely to click led
 * nowhere.
 *
 * Renders the same `SmeApprenticeRoster` the dashboard shows, over the same
 * `/reporting/sme-overview` data. Building a second roster against a different
 * endpoint would have let this page and the dashboard disagree about who is
 * enrolled — the kind of split that is invisible until someone notices two
 * screens showing different numbers.
 *
 * The heading is suppressed: the page is already titled "Apprentices" by the
 * subheader, and a card headed "Your apprentices" underneath it says the same
 * thing twice.
 */
export const { metadata } = createPageSeo({
  title: "Apprentices",
  description: "Your apprentices, their off-the-job progress and next reviews.",
  path: "/learners",
  noIndex: true,
});

export default function LearnersPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Users}
        eyebrow="Programmes"
        title="Apprentices"
        description="Your apprentices, their off-the-job progress and next reviews."
      />
      <SmeApprenticeRoster heading={null} />
    </div>
  );
}
