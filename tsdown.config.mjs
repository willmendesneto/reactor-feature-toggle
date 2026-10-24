import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/client.ts'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  target: 'es2020',
  dts: true,
  // Keeps one output file per source file, so `'use client'` stays at the top
  // of `client` and is not hoisted into a shared chunk
  unbundle: true,
  clean: true,
  inputOptions: {
    checks: {
      // `'use client'` is preserved in the output, see `npm run test:smoke`
      moduleLevelDirective: false,
    },
  },
});
