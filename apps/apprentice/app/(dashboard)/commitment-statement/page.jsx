import { FileSignature } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { CommitmentStatementSigning } from "@/features/commitments/components/CommitmentStatementSigning";
import { createPageSeo } from "@/utils/metadata";

/**
 * F3.4.1 Commitment Statement Signing (Must Have).
 *
 * The API for this was complete — `POST /commitment-statements/:id/sign`,
 * `GET /:id/signed-document`, and the seven-day chase — and the employer,
 * provider and flow portals all had signing routes. The apprentice, the party
 * the feature is named for, had none: `features/esignature/` held a single
 * orphaned `SignaturePad.jsx` imported nowhere.
 */
export const { metadata } = createPageSeo({
  title: "Commitment statement",
  description: "Read and sign your apprenticeship commitment statement.",
  path: "/commitment-statement",
  noIndex: true,
});

export default function CommitmentStatementPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={FileSignature}
        eyebrow="My Learning"
        title="Commitment statement"
        description="Read what you are agreeing to, then sign. Your employer and training provider sign it too."
      />
      <CommitmentStatementSigning />
    </div>
  );
}
