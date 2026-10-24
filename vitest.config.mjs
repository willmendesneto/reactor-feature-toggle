import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enable global APIs like expect, describe, it
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{spec,test}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/__tests__/**'],
      reportsDirectory: './coverage',
    },
  },
});
