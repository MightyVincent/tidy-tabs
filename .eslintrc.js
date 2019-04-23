// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  "parser": "vue-eslint-parser",
  "parserOptions": {
      "parser": "@typescript-eslint/parser",
      "sourceType": "module",
      "allowImportExportEverywhere": false
  },
  globals: {
     "chrome": true
  },
  env: {
    "es6": true,
    "node": true,
    "browser": true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  // extends: 'standard',
  "extends": ["plugin:vue/recommended"],
  // required to lint *.vue files
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "pug",
    "vue",
    'html'
  ],
  // add your custom rules here
  'rules': {
    'indent': ["error", 2],
    "comma-dangle": ["error", "only-multiline"],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
