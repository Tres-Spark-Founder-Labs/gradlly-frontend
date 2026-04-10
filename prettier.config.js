export default {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "all",
  printWidth: 100,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^(react|next)(.*)?$",
    "<THIRD_PARTY_MODULES>",
    "^@gradlly/(.*)$",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
};
