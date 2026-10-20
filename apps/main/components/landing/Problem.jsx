import { Section, SectionHead } from "./Section";

/** content-v1.md §3, verbatim. */
const PROBLEMS = [
  {
    claim: "Skills and checks are proved again at every job.",
    detail:
      "Employers can't trust what a worker says they can do, so skills are retested and DBS, right to work and qualifications checked again, even when they're still valid.",
  },
  {
    claim: "Evidence is pieced together before every audit.",
    detail:
      "Enrolment, off-the-job hours, reviews and assessment sit in separate tools, so provider teams rebuild the evidence by hand.",
  },
  {
    claim: "Apprentices finish with nothing they can carry.",
    detail:
      "What an apprentice achieved lives in the provider's system. Their next employer can't see it or trust it without starting again.",
  },
];

/**
 * Three ruled columns, not three cards.
 *
 * The first pass had these as identical rounded cards with the same soft
 * shadow under each, which is the SaaS-card kit and says nothing about the
 * content. A rule above each column does the same separating job and leaves
 * the page quiet, which matters here because this section sits between the
 * hero's two saturated plates and the teal plate below.
 */
export function Problem() {
  return (
    <Section id="the-problem" labelledBy="the-problem-heading">
      <SectionHead id="the-problem-heading">
        Proof gets rebuilt at every step. It shouldn&rsquo;t.
      </SectionHead>

      <ul className="mt-12 grid list-none gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
        {PROBLEMS.map(({ claim, detail }) => (
          <li key={claim} className="border-t-2 border-navy pt-5">
            <p className="font-display text-subhead font-medium text-navy">
              {claim}
            </p>
            <p className="mt-3 text-small text-slate">{detail}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
