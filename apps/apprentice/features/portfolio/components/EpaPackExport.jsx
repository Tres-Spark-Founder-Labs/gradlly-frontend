"use client";

import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Download,
  Loader2,
  MinusCircle,
  Package,
} from "lucide-react";
import { useMemo } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useCommitmentStatements } from "@/features/commitments/queries/commitments.query";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { useReviews } from "@/features/reviews/queries/reviews.query";

import { useEpaPackExport } from "../queries/epa-pack.query";
import { useEvidenceItems, useKsbHeatmap } from "../queries/portfolio.query";
import {
  PACK_SECTION_STATUS,
  buildPackPreview,
} from "../utils/epa-pack-preview";

/**
 * F3.3.4 EPA Evidence Pack Export.
 *
 *   AC1  compiles evidence, KSB coverage, reviews, OTJ and commitment
 *   AC2  structured by KSB category  (see the note on format below)
 *   AC3  generated within 60 seconds (measured — see epa-pack-timing.e2e-spec)
 *   AC4  preview before generating   → buildPackPreview
 *   AC5  download link also emailed  (see the note below)
 *
 * The PRD asks for "a single tap", so the export is one button. The preview
 * above it is a list, not a step: nothing has to be confirmed or configured
 * before the button works.
 */

const STATUS_ICON = {
  [PACK_SECTION_STATUS.READY]: CheckCircle2,
  [PACK_SECTION_STATUS.EMPTY]: Circle,
  [PACK_SECTION_STATUS.UNAVAILABLE]: MinusCircle,
};

const STATUS_TONE = {
  [PACK_SECTION_STATUS.READY]: "text-success-600",
  [PACK_SECTION_STATUS.EMPTY]: "text-neutral-400",
  [PACK_SECTION_STATUS.UNAVAILABLE]: "text-amber-600",
};

export function EpaPackExport() {
  const summary = useLearnerSummary();
  const enrolmentId = summary.data?.activeEnrolmentId ?? null;

  const evidence = useEvidenceItems({ perPage: 100 });
  const heatmap = useKsbHeatmap(enrolmentId);
  const reviews = useReviews({ perPage: 100 });
  const commitments = useCommitmentStatements(enrolmentId);

  const exporter = useEpaPackExport(enrolmentId);

  const preview = useMemo(() => {
    const cells = heatmap.data?.cells ?? heatmap.data ?? null;
    const covered = Array.isArray(cells)
      ? cells.filter((c) => (c.evidenceCount ?? 0) > 0).length
      : null;

    return buildPackPreview({
      evidenceCount:
        evidence.data?.items?.length ?? evidence.data?.length ?? null,
      ksbCoveredCount: covered,
      ksbTotalCount: Array.isArray(cells) ? cells.length : null,
      reviewCount: reviews.data?.items?.length ?? reviews.data?.length ?? null,
      otjHours: summary.data?.otjSummary?.approvedHours ?? null,
      hasCommitmentStatement: (commitments.data ?? []).some(
        (s) => s.status === "signed",
      ),
    });
  }, [
    evidence.data,
    heatmap.data,
    reviews.data,
    summary.data,
    commitments.data,
  ]);

  const unavailable = preview.filter(
    (row) => row.status === PACK_SECTION_STATUS.UNAVAILABLE,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-800">
              What goes in your pack
            </h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="divide-y divide-neutral-100">
            {preview.map((row) => {
              const Icon = STATUS_ICON[row.status];
              return (
                <li
                  key={row.key}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="flex items-center gap-2 text-sm text-neutral-700">
                    <Icon className={`h-4 w-4 ${STATUS_TONE[row.status]}`} />
                    {row.label}
                  </span>
                  <span className="text-xs text-neutral-500">{row.detail}</span>
                </li>
              );
            })}
          </ul>

          {/*
            AC1 lists reflective statements among the pack's contents and
            F3.3.3 is not built, so the section is absent rather than empty.
            Saying so here is the difference between an apprentice knowing the
            pack is incomplete and discovering it at assessment.
          */}
          {unavailable.length > 0 ? (
            <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                {unavailable.length === 1
                  ? `“${unavailable[0].label}” will not be in this pack.`
                  : `${unavailable.length} sections will not be in this pack.`}{" "}
                You can still export — just tell your assessor what is missing.
              </span>
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 py-5">
          {exporter.status === "completed" && exporter.downloadUrl ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  Your pack is ready
                </p>
                <p className="text-xs text-neutral-500">
                  The download link is also in your documents.
                </p>
              </div>
              <Button href={exporter.downloadUrl} startIcon={<Download />}>
                Download pack
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  Export your evidence pack
                </p>
                <p className="text-xs text-neutral-500">
                  {exporter.isBuilding
                    ? "Building your pack. This can take up to a minute."
                    : "One tap. We will compile everything listed above."}
                </p>
              </div>
              <Button
                type="button"
                disabled={!enrolmentId || exporter.isBuilding}
                onClick={() => exporter.start.mutate()}
                startIcon={
                  exporter.isBuilding ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Package />
                  )
                }
              >
                {exporter.isBuilding ? "Building…" : "Export pack"}
              </Button>
            </div>
          )}

          {exporter.status === "failed" || exporter.errorMessage ? (
            <p role="alert" className="text-sm text-danger-600">
              {exporter.errorMessage ??
                "The pack could not be built. Please try again."}
            </p>
          ) : null}

          {!enrolmentId && !summary.isLoading ? (
            <p className="text-sm text-neutral-500">
              You need an active enrolment before you can export a pack.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
