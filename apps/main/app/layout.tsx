import { createPageMetadata, createViewport } from "@gradlly/utils";

import type { Viewport } from "next";

import "@/styles/globals.css";
import { AppProvider } from "@/providers";

export const metadata = createPageMetadata({
  description:
    "Gradlly main portal for cross-platform administration and oversight.",
  portalName: "Main Portal",
  baseUrl: process.env["NEXT_PUBLIC_APP_URL"] ?? "https://gradlly.com",
});

export const viewport: Viewport = createViewport({ themeColor: "#1d4ed8" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
