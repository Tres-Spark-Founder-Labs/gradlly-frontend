"use client";

import { ArrowRightLeft, Download, FileText, PenTool } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { GoBackButton } from "@/components/ui/GoBackButton";
import { PageSubheader } from "@/components/ui/PageSubheader";
import TextBadge from "@/components/ui/TextBadge";

import {
  TRANSFER_DOCUMENT_STATUS_LABELS,
  TRANSFER_PARTY,
  TRANSFER_STATUS_META,
  formatGbpDecimal,
  formatIsoDate,
} from "../constants";
import { SignTransferModal } from "./SignTransferModal";
import { TransferSignatures } from "./TransferSignatures";
import { TransferStatusBadge } from "./TransferStatusBadge";
import {
  useTransfer,
  useTransferDocument,
} from "../queries/levy-exchange.query";

const isText = (value) => typeof value === "string" && value.trim() !== "";

function Field({ label, children }) {
  if (children === null || children === undefined || children === "") {
    return null;
  }
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="text-xs font-medium text-neutral-400">{label}</dt>
      <dd className="text-right text-sm text-neutral-800">{children}</dd>
    </div>
  );
}

/**
 * What the signatures card says when the signed-in user cannot sign. Only
 * the API's `nextParty` decides this; when it is null nothing is claimed.
 */
function waitingText(nextParty) {
  if (nextParty === TRANSFER_PARTY.DONOR) {
    return "Waiting for the donor to sign.";
  }
  if (nextParty === TRANSFER_PARTY.RECIPIENT) {
    return "Your organisation's turn. The assigned signer, or an owner or admin, can sign.";
  }
  return null;
}

/**
 * One transfer as the recipient sees it: the agreement document (F4.2.4 AC3),
 * both signature slots, and the signing action when — and only when — the
 * API's `actionRequired` says this user can sign now. That signal already
 * applies the donor-first order and the signer rule; `status` alone would
 * invite a signature the API refuses.
 */
export function TransferDetailView({ transferId }) {
  const [signing, setSigning] = useState(false);
  const transferQuery = useTransfer(transferId);
  const transfer = transferQuery.data ?? null;

  // The download link is presigned and short-lived, so the document is
  // fetched fresh on every mount rather than served from a stale cache.
  const documentQuery = useTransferDocument(transferId, {
    enabled: !!transfer,
    staleTime: 0,
  });
  const document = documentQuery.data ?? null;

  if (transferQuery.isLoading) {
    return (
      <div className="space-y-4">
        <GoBackButton />
        <p className="text-sm text-neutral-500">Loading transfer…</p>
      </div>
    );
  }

  if (transferQuery.isError || !transfer) {
    const notFound = transferQuery.error?.status === 404;
    return (
      <div className="space-y-4">
        <GoBackButton />
        <EmptyState
          icon={ArrowRightLeft}
          title={
            notFound ? "Transfer not found" : "Could not load this transfer"
          }
          description={
            notFound
              ? "No transfer with this id is visible to your organisation."
              : transferQuery.error?.message
          }
        />
      </div>
    );
  }

  const amount = formatGbpDecimal(transfer.amount);
  // The API's name for the donor. The parties to a transfer are known to each
  // other (the agreement prints it); null only when the API has none.
  const donorName = isText(transfer.donorOrganisationName)
    ? transfer.donorOrganisationName
    : null;
  const statusMeta = isText(transfer.status)
    ? (TRANSFER_STATUS_META[transfer.status] ?? null)
    : null;
  const canSign = transfer.actionRequired === true;
  const waiting = canSign ? null : waitingText(transfer.nextParty);

  const documentStatus = document?.status;
  const documentLabel = isText(documentStatus)
    ? (TRANSFER_DOCUMENT_STATUS_LABELS[documentStatus] ?? documentStatus)
    : null;

  return (
    <div className="space-y-6">
      <GoBackButton />
      <PageSubheader
        icon={ArrowRightLeft}
        eyebrow="Levy Exchange"
        title={
          amount
            ? `${amount} transfer${donorName ? ` from ${donorName}` : ""}`
            : donorName
              ? `Transfer from ${donorName}`
              : "Transfer"
        }
        description={statusMeta?.detail ?? undefined}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-neutral-900">
              Agreement
            </h2>
            <p className="text-sm text-neutral-500">
              The transfer agreement both parties sign. Until then this is the
              unsigned agreement; once both have signed, the signed one.
            </p>
          </CardHeader>
          <CardContent>
            {documentQuery.isLoading ? (
              <p className="text-sm text-neutral-500">Loading document…</p>
            ) : documentQuery.isError ? (
              <p className="text-sm text-danger-600" role="alert">
                {documentQuery.error?.message}
              </p>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm text-neutral-800">
                  <FileText className="size-4 text-neutral-400" aria-hidden />
                  {documentLabel ?? "Agreement"}
                </span>
                {isText(document?.downloadUrl) ? (
                  <TextBadge
                    variant="solid"
                    color="green"
                    size="sm"
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-neutral-900">
              Signatures
            </h2>
            <p className="text-sm text-neutral-500">
              The donor signs first, then the recipient.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <TransferSignatures
                signatures={transfer.signatures}
                nextParty={transfer.nextParty}
              />
              {canSign ? (
                <Button
                  type="button"
                  color="green"
                  size="sm"
                  startIcon={<PenTool className="size-4" />}
                  onClick={() => setSigning(true)}
                >
                  Sign as recipient
                </Button>
              ) : waiting ? (
                <p className="text-sm text-neutral-500">{waiting}</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-neutral-900">Details</h2>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-neutral-100">
            <Field label="From">{donorName}</Field>
            <Field label="Status">
              <TransferStatusBadge status={transfer.status} />
            </Field>
            <Field label="Amount">{amount}</Field>
            <Field label="ESFA reference">
              {isText(transfer.esfaTransferReference)
                ? transfer.esfaTransferReference
                : null}
            </Field>
            <Field label="Start date">
              {formatIsoDate(transfer.startDate)}
            </Field>
            <Field label="Expiry date">
              {formatIsoDate(transfer.expiryDate)}
            </Field>
            <Field label="Confirmed">
              {formatIsoDate(transfer.confirmedAt)}
            </Field>
            <Field label="Created">{formatIsoDate(transfer.createdAt)}</Field>
            <Field label="Last updated">
              {formatIsoDate(transfer.updatedAt)}
            </Field>
          </dl>
        </CardContent>
      </Card>

      <SignTransferModal
        transfer={transfer}
        open={signing}
        onClose={() => setSigning(false)}
      />
    </div>
  );
}
