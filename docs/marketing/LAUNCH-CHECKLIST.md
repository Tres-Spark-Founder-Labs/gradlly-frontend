# Launch checklist — marketing site (`apps/main`)

What has to be true before `apps/main` goes live on the production domain, and
where each item lives in the code. Items are grouped by who can close them.

The content source of record is [`content-v1.md`](./content-v1.md); its own
"Before launch" list is reproduced here with the code location added.

---

## 1. Needs the client

These cannot be closed from the repository. Each one is wired so the site
renders correctly while the value is missing — the line simply does not appear —
so none of them blocks a deploy, but each leaves the page less complete than it
should be.

| #   | Item                                      | Where it goes                                                 | Current behaviour                                               |
| --- | ----------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| 1.1 | Contact email for the demo section        | `SITE.contactEmail` in `apps/main/config/site.config.js`      | The "Or email us at …" line does not render                     |
| 1.2 | Registered company details for the footer | `SITE.registeredDetails` in `apps/main/config/site.config.js` | The footer reads "© 2026 Gradlly." with nothing after it        |
| 1.3 | Production domain                         | `NEXT_PUBLIC_SITE_URL`                                        | Canonical URLs and the sitemap point at `http://localhost:3005` |
| 1.4 | Portal sign-in URLs                       | `NEXT_PUBLIC_{EMPLOYER,PROVIDER,APPRENTICE,FLOW}_URL`         | A portal with no URL is left out of the Sign in menu            |
| 1.5 | Where the demo form's submissions go      | `apps/main/app/api/demo-request/route.js`                     | Confirm the destination before the form is reachable in public  |

**1.1 and 1.2 used to be visible.** They shipped as literal `[CONTACT EMAIL]`
and `[REGISTERED COMPANY DETAILS]`, in square brackets, on the live page, each
with a `title` attribute pointing at this file — which did not exist. A visitor
does not read a `title`, and a page that prints its own placeholders reads as
broken rather than as unfinished. Both now follow the rule `PORTAL_SIGN_IN`
already set: render the slot only when there is something to put in it.

---

## 2. Needs a product decision

From `content-v1.md`'s own list. Each changes copy that is currently on the
page, so each needs an answer before the copy is final.

- [ ] **Is the Passport-to-Continuo handoff on the roadmap?** If not, remove the
      "Better together" block in §08 and the last Passport bullet in §07.
- [ ] **Keep the name "Trust Score", or rename it?** It appears in the "Four
      ways to work with Continuo" group in §03.
- [ ] **Does the Continuo section name a first sector** — adult social care,
      agency staffing — or stay sector-neutral?
- [ ] **Does Continuo describe skills against recognised occupational
      standards?** §04's detail panel says it does. If that is not how skills
      are defined, that line has to change.

---

## 3. Proof, when there is any

`content-v1.md`: _"Add proof once available: a pilot provider, employer logos or
a short quote. Use no figures until they are real."_

There is currently **no proof slot on the page at all**, which is deliberate.
An earlier version carried £142,400, 94%, 2,700, >80%, £3.5bn and £8,000, none
of which had a source, plus a testimonials section with invented attributions.
Those were removed rather than replaced with placeholders, because a layout
holding an empty proof slot invites someone to fill it with an estimate.

When real proof exists, add the slot then. The same rule applies inside the
product visuals: the hero's pace chart has no axis and no percentage, the
readiness list reports states rather than counts, and the record's date column
is a neutral block, all for this reason. See
`apps/main/components/site/HeroStack.jsx`.

---

## 4. Known stale configuration

Found while wiring the two placeholders. Neither breaks the build, and neither
is user-visible today, but both will mislead the next person to read the file.

- **`PAGES` in `config/site.config.js` still describes seven pages.** It lists
  `/continuo`, `/apprenticeship-passport`, `/how-it-works`, `/who-its-for` and
  `/book-a-demo` as routes. They are sections of the single page now, and only
  `/` and `/gradlly-ams` exist. `PAGES` is unused by the current page; it should
  be deleted or reduced to the two real routes before anything starts reading it
  again.
- **`SITE.themeColor` is `#13233a`**, a navy from the pre-restyle palette. The
  site's surfaces are cream `#faf5f1` and olive `#3d4128`. The theme colour is
  what a mobile browser paints its chrome with, so this is visible on a phone.
- **`PAGES[].mark` uses `navy`, `teal` and `brass`.** The palette is olive,
  terracotta and chartreuse. Dead alongside `PAGES` itself.

---

## 5. Still to run

Verification that was scoped and has not been executed. None of it has been
run, so none of it should be reported as passing.

- [ ] **axe** on `/`, `/gradlly-ams`, `/privacy`, `/terms`, `/accessibility`
- [ ] **Lighthouse** on `/` and `/gradlly-ams`, mobile and desktop
- [ ] **Keyboard pass**: the section rail, the record's replay control, the
      share radiogroup, the three disclosures, the three-step demo form
- [ ] **Demo form states** end to end: empty, invalid, sending, error, sent
- [ ] **Link resolution**: every `href` on the site, including the Sign in menu
      with and without the portal variables set
- [ ] **Copy diff** of every string on the page against `content-v1.md`
- [ ] **Bundle sizes** recorded, so a regression has something to regress from
- [ ] **Playwright + axe wired into CI** for `apps/main`. The app is currently
      in `EXEMPT` in `scripts/lib/app-test-policy.mjs`; it comes out of that
      list once it has a `test` script.

### What has been checked

So the list above is not read as "nothing has been verified":

- eslint and `next build` clean
- No horizontal overflow at 390, 768, 1024, 1280, 1440 or 1600
- All 20 reveal blocks reach opacity 1 after a scroll walk, measured in-browser
- All ten `<section>` landmarks carry an `aria-labelledby` that resolves to a
  real heading, checked against the DOM
- All ten section reference labels measured for contrast against the band each
  sits on: 4.61:1 to 10.53:1, every one passing AA for normal text
- Chartreuse display type on olive measured at 8.5:1
