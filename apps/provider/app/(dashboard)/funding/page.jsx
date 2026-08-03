import { Banknote } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { FundingPaymentsTable } from "@/features/das/components/FundingPaymentsTable";
import { LevyBalanceCard } from "@/features/das/components/LevyBalanceCard";
import { LevyForecastCard } from "@/features/das/components/LevyForecastCard";
import { FundingClaimTracker } from "@/features/ilr/components/FundingClaimTracker";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Funding",
  description:
    "Your DAS levy balance, spend forecast and runway, and synced funding payments.",
  path: "/funding",
  noIndex: true,
});

export default function FundingPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Banknote}
        eyebrow="Funding"
        title="Funding (DAS)"
        description="Levy balance, spend forecast, and funding payments synced from the apprenticeship service."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LevyBalanceCard />
        <LevyForecastCard />
      </div>
      <FundingPaymentsTable />
      {/* F2.3.2 AC7 — claimed vs received, and what is being done about gaps. */}
      <FundingClaimTracker />
    </div>
  );
}
