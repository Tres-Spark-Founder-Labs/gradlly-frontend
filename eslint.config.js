import js from "@eslint/js";

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
];
