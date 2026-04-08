/** @type {import("eslint").Linter.Config} */
module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import', 'unused-imports'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'next/core-web-vitals',
    ],
    rules: {
        // No any
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-unsafe-return': 'error',
        // Unused vars — handled by unused-imports plugin for auto-fix
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'error',
            { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],
        // Import ordering
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
                pathGroups: [
                    { pattern: 'react', group: 'external', position: 'before' },
                    { pattern: 'next/**', group: 'external', position: 'before' },
                    { pattern: '@gradlly/**', group: 'internal', position: 'before' },
                    { pattern: '@/**', group: 'internal' },
                ],
                pathGroupsExcludedImportTypes: ['react', 'next'],
                'newlines-between': 'always',
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
        'import/no-duplicates': 'error',
    },
};