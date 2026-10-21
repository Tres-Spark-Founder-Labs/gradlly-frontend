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

  /**
   * The positioning table, verbatim from content-v1.md's Positioning section.
   *
   * It was in the approved copy from the start and no version of this site has
   * used it, which is an omission rather than an edit: it is the only place the
   * three things are set out against who buys each one.
   */
  positioning: [
    {
      product: "Continuo",
      what: "Verified skills for the workforce: each skill confirmed by whoever assessed or observed it, backed by verified identity, right to work and DBS, and kept current between jobs",
      who: "Employers and agencies in regulated sectors",
      mark: "olive",
      href: "/#continuo",
    },
    {
      product: "Gradlly AMS",
      what: "Apprenticeship management SaaS with Provider, Employer and Apprentice portals and the Gradlly Forge marketplace",
      who: "Training providers, levy-paying employers, SMEs",
      mark: "terracotta",
      href: "/gradlly-ams",
    },
    {
      product: "Apprenticeship Passport",
      what: "The apprentice's verified record of KSBs, off-the-job hours and EPA result, built by AMS",
      who: "Included with AMS; free for apprentices",
      mark: "terracotta",
      href: "/#passport",
    },
  ],

  /**
   * What a Continuo record carries, for the list and detail view.
   *
   * Every row is drawn from content-v1.md §4: the four core bullets, the three
   * verified-checks bullets and the continuous sign-off bullets. Nothing here
   * is a new claim; the detail lines restate the approved copy for the item they
   * belong to.
   */
  recordItems: [
    {
      id: "skills",
      name: "Skills",
      by: "Confirmed by whoever assessed or observed it",
      mark: "olive",
      detail:
        "Every skill on a Continuo record is confirmed by the trainer, assessor or employer who saw it, with the date and the evidence. Described against recognised occupational standards, so any employer can read them.",
    },
    {
      id: "identity",
      name: "Identity",
      by: "Verified at source",
      mark: "olive",
      detail:
        "Captured at source rather than taken on trust, and nothing is added to a record without the worker's consent.",
    },
    {
      id: "right-to-work",
      name: "Right to work",
      by: "Verified at source, live between jobs",
      mark: "olive",
      detail:
        "Kept current between jobs rather than checked once at the moment of hire, so an employer deploying a worker is reading a live status.",
    },
    {
      id: "dbs",
      name: "DBS",
      by: "Verified at source, live between jobs",
      mark: "olive",
      detail:
        "Held alongside the skills it clears the worker to use, and flagged before it lapses rather than after.",
    },
    {
      id: "qualifications",
      name: "Qualifications",
      by: "Captured at source",
      mark: "olive",
      detail:
        "Held on the record so they are not re-evidenced at every job, which is one of the three things this platform exists to stop.",
    },
    {
      id: "site-cards",
      name: "Site cards",
      by: "Captured at source",
      mark: "olive",
      detail:
        "The sector-specific cards a worker has to produce on arrival, on the same record as everything else they are cleared for.",
    },
    {
      id: "conduct",
      name: "Conduct, attendance and performance",
      by: "Confirmed by each employer",
      mark: "olive",
      detail:
        "Every employer adds conduct, attendance and performance confirmations alongside skills, so the record grows with the worker's career rather than restarting at each job.",
    },
    {
      id: "sign-off",
      name: "Competence sign-off",
      by: "Confirmed by the manager each quarter",
      mark: "olive",
      detail:
        "A quarterly skills and competence sign-off, done by a manager in minutes on a phone. A Health Score shows how fresh and complete each record is.",
    },
    {
      id: "passport",
      name: "Passport achievements",
      by: "Carried in from Gradlly AMS, with consent",
      mark: "terracotta",
      detail:
        "When an apprentice finishes, they can carry their Passport's verified achievements into Continuo, with their consent. Their first employer onboards from proof on day one.",
    },
  ],

  /**
   * The deeper detail behind each Continuo capability, shown on request.
   *
   * Progressive disclosure: the capability is always visible, the detail opens
   * when a reader asks for it. Every line restates content-v1.md §4 rather than
   * adding to it.
   */
  capabilities: [
    {
      summary: "Verified checks",
      detail:
        "Identity, right to work, DBS, qualifications and site cards, captured at source. Nothing added without the worker's consent. Every employer adds conduct, attendance and performance confirmations alongside skills.",
    },
    {
      summary: "A compliance evidence engine",
      detail:
        "Proof organised by each regulated obligation, not buried in folders. Gaps and upcoming lapses flagged before they become breaches. Evidence packs for any regulator, funder or client audit, on demand.",
    },
    {
      summary: "Continuous, not one-off",
      detail:
        "Quarterly skills and competence sign-off, done by a manager in minutes on a phone. A Health Score showing how fresh and complete each record is. One view across bank, agency and multiple employers.",
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
