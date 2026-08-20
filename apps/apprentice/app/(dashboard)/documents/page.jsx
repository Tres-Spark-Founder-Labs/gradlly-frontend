import { FolderOpen } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { DocumentsList } from "@/features/documents/components/DocumentsList";
import { createPageSeo } from "@/utils/metadata";

/**
 * PRD §5.2.4 Communications & Documents.
 *
 * This was `/reports`, titled "Generate programme delivery reports" — a
 * provider's job, on the apprentice's portal. It renders `DocumentsList` over
 * `/learners/me/documents`: the learner's own signed agreements, review records
 * and certificates. It has never generated a report.
 *
 * `/reports/completion` and `/reports/engagement` are gone with it. Both
 * rendered the identical component over the identical endpoint, so the three
 * routes were one screen behind three names.
 */
export const { metadata } = createPageSeo({
  title: "Documents",
  description:
    "Your signed agreements, review records and certificates, all in one place.",
  path: "/documents",
  noIndex: true,
});

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FolderOpen}
        eyebrow="My Learning"
        title="Documents"
        description="Your signed agreements, review records and certificates, all in one place."
      />
      <DocumentsList />
    </div>
  );
}
