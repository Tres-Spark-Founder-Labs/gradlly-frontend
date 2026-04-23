import { createPageMetadata, createViewport } from "@gradlly/utils";

import type { Viewport } from "next";

import "@/styles/globals.css";
import { AppProvider } from "@/providers";

export const metadata = createPageMetadata({
  description:
    "Gradlly portal for apprentices to manage learning and progress.",
  portalName: "Apprentice Portal",
  baseUrl:
    process.env["NEXT_PUBLIC_APP_URL"] ?? "https://apprentice.gradlly.com",
});

export const viewport: Viewport = createViewport({ themeColor: "#0ea5a4" });

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
