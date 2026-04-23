import type { Metadata } from "next";

interface CreatePageMetadataOptions {
  title?: string;
  description: string;
  portalName: string;
  baseUrl?: string;
  path?: string;
  noIndex?: boolean;
  portalSuffix?: string;
}

export function createPageMetadata({
  title,
  description,
  portalName,
  baseUrl,
  path = "/",
  noIndex = true,
  portalSuffix = "Gradlly",
}: CreatePageMetadataOptions): Metadata {
  const resolvedBaseUrl =
    baseUrl ?? process.env["NEXT_PUBLIC_APP_URL"] ?? "https://www.gradlly.com";
  const metadataBase = new URL(resolvedBaseUrl);
  const fullTitle = title
    ? `${title} | ${portalName} · ${portalSuffix}`
    : `${portalName} · ${portalSuffix}`;

  return {
    title: fullTitle,
    description,
    metadataBase,
    alternates: {
      canonical: path,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: new URL(path, metadataBase).toString(),
      siteName: "Gradlly",
    },
  };
}
