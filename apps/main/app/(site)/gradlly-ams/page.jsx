"use client";
import { useState } from "react";

import CTA from "@/components/Home/CTA";
import FlowPortal from "@/components/Home/FlowPortal";
import Hero from "@/components/Home/Hero";
import HowItWorks from "@/components/Home/HowItWorks";
import Marquee from "@/components/Home/Marquee";
import Nav from "@/components/Home/Nav";
import Portals from "@/components/Home/Portals";
import Pricing from "@/components/Home/Pricing";
import Problem from "@/components/Home/Problem";
import Results from "@/components/Home/Results";
import Stats from "@/components/Home/Stats";
import Testimonials from "@/components/Home/Testimonials";
import Why from "@/components/Home/Why";
import { Breadcrumbs } from "@/components/site/SectionNav";

/**
 * Gradlly AMS: the original design, kept.
 *
 * This is the page that was approved. It is not rebuilt, not restyled and not
 * brought onto the marketing tokens, because it is a standard rather than a
 * draft. It carries its own navigation for the same reason.
 *
 * It does not carry its own footer any more. `components/Home/Footer.jsx`
 * was stacking a second, fabricated-content footer (dead "#" links, an
 * invented hello@gradlly.com, legal pages that don't exist) underneath the
 * real one `app/(site)/layout.jsx` already renders around every page in this
 * route group, including this one. Deleted rather than kept unused — see
 * git history to restore it.
 *
 * ── STATS, RESULTS, TESTIMONIALS, PRICING: RESTORED ON REQUEST ──────────────
 *
 * A prior pass on this page removed these four sections (plus the KPI tiles
 * inside Problem, Portals and FlowPortal, and the Mockups column in Portals)
 * because every number and quote in them was fabricated: Testimonials quotes
 * six people who do not exist, one a director at an NHS Trust that was never
 * a customer; Stats, Results and the KPI tiles carry figures with no source
 * (£3.5B, 94%, £142,400, "98% vs 62% industry average"); Pricing's three
 * tiers (£200, £30, £80) match no approved copy anywhere in this repository.
 * None of that changed — there still isn't a real pilot, logo or figure to
 * put in their place.
 *
 * Restored anyway, on explicit instruction after being shown exactly what
 * that means. Replace the content in `constants.js`, `Stats.jsx`,
 * `Results.jsx`, `Testimonials.jsx` and `Pricing.jsx` with real data the
 * moment it exists — see `docs/marketing/content-v1.md`'s own "Before
 * launch" note: "Add proof once available: a pilot provider, employer logos
 * or a short quote. Use no figures until they are real."
 */
export default function GradllyAmsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="overflow-x-hidden bg-stone-50 text-stone-900">
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {/*
        Breadcrumbs, here and nowhere else. This is the only route a reader can
        reach that is not the top of the site, so it is the only place the trail
        carries information. On a single-page site a breadcrumb that always
        reads "Home" teaches people to ignore breadcrumbs everywhere.

        Set in the marketing system rather than this page's own, because it is
        wayfinding for the site rather than part of the preserved design.
      */}
      <div className="bg-stone-50 px-6 pt-24 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <Breadcrumbs
            trail={[
              { href: "/", label: "Gradlly" },
              { href: "/#positioning", label: "Products" },
              { label: "Gradlly AMS" },
            ]}
          />
        </div>
      </div>
      <Hero />
      <Stats />
      <Marquee />
      <Problem />
      <Portals />
      <HowItWorks />
      <FlowPortal />
      <Results />
      <Testimonials />
      <Pricing />
      <Why />
      <CTA />
    </div>
  );
}
