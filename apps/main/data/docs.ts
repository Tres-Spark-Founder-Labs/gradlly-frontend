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
          'Only clientEnv is exported by config/env/index.ts to prevent serverEnv leaks into client components.',
        ],
      },
      {
        id: 'validation',
        title: 'Validation workflow',
        content: [
          'Environment values are validated with strict Zod schemas for both server and client scopes.',
          'Client variables must use the NEXT_PUBLIC_ prefix and are safe to consume in client code.',
          'Server variables are parsed only from server files and never re-exported through index.ts.',
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
];

export const appLinks: AppLink[] = [
  { id: 'employer', label: 'Employer', href: clientEnv.NEXT_PUBLIC_EMPLOYER_URL },
  { id: 'provider', label: 'Provider', href: clientEnv.NEXT_PUBLIC_PROVIDER_URL },
  { id: 'apprentice', label: 'Apprentice', href: clientEnv.NEXT_PUBLIC_APPRENTICE_URL },
  { id: 'flow', label: 'Flow', href: clientEnv.NEXT_PUBLIC_FLOW_URL },
  { id: 'main', label: 'Main', href: clientEnv.NEXT_PUBLIC_MAIN_URL },
];
