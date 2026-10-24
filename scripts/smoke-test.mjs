// Installs the packed tarball in a temporary project and checks that both entry
// points work from ESM, CommonJS and the `react-server` condition (RSC).
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const reactVersion = process.env.REACT_VERSION || '19';
const serviceVersion = process.env.FEATURE_TOGGLE_SERVICE_VERSION || '8';
const root = resolve(import.meta.dirname, '..');
const dir = mkdtempSync(join(tmpdir(), 'reactor-feature-toggle-'));

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { cwd: dir, stdio: 'inherit', ...opts });

const check = (name, args, code) => {
  console.log(`\n▶ ${name}`);
  run(process.execPath, [...args, '--input-type=module', '-e', code]);
};

try {
  run('npm', ['run', 'build'], { cwd: root });
  const [{ filename }] = JSON.parse(
    execFileSync(
      'npm',
      ['pack', '--json', '--ignore-scripts', '--pack-destination', dir],
      {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'inherit'],
      }
    )
  );
  writeFileSync(join(dir, 'package.json'), '{ "private": true }');
  run('npm', [
    'install',
    '--no-audit',
    '--no-fund',
    `./${filename}`,
    `react@${reactVersion}`,
    `react-dom@${reactVersion}`,
    `feature-toggle-service@${serviceVersion}`,
  ]);

  check(
    'ESM: both entry points',
    [],
    `
    import assert from 'node:assert/strict';
    import { createElement } from 'react';
    import { renderToString } from 'react-dom/server';
    import * as main from 'reactor-feature-toggle';
    import * as client from 'reactor-feature-toggle/client';

    const exports = ['FeatureToggle', 'FeatureToggleProvider', 'useFeatureToggle'];
    assert.deepEqual(Object.keys(main).sort(), exports);
    assert.deepEqual(Object.keys(client).sort(), exports);

    const html = renderToString(
      createElement(main.FeatureToggleProvider, { featureToggleService: { a: true } },
        createElement(main.FeatureToggle, { featureName: 'a' }, 'on'))
    );
    assert.equal(html, 'on');
    `
  );

  check(
    'CJS: both entry points',
    [],
    `
    import assert from 'node:assert/strict';
    import { createRequire } from 'node:module';
    const require = createRequire(process.cwd() + '/');
    const main = require('reactor-feature-toggle');
    const client = require('reactor-feature-toggle/client');

    assert.equal(typeof main.FeatureToggle, 'function');
    assert.equal(typeof main.FeatureToggleProvider, 'function');
    assert.equal(typeof client.useFeatureToggle, 'function');
    `
  );

  // Both entry points are client modules, so React Server Components bundlers
  // (e.g. Next.js) render them as client components
  console.log('\n▶ "use client" directive');
  for (const file of ['index.mjs', 'index.js', 'client.mjs', 'client.js']) {
    const code = readFileSync(
      join(dir, 'node_modules/reactor-feature-toggle/dist', file),
      'utf8'
    );
    assert.match(
      code,
      /^"use client";/,
      `dist/${file} should start with "use client"`
    );
  }

  console.log('\n✔ Smoke test passed');
} finally {
  rmSync(dir, { recursive: true, force: true });
}
