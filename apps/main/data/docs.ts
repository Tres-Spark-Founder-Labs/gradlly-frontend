import type { DocSection } from '@/types/docs';

export const docsSections: DocSection[] = [
  {
    id: 'environment',
    title: 'Environment',
    content: [
      'Overview',
      'The environment system is centralized in packages/env with strict server and client separation.',
      'All apps read from the workspace root .env file so each portal shares one source of truth.',
      'Local development falls back to safe localhost defaults for required NEXT_PUBLIC variables.',
      'File structure',
      'packages/env/index.ts',
      'packages/env/client.ts',
      'packages/env/server.ts',
      'packages/env/schema.ts',
      'Naming rules',
      'Client variables must start with NEXT_PUBLIC_.',
      'Server variables must never be exposed in client code.',
      'Env guide',
      '1. Add the variable to .env.example.',
      '2. Add it to the zod schema in packages/env/schema.ts.',
      '3. Access values through serverEnv or clientEnv exports.',
      'Server usage example',
      "import { serverEnv } from '@env';",
      'const tokenName = serverEnv.JWT_ACCESS_TOKEN_NAME;',
      'Client usage example (NEXT_PUBLIC only)',
      "import { clientEnv } from '@env';",
      'const apiBaseUrl = clientEnv.NEXT_PUBLIC_API_BASE_URL;',
      'Quick links',
      'Use the domain links above to open each portal in a new tab.',
    ],
    links: [
      { label: 'Employer', href: process.env['NEXT_PUBLIC_EMPLOYER_URL'] ?? '#' },
      { label: 'Provider', href: process.env['NEXT_PUBLIC_PROVIDER_URL'] ?? '#' },
      { label: 'Apprentice', href: process.env['NEXT_PUBLIC_APPRENTICE_URL'] ?? '#' },
      { label: 'Flow', href: process.env['NEXT_PUBLIC_FLOW_URL'] ?? '#' },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    content: [
      'This monorepo uses Turborepo with modular applications and shared packages.',
      'Shared packages: config, env, ui, utils, and types.',
      'Applications are isolated but can consume shared workspace libraries.',
    ],
  },
];
