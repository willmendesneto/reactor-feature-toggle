import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enable global APIs like expect, describe, it
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
  },
});
