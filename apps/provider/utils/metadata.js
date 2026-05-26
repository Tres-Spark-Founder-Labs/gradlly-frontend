// ============================================================
// FILE: apps/provider/utils/metadata.js
// ============================================================
import { PORTAL } from "@/config/portal.config";

export function createPageSeo({
  title,
  description = PORTAL.defaultDescription,
  path = "/",
  noIndex = true,
} = {}) {
  const metadataBase = new URL(PORTAL.baseUrl);
  const canonicalUrl = new URL(path, metadataBase).toString();

  const suffix = `${PORTAL.name} · ${PORTAL.brand}`;
  const fullTitle = title ? `${title} | ${suffix}` : suffix;

  const metadata = {
    metadataBase,
    title: {
      default: fullTitle,
      template: `%s | ${suffix}`,
    },
    description,
    applicationName: `${PORTAL.brand} ${PORTAL.name}`,
    alternates: { canonical: path },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      siteName: PORTAL.brand,
      title: fullTitle,
      description,
      url: canonicalUrl,
      locale: PORTAL.locale,
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      shortcut: "/favicon.svg",
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };

  const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: PORTAL.themeColor,
  };

  return { metadata, viewport };
}
