import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

/**
 * Factory's two voices: Geist for everything, Geist Mono for the
 * instrument labels.
 *
 * Pre-built and self-hosted by the `geist` package rather than loaded via
 * `next/font/google` — Geist isn't on Google Fonts, it's Vercel's own face,
 * and the package ships it as a ready `NextFontWithVariable` with no config
 * call needed, unlike `playfair`/`inter` in ../fonts.js next door.
 *
 * Re-exported from this one file for the same reason that file exists: a
 * single place to see what this route loads and to swap it from later.
 */
export const geistSans = GeistSans;
export const geistMono = GeistMono;
