import { Band, PageHeader } from "@/components/site/PageHeader";
import { createPageSeo } from "@/utils/metadata";

export const metadata = createPageSeo({
  title: "Accessibility",
  path: "/accessibility",
});

/**
 * Placeholder. Published so the footer link resolves instead of 404ing, and
 * says plainly that the content is not written rather than showing an empty
 * page that looks broken.
 *
 * Tracked in docs/marketing/LAUNCH-CHECKLIST.md.
 */
export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        number="&mdash;"
        label="Legal"
        title="Accessibility"
        lead="Not written yet."
      />
      <Band>
        <p className="measure text-body text-slate">
          This page is published so the link to it works. It will carry
          Gradlly&rsquo;s accessibility content before launch.
        </p>
        <p className="mt-8">
          <a
            href="/"
            className="text-small font-semibold text-navy underline decoration-rule decoration-2 underline-offset-[6px] transition-colors duration-[120ms] ease-out hover:decoration-navy"
          >
            Back to the overview
          </a>
        </p>
      </Band>
    </>
  );
}
