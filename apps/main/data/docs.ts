import type { DocsPage } from "@/types/docs";

export const docsPages: DocsPage[] = [
  {
    id: "eslint",
    title: "ESLint setup",
    sections: [
      {
        id: "eslint-source",
        title: "Configuration source",
        content: [
          "The monorepo ESLint preset is defined in packages/config/eslint/eslint.config.js and consumed by each app/package.",
          "Type-aware linting is enabled through project tsconfig references, so architectural and TypeScript checks run together.",
        ],
      },
      {
        id: "lint-rules",
        title: "Core lint rules",
        rules: [
          {
            id: "no-duplicate-imports",
            name: "no-duplicate-imports",
            enforces: "Keeps imports normalized and prevents repeated imports from the same module.",
            badExample: "import { a } from './x';\nimport { b } from './x';",
            goodExample: "import { a, b } from './x';",
          },
          {
            id: "consistent-type-imports",
            name: "@typescript-eslint/consistent-type-imports",
            enforces: "Requires type-only symbols to use import type syntax.",
            badExample: "import { User } from '@/types/user';",
            goodExample: "import type { User } from '@/types/user';",
          },
        ],
      },
    ],
  },
  {
    id: "imports",
    title: "Import rules",
    sections: [
      {
        id: "boundaries",
        title: "Dependency boundaries",
        content: [
          "Import from workspace package roots (for example, @gradlly/ui) instead of internal deep paths.",
          "In apps/main, localized modules should be imported through @/features/* and @/lib/* aliases.",
          "Cross-app imports are disallowed; shared code must live under packages/*.",
        ],
      },
    ],
  },
  {
    id: "architecture",
    title: "Dependency boundaries",
    sections: [
      {
        id: "ui-feature",
        title: "Layering rules",
        content: [
          "ui cannot import feature modules.",
          "feature modules cannot import other feature modules.",
          "utility packages must remain dependency-light and avoid feature/UI coupling.",
        ],
      },
    ],
  },
  {
    id: "structure",
    title: "Folder structure",
    sections: [
      {
        id: "main-layout",
        title: "apps/main localized structure",
        content: [
          "apps/main/features/auth contains auth feature logic (services, queries, hooks, types, constants, querykeys).",
          "apps/main/lib/api contains the app-local API client layer.",
          "apps/main/lib/react-query contains query client, provider, and hydration helpers.",
          "packages/hooks is the new lightweight shared hooks package for non-feature-specific hooks.",
        ],
      },
    ],
  },
];
