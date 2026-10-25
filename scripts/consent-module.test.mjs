import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, symlink, rm, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
async function fixture(run) {
  const directory = await mkdtemp(path.join(tmpdir(), 'radovar consent '));
  try {
    await mkdir(path.join(directory, 'scripts'));
    await mkdir(path.join(directory, 'public', 'analytics'), { recursive: true });
    await symlink(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'junction');
    for (const file of ['scripts/build-consent-module.mjs', 'public/analytics/owned-analytics.js', 'package.json']) await copyFile(path.join(root, file), path.join(directory, file));
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
test('consent module builds at the real path when checkout contains spaces', async () => {
  await fixture(async directory => {
    const result = spawnSync(process.execPath, ['scripts/build-consent-module.mjs'], { cwd: directory, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const module = await readFile(path.join(directory, 'public/analytics/consent-manager.js'), 'utf8');
    assert.ok(module.length > 0);
    assert.ok(!module.includes('createAnalyticsClient'), 'essential module excludes the optional client');
  });
});
test('npm dev lifecycle prepares essential consent code in a fresh checkout', async () => {
  await fixture(async directory => {
    const config = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
    // Replace the long-running Next process only; npm still owns the real predev hook.
    config.scripts.dev = 'node -e "require(\'fs\').accessSync(\'public/analytics/consent-manager.js\')"';
    await writeFile(path.join(directory, 'package.json'), JSON.stringify(config));
    const result = spawnSync('npm', ['run', 'dev'], { cwd: directory, encoding: 'utf8', shell: process.platform === 'win32' });
    assert.equal(result.status, 0, result.stderr);
  });
});
