export const PORTALS = [
  {
    num: "Portal 01 — Employer",
    title: "Manage your levy. Track every apprentice.",
    desc: "The levy dashboard your finance team will actually use. Real-time data, one-tap approvals, and board-ready reporting.",
    features: [
      "Real-time levy balance synced live from ESFA DAS API — expiry dates, funds at risk",
      "All apprentices across all providers in one table — OTJ progress, EPA dates",
      "One-tap OTJ approval workflow with weekly email digest for line managers",
      "Tripartite commitment statement signing — fully digital, legally binding",
      "Levy ROI report: spend vs EPA pass rates, board-ready PDF export",
    ],
    kpis: [
      { val: "£142K", label: "avg levy balance visible" },
      { val: "2 sec", label: "dashboard load time" },
    ],
    mockup: "employer",
  },
  {
    num: "Portal 02 — Provider",
    title: "Ofsted-ready. ILR automated.",
    desc: "Your compliance ops centre — always audit-ready. Live Ofsted scoring, auto-generated reports, one-click ILR submission.",
    features: [
      "Live Ofsted EIF readiness score — red/amber/green, updated in real time from platform data",
      "Auto-generated SAR and QIP from live platform data",
      "ILR build, validation, and direct submission to ESFA — no spreadsheets",
      "Full cohort management: at-risk queue, 12-weekly review scheduler",
      "Pre-organised Ofsted evidence pack downloadable in under 60 seconds",
    ],
    kpis: [
      { val: "76%", label: "avg Ofsted score improvement" },
      { val: "1-click", label: "ILR submission" },
    ],
    mockup: "provider",
  },
  {
    num: "Portal 03 — Apprentice",
    title: "Log it. Track it. Own your journey.",
    desc: "Mobile-first. Under 30 seconds to log OTJ. Visual progress tracking that makes apprentices want to stay on top of their programme.",
    features: [
      "Quick OTJ log entry — completable in under 30 seconds on any phone",
      "Visual progress ring toward 20% statutory OTJ target with smart pace alerts",
      "KSB portfolio heatmap — strong/good/partial/weak/missing across all KSBs",
      "EPA countdown, gateway readiness checklist, full programme timeline",
      "One-click EPA evidence pack export for EPAO submission in under 60 seconds",
    ],
    kpis: [
      { val: "<30s", label: "OTJ log on mobile" },
      { val: "87%", label: "EPA gateway completion rate" },
    ],
    mockup: "apprentice",
  },
  {
    num: "Portal 04 — FlowPortal",
    title: "Levy flows. Talent flows.",
    desc: "The UK's only automated levy transfer marketplace. Matching large employers to SMEs in 48 hours — not 4–6 weeks.",
    features: [
      "Levy Exchange — matches large employer donors to SMEs in under 48 hours",
      "SME dashboard built for owners with no HR function — everything in one tap",
      "Four Level 3 AI apprenticeship programmes — fully online, no campus days",
      "ESFA registration wizard — 20 minutes from zero to DAS-linked and funded",
      "£0 cost to SME learner — 100% levy-funded through the Exchange",
    ],
    kpis: [
      { val: "48hr", label: "levy transfer vs weeks manually" },
      { val: "£0", label: "cost to SME learner" },
    ],
    mockup: "flow",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "We spent four hours every Monday chasing OTJ approvals by email. Gradlly turned it into a five-minute review. Our L&D manager actually thanked us for the first time in three years.",
    name: "Sarah H.",
    role: "Head of L&D, Manufacturing Group",
    initials: "SH",
    badge: "Portal 1",
  },
  {
    quote:
      "I used to spend two weeks preparing our Ofsted evidence pack. With Gradlly it downloads in under a minute. The live EIF score alone is worth every penny of the subscription.",
    name: "Marcus K.",
    role: "Quality Manager, Training Provider",
    initials: "MK",
    badge: "Portal 2",
  },
  {
    quote:
      "I logged my first OTJ session in 22 seconds. I've been on my apprenticeship for nine months and no one has ever made it feel this easy. The KSB heatmap actually makes me want to fill the gaps.",
    name: "Jamie O.",
    role: "Data Technician Apprentice",
    initials: "JO",
    badge: "Portal 3",
  },
  {
    quote:
      "We'd been paying into the levy for three years and using none of it. Gradlly connected us with an SME in our supply chain, handled every bit of paperwork, and had a learner starting within six weeks.",
    name: "Alison T.",
    role: "Corporate L&D Director, NHS Trust",
    initials: "AT",
    badge: "FlowPortal",
  },
  {
    quote:
      "I run a 12-person marketing agency. I had no idea we were eligible for funded apprenticeships. FlowPortal walked me through everything in 20 minutes. Our first learner starts next month — and it costs us nothing.",
    name: "Raj P.",
    role: "Founder, Digital Marketing Agency",
    initials: "RP",
    badge: "FlowPortal SME",
  },
  {
    quote:
      "The ILR submission used to be a half-day job. Now it validates, error-checks, and submits in twenty minutes. Gradlly's platform has given my compliance team back eight hours a month.",
    name: "Nikki C.",
    role: "Programme Director, Training Provider",
    initials: "NC",
    badge: "Portal 2",
  },
];

export const PRICING = [
  {
    portal: "Portal 1",
    name: "Employer",
    desc: "For HR and L&D teams managing apprenticeship investment",
    price: "£200",
    period: "/mo",
    featured: false,
    features: [
      "Up to 50 apprentices",
      "Live levy dashboard (DAS sync)",
      "OTJ approval workflow",
      "Commitment statement e-signing",
      "ROI and levy reporting",
      "Levy Transfer Hub access",
    ],
    cta: "Get started",
  },
  {
    portal: "Portal 2",
    name: "Provider",
    desc: "For training providers managing Ofsted compliance and learner cohorts",
    price: "£30",
    period: "/learner/mo",
    featured: true,
    features: [
      "Minimum 20 learners",
      "Live Ofsted EIF readiness score",
      "ILR build, validation and submission",
      "Full cohort management + reviews",
      "Auto SAR + QIP generation",
      "Ofsted evidence pack download",
      "Two-way DAS sync included",
    ],
    cta: "Start free trial",
  },
  {
    portal: "Portal 3",
    name: "Apprentice",
    desc: "Included free with every provider or employer subscription",
    price: "Free",
    period: " always",
    featured: false,
    features: [
      "For every active apprentice",
      "OTJ logging (under 30 seconds)",
      "KSB portfolio and heatmap",
      "EPA countdown and gateway tracker",
      "EPA evidence pack export",
      "Direct messaging to tutor and employer",
    ],
    cta: "Learn more",
  },
  {
    portal: "Portal 4",
    name: "FlowPortal",
    desc: "For SMEs accessing funded AI training and levy donors",
    price: "£80",
    period: "/mo",
    featured: false,
    features: [
      "SME employer dashboard",
      "Levy Exchange access",
      "SME compliance dashboard",
      "ESFA registration wizard",
      "4 AI apprenticeship programmes",
      "Concierge onboarding (first 100 SMEs)",
    ],
    cta: "Check eligibility free",
  },
];

export const RESULTS = [
  {
    val: "98%",
    label:
      "commitment statements completed on time through Gradlly — vs 62% industry average",
  },
  {
    val: "3.2×",
    label:
      "more OTJ sessions logged per week per apprentice vs previous paper-based methods",
  },
  {
    val: "18pts",
    label:
      "average Ofsted readiness score improvement within 90 days of going live on Portal 2",
  },
  {
    val: "£0",
    label:
      "cost to the SME learner on every AI programme through FlowPortal — 100% levy-funded",
  },
  {
    val: "48hrs",
    label:
      "median levy transfer on FlowPortal vs 4–6 weeks via manual ESFA process",
  },
  {
    val: ">8.5",
    label:
      "target NPS from employers and providers — top 10% benchmark in UK EdTech",
  },
];

export const WHY = [
  {
    icon: "🔗",
    title: "ESFA-integrated from day one",
    desc: "A genuine two-way DAS API integration. Levy balances, enrolments, ILR submissions, and funding claims all sync automatically — no manual ESFA portal visits.",
  },
  {
    icon: "⚡",
    title: "Real-time, not retrospective",
    desc: "Every OTJ log, review record, and commitment statement is visible to all three parties the moment it's saved. Stop finding out about problems at month-end.",
  },
  {
    icon: "📋",
    title: "Ofsted-ready by design",
    desc: "Portal 2's live EIF scoring is calculated from actual platform data — not self-assessment. When an inspector arrives, your evidence pack is already waiting.",
  },
  {
    icon: "🏦",
    title: "The only levy marketplace",
    desc: "FlowPortal is the only platform that automates the entire levy transfer process — donor matching, ESFA documentation, DAS API submission — cutting weeks to 48 hours.",
  },
  {
    icon: "🔒",
    title: "Switching cost that protects you",
    desc: "Once your OTJ history, reviews, and EPA evidence are in Gradlly, your programme record lives here — not in a spreadsheet someone can delete.",
  },
  {
    icon: "♿",
    title: "WCAG 2.1 AA. For every user.",
    desc: "Every portal is built to WCAG 2.1 AA accessibility standards. Screen reader compatible. Keyboard navigable. 4.5:1 contrast ratio throughout.",
  },
];
