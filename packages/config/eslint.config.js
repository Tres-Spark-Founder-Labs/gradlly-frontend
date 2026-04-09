const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const nextPlugin = require('@next/eslint-plugin-next');

const hasTypeScriptImportResolver = (() => {
  try {
    require.resolve('eslint-import-resolver-typescript');
    return true;
  } catch {
    return false;
  }
})();

const baseRules = {
  'no-console': ['warn', { allow: ['error'] }],
  eqeqeq: ['error', 'always'],
  'no-var': 'error',
  'prefer-const': 'error',
  'no-duplicate-imports': 'error',
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    },
  ],
  'react/jsx-key': 'error',
  'react-hooks/exhaustive-deps': 'error',
  '@next/next/no-img-element': 'error',
};

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/next-env.d.ts',
      '**/*.config.{js,cjs,mjs,ts}',
      'eslint.config.js',
      'lint-staged.config.js',
      'prettier.config.mjs',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': 'off',
      ...baseRules,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: [
          "./apps/*/tsconfig.json",
          "./packages/*/tsconfig.json",
        ],
        tsconfigRootDir: __dirname + "/../..",
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      ...(hasTypeScriptImportResolver
        ? {
            'import/resolver': {
              typescript: true,
            },
          }
        : {}),
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': 'off',
      ...baseRules,
      'no-unused-vars': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
];
