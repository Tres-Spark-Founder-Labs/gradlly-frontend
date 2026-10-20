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
 * The Gradlly AMS page: the previous landing page, kept and moved here.
 *
 * It is deliberately not redesigned. It does not use the marketing tokens, the
 * new type scale or the motion rules, because none of those were written for
 * it, and bringing it onto them would be a rebuild rather than a move. The
 * only change is subtraction.
 *
 * ── WHAT CAME OUT, AND WHY ──────────────────────────────────────────────────
 *
 * Four sections are gone because their entire content was proof nobody has:
 *
 *   Stats          four market figures (£3.5B, 750K, £0, 4)
 *   Results        six measured outcomes under the heading "Early Results"
 *   Testimonials   six attributed quotes from people who do not exist, one of
 *                  them a director at an NHS Trust
 *   Pricing        three prices that appear in no approved copy
 *
 * Mockups went with them: it drew simulated dashboards whose numbers
 * (£142,400, 94%, £8,000) read as a screenshot of real data, and a screenshot
 * with the numbers taken out is not a screenshot. Portals lost its mockup
 * column as a result, which is a visible loss on this page and is recorded as
 * one.
 *
 * The KPI tiles inside Problem, Portals and FlowPortal are gone too, and the
 * layouts closed up rather than keeping an empty slot. Nothing was replaced
 * with a placeholder that looks like proof.
 *
 * Every removal is listed with file and line in docs/marketing/DESIGN-SPEC.md
 * section 9.
 */
export default function GradllyAmsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-sans overflow-x-hidden bg-stone-50 text-stone-900">
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="main-content">
        <Hero />
        <Marquee />
        <Problem />
        <Portals />
        <HowItWorks />
        <FlowPortal />
        <Why />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
