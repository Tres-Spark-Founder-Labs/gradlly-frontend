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

import Button from "@/components/ui/Button";
import { AnimatePresence, MotionBox } from "@/components/ui/MotionBox";
import { cn } from "@/utils/helper";
import { acquireScrollLock, releaseScrollLock } from "@/utils/scroll-lock";

// Isomorphic layout effect: useLayoutEffect runs before paint (no blank frame
// on mount), falling back to useEffect on the server where there is no DOM.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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

function getFocusableNodes(root) {
  return Array.from(
    root.querySelectorAll(
      "a[href], button:not([disabled]), input:not([disabled]), " +
        "select:not([disabled]), textarea:not([disabled]), " +
        "[tabindex]:not([tabindex='-1'])",
    ),
  );
}

/**
 * Standard application modal. Always renders a sticky header (icon + title +
 * description + close), a scrollable body, and a sticky footer with a default
 * Cancel button. Callers supply only the primary action via the `footer` prop.
 *
 * @param {object}          props
 * @param {boolean}         props.open                  visibility flag
 * @param {function}        [props.onClose]             called when the modal requests close
 * @param {boolean}         [props.closable=true]       enables ESC, backdrop click, close button
 * @param {boolean}         [props.busy=false]          blocks close/cancel while an action runs
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl'|'full'} [props.size='lg'] card width
 * @param {React.ReactNode} props.icon                  leading header icon
 * @param {React.ReactNode} props.title                 header title
 * @param {React.ReactNode} [props.description]         header subtitle
 * @param {React.ReactNode} [props.footer]              primary action button(s); Cancel is automatic
 * @param {string}          [props.cancelLabel='Cancel'] label for the default Cancel button
 * @param {boolean}         [props.hideCancel=false]    omit the default Cancel button
 * @param {'center'|'top'}  [props.align='center']      vertical position on screen
 * @param {string}          [props.className]           extra classes on the card
 * @param {string}          [props.overlayClassName]    extra classes on the backdrop wrapper
 * @param {React.ReactNode} props.children              modal body
 */
export function Modal({
  open,
  onClose,
  closable = true,
  busy = false,
  size = "lg",
  icon,
  title,
  description,
  footer,
  cancelLabel = "Cancel",
  hideCancel = false,
  align = "center",
  className,
  overlayClassName,
  children,
}) {
  const cardRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const titleId = useId();
  const descriptionId = useId();

  // Close is permitted only when closable and not mid-action.
  const canClose = closable && !busy;
  const requestClose = canClose ? onClose : undefined;

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock via the shared ref-counted utility so Modal and
  // MobileDrawer never fight over the same counter.
  useEffect(() => {
    if (!open) return;
    acquireScrollLock();
    return releaseScrollLock;
  }, [open]);

  // Focus the first focusable element after the entrance animation settles.
  useEffect(() => {
    if (!open || !cardRef.current) return;
    const id = setTimeout(() => {
      const nodes = getFocusableNodes(cardRef.current);
      nodes[0]?.focus();
    }, 60);
    return () => clearTimeout(id);
  }, [open]);

  // Return keyboard users to the control that opened the dialog. Capturing
  // the element when the modal opens also makes this work for every caller,
  // rather than requiring each trigger to maintain its own ref.
  useEffect(() => {
    if (!open) return;
    const returnFocusTarget = document.activeElement;

    return () => {
      if (
        returnFocusTarget instanceof HTMLElement &&
        returnFocusTarget !== document.body &&
        returnFocusTarget.isConnected
      ) {
        returnFocusTarget.focus();
      }
    };
  }, [open]);

  // Focus trap + ESC handling.
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") {
        canClose ? onClose?.() : e.preventDefault();
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
    [canClose, onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, handleKey]);

  if (!mounted) return null;

  const showFooter = !hideCancel || Boolean(footer);

  return createPortal(
    <AnimatePresence>
      {open && (
        // Presence wrapper animates opacity only; the visual overlay below owns
        // the backdrop so backdrop-filter gets its own GPU layer up front.
        <MotionBox
          key="modal-backdrop"
          variant="fade"
          duration={0.25}
          exitDuration={0.2}
          ease="easeOut"
          className={cn(
            "fixed inset-0 z-[400] flex",
            align === "top"
              ? "items-start justify-center p-4 pt-16"
              : "items-center justify-center p-4",
            overlayClassName,
          )}
          onClick={requestClose}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundColor: "rgba(6, 8, 9, 0.72)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          <MotionBox
            ref={cardRef}
            variant="popUp"
            duration={0.3}
            exitDuration={0.2}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl",
              SIZES[size] ?? SIZES.lg,
              className,
            )}
            style={{ maxHeight: "92dvh", willChange: "transform, opacity" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky header */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-100 px-6 py-5">
              <div className="flex min-w-0 items-start gap-3">
                {icon ? (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-sm">
                    {icon}
                  </span>
                ) : null}
                <div className="min-w-0">
                  <h2
                    id={titleId}
                    className="truncate text-base font-semibold leading-snug text-neutral-900"
                  >
                    {title}
                  </h2>
                  {description ? (
                    <p
                      id={descriptionId}
                      className="mt-0.5 text-sm leading-snug text-neutral-500"
                    >
                      {description}
                    </p>
                  ) : null}
                </div>
              </div>

              {canClose ? (
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
              ) : null}
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
              {children}
            </div>

            {/* Sticky footer: default Cancel + caller-supplied action(s) */}
            {showFooter ? (
              <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-neutral-100 bg-neutral-50/60 px-6 py-4">
                {!hideCancel ? (
                  <Button
                    type="button"
                    color="black"
                    variant="neutral"
                    size="sm"
                    disabled={busy}
                    onClick={onClose}
                  >
                    {cancelLabel}
                  </Button>
                ) : null}
                {footer}
              </div>
            ) : null}
          </MotionBox>
        </MotionBox>
      )}
    </AnimatePresence>,
    document.body,
  );
}
