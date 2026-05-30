import "@/assets/css/globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";

import { PORTAL } from "@/config/portal.config";
import { AppProvider } from "@/providers";
import { createPageSeo } from "@/utils/metadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const { metadata, viewport } = createPageSeo();

export default function RootLayout({ children }) {
  return (
    <html
      lang={PORTAL.locale.replace("_", "-")}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
