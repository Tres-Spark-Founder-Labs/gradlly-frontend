# Marketing rebuild: survey

Phase 1. Read-only. Every claim cites `file:line`. Where something was looked
for and does not exist, it says "not found" rather than treating absence as
proven.

Surveyed 20 October 2026 at `abf59ef`.

---

## 1. The five apps

All five are Next.js 16.2.9 / React 19.2.4, App Router, JavaScript with JSX. No
TypeScript island.

| App                   | Path              | Dev port | Production domain                    | Purpose        |
| --------------------- | ----------------- | -------- | ------------------------------------ | -------------- |
| `@gradlly/main`       | `apps/main`       | 3005     | `gradlly.co.uk`, `www.gradlly.co.uk` | Marketing site |
| `@gradlly/apprentice` | `apps/apprentice` | 3001     | `apprentice.gradlly.co.uk`           | Portal 3       |
| `@gradlly/employer`   | `apps/employer`   | 3002     | `employer.gradlly.co.uk`             | Portal 1       |
| `@gradlly/flow`       | `apps/flow`       | 3003     | `flow.gradlly.co.uk`                 | Portal 4       |
| `@gradlly/provider`   | `apps/provider`   | 3004     | `provider.gradlly.co.uk`             | Portal 2       |

Ports are from each `package.json` `dev` script. Domains are from
`vercel alias ls`, which maps each production deployment to its subdomain; the
apex and `www` both resolve to `@gradlly/main`.

Router type is App Router in all five (`apps/*/app/` exists; no `pages/`
directory was found in any app).

Only `apprentice` and `employer` define a `test` script. `provider`, `flow` and
`main` have none, so `turbo run test` skips them.

---

## 2. The existing marketing page

**App:** `apps/main`. **Route:** `/` only. It is the sole page in the app;
`find apps/main/app -name "page.jsx"` returns exactly one file.

**Entry point:** `apps/main/app/page.jsx:19`, a client component
(`"use client"` at line 1) that composes fourteen sections in this order
(`page.jsx:24-37`): Nav, Hero, Stats, Marquee, Problem, Portals, HowItWorks,
FlowPortal, Results, Testimonials, Pricing, Why, CTA, Footer.

**Components:** `apps/main/components/Home/` — sixteen files. Fourteen sections
plus `Reveal.jsx` (scroll animation wrapper), `Mockups.jsx` (device mockups,
imported by another section rather than by the page) and `constants.js` (copy
and data).

**Styles:** `apps/main/assets/css/globals.css`. Tailwind v4 via
`@import "tailwindcss"` (line 6) with an `@theme` token block (line 12). The
file header reads "Provider Portal (extendable to all portals)" (line 3) — it
is the provider portal's stylesheet, copied.

**Assets:** `apps/main/public/favicon.svg` is the only file in `public/`. No
Open Graph image, no `robots.txt`, no `sitemap.xml`, no fonts.

**Metadata:** `apps/main/app/layout.jsx:5` calls `createPageSeo` from
`apps/main/utils/metadata.js`.

**Forms:** not found. There is no form anywhere in `apps/main`. `react-hook-form`
and `zod` are dependencies (`apps/main/package.json`) and are not imported by any
file in the app.

**Public URLs served:** `/` is the only route. Four in-page anchors exist:
`#portals` (`Portals.jsx:20`), `#flow` (`FlowPortal.jsx:40`), `#pricing`
(`Pricing.jsx:6`), `#testimonials` (`Testimonials.jsx:6`). `/privacy`, `/terms`
and `/accessibility` are not found, so the footer's links to them cannot resolve.

### Findings that affect the rebuild

**a. The marketing site is noindexed.** `createPageSeo` defaults to
`noIndex: true` (`utils/metadata.js:10`), and `layout.jsx:5` calls it without
overriding that, so every page emits `robots: { index: false, follow: false,
nocache: true }` (`utils/metadata.js:27-28`). Correct for a portal, wrong for
the one app whose job is to be found.

**b. Canonical URLs point at a domain that is not served.**
`PORTAL.baseUrl` is `https://main.gradlly.com` (`config/portal.config.js:16`).
The site is served from `gradlly.co.uk`. Every canonical and Open Graph URL
therefore names a host that does not resolve to this app.

**c. Titles and description are the provider portal's.** `PORTAL.name`
evaluates to "Main Portal" (`portal.config.js:11`), giving a title suffix of
"Main Portal · Gradlly" (`metadata.js:15`), and `defaultDescription`
(`portal.config.js:17-18`) describes "learner cohorts, 12-weekly reviews, ILR
submissions, and Ofsted readiness". Three files in this app carry a header
comment naming `apps/provider` as their origin: `next.config.js:2`,
`portal.config.js:2`, `utils/metadata.js:2`.

**d. Declared fonts are never loaded.** `globals.css:14-15` declares Poppins
and JetBrains Mono. `apps/main/package.json` has no font dependency and no file
in the app imports `next/font`, so both fall back to the system stack.

**e. The page contains fabricated proof.** Recorded here because the brief
forbids inventing it and because the current page is to be kept and linked from
the new nav. See section 8.

---

## 3. What links to and from it

**From the page, outward:** every outward link is a dead `href="#"`. Nine of
them: `Nav.jsx:22` (logo), `Nav.jsx:43` (Sign in), `Nav.jsx:49` (Get started
free), `Nav.jsx:86` (mobile Get started free), `Hero.jsx:61`, `CTA.jsx:42`,
`CTA.jsx:48`, `Footer.jsx:73`, `Footer.jsx:94`, `Pricing.jsx:108`. The only
working links are the four in-page anchors (`Nav.jsx:7-10`, `Hero.jsx:67`).

The nav's "Sign in" at `Nav.jsx:43` therefore does not reach any portal today.
Decision 2's env-driven sign-in link replaces a link that has never worked.

**Into the page, from the portals:** not found. No portal references
`gradlly.co.uk`, `gradlly.com` or `NEXT_PUBLIC_MAIN_URL` in a link.

**From API email templates:** not found. `grep -rln "gradlly.co.uk\|gradlly.com\|MAIN_URL" graddly-api/src`
returns no matches, so no transactional email points at a marketing URL and no
email copy breaks if the page changes.

**Conclusion on in-place rebuild:** no portal route depends on `apps/main`, and
nothing links into it. Rebuilding in place breaks nothing. No hard stop.

---

## 4. Shared packages

**There are none.** `packages/` does not exist — `ls -d */` in the repo root
returns `apps/ docker/ docs/ e2e/ node_modules/ scripts/ test-results/`. The
root `README.md:16` has a "Packages" heading, which is stale.

Each app carries its own copy of everything: its own `globals.css`, its own
`components/ui/Modal.jsx`, its own `SingleSelectField.jsx`, its own
`config/portal.config.js`, its own `utils/metadata.js`. The four portals were
given separate fonts and palettes in `f6a971e`.

Consequences for this job:

- **Nothing can be reused without copying it**, and nothing can be changed in a
  way that reaches a portal. The hard stop about changing a shared package
  cannot be triggered, because there is no shared package to change.
- **Tailwind is configured per app** through `@theme` in each app's CSS, not
  through a root config. `apps/main/postcss.config.js` exists; `tailwindcss`
  itself is hoisted to the root `node_modules` and is not listed in
  `apps/main/package.json`.
- **The duplication is deliberate.** Marketing tokens go in
  `apps/main/assets/css/` and nowhere else.

---

## 5. Sign-in URLs

Every portal uses the same route, `(auth)/login`:

| Portal     | File                                        | URL                                      |
| ---------- | ------------------------------------------- | ---------------------------------------- |
| Apprentice | `apps/apprentice/app/(auth)/login/page.jsx` | `https://apprentice.gradlly.co.uk/login` |
| Employer   | `apps/employer/app/(auth)/login/page.jsx`   | `https://employer.gradlly.co.uk/login`   |
| Flow       | `apps/flow/app/(auth)/login/page.jsx`       | `https://flow.gradlly.co.uk/login`       |
| Provider   | `apps/provider/app/(auth)/login/page.jsx`   | `https://provider.gradlly.co.uk/login`   |

`(auth)` is a route group, so it contributes nothing to the path.

The env var names already exist in the Turbo build allowlist
(`turbo.json:13-21`): `NEXT_PUBLIC_EMPLOYER_URL`, `NEXT_PUBLIC_PROVIDER_URL`,
`NEXT_PUBLIC_APPRENTICE_URL`, `NEXT_PUBLIC_FLOW_URL`, `NEXT_PUBLIC_MAIN_URL`.
Decision 2's sign-in link should use these rather than introduce new names.

---

## 6. The email path

It exists in the API, not the frontend.

`graddly-api/src/email/email.module.ts:27-31` selects a sender from config:
`resend` or `noop`, **defaulting to `noop`** (line 29). The two implementations
are `providers/resend-email.sender.ts` and `providers/noop-email.sender.ts`.

There is no email path in the frontend. `apps/main` has no API route, and
`find apps/main -name "route.js"` returns nothing.

So for Phase 3 item 4: the existing path is the API's `EmailModule`, and
whether it is live depends on one env var at runtime, not on code. The adapter
should call it rather than reach for Resend directly, and must behave correctly
when the provider is `noop` — which is the default, and therefore the state to
build and test against.

---

## 7. Turbo and CI

**Turbo** (`turbo.json`) defines five tasks: `dev`, `build`, `lint`,
`check-types`, `test`, `clean`. There is no `e2e` task. `apps/main` defines
`dev`, `build`, `start`, `lint`, `type-check`, `clean` — note `type-check`,
while the Turbo task is `check-types`, so **`apps/main` is not covered by
`turbo run check-types`**.

**CI** is `.github/workflows/ci.yml`, on pull request and push to `main`. Nine
steps: Lint (`:43`), Typecheck (`:46`), Type-check ratchet (`:52`), FAB coverage
(`:56`), App test-task coverage (`:68`), Unit tests (`:73`), Build affected
(`:76`), Security audit (`:79`).

`.github/workflows/preview.yml` builds affected packages on pull requests. Its
second half, lines 33-60, is a commented-out duplicate of itself.

**No workflow deploys.** Deployment is Vercel's own Git integration, so the
"Wait for CI" gate in Phase 5 is a Vercel project setting and is **not found in
this repository**. It cannot be verified from the code.

Files that change to add Playwright and axe to `apps/main` only:

1. `apps/main/package.json` — add `test:e2e` and `test:a11y` scripts scoped to
   this app, and `@playwright/test` + `@axe-core/playwright` as devDependencies.
   Both are already installed at the root for the existing `e2e/` suite
   (`@axe-core/playwright: ^4.13.0`, `@playwright/test: ^1.62.1`).
2. `apps/main/playwright.config.js` — new, `testDir` scoped to the app. The root
   `playwright.config.js` points at `./e2e` and covers the portals; keeping a
   separate config is what lets the portals adopt the same shape later without
   inheriting marketing's routes.
3. `turbo.json` — add an `e2e` task. It must be `cache: false`, because it
   depends on running servers rather than on file inputs.
4. `.github/workflows/ci.yml` — a step after Build.
5. `scripts/lib/app-test-policy.mjs` — `main` is on the `EXEMPT` map
   (`app-test-policy.mjs:33-37`) with the reason "Marketing site: static
   content, no data layer. Lowest value of the three, but still owes at least a
   render smoke test."

   This has a trap in it. `verify-app-test-tasks.mjs:66-69` fails the build when
   an app **has** a `test` script and is **still** listed as exempt. So adding a
   `test` script to `apps/main` without removing `main` from `EXEMPT` turns CI
   red, and the failure reads as a policy violation rather than as a missing
   test. Adding only `test:e2e` and `test:a11y` does not trip it, because the
   gate keys on `test` specifically. Either is fine; doing the first without the
   second is not.

---

## 8. Blocker-level finding: fabricated proof on the page being kept

The brief forbids inventing "copy, figures, logos, testimonials or customer
names", and `content-v1.md`'s own Before launch list says "Add proof once
available: a pilot provider, employer logos or a short quote. **Use no figures
until they are real.**"

The existing page is built on exactly that. `apps/main/components/Home/constants.js`
carries six attributed testimonials:

- `constants.js:76-77` — "Sarah H.", Head of L&D, Manufacturing Group
- `constants.js:84-85` — "Marcus K.", Quality Manager, Training Provider
- `constants.js:92-93` — "Jamie O.", Data Technician Apprentice
- `constants.js:100-101` — "Alison T.", Corporate L&D Director, **NHS Trust**
- `constants.js:108-109` — "Raj P.", Founder, Digital Marketing Agency
- `constants.js:116-117` — "Nikki C.", Programme Director, Training Provider

And figures presented as fact: `£142,400` (`Mockups.jsx:48`), `94%`
(`Mockups.jsx:77`), `2,700` (`Problem.jsx:8`), `>80%` (`FlowPortal.jsx:33`),
`£3.5` billion (`Stats.jsx:2`, `Problem.jsx:13`, `FlowPortal.jsx:50`), `£45`
(`Problem.jsx:22`), `£8,000` (`Mockups.jsx:209`).

This has not mattered while the page was noindexed and unlinked. It starts
mattering the moment the instruction is "keep this page and link to it from the
nav as Gradlly OS", because that publishes an invented quote attributed to a
director at an NHS Trust, from a navigation item on the new page.

**Not worked around.** Raised for a decision, with the options set out in the
report. Nothing has been changed.

---

## 9. Summary against the brief's hard stops

| Hard stop                                              | Status                                             |
| ------------------------------------------------------ | -------------------------------------------------- |
| Marketing page cannot be located                       | Located: `apps/main`, route `/`                    |
| Rebuilding in place would break a portal route         | No. Nothing links into `apps/main` (section 3)     |
| Rebuilding in place requires changing a shared package | Impossible. `packages/` does not exist (section 4) |

In-place rebuild is clear to proceed. The one item needing a decision before
Phase 3 is section 8, and it concerns the page being preserved rather than the
page being built.
