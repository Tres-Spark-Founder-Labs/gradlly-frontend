"use client";

import { ArrowRightLeft, Download, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import TextBadge from "@/components/ui/TextBadge";
import { TransferStatusBadge } from "@/features/levy-exchange/components/TransferStatusBadge";
import {
  TRANSFER_DOCUMENT_STATUS_LABELS,
  formatGbpDecimal,
} from "@/features/levy-exchange/constants";
import {
  useRecipientTransfers,
  useTransferDocument,
} from "@/features/levy-exchange/queries/levy-exchange.query";

const isText = (value) => typeof value === "string" && value.trim() !== "";

/**
 * The agreement's state and link, from GET /transfers/:id/document.
 *
 * Labelled by the document's status and nothing more. The API serves each
 * party its own signed copy where one exists, but a transfer completed before
 * migration 1781100000055 serves the recipient the donor's copy, and the DTO
 * does not say which it sent — so nothing here calls the file "your copy".
 */
function AgreementDocument({ transferId }) {
  // Fresh on every mount: the link is presigned and short-lived.
  const documentQuery = useTransferDocument(transferId, { staleTime: 0 });
  const document = documentQuery.data ?? null;

  if (documentQuery.isLoading) {
    return <span className="text-xs text-neutral-400">Loading…</span>;
  }
  if (documentQuery.isError) {
    return documentQuery.error?.status === 404 ? (
      <span className="text-xs text-neutral-500">No agreement recorded</span>
    ) : (
      <span className="text-xs text-danger-600" role="alert">
        {documentQuery.error?.message}
      </span>
    );
  }

  const status = document?.status;
  const statusLabel = isText(status)
    ? (TRANSFER_DOCUMENT_STATUS_LABELS[status] ?? status)
    : null;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {statusLabel ? (
        <span className="text-xs text-neutral-500">{statusLabel}</span>
      ) : null}
      {isText(document?.downloadUrl) ? (
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
      ) : (
        <span className="text-xs text-neutral-400">
          Not available to download yet
        </span>
      )}
    </div>
  );
}

/**
 * F4.2.4 AC3 — the transfer agreements, one per transfer made to this SME.
 *
 * An index: every row links back to its transfer, which keeps the agreement
 * too. Who the transfer is from is the API's `donorOrganisationName`; the
 * parties to a transfer are known to each other, and the row says nothing
 * when the API has no name.
 */
export function TransferAgreementsSection() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useRecipientTransfers({ page });
  const transfers = data?.transfers ?? [];
  const meta = data?.meta ?? null;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-neutral-900">
          Levy transfer agreements
        </h2>
        <p className="text-sm text-neutral-500">
          The agreement for each levy transfer made to your organisation. Each
          one is also on its transfer&rsquo;s page.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading agreements…</p>
        ) : isError ? (
          <p className="text-sm text-danger-600" role="alert">
            {error?.message}
          </p>
        ) : transfers.length === 0 ? (
          <EmptyState
            compact
            icon={ArrowRightLeft}
            title="No transfer agreements"
            description="An agreement appears here once a donor creates a transfer from your confirmed match application."
          />
        ) : (
          <>
            <ul className="divide-y divide-neutral-100">
              {transfers.map((transfer) => {
                const amount = formatGbpDecimal(transfer?.amount);
                const donor = isText(transfer?.donorOrganisationName)
                  ? transfer.donorOrganisationName
                  : null;
                return (
                  <li
                    key={transfer.id}
                    className="flex flex-wrap items-start justify-between gap-3 py-3"
                  >
                    <div className="flex min-w-0 items-start gap-2">
                      <FileText
                        className="mt-0.5 size-4 shrink-0 text-neutral-400"
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-neutral-900">
                          Transfer agreement
                          {donor ? ` — ${donor}` : null}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                          {amount ? <span>{amount}</span> : null}
                          <TransferStatusBadge status={transfer?.status} />
                          {isText(transfer?.id) ? (
                            <Link
                              href={`/levy-exchange/transfers/${transfer.id}`}
                              className="font-medium text-primary-700 hover:underline"
                            >
                              View transfer
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {isText(transfer?.id) ? (
                      <AgreementDocument transferId={transfer.id} />
                    ) : null}
                  </li>
                );
              })}
            </ul>
            {meta?.hasPreviousPage === true || meta?.hasNextPage === true ? (
              <div className="mt-3 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={meta?.hasPreviousPage !== true}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </Button>
                {typeof meta?.page === "number" &&
                typeof meta?.totalPages === "number" ? (
                  <span className="text-xs text-neutral-500">
                    {`Page ${meta.page} of ${meta.totalPages}`}
                  </span>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={meta?.hasNextPage !== true}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
