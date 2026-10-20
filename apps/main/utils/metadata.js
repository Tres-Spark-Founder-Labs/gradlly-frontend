import { IS_PRODUCTION_DEPLOYMENT, SITE, SITE_URL } from "@/config/site.config";

/**
 * Metadata for the marketing site.
 *
 * The version this replaced defaulted `noIndex` to true and was called without
 * overriding it, so the one app in this repository whose job is to be found
 * emitted `index: false, follow: false, nocache: true` on every page. Correct
 * for a portal, which is where the file was copied from.
 */
export function createPageSeo({
  title,
  description = SITE.description,
  path = "/",
} = {}) {
  const metadataBase = new URL(SITE_URL);
  const canonical = new URL(path, metadataBase).toString();

  // "Gradlly" alone, per ruling 6. The previous suffix rendered
  // "Main Portal · Gradlly" on a public marketing page.
  const fullTitle = title
    ? `${title} | ${SITE.brand}`
    : `${SITE.brand}. ${SITE.tagline}`;

  return {
    metadataBase,
    title: { default: fullTitle, template: `%s | ${SITE.brand}` },
    description,
    applicationName: SITE.brand,
    alternates: { canonical: path },

    /**
     * Production is indexed; preview and local are not. Driven by VERCEL_ENV
     * so it cannot drift: there is no flag anyone has to remember to flip, and
     * a preview deployment cannot start ranking for the brand.
     */
    robots: IS_PRODUCTION_DEPLOYMENT
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
          },
        }
      : { index: false, follow: false, nocache: true },

    openGraph: {
      type: "website",
      siteName: SITE.brand,
      title: fullTitle,
      description,
      url: canonical,
      locale: SITE.locale,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${SITE.brand}. ${SITE.tagline}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image"],
    },

    icons: { icon: "/favicon.svg" },
  };
}

/**
 * Organization JSON-LD.
 *
 * Only facts that appear in content-v1.md. No founding date, no employee
 * count, no address and no social profiles, because none of those are in the
 * approved copy and inventing structured data is inventing data with a schema
 * attached.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.brand,
    url: SITE_URL,
    slogan: SITE.tagline,
    description: SITE.description,
    logo: new URL("/favicon.svg", SITE_URL).toString(),
  };
}
