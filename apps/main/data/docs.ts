import { clientEnv } from '@/config/env/client';
import type { AppLink, DocsPage } from '@/types/docs';

export const docsPages: DocsPage[] = [
  {
    id: 'env',
    title: 'Environment',
    sections: [
      {
        id: 'ownership',
        title: 'Per-app ownership',
        content: [
          'Each application owns its own environment schema, client parser, and server parser under config/env.',
          'Import client values from config/env/client and server values from config/env/server.',
        ],
      },
      {
        id: 'validation',
        title: 'Validation workflow',
        content: [
          'Environment values are validated with strict Zod schemas for both server and client scopes.',
          'Client variables must use the NEXT_PUBLIC_ prefix and are safe to consume in client code.',
          'Server variables are parsed only in config/env/server and cannot be consumed from client modules.',
        ],
      },
      {
        id: 'usage',
        title: 'Usage patterns',
        content: [
          "Server usage: import { serverEnv } from '@/config/env/server'",
          "Client usage: import { clientEnv } from '@/config/env/client'",
          'Use NEXT_PUBLIC_* URLs for cross-app links and navigation.',
        ],
      },
    ],
  },
  {
    id: 'eslint',
    title: 'ESLint & Code Standards',
    sections: [
      {
        id: 'eslint-imports',
        title: 'Imports',
        rules: [
          {
            id: 'import-order',
            name: 'import/order',
            enforces:
              'Groups imports (builtin/external/internal/relative/type), requires newline boundaries, and alphabetizes import statements.',
            badExample: "import z from 'z';\nimport fs from 'node:fs';",
            goodExample: "import fs from 'node:fs';\n\nimport z from 'z';",
          },
          {
            id: 'duplicate-imports',
            name: 'no-duplicate-imports',
            enforces: 'Prevents multiple import declarations from the same module.',
            badExample: "import { a } from './utils';\nimport { b } from './utils';",
            goodExample: "import { a, b } from './utils';",
          },
          {
            id: 'type-imports',
            name: '@typescript-eslint/consistent-type-imports',
            enforces: 'Requires type-only imports to use the type import syntax.',
            badExample: "import { User } from '@/types/user';",
            goodExample: "import type { User } from '@/types/user';",
          },
        ],
      },
      {
        id: 'eslint-react',
        title: 'React & Hooks rules',
        rules: [
          {
            id: 'jsx-key',
            name: 'react/jsx-key',
            enforces: 'Requires stable key props for rendered lists.',
            badExample: '{items.map((item) => <li>{item.label}</li>)}',
            goodExample: '{items.map((item) => <li key={item.id}>{item.label}</li>)}',
          },
          {
            id: 'hooks-deps',
            name: 'react-hooks/exhaustive-deps',
            enforces: 'Requires React hook dependency arrays to include all referenced values.',
            badExample: 'useEffect(() => { sync(filters); }, []);',
            goodExample: 'useEffect(() => { sync(filters); }, [filters]);',
          },
          {
            id: 'next-img',
            name: '@next/next/no-img-element',
            enforces: 'Requires usage of next/image instead of raw img elements in Next.js apps.',
            badExample: "<img src='/logo.png' alt='logo' />",
            goodExample: "<Image src='/logo.png' alt='logo' width={80} height={80} />",
          },
        ],
      },
      {
        id: 'eslint-typescript',
        title: 'TypeScript strictness',
        rules: [
          {
            id: 'no-any',
            name: '@typescript-eslint/no-explicit-any',
            enforces: 'Disallows explicit any and requires concrete domain types.',
            badExample: 'const payload: any = response.data;',
            goodExample: 'const payload: UserPayload = response.data;',
          },
          {
            id: 'no-unused-vars',
            name: '@typescript-eslint/no-unused-vars',
            enforces:
              'Errors on unused variables; underscore-prefixed names are allowed for intentional unused params.',
            badExample: 'const data = fetchUser();',
            goodExample: 'const _data = fetchUser();',
          },
          {
            id: 'strict-boolean',
            name: '@typescript-eslint/strict-boolean-expressions',
            enforces: 'Prevents non-boolean values in conditionals.',
            badExample: 'if (user.name) {\n  openProfile();\n}',
            goodExample:
              'if (user.name !== undefined && user.name.length > 0) {\n  openProfile();\n}',
          },
          {
            id: 'no-floating-promises',
            name: '@typescript-eslint/no-floating-promises',
            enforces: 'Requires promises to be awaited, returned, or intentionally handled.',
            badExample: 'saveProfile(formValues);',
            goodExample: 'await saveProfile(formValues);',
          },
        ],
      },
      {
        id: 'eslint-general',
        title: 'General JavaScript standards',
        rules: [
          {
            id: 'eqeqeq',
            name: 'eqeqeq',
            enforces: 'Requires strict equality operators.',
            badExample: 'if (status == 1) {\n  proceed();\n}',
            goodExample: 'if (status === 1) {\n  proceed();\n}',
          },
          {
            id: 'prefer-const',
            name: 'prefer-const',
            enforces: 'Requires const when variables are never reassigned.',
            badExample: 'let apiUrl = buildUrl();',
            goodExample: 'const apiUrl = buildUrl();',
          },
          {
            id: 'no-var',
            name: 'no-var',
            enforces: 'Blocks var declarations in favor of let/const.',
            badExample: 'var retries = 3;',
            goodExample: 'const retries = 3;',
          },
          {
            id: 'no-console',
            name: 'no-console (warn, allows console.error)',
            enforces: 'Warns on console usage except console.error for operational errors.',
            badExample: "console.log('debug payload', payload);",
            goodExample: "console.error('request failed', error);",
          },
        ],
      },
      {
        id: 'eslint-project-restrictions',
        title: 'Project-specific restrictions',
        content: [
          'Configuration files and generated files are excluded through ignore globs (node_modules, .next, dist, coverage, turbo cache, and config scripts).',
          'TypeScript linting resolves workspace tsconfig projects from apps/* and packages/* to enforce strict checks across the monorepo.',
          'Next.js page-link restriction @next/next/no-html-link-for-pages is explicitly disabled to support app-router layouts.',
        ],
      },
    ],
  },
  {
    id: 'guidelines',
    title: 'Developer Guidelines',
    sections: [
      {
        id: 'typing-guidelines',
        title: 'Typing and shared contracts',
        content: [
          'Avoid any in application and package code; model API contracts with explicit interfaces and Zod schemas.',
          'Use shared types from packages/types (or package-owned type modules) to avoid duplicating domain models across apps.',
          'Prefer type imports for type-only symbols and keep runtime imports clean.',
        ],
      },
      {
        id: 'architecture-guidelines',
        title: 'Code architecture standards',
        content: [
          'Use absolute imports configured by tsconfig paths for stable module boundaries.',
          'Do not create cross-app imports; shared logic belongs in packages/*.',
          'Keep components small, single-purpose, and modular to preserve testability and reuse.',
          'Follow feature-based structure by grouping related UI, hooks, schema, and data-access code together.',
        ],
      },
      {
        id: 'runtime-guidelines',
        title: 'Runtime and integration patterns',
        content: [
          'Read environment values through config/env/client and config/env/server modules only.',
          'Use fetch wrapper patterns from shared utilities for consistent request handling and error normalization.',
          'Promote side-effect safety: await promises and avoid implicit async work in render paths.',
        ],
      },
    ],
  },
  {
    id: 'tailwind-architecture',
    title: 'Tailwind Architecture',
    sections: [
      {
        id: 'tailwind-ownership',
        title: 'Compilation boundaries',
        content: [
          'Tailwind is compiled per app (apps/*) and styles are loaded only through each app/app/globals.css entrypoint.',
          'The shared UI package provides className-based components only and does not compile Tailwind itself.',
        ],
      },
      {
        id: 'tailwind-shared-config',
        title: 'Shared configuration model',
        content: [
          'Common Tailwind defaults live in packages/config/tailwind/base.ts as the monorepo source of truth.',
          'Each app tailwind.config.ts imports baseConfig and defines app-specific content globs, including packages/ui/src.',
        ],
      },
      {
        id: 'tailwind-extension',
        title: 'How to extend',
        content: [
          'Add a new Tailwind token by extending theme values in packages/config/tailwind/base.ts.',
          'Add new reusable UI components inside packages/ui/src and consume them from apps without introducing Tailwind build steps in packages/ui.',
          'If app-specific styles are required, extend only that app tailwind.config.ts content/theme while preserving shared base imports.',
        ],
      },
    ],
  },
];

export const appLinks: AppLink[] = [
  { id: 'employer', label: 'Employer', href: clientEnv.NEXT_PUBLIC_EMPLOYER_URL },
  { id: 'provider', label: 'Provider', href: clientEnv.NEXT_PUBLIC_PROVIDER_URL },
  { id: 'apprentice', label: 'Apprentice', href: clientEnv.NEXT_PUBLIC_APPRENTICE_URL },
  { id: 'flow', label: 'Flow', href: clientEnv.NEXT_PUBLIC_FLOW_URL },
  { id: 'main', label: 'Main', href: clientEnv.NEXT_PUBLIC_MAIN_URL },
];
