import { ClipboardList } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { RecipientProfileForm } from "@/features/levy-exchange/components/RecipientProfileForm";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Recipient profile",
  description:
    "The details levy donors are matched against: sector, region, programme and the transfer you need.",
  path: "/levy-exchange/profile",
  noIndex: true,
});

export default function RecipientProfilePage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ClipboardList}
        eyebrow="Levy Exchange"
        title="Recipient profile"
        description="Tell levy-paying employers what you need. Matching compares these details with what each donor has said they will fund."
      />
      <RecipientProfileForm />
    </div>
  );
}
