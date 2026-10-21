import "@/assets/css/factory.css";

import { geistMono, geistSans } from "./fonts";

/**
 * Factory's own root layout — a second, independent `<html>` tree.
 *
 * ── WHY A SEPARATE ROOT LAYOUT, NOT A NESTED ONE ────────────────────────────
 *
 * Factory is dark, Geist-set and 1px-bordered; the rest of the site is cream,
 * Playfair-and-Inter, and shadow-carded. Nesting this under the shared layout
 * would mean fighting that layout's `<html>`/`<body>` (cream background,
 * olive theme-colour, Playfair/Inter font variables) from inside, which is
 * fragile by construction. Next.js supports exactly this instead: route
 * groups each get their own root layout, and a route outside every group
 * falls back to the top-level one. `app/(site)/layout.jsx` is that top-level
 * one now; this is the second.
 *
 * No Grain, no Header, no Footer import from components/site — those are the
 * Gradlly brand's own chrome. Factory's nav and footer are built fresh in
 * components/factory, matching this reference instead.
 *
 * `noindex`: this route exists to be compared against the live site, not to
 * be found next to it in search results.
 */
export const metadata = {
  title: "Gradlly — Factory",
  description:
    "A comparison build of the Gradlly marketing page in the Factory visual system.",
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: "#101010",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function FactoryLayout({ children }) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
