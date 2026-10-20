import "@/assets/css/globals.css";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SITE } from "@/config/site.config";
import { createPageSeo, organizationJsonLd } from "@/utils/metadata";

import { archivo } from "./fonts";

export const metadata = createPageSeo();

export const viewport = {
  themeColor: SITE.themeColor,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/**
 * The shell is the same on every page: a navy band above, a navy band below,
 * white content between them. Pages write content only.
 */
export default function RootLayout({ children }) {
  return (
    <html lang={SITE.lang} className={archivo.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
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
