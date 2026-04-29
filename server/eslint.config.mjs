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
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],

      // groping and sorting imports
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // // 1. Встроенные модули Node.js (fs, path, os и т. д.)
            // ['^node:.*', '^(fs|path|os|crypto|util|events|http|https|stream|url)$'],
            //
            // // 2. External libraries (npm)
            // [
            //   '^express$',
            //   '^mongoose$',
            //   '^cors$',
            //   '^dotenv$',
            //   '^jsonwebtoken$',
            //   '^jwt$',
            //   '^bcrypt$',
            //   '^inversify$',
            //   '^zod$',
            // ],
            // ['^@?\\w'],
            //
            // // 3. DDD Layers
            // ['^src/core/domain'],
            // ['^src/core/application'],
            // ['^src/core/infrastructure'],
            // ['^src/core/interface'],
            // ['^@ioc'],
            //
            // // 4. Relative imports (сначала на уровень выше, потом локальные файлы)
            // ['^\\.\\.(?!/?$)', '^\\./?$'],

            // 1. Node.js built-ins
            ['^node:.*', '^(fs|path|os|crypto|util|events|http|https|stream|url)$'],

            // 2. External packages
            ['^reflect-metadata$', '^@?\\w'],

            ['^@events(/.*)?$'],

            // 3. Domain
            ['^@core/domain(/.*)?$', '^@modules/.+/domain(/.*)?$'],

            // 4. Application
            ['^@core/application(/.*)?$', '^@modules/.+/application(/.*)?$'],

            // 8. Infrastructure
            ['^@infrastructure(/.*)?$', '^@modules/.+/infrastructure(/.*)?$'],

            // 9. DI IOC
            ['^@core/constants(/.*)?$', '^@modules/.+/constants(/.*)?$'],

            // 10. IOC
            ['^@ioc(/.*)?$'],

            // 11. Relative imports
            ['^\\.\\.(?!/?$)', '^\\./'],
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
            // // Domain → nobody
            // { from: 'domain', allow: ['domain'] },
            //
            // // Application → domain
            // { from: 'application', allow: ['domain', 'application'] },
            //
            // // Infrastructure → application, domain
            // { from: 'infrastructure', allow: ['domain', 'application', 'infrastructure', 'ioc'] },
            //
            // // Interface → everything except infra
            // { from: 'interface', allow: ['domain', 'application', 'infrastructure', 'interface', 'ioc'] },
            //
            // { from: 'ioc', allow: ['ioc'] }, // ioc только сам с собой

            // { from: 'domain', allow: ['shared'] }, // Domain не зависит ни от чего

            { from: 'core-domain', allow: ['core-domain'] }, // Domain не зависит ни от чего
            { from: 'core-application', allow: ['core-domain', 'core-application'] },
            {
              from: 'module-domain',
              allow: ['core-domain', 'module-domain'],
            },
            {
              from: 'module-application',
              allow: ['core-domain', 'core-application', 'module-domain', 'module-application'],
            },

            {
              from: 'module-infrastructure',
              allow: [
                'core-domain',
                'core-application',
                'module-domain',
                'module-application',
                'module-infrastructure',
                // 'ioc',
              ],
            },
            {
              from: 'infrastructure',
              allow: [
                'core-domain',
                'core-application',
                'module-domain',
                'module-application',
                'module-infrastructure',
                'ioc',
              ],
            },
            {
              from: 'ioc',
              allow: [
                'core-domain',
                'core-application',
                'module-domain',
                'module-application',
                'module-infrastructure',
                'infrastructure',
              ],
            },

            // {
            //   type: 'domain',
            //   pattern: 'modules/*/domain/**',
            // },
            // {
            //   type: 'application',
            //   pattern: 'modules/*/application/**',
            // },
            // {
            //   type: 'infrastructure',
            //   pattern: 'modules/*/infrastructure/**',
            // },
            // {
            //   type: 'shared',
            //   pattern: 'shared/**',
            // },
            // {
            //   type: 'ioc',
            //   pattern: 'ioc/**',
            // },
            // {
            //   type: 'events',
            //   pattern: 'app/events/**',
            // },
          ],
        },
      ],
    },

    settings: {
      // === DDD SLICE DEFINITIONS ===
      'boundaries/elements': [
        // // Domain
        // { type: 'domain', pattern: 'src/core/domain(/.*)?' },
        //
        // // Application (use cases)
        // { type: 'application', pattern: 'src/core/application(/.*)?' },
        //
        // // Infrastructure (adapters, repos)
        // { type: 'infrastructure', pattern: 'src/core/infrastructure(/.*)?' },
        //
        // // Interface (controllers, http, ws)
        // { type: 'interface', pattern: 'src/core/interface(/.*)?' },
        //
        // // IoC
        // { type: 'ioc', pattern: 'src/ioc(/.*)?' },

        // { type: 'domain', pattern: 'src/core/domain(/.*)?' },

        { type: 'core-domain', pattern: 'core/domain(/.*)?' },
        { type: 'core-application', pattern: 'core/application(/.*)?' },

        { type: 'module-domain', pattern: 'modules/*/domain(/.*)?' },
        { type: 'module-application', pattern: 'modules/*/application(/.*)?' },
        { type: 'module-infrastructure', pattern: 'modules/*/infrastructure(/.*)?' },

        { type: 'infrastructure', pattern: 'infrastructure(/.*)?' },
        { type: 'ioc', pattern: 'ioc(/.*)?' },
        // { type: 'shared', pattern: 'shared(/.*)?' },
      ],
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
];
