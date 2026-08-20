"use client";

import { PenLine, Keyboard } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { SignaturePad } from "./SignaturePad";

/**
 * F3.4.1 AC3 — "E-signature is captured via drawn signature on mobile or typed
 * name on desktop."
 *
 * ── WHY BOTH MODES ARE OFFERED EVERYWHERE ───────────────────────────────────
 *
 * Read literally, AC3 pairs each mode to a device class. Implemented literally,
 * it ships a signature control that a keyboard user cannot operate: `SignaturePad`
 * is a `<canvas>` driven by pointer events, with no keyboard path at all. That
 * fails WCAG 2.1 AA 2.1.1 (Keyboard), and on a Must Have that gates the whole
 * apprenticeship agreement it would exclude people from signing their own
 * commitment.
 *
 * So the device decides the *default*, never the *availability*: touch devices
 * open on the drawn pad, everything else opens on the typed field, and the
 * toggle is always present. Every device therefore has a keyboard-operable
 * path, and the drawn pad remains the mobile-preferred option AC3 asks for
 * rather than the only one.
 *
 * ── WHY THE TYPED NAME IS RASTERISED ────────────────────────────────────────
 *
 * `SignCommitmentDto.signatureImageKey` is required and takes a storage key for
 * an image. There is no text-signature field on the API. A typed name is
 * therefore drawn to an offscreen canvas and exported as PNG, so both modes hand
 * the caller the same thing: a data URL. Nothing downstream needs to know which
 * mode produced it.
 */

const TYPED_FONT = '48px "Segoe Script", "Brush Script MT", cursive';
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 160;

/**
 * Draws `name` onto an offscreen canvas and returns a PNG data URL.
 *
 * Exported for testing: rasterisation is the part of AC3 most likely to break
 * silently, because a failure produces a blank image rather than an error.
 */
export function renderTypedSignature(
  name,
  { width = CANVAS_WIDTH, height = CANVAS_HEIGHT } = {},
) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Transparent background, dark ink — the PDF composites this over paper.
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#111827";
  ctx.font = TYPED_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(trimmed, width / 2, height / 2, width - 40);

  return canvas.toDataURL("image/png");
}

/**
 * Touch-first devices default to drawing; everything else defaults to typing.
 *
 * Subscribed to rather than sampled once in an effect. An effect that calls
 * `setMode` on mount causes a cascading render and, more practically, misses a
 * device whose pointer type changes mid-session — a tablet with a keyboard
 * attached is exactly the case where the typed path matters most.
 */
const POINTER_QUERY = "(pointer: coarse)";

function subscribeToPointer(onChange) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia(POINTER_QUERY);
  mql.addEventListener?.("change", onChange);
  return () => mql.removeEventListener?.("change", onChange);
}

function getPointerSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(POINTER_QUERY).matches;
}

/** The server cannot know the pointer type; typing is the safe default. */
function getPointerServerSnapshot() {
  return false;
}

export function SignatureCapture({
  onChange,
  disabled = false,
  fullName = "",
}) {
  const prefersDrawing = useSyncExternalStore(
    subscribeToPointer,
    getPointerSnapshot,
    getPointerServerSnapshot,
  );

  /**
   * `null` means "follow the device". Once the apprentice picks a mode their
   * choice wins, so a pointer change does not yank the control out from under
   * someone mid-signature.
   */
  const [chosenMode, setChosenMode] = useState(null);
  const mode = chosenMode ?? (prefersDrawing ? "draw" : "type");

  const [typed, setTyped] = useState(fullName);
  /**
   * Held in a ref so the rasterising effect below does not re-run every time
   * the parent re-renders with a new inline callback. Assigned in an effect,
   * not during render: mutating a ref while rendering is what the React docs
   * warn against, and it makes the value the effect reads order-dependent.
   */
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Typed mode re-rasterises as the name changes, so the caller always holds a
  // current image without the apprentice pressing a separate "apply" button.
  useEffect(() => {
    if (mode !== "type") return;
    onChangeRef.current?.(renderTypedSignature(typed));
  }, [mode, typed]);

  const handleDrawn = useCallback((dataUrl) => {
    onChangeRef.current?.(dataUrl);
  }, []);

  const switchMode = (next) => {
    setChosenMode(next);
    // Switching clears the previous signature rather than carrying it over:
    // the apprentice should see the control they are about to sign with, not
    // inherit an image they can no longer edit in this mode.
    onChangeRef.current?.(null);
  };

  return (
    <div className="space-y-3">
      <div
        className="inline-flex rounded-lg border border-neutral-200 p-0.5"
        role="group"
        aria-label="Signature method"
      >
        <button
          type="button"
          onClick={() => switchMode("type")}
          disabled={disabled}
          aria-pressed={mode === "type"}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            mode === "type"
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          <Keyboard className="h-3.5 w-3.5" /> Type it
        </button>
        <button
          type="button"
          onClick={() => switchMode("draw")}
          disabled={disabled}
          aria-pressed={mode === "draw"}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            mode === "draw"
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          <PenLine className="h-3.5 w-3.5" /> Draw it
        </button>
      </div>

      {mode === "type" ? (
        <div className="space-y-1.5">
          <label
            htmlFor="typed-signature"
            className="block text-xs font-medium text-neutral-600"
          >
            Type your full name
          </label>
          <input
            id="typed-signature"
            type="text"
            value={typed}
            disabled={disabled}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="name"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            placeholder="e.g. Alex Morgan"
          />
          <p
            aria-live="polite"
            className="text-2xl text-neutral-900 pt-1"
            style={{ fontFamily: '"Segoe Script", "Brush Script MT", cursive' }}
          >
            {typed.trim() || " "}
          </p>
          <p className="text-xs text-neutral-500">
            Typing your name counts as your signature.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <SignaturePad onCapture={handleDrawn} disabled={disabled} />
          <p className="text-xs text-neutral-500">
            Draw your signature above. Prefer a keyboard?{" "}
            <button
              type="button"
              onClick={() => switchMode("type")}
              className="font-semibold underline"
            >
              Type it instead
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
}
