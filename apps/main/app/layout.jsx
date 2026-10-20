import "@/assets/css/globals.css";

import { SITE } from "@/config/site.config";
import { createPageSeo, organizationJsonLd } from "@/utils/metadata";

import { newsreader, publicSans } from "./fonts";

export const metadata = createPageSeo();

export const viewport = {
  themeColor: SITE.themeColor,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang={SITE.lang}
      className={`${newsreader.variable} ${publicSans.variable}`}
    >
      <body>
        {/* First stop in the tab order on every page. */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
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
