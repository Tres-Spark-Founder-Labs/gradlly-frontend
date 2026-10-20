import { IBM_Plex_Mono, Inter_Tight } from "next/font/google";

/**
 * Two faces, with a hard rule about which one is allowed where.
 *
 * ── INTER TIGHT, FOR EVERYTHING ─────────────────────────────────────────────
 *
 * Display, headings, body, navigation, buttons, inputs. Character comes from
 * scale, tracking and composition rather than from a second voice.
 *
 * Inter Tight rather than Inter: it is drawn tight, so the compressed
 * engineered feel comes from the typeface instead of from negative tracking
 * fighting a face that does not want it. Nothing is set at 700, because at
 * display size that reads as shouting and this audience is not persuaded by
 * volume.
 *
 * The two previous attempts both used a high-contrast editorial serif for
 * display. It gave a compliance product a literary voice, and it is the
 * pairing most generated marketing pages reach for.
 *
 * ── IBM PLEX MONO, FOR REFERENCE DATA ONLY ──────────────────────────────────
 *
 * UKPRNs, dates, counts, statuses, page numbers. If the string is not something
 * you could look up, it is not set in this face. The rule is strict on purpose:
 * a monospace applied to small labels for texture is the commonest piece of
 * borrowed chrome in this category, and this product genuinely has reference
 * data to set.
 *
 * Both provisional pending designer confirmation. Self-hosted: next/font
 * fetches at build and serves from this origin, so nothing reaches Google at
 * runtime.
 */

export const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
  adjustFontFallback: true,
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
  adjustFontFallback: true,
});
