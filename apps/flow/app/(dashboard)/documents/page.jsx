import { FolderOpen } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { DocumentLibraryScreen } from "@/features/documents/components/DocumentLibraryScreen";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Documents",
  description:
    "Your organisation's levy transfer agreements and apprentice documents.",
  path: "/documents",
  noIndex: true,
});

/**
 * F4.2.4 AC3 — "Copies are stored in both the donor's and SME's FlowPortal
 * document libraries". FlowPortal had no library: signed commitment PDFs lived
 * in each commitment panel and the transfer agreement on the transfer detail.
 * Both stay where they are; this page indexes them.
 */
export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FolderOpen}
        eyebrow="Library"
        title="Documents"
        description="Levy transfer agreements and your apprentices' documents, in one place. Each transfer agreement is also on its transfer's page."
      />
      <DocumentLibraryScreen />
    </div>
  );
}
