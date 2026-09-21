// @ts-check
"use client";

import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { QuickOtjLogSheet } from "@/features/otj/components/QuickOtjLogSheet";

/**
 * F3.1.1 AC6 — "Form is accessible via a persistent floating action button on
 * all app screens".
 *
 * Deliberately mounted in `DashboardLayout`, not inside the OTJ route. "All app
 * screens" is a layout property; a button placed on one page is not persistent,
 * it is a button on one page. Mounting it here means every one of the twelve
 * routes under `app/(dashboard)/` gets it by construction rather than by
 * somebody remembering — and `quick-log-fab.spec.js` asserts that against the
 * real route list rather than against the one route that was checked by hand.
 *
 * MOBILE POSITIONING. `DashboardLayout` renders a `BottomNav` on small screens
 * and pads the main region with `pb-16` to clear it. The FAB sits above that
 * (`bottom-20`) on mobile and drops to `bottom-6` from `md` up where the
 * BottomNav is gone. Sitting at `bottom-6` throughout would have put it
 * directly on top of the mobile navigation — on the portal whose PRD calls
 * mobile primary.
 *
 * ACCESSIBILITY. A FAB is a predictable WCAG failure, so: 56px target (above
 * the 44px WCAG 2.1 AA minimum), a real `aria-label` because the button has no
 * text, and a visible focus ring. There is no axe-core in this repository yet,
 * which is recorded as an outstanding launch gate rather than assumed fine.
 */
/**
 * `?log=1` opens the sheet on arrival. It is where the inactivity push lands
 * (F3.1.4 AC5 — "alerts include a CTA to log hours immediately") and where the
 * manifest's "Log a session" shortcut points, so both open the form directly
 * rather than a page with a button on it.
 */
export function QuickLogFab() {
  // useSearchParams needs a Suspense boundary for static prerendering. The
  // fallback is the same button, so the FAB is never missing from a page.
  return (
    <Suspense fallback={<QuickLogFabButton initialOpen={false} />}>
      <QuickLogFabWithUrl />
    </Suspense>
  );
}

function QuickLogFabWithUrl() {
  const searchParams = useSearchParams();
  return <QuickLogFabButton initialOpen={searchParams.get("log") === "1"} />;
}

function QuickLogFabButton({ initialOpen }) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Log an off-the-job session"
        aria-haspopup="dialog"
        className="fixed right-5 bottom-20 z-40 flex size-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 focus-visible:outline-none md:bottom-6"
      >
        <Plus className="size-6" aria-hidden />
      </button>

      <QuickOtjLogSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
