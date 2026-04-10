import { Inter } from "next/font/google";

import Providers from "../providers/index";
import "./globals.css";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gradlly Main",
  description: "Internal development portal",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactNode {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
