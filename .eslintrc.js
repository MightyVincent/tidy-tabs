const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/essential',
    '@vue/typescript',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  globals: {
    chrome: true
  },
  rules: {
    'no-console': isProd ? 'warn' : 'off',
    'no-debugger': isProd ? 'warn' : 'off',
    'comma-dangle': 'off',
    'no-empty-function': 'off',
    'no-unused-vars': 'off',
    'space-before-function-paren': 0,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
}
