import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'),
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/dist/**',
      '**/.turbo/**',
      'next-env.d.ts',

      // Ignore Prisma generated types
      '**/src/generated/**',
      // 'prisma/generated/**',
    ],
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'prettier/prettier': 'error',
    },
  },
];

export default eslintConfig;
