import { Archivo } from "next/font/google";

/**
 * One family, doing all of it.
 *
 * ── WHY NOT A SERIF ─────────────────────────────────────────────────────────
 *
 * The previous attempt paired a high-contrast editorial serif with a humanist
 * sans, which is the pairing the mockup uses and the pairing most generated
 * marketing pages use. It gave the page a literary voice, and this product is
 * not literary: it is a register of who confirmed what, on what date, with what
 * evidence. Site cards, DBS certificates and ILR returns are set in grotesques,
 * not in Didones.
 *
 * Archivo is a grotesque with a width axis. Headlines run at 600 to 700 weight
 * with the width pushed out, which reads as signage and official stationery
 * rather than as a magazine. Body runs at normal width and 400. One family with
 * two axes carries the whole hierarchy, so nothing on the page is a second
 * voice.
 *
 * Tabular figures throughout, because this design puts reference data in the
 * open and numbers that shift width between rows read as careless.
 *
 * Provisional pending designer confirmation.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  // No weight array: axes can only be requested on the variable font, and
  // asking for named weights pins it to static instances. The variable font
  // covers 100 to 900, so every weight this design uses comes from one file.
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
  adjustFontFallback: true,
});
