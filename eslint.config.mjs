import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginFormatJs from 'eslint-plugin-formatjs';
import eslintPluginImportHelpers from 'eslint-plugin-import-helpers';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**', 'dist/**']),
  eslintPluginPrettierRecommended,
  {
    plugins: { formatjs: eslintPluginFormatJs, 'import-helpers': eslintPluginImportHelpers },
    rules: { '@typescript-eslint/no-explicit-any': 'off', 'react-hooks/set-state-in-effect': 'off' }
  }
]);
