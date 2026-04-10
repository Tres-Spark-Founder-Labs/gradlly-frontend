import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

const hasTypeScriptImportResolver = (() => {
  try {
    return Boolean(import.meta.resolve("eslint-import-resolver-typescript"));
  } catch {
    return false;
  }
})();

const reactHooksRecommendedRules = reactHooksPlugin.configs.recommended?.rules ?? {};
const nextRecommendedRules = nextPlugin.configs.recommended?.rules ?? {};
const nextCoreWebVitalsRules = nextPlugin.configs["core-web-vitals"]?.rules ?? {};

const sharedRules = {
  "no-console": ["warn", { allow: ["error"] }],
  eqeqeq: ["error", "always"],
  "no-var": "error",
  "prefer-const": "error",
  "no-duplicate-imports": "error",
  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "object", "type"],
      "newlines-between": "always",
      alphabetize: {
        order: "asc",
        caseInsensitive: true,
      },
    },
  ],
  "react/jsx-key": "error",
  "react-hooks/exhaustive-deps": "error",
  "@next/next/no-img-element": "error",
};

const pluginMap = {
  "@typescript-eslint": tsPlugin,
  import: importPlugin,
  react: reactPlugin,
  "react-hooks": reactHooksPlugin,
  "@next/next": nextPlugin,
};

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/next-env.d.ts",
      "**/*.config.{js,cjs,mjs,ts}",
      "eslint.config.js",
      "lint-staged.config.js",
      "prettier.config.mjs",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    rules: Object.assign({}, reactHooksRecommendedRules, nextRecommendedRules, nextCoreWebVitalsRules, sharedRules, {
      "@next/next/no-html-link-for-pages": "off",
    }),
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json", "./packages/feature/*/tsconfig.json"],
        tsconfigRootDir: import.meta.dirname + "/../..",
      },
      globals: {
        console: "readonly",
        process: "readonly",
        fetch: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      ...(hasTypeScriptImportResolver
        ? {
            "import/resolver": {
              typescript: true,
            },
          }
        : {}),
    },
    plugins: pluginMap,
    rules: Object.assign({}, reactHooksRecommendedRules, nextRecommendedRules, nextCoreWebVitalsRules, sharedRules, {
      "@next/next/no-html-link-for-pages": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/no-floating-promises": "error",
    }),
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@gradlly/ui/*",
                "@gradlly/utils/*",
                "@gradlly/api/*",
                "@gradlly/types/*",
                "@gradlly/lib/*",
                "@gradlly/feature-*/*",
              ],
              message: "Import from package roots only (e.g. @gradlly/ui).",
            },
            {
              group: ["**/packages/**"],
              message: "Do not import using package filesystem paths. Use workspace package aliases.",
            },
          ],
          paths: [
            {
              name: "@gradlly/lib/react-query",
              message: "Import from @gradlly/lib only.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/ui/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@gradlly/feature-*"],
              message: "UI package must not depend on feature packages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/feature/*/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@gradlly/feature-*"],
              message: "Feature packages must not depend on other feature packages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/api/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@gradlly/feature-*"],
              message: "API package must not depend on feature packages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/utils/src/**/*.{ts,tsx}", "packages/types/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@gradlly/feature-*", "@gradlly/ui"],
              message: "Utility/type packages must remain dependency-light.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@gradlly/ui/*', '@gradlly/utils/*', '@gradlly/api/*', '@gradlly/types/*', '@gradlly/lib/*', '@gradlly/feature-*/*'],
              message: 'Import from package roots only (e.g. @gradlly/ui).',
            },
            {
              group: ['**/packages/**'],
              message: 'Do not import using package filesystem paths. Use workspace package aliases.',
            },
          ],
          paths: [
            {
              name: '@gradlly/lib/react-query',
              message: 'Import from @gradlly/lib only.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/ui/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@gradlly/feature-*'],
              message: 'UI package must not depend on feature packages.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/feature/*/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@gradlly/feature-*'],
              message: 'Feature packages must not depend on other feature packages.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/api/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@gradlly/feature-*'],
              message: 'API package must not depend on feature packages.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/utils/src/**/*.{ts,tsx}', 'packages/types/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@gradlly/feature-*', '@gradlly/ui'],
              message: 'Utility/type packages must remain dependency-light.',
            },
          ],
        },
      ],
    },
  }
];
