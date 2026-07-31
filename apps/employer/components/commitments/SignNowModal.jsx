"use client";
import { useRef, useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { Modal } from "@/components/ui/Modal";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import {
  useCommitmentStatement,
  useSignCommitmentStatement,
} from "@/features/commitments/queries/commitments.query";
import { renderStatementText } from "@/features/commitments/utils/statement-text";
import {
  STORAGE_CATEGORY,
  dataUrlToFile,
  uploadFileForKey,
} from "@/features/storage/services/storage.service";
import { toastError } from "@/hooks/useToast";
import { getFullName } from "@/utils/helper";

/** The party an employer signs as. Matches TripartiteParty on the API. */
const EMPLOYER_PARTY = "employer_manager";

function DrawCanvas({ canvasRef, onHasDrawing }) {
  const drawing = useRef(false);

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onHasDrawing(false);
  };

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches?.[0];
    return {
      x: (touch?.clientX ?? e.clientX) - rect.left,
      y: (touch?.clientY ?? e.clientY) - rect.top,
    };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = pos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
    ctx.lineTo(x, y);
    ctx.stroke();
    onHasDrawing(true);
  };

  const end = () => {
    drawing.current = false;
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={520}
        height={160}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        className="w-full rounded-xl touch-none cursor-crosshair"
        style={{ backgroundColor: "#fff", border: `1px solid ${T.border}` }}
      />
      <button
        type="button"
        onClick={clear}
        className="text-xs font-semibold hover:underline"
        style={{ color: T.muted }}
      >
        Clear
      </button>
    </div>
  );
}

/** Renders a typed name to a PNG, so both paths produce the same evidence. */
function typedSignatureToDataUrl(name) {
  const canvas = document.createElement("canvas");
  canvas.width = 520;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111827";
  ctx.font = "italic 48px Georgia, serif";
  ctx.textBaseline = "middle";
  ctx.fillText(name, 20, 80);
  return canvas.toDataURL("image/png");
}

export function SignNowModal({ open, onClose, statement }) {
  const { user } = useAuthUser();
  const canvasRef = useRef(null);
  const [sigTab, setSigTab] = useState("draw");
  const [agreed, setAgreed] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [hasDrawing, setHasDrawing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const statementId = statement?.statementId ?? statement?.id ?? null;
  const apprenticeName =
    statement?.apprenticeName ??
    statement?.apprentice?.name ??
    "this apprentice";

  /**
   * F1.3.2 AC1 — "employer can view the full commitment statement text in the
   * portal before signing".
   *
   * The text used to be a hardcoded `DOC` constant naming "Midlands
   * Engineering Ltd" and "Amara Diallo" — a fixed sample shown to every
   * employer, for every apprentice, regardless of what their statement
   * actually said. On the screen where they agree to be bound by it.
   */
  const { data: full, isLoading: loadingText } = useCommitmentStatement(
    statementId,
    { enabled: open && !!statementId },
  );

  const { mutateAsync: signStatement, isPending: signing } =
    useSignCommitmentStatement();

  const signatoryName = getFullName(user) || user?.email || "the signatory";

  /**
   * The confirmation checkbox gates *both* paths.
   *
   * It previously applied only to the typed-name tab, so a drawn signature
   * could be submitted without the signatory confirming they had read
   * anything — on a document the PRD describes as legally binding.
   */
  const hasMark = sigTab === "draw" ? hasDrawing : typedName.trim().length > 0;
  const canSign = hasMark && agreed && !!statementId && !signing && !uploading;

  const reset = () => {
    setSigTab("draw");
    setAgreed(false);
    setTypedName("");
    setHasDrawing(false);
  };

  const handleClose = () => {
    if (signing || uploading) return;
    reset();
    onClose();
  };

  /**
   * Signs for real.
   *
   * This was `setSigned(true)` followed by a 900ms `setTimeout` and a success
   * toast. No request was made: the employer drew their signature, ticked the
   * confirmation, saw "Commitment statement signed", and nothing was recorded
   * anywhere — no signature row, no PDF, no audit trail, and the other two
   * parties were never told.
   */
  const handleSign = async () => {
    if (!canSign) return;

    try {
      setUploading(true);
      const dataUrl =
        sigTab === "draw"
          ? canvasRef.current?.toDataURL("image/png")
          : typedSignatureToDataUrl(typedName.trim());

      if (!dataUrl) {
        throw new Error("Could not read the signature. Please try again.");
      }

      // The API stores a storage *key*, not a data URL — the image is
      // evidence attached to the signature record alongside the IP and
      // timestamp (AC3).
      const signatureImageKey = await uploadFileForKey({
        file: dataUrlToFile(dataUrl, `signature-${statementId}.png`),
        category: STORAGE_CATEGORY.SIGNATURE,
      });
      setUploading(false);

      await signStatement({
        id: statementId,
        party: EMPLOYER_PARTY,
        signatureImageKey,
      });
      reset();
      onClose();
    } catch (error) {
      setUploading(false);
      toastError(error?.message || "Could not sign the statement.");
    }
  };

  const busyLabel = uploading
    ? "Uploading signature…"
    : signing
      ? "Signing…"
      : "Sign statement";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title="Sign commitment statement"
      description={`For ${apprenticeName}`}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={signing || uploading}
            className="px-4 py-2 rounded-xl text-sm font-semibold border hover:opacity-75 transition-opacity disabled:opacity-40"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSign}
            disabled={!canSign}
            title={
              !hasMark
                ? "Draw or type your signature first"
                : !agreed
                  ? "Confirm you have read the statement"
                  : undefined
            }
            className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            {busyLabel}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* AC1 — the real statement text, before signing. */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: T.subtle }}>
            Commitment statement{full?.version ? ` · v${full.version}` : ""}
          </p>
          <div
            className="rounded-xl px-4 py-3 max-h-56 overflow-y-auto text-xs whitespace-pre-wrap"
            style={{
              backgroundColor: T.card,
              border: `1px solid ${T.border}`,
              color: T.subtle,
            }}
          >
            {loadingText
              ? "Loading the statement…"
              : renderStatementText(full?.content)}
          </div>
        </div>

        {/* AC2 — drawn signature or typed name. */}
        <div
          className="inline-flex rounded-xl overflow-hidden"
          style={{ border: `1px solid ${T.border}` }}
        >
          {[
            ["draw", "Draw signature"],
            ["type", "Type name"],
          ].map(([key, label], i) => (
            <button
              key={key}
              type="button"
              onClick={() => setSigTab(key)}
              className="px-4 py-2 text-xs font-semibold transition-all"
              style={{
                backgroundColor: sigTab === key ? T.ink : "transparent",
                color: sigTab === key ? "#fff" : T.subtle,
                borderRight: i === 0 ? `1px solid ${T.border}` : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {sigTab === "draw" ? (
          <DrawCanvas canvasRef={canvasRef} onHasDrawing={setHasDrawing} />
        ) : (
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Type your full name"
            className="w-full rounded-xl px-3 py-2.5 text-base border focus:outline-none"
            style={{
              borderColor: T.border,
              backgroundColor: T.surface,
              color: T.ink,
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
            }}
          />
        )}

        {/* AC2 — confirmation checkbox, required on both paths. */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded"
            style={{ accentColor: T.blue }}
          />
          <span className="text-xs" style={{ color: T.subtle }}>
            {/* The signatory is the signed-in user. This was hardcoded to
                "Sarah Rahman", so every employer signed under one name. */}
            I, <strong style={{ color: T.ink }}>{signatoryName}</strong>,
            confirm I have read and understood this commitment statement and
            agree to be bound by it.
          </span>
        </label>

        <p className="text-[11px]" style={{ color: T.muted }}>
          Your signature is recorded with the date, time and IP address it was
          made from, and a signed PDF is generated immediately.
        </p>
      </div>
    </Modal>
  );
}
