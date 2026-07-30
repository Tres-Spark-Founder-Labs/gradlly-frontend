"use client";
import { ChevronDown, Download } from "lucide-react";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { SignaturePad } from "@/features/esignature/components/SignaturePad";
import {
  useLevyTransfers,
  useSignTransfer,
  useSubmitTransferToDas,
  useTransferDocument,
} from "@/features/levy/queries/levy.query";
import { useUploadFileForKey } from "@/features/storage/queries/storage.query";
import {
  dataUrlToFile,
  STORAGE_CATEGORY,
} from "@/features/storage/services/storage.service";

const fmt = (n) => `£${Number(n ?? 0).toLocaleString("en-GB")}`;

const STATUS_LABEL = {
  draft: "Draft",
  pending_signatures: "Awaiting signatures",
  pending_esfa: "Ready to submit to DAS",
  confirmed: "Confirmed",
  active: "Active",
  failed: "Failed",
};

const STATUS_COLOR = {
  draft: T.muted,
  pending_signatures: T.amber,
  pending_esfa: T.blue,
  confirmed: T.green,
  active: T.green,
  failed: T.red,
};

function TransferRow({ transfer }) {
  const [open, setOpen] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const signTransfer = useSignTransfer(transfer.id);
  const submitToDas = useSubmitTransferToDas(transfer.id);
  const uploadSignature = useUploadFileForKey({
    category: STORAGE_CATEGORY.SIGNATURE,
  });
  const { data: document } = useTransferDocument(transfer.id, {
    enabled: open,
  });

  const handleSign = async () => {
    if (!signatureDataUrl) return;
    const file = dataUrlToFile(signatureDataUrl, `transfer-${transfer.id}.png`);
    const signatureImageKey = await uploadSignature.upload(file);
    await signTransfer.mutateAsync({ party: "donor", signatureImageKey });
    setSignatureDataUrl(null);
  };

  const statusColor = STATUS_COLOR[transfer.status] ?? T.muted;

  return (
    <div style={{ borderTop: `1px solid ${T.border}` }}>
      <div className="flex items-start gap-3.5 px-5 py-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-bold" style={{ color: T.ink }}>
                {fmt(transfer.amount)}
                {transfer.esfaTransferReference &&
                  ` · ${transfer.esfaTransferReference}`}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
                Created{" "}
                {new Date(transfer.createdAt).toLocaleDateString("en-GB")}
                {transfer.startDate &&
                  ` · starts ${new Date(transfer.startDate).toLocaleDateString("en-GB")}`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${statusColor}22`,
                  color: statusColor,
                }}
              >
                {STATUS_LABEL[transfer.status] ?? transfer.status}
              </span>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1 text-[11px] font-semibold hover:opacity-70"
                style={{ color: T.muted }}
              >
                {open ? "Less" : "Details"}
                <ChevronDown
                  className="h-3 w-3 transition-transform"
                  style={{ transform: open ? "rotate(180deg)" : "" }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="px-5 pb-4 space-y-3"
          style={{ animation: "slide-up 250ms var(--ease-out) both" }}
        >
          {transfer.status === "pending_signatures" && (
            <div
              className="rounded-xl p-3 space-y-2"
              style={{
                backgroundColor: T.card,
                border: `1px solid ${T.border}`,
              }}
            >
              <p className="text-[11px] font-semibold" style={{ color: T.ink }}>
                Sign as donor
              </p>
              <SignaturePad
                onCapture={setSignatureDataUrl}
                disabled={signTransfer.isPending}
              />
              <button
                type="button"
                onClick={handleSign}
                disabled={
                  !signatureDataUrl ||
                  uploadSignature.isUploading ||
                  signTransfer.isPending
                }
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 disabled:opacity-40"
                style={{ backgroundColor: T.green, color: "#fff" }}
              >
                {uploadSignature.isUploading || signTransfer.isPending
                  ? "Signing…"
                  : "Confirm signature"}
              </button>
            </div>
          )}

          {transfer.status === "pending_esfa" && (
            <button
              type="button"
              onClick={() => submitToDas.mutate()}
              disabled={submitToDas.isPending}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 disabled:opacity-40"
              style={{ backgroundColor: T.blue, color: "#fff" }}
            >
              {submitToDas.isPending ? "Submitting…" : "Submit to ESFA DAS →"}
            </button>
          )}

          {document?.downloadUrl && (
            <a
              href={document.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold hover:underline"
              style={{ color: T.blue }}
            >
              <Download className="h-3 w-3" /> Download agreement
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function ActiveTransfers() {
  const { data, isLoading } = useLevyTransfers({ role: "donor" });
  const transfers = data?.transfers ?? [];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div
        className="px-5 py-4"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <p className="text-sm font-bold" style={{ color: T.ink }}>
          Transfers
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
          {isLoading ? "Loading…" : `${transfers.length} total`}
        </p>
      </div>
      {!isLoading && transfers.length === 0 && (
        <p className="px-5 py-6 text-xs" style={{ color: T.muted }}>
          No transfers yet — confirm an SME match application to create one.
        </p>
      )}
      {transfers.map((t) => (
        <TransferRow key={t.id} transfer={t} />
      ))}
    </div>
  );
}
