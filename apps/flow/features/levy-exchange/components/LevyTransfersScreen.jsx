"use client";

import { ArrowRightLeft, PenTool } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";

import { formatGbpDecimal, formatIsoDate } from "../constants";
import { TransferStatusBadge } from "./TransferStatusBadge";
import { useRecipientTransfers } from "../queries/levy-exchange.query";

const isText = (value) => typeof value === "string" && value.trim() !== "";

/**
 * The signature column, from the API's own fields: `actionRequired` when the
 * signed-in user can sign now, otherwise a count of the slots the API says
 * are signed. Nothing here is inferred from the status.
 */
function signatureSummary(transfer) {
  if (transfer?.actionRequired === true) {
    return { text: "Your signature needed", color: "amber", icon: PenTool };
  }
  const slots = Array.isArray(transfer?.signatures) ? transfer.signatures : [];
  if (slots.length === 0) return null;
  const signed = slots.filter((slot) => slot?.signed === true).length;
  return {
    text: `${signed} of ${slots.length} signed`,
    color: signed === slots.length ? "green" : "gray",
    icon: null,
  };
}

/**
 * The transfers made to this SME (GET /transfers?role=recipient), as the API
 * reports them: its six statuses, its signature slots, its dates.
 *
 * F4.2.4 AC3 puts the signed agreement in the recipient's document library;
 * until this screen existed FlowPortal had no way to reach it.
 */
export function LevyTransfersScreen() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useRecipientTransfers({ page });

  const transfers = data?.transfers ?? [];
  const meta = data?.meta ?? null;
  const awaitingYou = transfers.filter((t) => t?.actionRequired === true);

  const columns = [
    {
      key: "amount",
      header: "Amount",
      primary: true,
      cell: (transfer) => {
        const amount = formatGbpDecimal(transfer?.amount);
        const reference = transfer?.esfaTransferReference;
        const donor = transfer?.donorOrganisationName;
        return (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900">
              {amount ?? "Transfer"}
            </p>
            {isText(donor) ? (
              <p className="text-xs text-neutral-600">From {donor}</p>
            ) : null}
            {isText(reference) ? (
              <p className="text-xs text-neutral-500">ESFA ref {reference}</p>
            ) : null}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (transfer) => <TransferStatusBadge status={transfer?.status} />,
    },
    {
      key: "signatures",
      header: "Signatures",
      cell: (transfer) => {
        const summary = signatureSummary(transfer);
        if (!summary) return null;
        const Icon = summary.icon;
        return (
          <TextBadge
            variant="light"
            color={summary.color}
            size="xs"
            startIcon={Icon ? <Icon className="size-3" aria-hidden /> : null}
          >
            {summary.text}
          </TextBadge>
        );
      },
    },
    {
      key: "startDate",
      header: "Start",
      hideOnMobile: true,
      cell: (transfer) => formatIsoDate(transfer?.startDate),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      sortValue: (transfer) =>
        isText(transfer?.createdAt) ? new Date(transfer.createdAt) : null,
      cell: (transfer) => formatIsoDate(transfer?.createdAt),
    },
    {
      key: "view",
      header: "",
      align: "right",
      mobileLabel: "Agreement",
      cell: (transfer) =>
        isText(transfer?.id) ? (
          <TextBadge
            variant="outline"
            color="blue"
            size="xs"
            href={`/levy-exchange/transfers/${transfer.id}`}
          >
            View
          </TextBadge>
        ) : null,
    },
  ];

  return (
    <div className="space-y-4">
      {awaitingYou.length > 0 ? (
        <p
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="status"
        >
          {awaitingYou.length === 1
            ? "One agreement is waiting for your signature."
            : `${awaitingYou.length} agreements are waiting for your signature.`}
        </p>
      ) : null}

      {isError ? (
        <p className="text-sm text-danger-600" role="alert">
          {error?.message}
        </p>
      ) : null}

      <DataTable
        columns={columns}
        data={transfers}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        empty={{
          icon: ArrowRightLeft,
          title: "No transfers yet",
          description:
            "A transfer appears here once a donor creates one from your confirmed match application.",
        }}
      />
    </div>
  );
}
