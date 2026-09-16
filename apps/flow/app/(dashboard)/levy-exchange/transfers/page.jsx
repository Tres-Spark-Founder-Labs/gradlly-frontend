import { ArrowRightLeft } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { LevyTransfersScreen } from "@/features/levy-exchange/components/LevyTransfersScreen";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Levy transfers",
  description:
    "Levy transfers made to your organisation, their agreements and signatures.",
  path: "/levy-exchange/transfers",
  noIndex: true,
});

export default function LevyTransfersPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ArrowRightLeft}
        eyebrow="Levy Exchange"
        title="Transfers"
        description="Transfers a donor has created for your organisation. Open one to download the agreement and, when it is your turn, sign it."
      />
      <LevyTransfersScreen />
    </div>
  );
}
