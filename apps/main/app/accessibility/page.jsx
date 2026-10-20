import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";
import { createPageSeo } from "@/utils/metadata";

export const metadata = createPageSeo({
  title: "Accessibility",
  path: "/accessibility",
});

/**
 * Placeholder. The page exists so the footer link resolves instead of 404ing,
 * and says plainly that the content is not written rather than showing an
 * empty page that looks broken.
 *
 * Tracked in docs/marketing/LAUNCH-CHECKLIST.md.
 */
export default function AccessibilityPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1140px]">
          <h1 className="font-display text-section text-navy">Accessibility</h1>
          <p className="measure mt-6 text-body text-slate">
            This page is not written yet. It is published so the link to it
            works, and it will carry Gradlly&rsquo;s accessibility content
            before launch.
          </p>
          <p className="mt-6 text-small text-slate">
            <a
              href="/"
              className="font-medium text-navy underline decoration-rule decoration-2 underline-offset-4 hover:decoration-navy"
            >
              Back to the home page
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
