import "@/assets/css/globals.css";

import { inter, playfair } from "@/app/fonts";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Grain } from "@/components/site/Texture";
import { SITE } from "@/config/site.config";
import { createPageSeo, organizationJsonLd } from "@/utils/metadata";

export const metadata = createPageSeo();

export const viewport = {
  themeColor: SITE.themeColor,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/**
 * The shell for the Gradlly-branded pages: cream and olive, Playfair and
 * Inter. Pages write content only.
 *
 * Lives in the (site) route group now, which gives it its own `<html>` —
 * `app/factory` is a second, unrelated root layout beside it, for the
 * comparison build at /factory. Route groups don't affect the URL, so this
 * still serves every path it served before the move.
 */
export default function RootLayout({ children }) {
  return (
    <html lang={SITE.lang} className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Grain />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          // Serialised from an object literal built in this repository, so
          // there is no user input in it and nothing to escape against.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
