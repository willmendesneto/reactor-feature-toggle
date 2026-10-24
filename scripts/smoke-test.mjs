// Installs the packed tarball in a temporary project and checks that both entry
// points work from ESM, CommonJS and the `react-server` condition (RSC).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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
    import * as server from 'reactor-feature-toggle';
    import * as client from 'reactor-feature-toggle/client';

    assert.deepEqual(Object.keys(server).sort(), ['FeatureToggle']);
    assert.deepEqual(Object.keys(client).sort(), ['FeatureToggleProvider', 'useFeatureToggle']);

    const html = renderToString(
      createElement(client.FeatureToggleProvider, { featureToggleService: { a: true } },
        createElement(server.FeatureToggle, { featureName: 'a' }, 'on'))
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
    const server = require('reactor-feature-toggle');
    const client = require('reactor-feature-toggle/client');

    assert.equal(typeof server.FeatureToggle, 'function');
    assert.equal(typeof client.FeatureToggleProvider, 'function');
    `
  );

  // React 18 stable throws for the `react-server` condition
  if (!reactVersion.startsWith('18')) {
    check(
      'react-server: root entry point does not need client-only APIs',
      ['--conditions=react-server'],
      `
    import assert from 'node:assert/strict';
    import { set } from 'feature-toggle-service';
    import { FeatureToggle } from 'reactor-feature-toggle';

    set({ a: true });
    assert.equal(FeatureToggle({ featureName: 'a', children: 'on' }).props.children, 'on');
    `
    );
  }

  console.log('\n✔ Smoke test passed');
} finally {
  rmSync(dir, { recursive: true, force: true });
}
