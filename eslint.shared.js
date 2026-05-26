import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export const sharedPlugins = {
  "@next/next": nextPlugin,
  import: importPlugin,
  react: reactPlugin,
  "react-hooks": reactHooksPlugin,
  "unused-imports": unusedImports,
};

export const sharedLanguageOptions = {
  ecmaVersion: "latest",
  sourceType: "module",
  parserOptions: { ecmaFeatures: { jsx: true } },
  globals: { ...globals.browser, ...globals.node },
};

export const sharedSettings = {
  react: { version: "detect" },
};

export const sharedRules = {
  ...reactPlugin.configs.recommended.rules,
  ...reactHooksPlugin.configs.recommended.rules,
  ...nextPlugin.configs.recommended.rules,
  ...nextPlugin.configs["core-web-vitals"].rules,

  "no-console": ["warn", { allow: ["error"] }],
  "no-duplicate-imports": "error",
  "no-var": "error",
  "prefer-const": "error",
  eqeqeq: ["error", "always"],

  "import/order": [
    "error",
    {
      groups: [
        "builtin",
        "external",
        "internal",
        ["parent", "sibling", "index"],
      ],
      pathGroups: [{ pattern: "@/**", group: "internal", position: "after" }],
      pathGroupsExcludedImportTypes: ["builtin"],
      "newlines-between": "always",
      alphabetize: { order: "asc", caseInsensitive: true },
    },
  ],

  "react/jsx-key": "error",
  "react/react-in-jsx-scope": "off",
  "react/prop-types": "off",
  "react-hooks/exhaustive-deps": "error",

  "@next/next/no-img-element": "error",
  "@next/next/no-html-link-for-pages": "off",

  "no-unused-vars": "off",
  "unused-imports/no-unused-imports": "error",
  "unused-imports/no-unused-vars": [
    "warn",
    {
      vars: "all",
      args: "after-used",
      ignoreRestSiblings: true,
      varsIgnorePattern: "^_",
      argsIgnorePattern: "^_",
    },
  ],
};
