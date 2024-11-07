module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // if you use TypeScript
    'prettier', // Отключает все правила, которые могут конфликтовать с Prettier
    'plugin:prettier/recommended', // включает настройки Prettier eslint-plugin-prettier и eslint-config-prettier
  ],
  plugins: ['@typescript-eslint', 'html', 'import'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  ignorePatterns: ['node_modules', 'dist'],
  rules: {
    'prettier/prettier': ['error'], // Требует форматирования с использованием Prettier// показывает ошибки форматирования Prettier как ошибки ESLint
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'], // 1) встроенные и внешние модули //'fs', 'path', 'rxjs', '@angular/core', react
          ['internal', 'sibling', 'parent'], // 2) внутренние модули, модули из текущей и родительских папок // custom
          ['index'], // Третья группа: импорты из файла index
        ],
        pathGroups: [
          {
            pattern: '@angular/**',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignorePattern: '^\\s*// eslint-disable-line',
      },
    ],
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'linebreak-style': ['error', 'unix'],
  },
};
