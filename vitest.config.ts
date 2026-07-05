import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@public': path.resolve(__dirname, './public'),
      '@app': path.resolve(__dirname, './app'),
      '@ui/presentation': path.resolve(__dirname, './src/components'),
      '@ui/utils': path.resolve(__dirname, './src/lib'),
    },
  },
});
