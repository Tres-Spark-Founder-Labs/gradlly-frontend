# Gradlly — Frontend Monorepo

Apprenticeships, in progress.

## What's inside?

### Apps

| App               | Portal                 | Domain                 | Port |
| ----------------- | ---------------------- | ---------------------- | ---- |
| `apps/employer`   | P1 — Employer Portal   | employer.gradlly.com   | 3001 |
| `apps/provider`   | P2 — Provider Portal   | provider.gradlly.com   | 3002 |
| `apps/apprentice` | P3 — Apprentice Portal | apprentice.gradlly.com | 3003 |
| `apps/flow`       | P4 — FlowPortal        | flow.gradlly.com       | 3004 |

### Packages

| Package           | Purpose                                                   |
| ----------------- | --------------------------------------------------------- |
| `@gradlly/ui`     | Shared React component library                            |
| `@gradlly/utils`  | Shared utilities, types, and API client                   |
| `@gradlly/config` | Shared ESLint, Prettier, TypeScript, and Tailwind configs |

---

## Prerequisites

```sh
node >= 20
npm  >= 9
```

---

## Getting Started

Install all dependencies from the root:

```sh
npm install
```

Copy environment files for each portal you're working on:

```sh
cp apps/employer/.env.local.example   apps/employer/.env.local
cp apps/provider/.env.local.example   apps/provider/.env.local
cp apps/apprentice/.env.local.example apps/apprentice/.env.local
cp apps/flow/.env.local.example       apps/flow/.env.local
```

---

## Development

Run all four portals concurrently:

```sh
npm run dev
```

Run a single portal:

```sh
npm run dev:employer    # localhost:3001
npm run dev:provider    # localhost:3002
npm run dev:apprentice  # localhost:3003
npm run dev:flow        # localhost:3004
```

---

## Build

Build all portals:

```sh
npm run build
```

Build a single portal:

```sh
npx turbo build --filter=@gradlly/employer
```

---

## Lint & Format

```sh
npm run lint          # ESLint across all workspaces
npm run lint:fix      # ESLint with auto-fix
npm run typecheck     # TypeScript strict check across all workspaces
npm run format        # Prettier — write
npm run format:check  # Prettier — check only (used in CI)
```

---

## Clean

```sh
npm run clean   # removes all .next, dist, and node_modules
```

---

## Adding Dependencies

```sh
# To a specific portal
npm install axios --workspace=apps/employer

# To a shared package
npm install clsx --workspace=packages/ui

# To the repo root (dev tooling only)
npm install -D turbo -w
```

---

## Project Structure

```
gradlly/
├── apps/
│   ├── employer/       # P1 — Levy management, apprentice tracking, compliance
│   ├── provider/       # P2 — Ofsted readiness, cohort management, ILR submission
│   ├── apprentice/     # P3 — OTJ logging, KSB portfolio, EPA readiness (mobile-first)
│   └── flow/           # P4 — Levy exchange, SME matching, AI programme delivery
├── packages/
│   ├── ui/             # Shared component library
│   ├── utils/          # Shared types, API client, formatting utilities
│   └── config/         # ESLint, Prettier, TypeScript, Tailwind base configs
├── turbo.json
├── package.json
└── .npmrc
```

---

## Tech Stack

- **Framework** — Next.js (App Router)
- **Language** — TypeScript 5.9 (strict mode)
- **Styling** — Tailwind CSS with per-portal design tokens
- **Monorepo** — Turborepo 2
- **Package manager** — npm 11
- **Linting** — ESLint + Prettier 3

---

## Remote Caching

Turborepo Remote Cache is free on all Vercel plans and speeds up CI significantly.

```sh
npx turbo login   # authenticate with your Vercel account
npx turbo link    # link this repo to Vercel Remote Cache
```

---

## Useful Links

- [Turborepo docs](https://turborepo.dev/docs)
- [Next.js docs](https://nextjs.org/docs)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
