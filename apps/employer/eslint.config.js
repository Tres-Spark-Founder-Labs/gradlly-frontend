import js from "@eslint/js";

import {
  sharedLanguageOptions,
  sharedPlugins,
  sharedRules,
  sharedSettings,
} from "../../eslint.shared.js";

export default [
  {
    ignores: [".next/**", "node_modules/**"],
  },

  js.configs.recommended,

  {
    files: ["**/*.{js,jsx}"],
    languageOptions: sharedLanguageOptions,
    settings: {
      ...sharedSettings,
      "import/resolver": {
        typescript: { project: "./jsconfig.json" },
      },
    },
    plugins: sharedPlugins,
    rules: sharedRules,
  },
];
