const isProd = process.env.NODE_ENV === "production"
module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/essential",
    // '@vue/standard',
    "@vue/typescript",
  ],
  globals: {
    "chrome": true,
    _: true,
  },
  rules: {
    "no-console": isProd ? "error" : "off",
    "no-debugger": isProd ? "error" : "off",
    "comma-dangle": isProd ? "error" : "off",
    "no-empty-function": isProd ? "error" : "off",
    "no-unused-vars": isProd ? "error" : "off",
  },
}
