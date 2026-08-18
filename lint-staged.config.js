export default {
  // `.mjs`/`.cjs` are here because they were missing: the repo's own build
  // scripts are `.mjs`, so every one of them skipped the pre-commit hook
  // entirely while appearing to be covered by it. Same failure family as the
  // rest of this stage — a check that reports PASS over files it never saw.
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"],
};
