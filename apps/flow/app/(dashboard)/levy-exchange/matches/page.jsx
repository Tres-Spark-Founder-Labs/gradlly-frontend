import { Handshake } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { LevyMatchesScreen } from "@/features/levy-exchange/components/LevyMatchesScreen";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Donor matches",
  description:
    "Levy donors matched to your recipient profile, and the transfer applications you have sent.",
  path: "/levy-exchange/matches",
  noIndex: true,
});

export default function DonorMatchesPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Handshake}
        eyebrow="Levy Exchange"
        title="Donor matches"
        description="Levy-paying employers whose transfer preferences fit your profile. Apply to a donor to request a transfer."
      />
      <LevyMatchesScreen />
    </div>
  );
}
