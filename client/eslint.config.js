import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import boundaries from 'eslint-plugin-boundaries';
import html from 'eslint-plugin-html';
import _import from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
// import perfectionist from 'eslint-plugin-perfectionist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/.angular/', 'node_modules/', 'dist/', 'docs/', '*.d.ts'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:boundaries/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      html,
      import: fixupPluginRules(_import),

      boundaries,
      'simple-import-sort': simpleImportSort,
      // perfectionist,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module', // Было
      parserOptions: {
        sourceType: 'module', // Добавьте эту строку
      },
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
      },
    },

    rules: {
      'prettier/prettier': ['warn'],

      // Запрещает импорт приватных файлов (например, _utils.ts)
      'boundaries/no-private': 'error',

      // 🔹 Запрещает неправильные импорты между слоями FSD
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'core', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
            { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
            { from: 'widgets', allow: ['features', 'entities', 'shared'] },
            { from: 'features', allow: ['shared', 'entities', 'widgets'] },
            { from: 'entities', allow: ['shared'] },
            { from: 'shared', allow: [] },
          ],
        },
      ],

      // 🔹 Группировка и сортировка импортов
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Встроенные модули Node.js
            ['^node:.*', '^@?\\w'],
            // Angular и RxJS
            ['^@angular', '^rxjs'],
            // Feature-Sliced Design (FSD)
            ['^@/shared', '^@/entities', '^@/features', '^@/widgets', '^@/pages', '^@/app'],
            // Относительные импорты
            ['^\\.\\.(?!/?$)', '^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // 🔹 Группировка импортов по слоям FSD
      'import/order': 'off',
      // 'import/order': [
      //   'warn',
      //   {
      //     groups: [['builtin', 'external'], ['internal', 'sibling', 'parent'], ['index']],
      //
      //     // pathGroups: [
      //     //   {
      //     //     pattern: '@angular/**',
      //     //     group: 'external',
      //     //     position: 'before',
      //     //   },
      //     // ],
      //
      //     // pathGroupsExcludedImportTypes: ['builtin'],
      //     // 'newlines-between': 'always',
      //
      //     alphabetize: {
      //       order: 'asc',
      //       caseInsensitive: true,
      //     },
      //   },
      // ],

      // 🔹 Авто-сортировка импортов по слоям FSD
      // 'perfectionist/sort-imports': [
      //   'error',
      //   {
      //     type: 'natural',
      //     groups: [
      //       ['^@angular', '^rxjs'],
      //       ['^shared'],
      //       ['^entities'],
      //       ['^features'],
      //       ['^widgets'],
      //       ['^pages'],
      //       ['^app'],
      //       ['../', './'],
      //     ],
      //   },
      // ],

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

      quotes: [
        'warn',
        'single',
        {
          allowTemplateLiterals: true,
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      'linebreak-style': ['error', 'unix'],

      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src', // Путь к основному каталогу исходных файлов
              from: './src/features/words-folder', // Папка, которую нужно исключить
              message: 'Запрещен импорт из этой папки', // Сообщение об ошибке
            },
          ],
        },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false, // запретит пропуск возвращаемого типа у стрелочных функций и методов
          allowTypedFunctionExpressions: true, // разрешит, если тип выведен из контекста (например, в `const handler: () => void = () => {}`)
          allowHigherOrderFunctions: true, // разрешит не указывать тип, если возвращается функция
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        },
      ],
    },

    settings: {
      // boundaries: {
      'boundaries/elements': [
        { type: 'shared', pattern: 'src/app/shared(/.*)?' },
        { type: 'entities', pattern: 'src/app/entities(/.*)?' },
        { type: 'features', pattern: 'src/app/features(/.*)?' },
        { type: 'widgets', pattern: 'src/app/widgets(/.*)?' },
        { type: 'pages', pattern: 'src/app/pages(/.*)?' },
        { type: 'core', pattern: 'src/app/core(/.*)?' },
      ],
      // },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
];
