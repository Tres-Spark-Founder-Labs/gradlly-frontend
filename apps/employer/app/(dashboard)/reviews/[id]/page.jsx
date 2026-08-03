import { EmployerReviewDetail } from "@/features/reviews/components/EmployerReviewDetail";

export const metadata = {
  title: "Progress Review · Gradlly Employer Portal",
};

export default async function ReviewDetailPage({ params }) {
  const { id } = await params;
  return <EmployerReviewDetail id={id} />;
}
