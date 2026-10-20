import { Band, TextLink } from "@/components/site/ui";
import { createPageSeo } from "@/utils/metadata";

export const metadata = createPageSeo({ title: "Terms", path: "/terms" });

/**
 * Placeholder. Published so the footer link resolves instead of 404ing, and
 * says plainly that the content is not written rather than showing an empty
 * page that looks broken.
 *
 * Tracked in docs/marketing/LAUNCH-CHECKLIST.md.
 */
export default function TermsPage() {
  return (
    <Band>
      <p className="text-caption text-ink-muted">Legal</p>
      <h1 className="display mt-6 max-w-[14ch] text-title text-ink">Terms</h1>
      <p className="measure mt-8 text-lead text-ink-soft">
        This page is published so the link to it works. It will carry
        Gradlly&rsquo;s terms content before launch.
      </p>
      <p className="mt-10">
        <TextLink href="/">Back to the home page</TextLink>
      </p>
    </Band>
  );
}
