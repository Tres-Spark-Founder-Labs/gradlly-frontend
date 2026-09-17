"use client";

import { Download, ExternalLink, GraduationCap } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import TextBadge from "@/components/ui/TextBadge";
import { useSmeOverview } from "@/features/reporting/queries/reporting.query";
import { formatDate } from "@/utils/helper";

import { LEARNER_DOCUMENT_TYPE_LABELS } from "../constants";
import { useLearnerDocuments } from "../queries/documents.query";

const isText = (value) => typeof value === "string" && value.trim() !== "";

/**
 * How a document opens, in the order the DTO offers it: the presigned
 * `downloadUrl` for a stored file, `externalUrl` for link evidence, and
 * otherwise a plain statement rather than a control that cannot work.
 */
function DocumentAction({ document }) {
  if (isText(document?.downloadUrl)) {
    return (
      <TextBadge
        variant="solid"
        color="green"
        size="xs"
        href={document.downloadUrl}
        external
        startIcon={<Download className="size-3" aria-hidden />}
      >
        Download
      </TextBadge>
    );
  }
  if (isText(document?.externalUrl)) {
    return (
      <TextBadge
        variant="outline"
        color="blue"
        size="xs"
        href={document.externalUrl}
        external
        startIcon={<ExternalLink className="size-3" aria-hidden />}
      >
        Open link
      </TextBadge>
    );
  }
  return (
    <span className="text-xs text-neutral-400">
      {isText(document?.storageKey)
        ? "No download link issued"
        : "No file attached"}
    </span>
  );
}

/** One apprentice's documents, in the order the API returns them (newest first). */
function ApprenticeDocumentGroup({ apprentice }) {
  const { data, isLoading, isError, error } = useLearnerDocuments(
    apprentice.enrolmentId,
  );
  const documents = data ?? [];

  return (
    <section className="py-4 first:pt-0 last:pb-0">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-neutral-900">
          {isText(apprentice?.learnerName)
            ? apprentice.learnerName
            : "Apprentice"}
        </h3>
        {isText(apprentice?.programmeTitle) ? (
          <p className="text-xs text-neutral-500">
            {apprentice.programmeTitle}
          </p>
        ) : null}
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Loading documents…</p>
      ) : isError ? (
        <p className="text-sm text-danger-600" role="alert">
          {error?.status === 404
            ? "This apprentice’s profile is not available to your organisation."
            : error?.message}
        </p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No signed commitment statement, completed review or accepted evidence
          on this enrolment yet.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-100 rounded-lg border border-neutral-100">
          {documents.map((document) => {
            const type = document?.type;
            const typeLabel = isText(type)
              ? (LEARNER_DOCUMENT_TYPE_LABELS[type] ?? type)
              : null;
            return (
              <li
                key={document.id}
                className="flex flex-wrap items-center justify-between gap-3 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-neutral-800">
                    {isText(document?.title) ? document.title : "Document"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {isText(document?.documentAt)
                      ? formatDate(document.documentAt)
                      : "Date not recorded"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {typeLabel ? (
                    <TextBadge variant="light" color="gray" size="xs">
                      {typeLabel}
                    </TextBadge>
                  ) : null}
                  <DocumentAction document={document} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/**
 * F1.2.2 AC5's documents for each apprentice, grouped by apprentice.
 *
 * The apprentice list is the SME roster (GET /reporting/sme-overview), which
 * holds active enrolments only — the section says so rather than implying the
 * list is complete. Each group reads its own profile.
 */
export function ApprenticeDocumentsSection() {
  const { data, isLoading, isError, error } = useSmeOverview();
  const apprentices = (
    Array.isArray(data?.apprentices) ? data.apprentices : []
  ).filter((apprentice) => isText(apprentice?.enrolmentId));

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-neutral-900">
          Apprentice documents
        </h2>
        <p className="text-sm text-neutral-500">
          Signed commitment statements, completed review records and accepted
          evidence for each apprentice with an active enrolment.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading apprentices…</p>
        ) : isError ? (
          <p className="text-sm text-danger-600" role="alert">
            {error?.message}
          </p>
        ) : apprentices.length === 0 ? (
          <EmptyState
            compact
            icon={GraduationCap}
            title="No active apprentices"
            description="Documents are listed per apprentice, and your organisation has no active enrolments."
          />
        ) : (
          <div className="divide-y divide-neutral-100">
            {apprentices.map((apprentice) => (
              <ApprenticeDocumentGroup
                key={apprentice.enrolmentId}
                apprentice={apprentice}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
