import { Newsreader, Public_Sans } from "next/font/google";

/**
 * Two families, self-hosted.
 *
 * `next/font/google` fetches these at build time and serves them from this
 * origin. No request reaches Google at runtime, so there is no third-party
 * connection to warm up, nothing to consent to, and no render-blocking
 * stylesheet on a cold visit.
 *
 * ── WHY THESE TWO ────────────────────────────────────────────────────────────
 *
 * Newsreader for display: a high-contrast editorial serif with ball terminals
 * and an italic with real personality, which this page needs because the
 * supporting line is set in it. Playfair Display would be the obvious pick and
 * is the default display serif of generated pages.
 *
 * Public Sans for everything else: the humanist face of the US Web Design
 * System, drawn for civic interfaces. Apt for a product about statutory checks,
 * and legible at 13px where a display serif is not. Inter would be the obvious
 * pick and is the default sans of generated pages.
 *
 * Both are provisional pending designer confirmation. The mockup's actual
 * faces are named in no file in this repository; these are a judgement about
 * the closest free, self-hostable match. Swapping either is a one-line change
 * here, because nothing references a family name directly.
 */

export const newsreader = Newsreader({
  subsets: ["latin"],
  // Variable across the range this design uses: 400 for display and section
  // headings, 500 for subheads. Nothing is set bolder than 500, because a
  // high-contrast serif at 700 reads as a masthead rather than a document.
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
  // Keeps the fallback's metrics close enough that the swap does not reflow.
  adjustFontFallback: true,
});

export const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-public-sans",
  adjustFontFallback: true,
});
