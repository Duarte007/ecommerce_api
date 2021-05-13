module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es6: true,
  },
  plugins: ["@typescript-eslint"],
  extends: ["plugin:@typescript-eslint/recommended", "prettier", "prettier/@typescript-eslint"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  ignorePatterns: ["build/"],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/class-name-casing": 0,
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/semi": ["error", "always"],
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/interface-name-prefix": "off",
  },
};
