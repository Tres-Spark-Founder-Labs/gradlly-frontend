import { Package } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EpaPackExport } from "@/features/portfolio/components/EpaPackExport";
import { createPageSeo } from "@/utils/metadata";

/**
 * F3.3.4 EPA Evidence Pack Export (Must Have).
 *
 * The backend was built — `POST /portfolio/epa-pack-jobs` and its poll
 * endpoint — and the provider portal called it. The apprentice, who AC1 puts
 * the export in the hands of, had no route to it.
 */
export const { metadata } = createPageSeo({
  title: "EPA evidence pack",
  description:
    "Export your complete evidence pack, ready to submit to your end-point assessment organisation.",
  path: "/epa-pack",
  noIndex: true,
});

export default function EpaPackPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Package}
        eyebrow="My Learning"
        title="EPA evidence pack"
        description="Everything your assessor needs, in one download."
      />
      <EpaPackExport />
    </div>
  );
}
