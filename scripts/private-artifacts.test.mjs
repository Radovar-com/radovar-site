import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
test('private environment, scratch and compiler cache artifacts stay outside source control', () => {
  const candidates = ['.env', 'ops/.env.local', '.superpowers/security-20261018/receipt.json', 'tsconfig.tsbuildinfo', 'build/tsconfig.tsbuildinfo'];
  const result = spawnSync('git', ['check-ignore', '--no-index', '--stdin'], { cwd: root, input: candidates.join('\n') + '\n', encoding: 'utf8' });
  assert.ok(result.status === 0 || result.status === 1);
  assert.deepEqual(result.stdout.trim().split(/\r?\n/), candidates);
  const tracked = execFileSync('git', ['ls-files', '--', '.env*', '**/.env*', '.superpowers', '*.tsbuildinfo'], { cwd: root, encoding: 'utf8' });
  assert.equal(tracked.trim(), '', 'no private or generated artifact is tracked');
});
