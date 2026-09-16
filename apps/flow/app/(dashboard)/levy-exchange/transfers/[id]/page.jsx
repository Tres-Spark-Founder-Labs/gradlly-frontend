import { TransferDetailView } from "@/features/levy-exchange/components/TransferDetailView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Levy transfer",
  description: "A levy transfer's agreement, signatures and details.",
  path: "/levy-exchange/transfers",
  noIndex: true,
});

export default async function LevyTransferDetailPage({ params }) {
  const { id } = await params;
  return <TransferDetailView transferId={id} />;
}
