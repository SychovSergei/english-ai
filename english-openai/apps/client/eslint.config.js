import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import html from 'eslint-plugin-html';
import _import from 'eslint-plugin-import';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/.angular/', 'node_modules/', 'dist/', '*.d.ts'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      html,
      import: fixupPluginRules(_import),
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
      'prettier/prettier': ['warn'],

      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], ['internal', 'sibling', 'parent'], ['index']],

          pathGroups: [
            {
              pattern: '@angular/**',
              group: 'external',
              position: 'before',
            },
          ],

          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
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
    },
  },
];
