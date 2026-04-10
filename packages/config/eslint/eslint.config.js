import nextPlugin from "@next/eslint-plugin-next";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const hasTypeScriptImportResolver = (() => {
  try {
    return Boolean(import.meta.resolve("eslint-import-resolver-typescript"));
  } catch {
    return false;
  }
})();

const reactHooksRecommendedRules =
  reactHooksPlugin.configs.recommended?.rules ?? {};
const nextRecommendedRules = nextPlugin.configs.recommended?.rules ?? {};
const nextCoreWebVitalsRules =
  nextPlugin.configs["core-web-vitals"]?.rules ?? {};

const sharedRules = {
  "no-console": ["warn", { allow: ["error"] }],
  eqeqeq: ["error", "always"],
  "no-var": "error",
  "prefer-const": "error",
  "no-duplicate-imports": "error",
  "import/order": [
    "error",
    {
      groups: [
        "builtin",
        "external",
        "internal",
        ["parent", "sibling", "index"],
        "object",
        "type",
      ],
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
  "@next/next": nextPlugin,
  "@typescript-eslint": tsPlugin,
  import: importPlugin,
  react: reactPlugin,
  "react-hooks": reactHooksPlugin,
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
        module: "readonly",
        process: "readonly",
        require: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      "@next/next": nextPlugin,
      import: importPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactHooksRecommendedRules,
      ...nextRecommendedRules,
      ...nextCoreWebVitalsRules,
      ...sharedRules,
      "@next/next/no-html-link-for-pages": "off",
    },
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
        project: ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
        tsconfigRootDir: import.meta.dirname + "/../../..",
      },
      globals: {
        console: "readonly",
        fetch: "readonly",
        process: "readonly",
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
    rules: {
      ...reactHooksRecommendedRules,
      ...nextRecommendedRules,
      ...nextCoreWebVitalsRules,
      ...sharedRules,
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/strict-boolean-expressions": "off",
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@gradlly/ui/*", "@gradlly/utils/*", "@gradlly/hooks/*"],
              message: "Import from package roots only (e.g. @gradlly/ui).",
            },
            {
              group: ["**/packages/**"],
              message:
                "Do not import using package filesystem paths. Use workspace package aliases.",
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
              group: ["@/features/*", "@gradlly/feature-*"],
              message: "UI package must not depend on feature modules.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["apps/main/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*"],
              message: "Feature modules must not import other feature modules.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/utils/src/**/*.{ts,tsx}", "packages/hooks/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@gradlly/ui"],
              message: "Utility and hooks packages must remain dependency-light.",
            },
          ],
        },
      ],
    },
  },
];
