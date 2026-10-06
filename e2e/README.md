# Browser tests

Two suites, both run by Playwright against a stack you start yourself.

| Spec                         | What it covers                                                    |
| ---------------------------- | ----------------------------------------------------------------- |
| `apprentice-journey.spec.js` | The apprentice's end-to-end path through Portal 3                 |
| `accessibility.spec.js`      | WCAG 2.1 AA audit of all four portals, plus design-token contrast |

`playwright.config.js` has no `webServer`, on purpose — see the comment at the
top of it. Nothing here boots the application, so a missing process fails as a
stated precondition rather than as a plausible-looking application bug.

## What has to be running

| Process      | Port | Notes                                               |
| ------------ | ---- | --------------------------------------------------- |
| Postgres     | 5432 | seeded with `graddly-api/scripts/seed-test-data.ts` |
| Redis        | 6379 | sessions and the idle-timeout keys                  |
| API + worker | 3100 | `yarn start:dev` in `graddly-api`                   |
| apprentice   | 3001 | `npm run dev:apprentice`                            |
| employer     | 3002 | `npm run dev:employer`                              |
| flow         | 3003 | `npm run dev:flow`                                  |
| provider     | 3004 | `npm run dev:provider`                              |

The Flow portal also needs `seed-flow-portal.ts`: no organisation in the main
seed has `portalType === 'flow'`, so without it the Flow login succeeds and the
dashboard has nothing to render.

```bash
npx playwright test                       # everything
npx playwright test e2e/accessibility.spec.js
```

## Running the accessibility audit

The audit doubles as the evidence for QA sign-off, so it refuses to run against
a stack it cannot name. Set `ACCESSIBILITY_AUDIT=1` and it checks four things
before the first browser opens (`assertPinnedAuditEnvironment` in
`auth.setup.js`):

```bash
export ACCESSIBILITY_AUDIT=1
export MFA_REQUIRED_FOR_ADMINS=false
export AUDIT_FRONTEND_COMMIT=$(git -C . rev-parse HEAD)
export AUDIT_API_COMMIT=$(git -C ../graddly-api rev-parse HEAD)
npx playwright test e2e/accessibility.spec.js
```

- **`MFA_REQUIRED_FOR_ADMINS=false`** — on the API deployment _and_ in this
  shell. The employer and Flow logins are organisation owners, who are
  challenged for a TOTP code otherwise. `seeded-users.js` detects that
  challenge and says so rather than timing out on a redirect that will never
  come.
- **`AUDIT_FRONTEND_COMMIT` / `AUDIT_API_COMMIT`** — both repositories must be
  at these commits with clean worktrees. A report that cannot name the code it
  audited is not evidence of anything, and an uncommitted change means the
  commit does not identify what ran.

Without `ACCESSIBILITY_AUDIT=1` the suite still runs; it just does not pin
anything. That is the right mode for working on it, and the wrong one for
producing a report.

## What the gate asserts

- **axe-core**, tags `wcag2a wcag2aa wcag21a wcag21aa`, failing only on
  `serious` and `critical`. `moderate` and `minor` are recorded in the
  attachment but do not fail the build — they are a backlog, not a gate.
- **Contrast specimens** measured from the live computed styles rather than
  from the token source, so a token that is overridden downstream is caught.
  Chromium does the sRGB conversion via a canvas, which avoids keeping a
  partial CSS colour parser in the spec; `lab()` and `oklch()` therefore work.
- **Keyboard**: the apprentice OTJ path is walked by Tab and Enter only — the
  FAB must be reachable, the dialog must trap focus and wrap, Escape must close
  it, and focus must return to the FAB.
- **One performance assertion**: OTJ submission inside 30 seconds.

Every run attaches `axe-<portal>-<route>.json` and `contrast-<portal>.json` to
the Playwright report, including for routes that passed. The attachment is the
deliverable; the pass/fail is the gate.

## Scope, and what is deliberately not covered

The audit visits a fixed list of routes, named at the top of each `describe`
block. The contrast fixes that accompany it were made for those routes, and
`text-neutral-400` (about 2.5:1 on white) still
appears elsewhere in the four portals. That is not an oversight to sweep
blindly: the same class is fine on a dark surface and fine on an icon, which
is a 3:1 rule rather than 4.5:1, so each remaining instance needs its rendered
background checked. Widen the route list and fix what the run reports.

Not audited at all: `apps/main`, and any route reachable only by completing a
write the audit does not perform.

Two portals have no unit tests of their own (`provider`, `flow` have no `test`
script), so for those this suite is the only automated coverage there is.
