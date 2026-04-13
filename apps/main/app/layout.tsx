import { Inter } from "next/font/google";

import Providers from "../providers/index";
import "./globals.css";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

const portalLinks = [
  { label: "Main", href: "http://main.gradlly.local/" },
  { label: "Flow", href: "http://flow.gradlly.local/" },
  { label: "Provider", href: "http://provider.gradlly.local/" },
  { label: "Employer", href: "http://employer.gradlly.local/" },
  { label: "Apprentice", href: "http://apprentice.gradlly.local/" },
] as const;

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
        <Providers>
          <nav className="border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
            <ul className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-2">
              {portalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 transition-colors hover:bg-slate-100"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}
