import { IBM_Plex_Sans } from "next/font/google";

import "@/assets/css/globals.css";
import { PORTAL } from "@/config/portal.config";
import { AppProvider } from "@/providers";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo();

const portalFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang={PORTAL.locale.replace("_", "-")}
      data-scroll-behavior="smooth"
      className={`h-full antialiased ${portalFont.variable}`}
    >
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
