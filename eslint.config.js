// ESLint v9+ flat config for SvelteKit + TypeScript + Prettier

import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: {
          ts: tsParser,
        },
        extraFileExtensions: ['.svelte'],
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: { svelte },
    rules: {
      ...svelte.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: { '@typescript-eslint': typescript },
    rules: {
      ...typescript.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
  {
    files: ['**/*.{ts,svelte}'],
    rules: {
      ...prettier.rules,
    },
  },
];