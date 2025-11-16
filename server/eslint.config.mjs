import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import boundaries from 'eslint-plugin-boundaries';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/node_modules', '**/dist', '**/docs'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:boundaries/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      boundaries,
      'simple-import-sort': simpleImportSort,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'max-len': [
        'warn',
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

      // Поменять правила на предупреждения
      '@typescript-eslint/no-explicit-any': 'warn', // Предупреждение вместо ошибки
      '@typescript-eslint/no-non-null-assertion': 'warn', // Предупреждение вместо ошибки
      '@typescript-eslint/no-unused-vars': ['warn'], //, { argsIgnorePattern: "^_" } Предупреждение вместо ошибки

      // 🔹 Группировка и сортировка импортов
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // 🔹 Встроенные модули Node.js (fs, path, os и т. д.)
            ['^node:.*', '^(fs|path|os|crypto|util|events|http|https|stream|url)$'],

            // 🔹 Пакеты из `node_modules` (Express, Mongoose и другие npm-библиотеки)
            ['^express$', '^mongoose$', '^cors$', '^dotenv$', '^jsonwebtoken$', '^bcrypt$', '^@?\\w'],

            // 🔹 Архитектурные слои DDD Architecture

            ['^@?\\w'],

            // DDD Layers
            ['^src/core/domain'],
            ['^src/core/application'],
            ['^src/core/infrastructure'],
            ['^src/core/interface'],

            // 🔹 Относительные импорты (сначала на уровень выше, потом локальные файлы)
            ['^\\.\\.(?!/?$)', '^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',

      // Запрещает импорт приватных файлов (например, _utils.ts)
      //"boundaries/no-private": "error",

      // 🔹 Запрещает неправильные импорты между слоями
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // Domain → nobody
            { from: 'domain', allow: [] },

            // Application → domain
            { from: 'application', allow: ['domain'] },

            // Infrastructure → application, domain
            { from: 'infrastructure', allow: ['application', 'domain'] },

            // Interface → everything except infra
            { from: 'interface', allow: ['application', 'domain', 'infrastructure'] },
          ],
        },
      ],
    },

    settings: {
      // === DDD SLICE DEFINITIONS ===
      'boundaries/elements': [
        // Domain
        { type: 'domain', pattern: 'src/core/domain(/.*)?' },

        // Application (use cases)
        { type: 'application', pattern: 'src/core/application(/.*)?' },

        // Infrastructure (adapters, repos)
        { type: 'infrastructure', pattern: 'src/core/infrastructure(/.*)?' },

        // Interface (controllers, http, ws)
        { type: 'interface', pattern: 'src/core/interface(/.*)?' },
      ],
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
];
