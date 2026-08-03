import { ClipboardCheck } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EmployerReviewsTable } from "@/features/reviews/components/EmployerReviewsTable";

export const metadata = {
  title: "Progress Reviews · Gradlly Employer Portal",
};

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={ClipboardCheck}
        eyebrow="Apprentices"
        title="Progress reviews"
        description="12-weekly reviews for your apprentices, recorded by your training provider."
      />
      <EmployerReviewsTable />
    </div>
  );
}
