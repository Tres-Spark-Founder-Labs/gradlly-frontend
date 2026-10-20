import { Inter, Playfair_Display } from "next/font/google";

/**
 * The Kindsight pairing: an editorial serif for display, a neutral grotesque
 * for everything functional.
 *
 * Times Now and Founders Grotesk are the reference's own faces and are both
 * commercially licensed, so the brief's stated fallbacks are used: Playfair
 * Display for the serif, Inter for the sans. Both self-hosted, both free to
 * swap for the licensed faces in one line here when they are bought.
 *
 * Playfair is set at 400 throughout. The reference runs its display type light,
 * and the weight is what makes an oversized headline read as editorial rather
 * than as advertising; Playfair's 400 is its lightest and is the right end of
 * its range for this.
 *
 * The serif never carries dense copy, tables, labels or form controls. That is
 * a rule from the brief and it is also what keeps the page readable at 15px.
 */

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
  adjustFontFallback: true,
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  adjustFontFallback: true,
});
