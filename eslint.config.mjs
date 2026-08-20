// Root ESLint v9 flat config. Lints ONLY root-level config/script files.
// apps/* each ship their own self-contained eslint.config.mjs (flat config does not cascade).
// Root `lint` script delegates to apps via `bun --filter '*' lint`; `lint:root` runs this file.
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: [
      'apps/**',
      'packages/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
  prettierConfig,
];
