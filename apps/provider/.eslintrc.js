const config = require('@gradlly/config/eslint');

module.exports = {
    ...config,
    parserOptions: {
        ...config.parserOptions,
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
};