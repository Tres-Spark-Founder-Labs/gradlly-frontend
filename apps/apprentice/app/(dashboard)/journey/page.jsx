import { Route } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { EnrolmentsTable } from "@/features/enrolments/components/EnrolmentsTable";
import { JourneyView } from "@/features/journey/components/JourneyView";
import { ReviewsTable } from "@/features/reviews/components/ReviewsTable";
import { createPageSeo } from "@/utils/metadata";

/**
 * PRD §5.2.2 Journey Milestones — F3.2.1 through F3.2.4 on one page.
 *
 * Two routes were folded in here:
 *
 *   /courses      EnrolmentsTable, described as "Manage all your courses and
 *                 learning content" — authoring language, and the PRD never
 *                 calls an enrolment a course. The enrolment is what the
 *                 timeline below is a timeline *of*, so it belongs above it.
 *   /assessments  ReviewsTable, described as "Review and grade learner
 *                 assessments" — a tutor's action, on the apprentice's own
 *                 portal. It is F3.2.4 Review History, which §5.2.2 places
 *                 here.
 *
 * ── WHY COMPOSED AT PAGE LEVEL, NOT INSIDE JourneyView ──────────────────────
 *
 * JourneyView early-returns for loading, error and the no-enrolment empty
 * state. Nesting these two inside it would mean a failed `useEnrolmentJourney`
 * call also blanked the review history, which is fetched by a different query
 * and would have been fine. Each section owns its own loading and error state
 * here, so one failing degrades one section.
 *
 * Order is narrative: what is coming (countdown), what I am on (enrolments),
 * the road (timeline), what is left (gateway), what is behind (reviews).
 * JourneyView still renders countdown, timeline and gateway as one unit
 * because the countdown deep-links to the gateway anchor (F3.2.3 AC4).
 */
export const { metadata, viewport } = createPageSeo({
  title: "My journey",
  description:
    "Your programme timeline, gateway readiness checklist, review history and countdown to end-point assessment.",
  path: "/journey",
  noIndex: true,
});

export default function JourneyPage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={Route}
        eyebrow="Programme"
        title="My journey"
        description="Every milestone from enrolment to end-point assessment, and what is left before gateway."
      />

      <JourneyView />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-neutral-900">
            Your enrolments
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            The programme or programmes you are registered on.
          </p>
        </CardHeader>
        <CardContent>
          <EnrolmentsTable />
        </CardContent>
      </Card>

      {/* F3.2.4 Review History. */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-neutral-900">
            Review history
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Every progress review with your provider and employer, most recent
            first.
          </p>
        </CardHeader>
        <CardContent>
          <ReviewsTable />
        </CardContent>
      </Card>
    </div>
  );
}
