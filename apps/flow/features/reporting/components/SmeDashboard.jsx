"use client";

import { Banknote, CalendarCheck, ClipboardCheck, Users } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { cn, formatDate } from "@/utils/helper";

import {
  COMMITMENT_PIPELINE_LABELS,
  FUNDING_CLAIM_META,
  SME_KPI_LINKS,
} from "../constants";
import { SmeApprenticeRoster } from "./SmeApprenticeRoster";
import { useSmeOverview } from "../queries/reporting.query";

function KpiTile({ href, icon: Icon, label, value, tone, isLoading }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            tone,
          )}
        >
          <Icon className="size-4.5" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums text-neutral-900">
        {isLoading ? "—" : (value ?? 0)}
      </p>
      <p className="mt-0.5 text-xs font-medium text-neutral-500 group-hover:text-neutral-700">
        {label}
      </p>
    </Link>
  );
}

function CommitmentPipelineBar({ pipeline }) {
  if (!pipeline) return null;
  const entries = Object.entries(COMMITMENT_PIPELINE_LABELS);
  const total = entries.reduce((sum, [key]) => sum + (pipeline[key] ?? 0), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            Commitment pipeline
          </h2>
          <Link
            href="/commitment-statements"
            className="text-xs font-medium text-primary-700 hover:underline"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {entries.map(([key, label]) => (
            <div
              key={key}
              className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2"
            >
              <p className="text-lg font-bold tabular-nums text-neutral-900">
                {pipeline[key] ?? 0}
              </p>
              <p className="text-xs text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
        {total === 0 ? (
          <p className="text-xs text-neutral-400">
            No commitment statements yet.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

const PENDING_OTJ_COLUMNS = [
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

export function SmeDashboard() {
  const { data, isLoading } = useSmeOverview();
  const summary = data?.summary;
  const pendingOtj = data?.pendingOtjApprovals ?? [];

  const funding = FUNDING_CLAIM_META[summary?.fundingClaimStatus] ?? null;

  return (
    <div className="space-y-6">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          href={SME_KPI_LINKS.apprentices}
          icon={Users}
          label="Active apprentices"
          value={summary?.activeApprenticeCount}
          tone="bg-primary-50 text-primary-600"
          isLoading={isLoading}
        />
        <KpiTile
          href={SME_KPI_LINKS.approvals}
          icon={ClipboardCheck}
          label="Pending OTJ approvals"
          value={summary?.pendingOtjApprovalCount}
          tone="bg-amber-50 text-amber-600"
          isLoading={isLoading}
        />
        <KpiTile
          href={SME_KPI_LINKS.reviews}
          icon={CalendarCheck}
          label="Reviews due this month"
          value={summary?.reviewsDueThisMonthCount}
          tone="bg-blue-50 text-blue-600"
          isLoading={isLoading}
        />
        <KpiTile
          href={SME_KPI_LINKS.funding}
          icon={Banknote}
          label={funding?.label ?? "Funding status"}
          value={
            funding ? (
              <TextBadge variant="light" color={funding.color} size="xs">
                {funding.label}
              </TextBadge>
            ) : (
              "—"
            )
          }
          tone="bg-green-50 text-green-600"
          isLoading={isLoading}
        />
      </div>

      <CommitmentPipelineBar pipeline={summary?.commitmentPipeline} />

      {/* Needs you: pending OTJ approvals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">
              Needs your approval
            </h2>
            <Link
              href={SME_KPI_LINKS.approvals}
              className="text-xs font-medium text-primary-700 hover:underline"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <DataTable
            columns={PENDING_OTJ_COLUMNS}
            data={pendingOtj}
            isLoading={isLoading}
            rowKey={(row) => row.id}
            empty={{
              icon: ClipboardCheck,
              title: "Nothing waiting on you",
              description:
                "Off-the-job entries awaiting approval will appear here.",
            }}
          />
        </CardContent>
      </Card>

      {/* Cohort roster — shared with /learners so the two cannot disagree. */}
      <SmeApprenticeRoster />
    </div>
  );
}
