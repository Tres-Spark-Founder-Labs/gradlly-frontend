/**
 * The landing page copy, verbatim from docs/marketing/content-v1.md.
 *
 * Separated from the layout on purpose. This page has been restyled three
 * times, and every restyle is an opportunity to quietly reword something while
 * moving it. With the copy in one file, a visual change cannot touch it, and a
 * copy change is a diff somebody can read against content-v1.md.
 *
 * `mark` is the product a thing belongs to: olive for Continuo, terracotta for
 * Gradlly AMS and the Apprenticeship Passport.
 */
export const CONTENT = Object.freeze({
  /** §2, the two product cards. */
  products: [
    {
      href: "/#continuo",
      name: "Continuo",
      summary: "Verified skills for the workforce",
      audience: "For employers and agencies",
      mark: "olive",
    },
    {
      href: "/gradlly-ams",
      name: "Gradlly AMS",
      summary: "With the Apprenticeship Passport",
      audience: "For training providers",
      mark: "terracotta",
    },
  ],

  /** §3. */
  problems: [
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
  ],

  /** §4, the core of Continuo. */
  continuoCore: [
    "Each skill confirmed by whoever assessed or observed it, with the date and evidence attached",
    "Described against recognised occupational standards, so any employer can read them",
    "New skills confirmed in every role, so the record grows with the worker's career",
    "Shared by the worker with one link, so the next employer deploys them from day one",
  ],

  continuoGroups: [
    {
      title: "Verified checks",
      points: [
        "Identity, right to work, DBS, qualifications and site cards, captured at source",
        "Nothing added without the worker's consent",
        "Every employer adds conduct, attendance and performance confirmations alongside skills",
      ],
    },
    {
      title: "A compliance evidence engine",
      points: [
        "Proof organised by each regulated obligation, not buried in folders",
        "Gaps and upcoming lapses flagged before they become breaches",
        "Evidence packs for any regulator, funder or client audit, on demand",
      ],
    },
    {
      title: "Continuous, not one-off",
      points: [
        "Quarterly skills and competence sign-off, done by a manager in minutes on a phone",
        "A Health Score showing how fresh and complete each record is",
        "One view across bank, agency and multiple employers",
      ],
    },
  ],

  ways: [
    {
      name: "Self-serve platform",
      detail:
        "Employers verify skills, run checks and confirm records themselves.",
    },
    {
      name: "Verify Bureau",
      detail:
        "A managed service for large employers and agencies. We verify skills and checks and return a verified record.",
    },
    {
      name: "Trust Score",
      detail:
        "A worker's verified skills and compliance status, shared by the worker with hirers and platforms.",
    },
    {
      name: "Framework Licence",
      detail:
        "White-label skills and credential infrastructure for sector bodies to run their own schemes.",
    },
  ],

  /** §6. */
  passportPoints: [
    "KSBs, off-the-job hours and the EPA result, each showing who confirmed it and when",
    "Created by AMS during delivery, so there's nothing extra for providers to do",
    "Shared by the apprentice with one link: full or partial, time-limited or revocable",
    "Kept after completion, and can be carried into Continuo when they move into work",
  ],

  /** §7. The only sequences in the copy, and so the only numbered lists. */
  continuoFlow: [
    {
      claim: "Verify skills and checks",
      detail:
        "Skills are confirmed by the trainer, assessor or employer who saw them. Identity, right to work and DBS are checked at source, with the worker's consent.",
    },
    {
      claim: "Share",
      detail:
        "The worker sends one link to an employer or agency, full or partial, time-limited or revocable.",
    },
    {
      claim: "Onboard",
      detail:
        "The employer deploys the worker on verified skills instead of retesting and repeating checks.",
    },
    {
      claim: "Stay current",
      detail:
        "New skills, renewals, live checks and quarterly sign-offs keep the record true at every job after.",
    },
  ],

  amsFlow: [
    {
      claim: "Enrol",
      detail:
        "The provider enrols the apprentice and the employer in AMS, with funding and ILR in one place.",
    },
    {
      claim: "Deliver",
      detail:
        "Off-the-job hours, reviews and KSB evidence are logged as they happen.",
    },
    {
      claim: "Reach gateway",
      detail:
        "A Gateway Readiness Score shows who is ready for end-point assessment.",
    },
    {
      claim: "Complete with a Passport",
      detail:
        "The apprentice leaves with a verified Passport of what they achieved.",
    },
  ],

  /** §8. The parenthesised product in the copy becomes the row's links. */
  audiences: [
    {
      who: "Employers and agencies in regulated work",
      detail:
        "Hire and deploy on verified skills, onboard without repeating checks, and be audit-ready every day.",
      products: [{ name: "Continuo", href: "/#continuo", mark: "olive" }],
    },
    {
      who: "Training providers",
      detail:
        "Run delivery and compliance in one place, and send learners out with proof employers trust.",
      products: [
        { name: "Gradlly AMS", href: "/gradlly-ams", mark: "terracotta" },
      ],
    },
    {
      who: "Levy-paying employers and SMEs",
      detail:
        "See every apprentice's progress, sign off reviews, and put unspent levy to work.",
      products: [
        { name: "Gradlly AMS", href: "/gradlly-ams", mark: "terracotta" },
      ],
    },
    {
      who: "Apprentices and workers",
      detail:
        "A free, verified record of your skills and checks that you own and share on your terms.",
      products: [
        { name: "Passport", href: "/#passport", mark: "terracotta" },
        { name: "Continuo", href: "/#continuo", mark: "olive" },
      ],
    },
  ],

  /**
   * §9's demo section does not list what a demo covers, so these three lines
   * are written here rather than quoted. They name only features that appear
   * in content-v1.md and claim nothing beyond them.
   */
  demoCovers: [
    {
      name: "Continuo",
      detail:
        "How a skill is confirmed, what the worker's record looks like, and how an evidence pack comes out of it.",
    },
    {
      name: "Gradlly AMS",
      detail:
        "Enrolment through to gateway, with ILR and funding compliance in the same place as delivery.",
    },
    {
      name: "The Passport",
      detail: "What an apprentice leaves with, and how it is shared.",
    },
  ],
});
