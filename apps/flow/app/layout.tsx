import { createPageMetadata, createViewport } from "@gradlly/utils";

import type { Viewport } from "next";

import "@/styles/globals.css";
import { AppProvider } from "@/providers";

export const metadata = createPageMetadata({
  description:
    "Gradlly flow portal for workflow orchestration and operational insights.",
  portalName: "Flow Portal",
  baseUrl: process.env["NEXT_PUBLIC_APP_URL"] ?? "https://flow.gradlly.com",
});

export const viewport: Viewport = createViewport({ themeColor: "#9333ea" });

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
