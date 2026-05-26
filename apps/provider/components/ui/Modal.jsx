"use client";

import { X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, MotionBox } from "@/components/ui/MotionBox";
import { cn } from "@/utils/helper";
import { acquireScrollLock, releaseScrollLock } from "@/utils/scroll-lock";

// ─── Isomorphic layout effect ─────────────────────────────────────────────────
//
// useLayoutEffect fires synchronously before the browser paint — eliminating
// the blank-frame flash that useEffect causes on mount. On the server, where
// there is no DOM and no paint, it falls back to useEffect so SSR doesn't warn.

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ─── Size map ─────────────────────────────────────────────────────────────────

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  full: "max-w-[90vw]",
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

function getFocusableNodes(root) {
  return Array.from(
    root.querySelectorAll(
      "a[href], button:not([disabled]), input:not([disabled]), " +
        "select:not([disabled]), textarea:not([disabled]), " +
        "[tabindex]:not([tabindex='-1'])",
    ),
  );
}

/*
 * @param {object}            props
 * @param {boolean}           props.open                   — visibility flag
 * @param {function}          [props.onClose]              — called when the modal requests close
 * @param {boolean}           [props.closable=true]        — enables ESC, backdrop click, close button
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl'|'full'} [props.size='lg'] — card width
 * @param {React.ReactNode}   [props.title]                — activates standard header
 * @param {React.ReactNode}   [props.description]          — subtitle inside header
 * @param {React.ReactNode}   [props.footer]               — sticky footer row
 * @param {boolean}           [props.showCloseButton=true] — X icon in header
 * @param {'center'|'top'}    [props.align='center']       — vertical position on screen
 * @param {string}            [props.className]            — extra classes on the card
 * @param {string}            [props.overlayClassName]     — extra classes on the backdrop wrapper
 * @param {React.ReactNode}   props.children
 */
export function Modal({
  open,
  onClose,
  closable = true,
  size = "lg",
  title,
  description,
  footer,
  showCloseButton = true,
  align = "center",
  className,
  overlayClassName,
  children,
}) {
  const cardRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Unique IDs per instance — satisfies ARIA uniqueness even when two modals
  // are mounted at the same time (e.g. a confirmation inside another modal).
  const titleId = useId();
  const descriptionId = useId();

  // Mount guard — useIsomorphicLayoutEffect fires before the browser paint,
  // so the portal is injected in the same frame as the first client render.
  // useEffect would fire after paint, producing a blank frame before the
  // AnimatePresence entrance animation begins.
  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock — delegated to the shared ref-counted utility so Modal
  // and MobileDrawer operate on the same counter and never fight each other.
  useEffect(() => {
    if (!open) return;
    acquireScrollLock();
    return releaseScrollLock;
  }, [open]);

  // Auto-focus first focusable element after entrance animation settles
  useEffect(() => {
    if (!open || !cardRef.current) return;
    const id = setTimeout(() => {
      const nodes = getFocusableNodes(cardRef.current);
      nodes[0]?.focus();
    }, 60);
    return () => clearTimeout(id);
  }, [open]);

  // Focus trap + conditional ESC handler
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") {
        closable ? onClose?.() : e.preventDefault();
        return;
      }
      if (e.key !== "Tab" || !cardRef.current) return;

      const nodes = getFocusableNodes(cardRef.current);
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const atBoundary = e.shiftKey
        ? document.activeElement === first
        : document.activeElement === last;

      if (atBoundary) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    },
    [closable, onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, handleKey]);

  if (!mounted) return null;

  const hasTitle = Boolean(title);
  const renderCloseBtn = closable && showCloseButton && hasTitle;

  return createPortal(
    <AnimatePresence>
      {open && (
        // ── Layer 1: Presence wrapper — animates opacity only ─────────────────
        //
        // Intentionally carries NO backgroundColor or backdropFilter.
        // Those live on the .overlay child below, which has its own GPU
        // compositing layer pre-allocated before the first animation frame.
        <MotionBox
          key="modal-backdrop"
          variant="fade"
          duration={0.25}
          exitDuration={0.2}
          ease="easeOut"
          className={cn(
            "fixed inset-0 z-400 flex",
            align === "top"
              ? "items-start justify-center p-4 pt-16"
              : "items-center justify-center p-4",
            overlayClassName,
          )}
          onClick={closable ? onClose : undefined}
        >
          {/* ── Layer 1a: Visual overlay ──────────────────────────────────────
               Separate from the MotionBox so backdrop-filter gets its own GPU
               compositing layer at render time, not mid-animation. Inherits
               parent opacity through CSS cascade — the visual fade is identical
               to if it were on the MotionBox directly.                        */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundColor: "rgba(6, 8, 9, 0.72)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* ── Layer 2: Card ─────────────────────────────────────────────────
               No explicit delay. The popUp preset (scale + y + opacity) has
               more motion than a plain fade, so it visually trails the backdrop
               without needing artificial delay. Explicit delay produced a dark
               flash — 40 ms of visible backdrop with no card.                */}
          <MotionBox
            ref={cardRef}
            variant="popUp"
            duration={0.3}
            exitDuration={0.2}
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            className={cn(
              "relative w-full overflow-hidden rounded-2xl bg-white shadow-xl",
              SIZES[size] ?? SIZES.lg,
              hasTitle ? "flex flex-col" : "flex",
              className,
            )}
            style={{
              maxHeight: "92dvh",
              willChange: "transform, opacity",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {hasTitle ? (
              <>
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 px-6 py-5">
                  <div className="min-w-0">
                    <h2
                      id={titleId}
                      className="truncate text-base font-semibold leading-snug text-neutral-900"
                    >
                      {title}
                    </h2>
                    {description && (
                      <p
                        id={descriptionId}
                        className="mt-0.5 text-sm leading-snug text-neutral-500"
                      >
                        {description}
                      </p>
                    )}
                  </div>

                  {renderCloseBtn && (
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close"
                      className={cn(
                        "-mr-1.5 -mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center",
                        "rounded-lg text-neutral-400 transition-colors duration-150",
                        "hover:bg-neutral-100 hover:text-neutral-700",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700",
                      )}
                    >
                      <X className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </button>
                  )}
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
                  {children}
                </div>

                {/* Sticky footer */}
                {footer && (
                  <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-neutral-100 bg-neutral-50/60 px-6 py-4">
                    {footer}
                  </div>
                )}
              </>
            ) : (
              children
            )}
          </MotionBox>
        </MotionBox>
      )}
    </AnimatePresence>,
    document.body,
  );
}
