import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import github from 'eslint-plugin-github';
import jestAsync from 'eslint-plugin-jest-async';
import jestFormatting from 'eslint-plugin-jest-formatting';
import perfectionist from 'eslint-plugin-perfectionist';
import promise from 'eslint-plugin-promise';
import globals from 'globals';
import yamlEslintParser from 'yaml-eslint-parser';
import jsoncEslintParser from 'jsonc-eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  js.configs.recommended,
  ...compat.config({ extends: ['airbnb-base'] }).map((config) => ({
    ...config,
    plugins: {
      ...config.plugins,
    },
    rules: {
      ...config.rules,
    },
  })),
  ...compat.extends('plugin:eslint-comments/recommended'),
  ...compat.config({ extends: ['plugin:github/recommended'] }).map((config) => ({
    ...config,
    plugins: {
      ...config.plugins,
      github: fixupPluginRules(github),
    },
  })),
  perfectionist.configs['recommended-natural'],
  promise.configs['flat/recommended'],
  {
    ignores: [
      '**/*',
      '**/node_modules',
      '**/coverage',
      '**/dist',
      '**/cache',
      '**/eslint.config.mjs',
      '**/coverage.json',
      '**/.next',
      '**/html',
    ],
  },
  {
    plugins: {
      github,
      perfectionist,
      promise,
    },
    rules: {
      'eol-last': ['error', 'always'],
      'no-restricted-syntax': 'off',
      'filenames/match-regex': ['error', '^[a-z]+(-[a-z]+)*(.[a-z]+)+$'],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'class-methods-use-this': 'off',
      curly: ['error', 'all'],
      'no-void': 'off',
      'eslint-comments/disable-enable-pair': 'off',
      'import/prefer-default-export': 'off',
      'no-console': 'warn',
      'security/detect-non-literal-fs-filename': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': ['error', {
        allowList: {
          props: true,
          Props: true,
        },
        replacements: {
          e: false,
          lib: false,
        },
      }],
      'arrow-body-style': ['warn', 'as-needed'],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', next: 'block-like', prev: '*' },
        { blankLine: 'any', next: 'case', prev: 'case' },
        { blankLine: 'always', next: 'return', prev: '*' },
        { blankLine: 'always', next: '*', prev: ['const', 'let', 'var'] },
        { blankLine: 'any', next: ['const', 'let', 'var'], prev: ['const', 'let', 'var'] },
      ],
    },
  },
  ...[
    ...compat.extends('airbnb-typescript/base'),
    ...compat.extends('plugin:@typescript-eslint/recommended'),
    ...compat.extends('plugin:@typescript-eslint/recommended-requiring-type-checking'),
  ].map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': 'allow-with-description',
      }],
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-useless-template-literals': 'error',
      '@typescript-eslint/strict-boolean-expressions': ['error', {
        allowNullableObject: true,
        allowNullableString: true,
      }],
    },
  })),
  ...[
    ...compat.extends('plugin:jest-formatting/recommended'),
  ].map((config) => ({
    ...config,
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    plugins: {
      'jest-formatting': jestFormatting,
      'jest-async': jestAsync,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'jest-async/expect-return': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'global-require': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'security/detect-object-injection': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-module': 'off',
      'no-await-in-loop': 'off',
      'no-restricted-syntax': 'off',
      '@typescript-eslint/dot-notation': 'off',
      'jest/expect-expect': ['error', {
        assertFunctionNames: ['expect', 'expectRequest'],
      }],
    },
  })),
  {
    files: ['**/__tests__/*.ts'],
    rules: {
      'max-classes-per-file': 'off',
    },
  },
  {
    files: ['**/*.yaml', '**/*.yml'],
    languageOptions: {
      parser: yamlEslintParser,
    },
  },
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncEslintParser,
    },
  },
];
