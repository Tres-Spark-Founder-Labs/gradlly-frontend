import { createPageMetadata, createViewport } from "@gradlly/utils";

import type { Viewport } from "next";

import "@/styles/globals.css";
import { AppProvider } from "@/providers";

export const metadata = createPageMetadata({
  description:
    "Gradlly employer portal for hiring, onboarding, and apprenticeship tracking.",
  portalName: "Employer Portal",
  baseUrl: process.env["NEXT_PUBLIC_APP_URL"] ?? "https://employer.gradlly.com",
});

export const viewport: Viewport = createViewport({ themeColor: "#4f46e5" });

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
