"use client";

import { ImageDown } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { toastError, toastSuccess } from "@/hooks/useToast";

import { T } from "./tokens";

/** Rasterise at 2x so the PNG stays legible when dropped into a slide deck. */
const PIXEL_RATIO = 2;

/**
 * F1.1.3 AC5 — export a chart as PNG.
 *
 * `html-to-image` is used rather than hand-rolled SVG serialisation because the
 * three charts on this dashboard are not built the same way: the monthly chart
 * is SVG, while the utilisation and forecast cards are DOM with CSS-driven
 * bars. One DOM-based rasteriser covers all of them identically.
 *
 * Returns a ref to attach to the element to capture, plus the button itself.
 */
export function useChartPng(filename) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);

  const download = useCallback(async () => {
    if (!ref.current || busy) return;
    setBusy(true);
    try {
      // Imported lazily so the rasteriser (and its fairly large dependency
      // graph) stays out of the initial dashboard bundle — it is only needed
      // when someone actually clicks export.
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(ref.current, {
        pixelRatio: PIXEL_RATIO,
        // Charts sit on white cards; without this, transparent PNGs look
        // broken when pasted into a light document.
        backgroundColor: "#ffffff",
        // Skip the export control itself so it never appears in the image.
        filter: (node) => node?.dataset?.chartExportControl !== "true",
      });

      const link = document.createElement("a");
      link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
      toastSuccess("Chart exported as PNG.");
    } catch {
      toastError("Could not export this chart. Please try again.");
    } finally {
      setBusy(false);
    }
  }, [busy, filename]);

  return { ref, download, busy };
}

export function ChartExportButton({ onClick, busy, label = "Export PNG" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      data-chart-export-control="true"
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-40 shrink-0"
      style={{ backgroundColor: T.blueLight, color: T.blue }}
    >
      <ImageDown className="h-3.5 w-3.5" />
      {busy ? "Exporting…" : "PNG"}
    </button>
  );
}
