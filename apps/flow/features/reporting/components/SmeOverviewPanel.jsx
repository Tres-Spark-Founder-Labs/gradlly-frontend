"use client";

import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { formatDate } from "@/utils/helper";

import { useSmeOverview } from "../queries/reporting.query";

const APPRENTICE_COLUMNS = [
  {
    key: "learnerName",
    header: "Apprentice",
    primary: true,
    sortable: true,
    cell: (row) => row.learnerName,
  },
  {
    key: "programmeTitle",
    header: "Programme",
    cell: (row) => row.programmeTitle,
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

const OTJ_COLUMNS = [
  {
    key: "apprenticeName",
    header: "Apprentice",
    primary: true,
    cell: (row) => row.apprenticeName,
  },
  {
    key: "loggedDate",
    header: "Logged",
    cell: (row) => formatDate(row.loggedDate),
  },
  {
    key: "minutes",
    header: "Minutes",
    align: "right",
    cell: (row) => row.minutes,
  },
];

function PipelineSummary({ pipeline }) {
  if (!pipeline) return null;

  const items = [
    { label: "None", value: pipeline.none },
    { label: "Draft", value: pipeline.draft },
    { label: "Awaiting signatures", value: pipeline.awaitingSignatures },
    { label: "Signed", value: pipeline.signed },
    { label: "Cancelled", value: pipeline.cancelled },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2.5"
        >
          <p className="text-2xl font-bold tabular-nums text-neutral-900">
            {item.value ?? 0}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function SmeOverviewPanel({ showPipeline = true }) {
  const router = useRouter();
  const { data, isLoading } = useSmeOverview();
  const summary = data?.summary;
  const apprentices = data?.apprentices ?? [];
  const pendingOtj = data?.pendingOtjApprovals ?? [];

  return (
    <div className="space-y-6">
      {showPipeline && summary?.commitmentPipeline ? (
        <Card>
          <CardHeader>
            <p className="eyebrow">Commitments</p>
            <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
              Pipeline status
            </h2>
          </CardHeader>
          <CardContent>
            <PipelineSummary pipeline={summary.commitmentPipeline} />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <p className="eyebrow">Apprentices</p>
          <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
            Active apprentice roster
          </h2>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <DataTable
            columns={APPRENTICE_COLUMNS}
            data={apprentices}
            isLoading={isLoading}
            rowKey={(row) => row.enrolmentId}
            onRowClick={(row) => router.push(`/learners/${row.enrolmentId}`)}
            empty={{
              icon: Users,
              title: "No active apprentices",
              description: "Enrolled apprentices will appear here.",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="eyebrow">OTJ</p>
          <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
            Pending OTJ approvals
          </h2>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <DataTable
            columns={OTJ_COLUMNS}
            data={pendingOtj}
            isLoading={isLoading}
            rowKey={(row) => row.id}
            empty={{
              title: "No pending OTJ approvals",
              description:
                "Off-the-job entries awaiting approval will show here.",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
