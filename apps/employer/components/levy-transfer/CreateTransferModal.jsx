"use client";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { Modal } from "@/components/ui/Modal";
import { SignaturePad } from "@/features/esignature/components/SignaturePad";
import {
  useCreateTransferFromMatch,
  useSignTransfer,
} from "@/features/levy/queries/levy.query";
import { useUploadFileForKey } from "@/features/storage/queries/storage.query";
import {
  dataUrlToFile,
  STORAGE_CATEGORY,
} from "@/features/storage/services/storage.service";

const fmt = (n) => `£${Number(n).toLocaleString("en-GB")}`;

/**
 * Creates a levy transfer from a confirmed match application, then walks the
 * donor through signing it. Recipient still has to sign their side (on
 * FlowPortal) and the donor still has to submit to DAS once both signatures
 * are in — those steps continue on the transfer's own page in
 * ActiveTransfers/HistoryDrawer once created.
 */
export function CreateTransferModal({ open, application, onClose }) {
  const [recipientSignerUserId, setRecipientSignerUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [transfer, setTransfer] = useState(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);

  const createTransfer = useCreateTransferFromMatch();
  const uploadSignature = useUploadFileForKey({
    category: STORAGE_CATEGORY.SIGNATURE,
  });
  const signTransfer = useSignTransfer(transfer?.id);

  const reset = () => {
    setRecipientSignerUserId("");
    setStartDate("");
    setTransfer(null);
    setSignatureDataUrl(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleCreate = async () => {
    if (!recipientSignerUserId.trim()) return;
    const created = await createTransfer.mutateAsync({
      matchApplicationId: application.id,
      recipientSignerUserId: recipientSignerUserId.trim(),
      startDate: startDate || undefined,
    });
    setTransfer(created);
  };

  const handleSign = async () => {
    if (!signatureDataUrl || !transfer) return;
    const file = dataUrlToFile(signatureDataUrl, `transfer-${transfer.id}.png`);
    const signatureImageKey = await uploadSignature.upload(file);
    await signTransfer.mutateAsync({ party: "donor", signatureImageKey });
    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      size="md"
      title="Create levy transfer"
      description={
        application
          ? `Confirmed match · ${fmt(application.requestedAmount)}`
          : ""
      }
      footer={
        !transfer ? (
          <>
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 rounded-xl text-sm font-semibold border hover:opacity-75 transition-opacity"
              style={{ borderColor: T.border, color: T.subtle }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={
                !recipientSignerUserId.trim() || createTransfer.isPending
              }
              className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-all disabled:opacity-40"
              style={{ backgroundColor: T.blue, color: "#fff" }}
            >
              {createTransfer.isPending ? "Creating…" : "Create transfer"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 rounded-xl text-sm font-semibold border hover:opacity-75 transition-opacity"
              style={{ borderColor: T.border, color: T.subtle }}
            >
              Sign later
            </button>
            <button
              type="button"
              onClick={handleSign}
              disabled={
                !signatureDataUrl ||
                uploadSignature.isUploading ||
                signTransfer.isPending
              }
              className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-all disabled:opacity-40"
              style={{ backgroundColor: T.green, color: "#fff" }}
            >
              {uploadSignature.isUploading || signTransfer.isPending
                ? "Signing…"
                : "Sign as donor"}
            </button>
          </>
        )
      }
    >
      {!transfer && application && (
        <div className="space-y-4">
          <div
            className="rounded-xl p-3.5 space-y-1.5"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
          >
            <div className="flex gap-2 text-[11px]">
              <span
                className="w-32 shrink-0 font-semibold"
                style={{ color: T.muted }}
              >
                Amount
              </span>
              <span style={{ color: T.ink }}>
                {fmt(application.requestedAmount)}
              </span>
            </div>
            <div className="flex gap-2 text-[11px]">
              <span
                className="w-32 shrink-0 font-semibold"
                style={{ color: T.muted }}
              >
                Match id
              </span>
              <span className="font-mono" style={{ color: T.ink }}>
                {application.id}
              </span>
            </div>
          </div>

          <div>
            <label
              className="block text-[10px] font-semibold mb-1"
              style={{ color: T.muted }}
            >
              Recipient signatory — user ID
            </label>
            <input
              type="text"
              value={recipientSignerUserId}
              onChange={(e) => setRecipientSignerUserId(e.target.value)}
              placeholder="Ask your SME contact for their Gradlly user ID"
              className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none"
              style={{
                borderColor: T.border,
                color: T.ink,
                backgroundColor: T.surface,
              }}
            />
            <p className="text-[11px] mt-1" style={{ color: T.muted }}>
              The person at the SME who will countersign the transfer agreement.
            </p>
          </div>

          <div>
            <label
              className="block text-[10px] font-semibold mb-1"
              style={{ color: T.muted }}
            >
              Planned start date (optional)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none"
              style={{
                borderColor: T.border,
                color: T.ink,
                backgroundColor: T.surface,
              }}
            />
          </div>
        </div>
      )}

      {transfer && (
        <div className="space-y-4">
          <p className="text-xs" style={{ color: T.subtle }}>
            Transfer created. We&apos;re preparing the agreement PDF — sign
            below once it&apos;s ready (retry signing if it says the agreement
            isn&apos;t ready yet).
          </p>
          <SignaturePad
            onCapture={setSignatureDataUrl}
            disabled={signTransfer.isPending}
          />
        </div>
      )}
    </Modal>
  );
}
