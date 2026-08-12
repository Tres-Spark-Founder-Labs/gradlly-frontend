import js from "@eslint/js";
import globals from "globals";

import {
  sharedLanguageOptions,
  sharedPlugins,
  sharedRules,
  sharedSettings,
} from "./eslint.shared.js";

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
      // Each app has its own eslint.config.js — skip re-linting their configs
      "apps/*/eslint.config.js",
    ],
  },

  js.configs.recommended,

  {
    files: ["apps/**/*.{js,jsx}", "*.{js,mjs,cjs}"],
    languageOptions: sharedLanguageOptions,
    settings: {
      ...sharedSettings,
      // Resolves @/* path aliases across all apps for CLI linting
      "import/resolver": {
        typescript: {
          project: ["apps/*/jsconfig.json", "apps/*/tsconfig.json"],
        },
      },
    },
    plugins: sharedPlugins,
    rules: sharedRules,
  },

  /**
   * Repository tooling under `scripts/` runs in Node, not the browser.
   *
   * The block above matches `*.{js,mjs,cjs}` at the repository root only, so
   * `scripts/*.mjs` fell through to the browser-globals defaults and failed
   * `no-undef` on `process`, `console` and `URL`. Both CI gate scripts
   * (`verify-fab-coverage`, `verify-ts-check-ratchet`) were affected, which
   * meant `npm run lint` — itself a CI step — had been failing since they were
   * added.
   */
  {
    files: ["scripts/**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },

  /**
   * Playwright specs and config run in Node, not the browser — they read
   * `process.env`, use `node:fs` and `node:path`. Same root cause as the
   * `scripts/` block above: the browser-globals default does not fit tooling.
   */
  {
    files: ["e2e/**/*.js", "playwright.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
  },
];
