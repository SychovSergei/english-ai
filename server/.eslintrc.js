module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
  },
  ignorePatterns: ["node_modules", "dist"],
  rules: {
    "max-len": [
      "error",
      {
        code: 120, // Длина строки для кода
        ignoreComments: true,
        ignoreUrls: true, // Игнорировать URL
        ignoreStrings: true, // Игнорировать строки
        ignoreTemplateLiterals: true, // Игнорировать шаблонные строки
        ignorePattern: "^\\s*// eslint-disable-line", // Игнорировать комментарии с определенным паттерном
      },
    ],
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "object-curly-spacing": ["error", "always"],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-interface": "off",
  },
};
