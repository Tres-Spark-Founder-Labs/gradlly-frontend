"use client";
import { useState } from "react";

import CTA from "@/components/Home/CTA";
import FlowPortal from "@/components/Home/FlowPortal";
import Hero from "@/components/Home/Hero";
import HowItWorks from "@/components/Home/HowItWorks";
import Marquee from "@/components/Home/Marquee";
import Nav from "@/components/Home/Nav";
import Portals from "@/components/Home/Portals";
import Problem from "@/components/Home/Problem";
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
 * The only change is subtraction. Four sections are gone because their entire
 * content was proof nobody has yet: Stats (four market figures), Results (six
 * measured outcomes under the heading "Early Results"), Testimonials (six
 * attributed quotes from people who do not exist, one a director at an NHS
 * Trust) and Pricing (three prices in no approved copy).
 *
 * Mockups went with them: it drew simulated dashboards whose numbers
 * (£142,400, 94%, £8,000) read as a screenshot of real data. Portals lost its
 * mockup column as a result, which is a visible loss and is recorded as one.
 * The KPI tiles inside Problem, Portals and FlowPortal are gone too, and the
 * layouts closed up rather than keeping an empty slot.
 *
 * Every removal is listed with file and line in
 * docs/marketing/DESIGN-SPEC.md section 9.
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
      <Marquee />
      <Problem />
      <Portals />
      <HowItWorks />
      <FlowPortal />
      <Why />
      <CTA />
    </div>
  );
}
