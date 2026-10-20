import { PageHeader } from "@/components/site/PageHeader";
import { Attestation, Band, BandHead } from "@/components/site/ui";
import { pageByHref } from "@/config/site.config";
import { createPageSeo } from "@/utils/metadata";

const page = pageByHref("/apprenticeship-passport");

export const metadata = createPageSeo({
  title: "Apprenticeship Passport",
  description:
    "Every apprentice leaves with a verified record of what they achieved. Built automatically as they train, owned by them, and free for them.",
  path: "/apprenticeship-passport",
});

/** content-v1.md §6, verbatim. */
const POINTS = [
  {
    claim: "KSBs, off-the-job hours and the EPA result",
    by: "Each showing who confirmed it and when",
  },
  {
    claim: "Created by AMS during delivery",
    by: "So there's nothing extra for providers to do",
  },
  {
    claim: "Shared by the apprentice with one link",
    by: "Full or partial, time-limited or revocable",
  },
  {
    claim: "Kept after completion",
    by: "And can be carried into Continuo when they move into work",
  },
];

export default function PassportPage() {
  return (
    <>
      <PageHeader {...page}>
        <p className="measure text-body text-graphite">
          Every apprentice leaves with a verified record of what they achieved.
          It&rsquo;s built automatically as they train, owned by them, and free
          for them.
        </p>
      </PageHeader>

      {/*
        The four points are the Passport's contents, so they are set as a list
        of entries: the claim, a rule, and the confirmation under it. That is
        the shape of the record itself, which is the point of the page.
      */}
      <Band id="contents">
        <BandHead id="contents-heading">What is in it.</BandHead>

        <ul className="mt-12 grid list-none gap-x-16 gap-y-10 md:mt-16 md:grid-cols-2">
          {POINTS.map(({ claim, by }) => (
            <li key={claim}>
              <Attestation claim={claim} by={by} mark="brass" />
            </li>
          ))}
        </ul>
      </Band>

      <Band id="who-owns-it" tone="fog">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
          <div>
            <div className="h-0.5 w-12 bg-brass" aria-hidden />
            <h2 className="font-semibold mt-5 max-w-[13ch] text-display text-navy">
              The apprentice owns it.
            </h2>
          </div>
          <div className="self-end">
            <p className="measure text-body text-graphite">
              Included with Gradlly AMS, and free for the apprentice. What they
              achieved does not stay in the provider&rsquo;s system when the
              apprenticeship ends, which is the third of the three problems this
              whole platform exists to answer.
            </p>
            <p className="mt-6">
              <a
                href="/#the-problem"
                className="text-body-sm font-semibold text-navy underline decoration-rule decoration-2 underline-offset-[6px] transition-colors duration-[120ms] ease-out hover:decoration-navy"
              >
                Read the three problems
              </a>
            </p>
          </div>
        </div>
      </Band>

      <Band tone="navy">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="text-lead text-paper/75">
            Next: the two flows, step by step.
          </p>
          <a
            href="/how-it-works"
            className="border border-white/40 px-6 py-3.5 text-body-sm font-semibold text-paper transition-colors duration-[140ms] ease-out hover:border-white"
          >
            05 How it works
          </a>
        </div>
      </Band>
    </>
  );
}
