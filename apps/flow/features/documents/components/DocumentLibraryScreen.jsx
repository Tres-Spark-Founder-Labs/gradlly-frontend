"use client";

import { ApprenticeDocumentsSection } from "./ApprenticeDocumentsSection";
import { TransferAgreementsSection } from "./TransferAgreementsSection";

/**
 * The SME's document library: two groups, not one table.
 *
 * A transfer agreement and a learner document share an id and a download link
 * and nothing else — different owners, a lifecycle on one and none on the
 * other, a title and date on one and neither on the other (see
 * features/documents/constants). Listing them as rows of one table would mean
 * inventing the missing fields and implying they are the same kind of record.
 */
export function DocumentLibraryScreen() {
  return (
    <div className="space-y-6">
      <TransferAgreementsSection />
      <ApprenticeDocumentsSection />
    </div>
  );
}
