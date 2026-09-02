"use client";

import { Users } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { formatDate } from "@/utils/helper";

import { useSmeOverview } from "../queries/reporting.query";

/**
 * F4.3.1 — the SME's apprentice roster.
 *
 * Extracted from `SmeDashboard` so it can serve two screens without being
 * written twice: the dashboard shows it beneath the KPIs, and `/learners` shows
 * it on its own. Both read `/reporting/sme-overview`, so the roster on the
 * dashboard and the roster on the learners page cannot disagree — which they
 * could if the second one had been built against a different endpoint.
 *
 * `heading` is a prop rather than a constant because the two contexts want
 * different framing: "Your apprentices" reads correctly as a section inside a
 * dashboard, and reads oddly as the whole content of a page already titled
 * "Apprentices".
 */
const APPRENTICE_COLUMNS = [
  {
    key: "learnerName",
    header: "Apprentice",
    primary: true,
    sortable: true,
    cell: (row) => (
      <Link
        href={`/learners/${row.enrolmentId}`}
        className="font-medium text-primary-700 hover:underline"
      >
        {row.learnerName}
      </Link>
    ),
  },
  {
    key: "programmeTitle",
    header: "Programme",
    cell: (row) => row.programmeTitle ?? "—",
  },
  {
    key: "otjPercent",
    header: "OTJ %",
    align: "right",
    sortable: true,
    cell: (row) =>
      row.otjPercent !== null && row.otjPercent !== undefined
        ? `${row.otjPercent.toFixed(1)}%`
        : "—",
  },
  {
    key: "nextReviewDate",
    header: "Next review",
    cell: (row) => (row.nextReviewDate ? formatDate(row.nextReviewDate) : "—"),
  },
  {
    key: "statusBadge",
    header: "Status",
    cell: (row) => (
      <TextBadge variant="light" color="gray" size="xs">
        {row.statusBadge?.replace(/_/g, " ") ?? "—"}
      </TextBadge>
    ),
  },
];

export function SmeApprenticeRoster({ heading = "Your apprentices" }) {
  const { data, isLoading } = useSmeOverview();
  const apprentices = data?.apprentices ?? [];

  return (
    <Card>
      {heading ? (
        <CardHeader>
          <h2 className="text-sm font-semibold text-neutral-900">{heading}</h2>
        </CardHeader>
      ) : null}
      <CardContent className="p-0 sm:p-0">
        <DataTable
          columns={APPRENTICE_COLUMNS}
          data={apprentices}
          isLoading={isLoading}
          rowKey={(row) => row.enrolmentId}
          empty={{
            icon: Users,
            title: "No active apprentices",
            description: "Enrol an apprentice from the AI programme catalogue.",
          }}
        />
      </CardContent>
    </Card>
  );
}
