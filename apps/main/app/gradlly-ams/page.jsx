"use client";
import { useState } from "react";

import CTA from "@/components/Home/CTA";
import FlowPortal from "@/components/Home/FlowPortal";
import Footer from "@/components/Home/Footer";
import Hero from "@/components/Home/Hero";
import HowItWorks from "@/components/Home/HowItWorks";
import Marquee from "@/components/Home/Marquee";
import Nav from "@/components/Home/Nav";
import Portals from "@/components/Home/Portals";
import Problem from "@/components/Home/Problem";
import Why from "@/components/Home/Why";

/**
 * Gradlly AMS: the original design, kept.
 *
 * This is the page that was approved. It is not rebuilt, not restyled and not
 * brought onto the marketing tokens, because it is a standard rather than a
 * draft. It carries its own navigation and footer for the same reason.
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
      <Hero />
      <Marquee />
      <Problem />
      <Portals />
      <HowItWorks />
      <FlowPortal />
      <Why />
      <CTA />
      <Footer />
    </div>
  );
}
