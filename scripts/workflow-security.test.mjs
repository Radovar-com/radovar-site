import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflow = await readFile(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
function block(source, key, indent) {
  const lines = source.split(/\r?\n/), start = lines.findIndex(line => line === `${' '.repeat(indent)}${key}:`);
  assert.ok(start >= 0, `${key} block exists`);
  let end = start + 1;
  while (end < lines.length && (!lines[end].trim() || lines[end].trimStart().startsWith('#') || lines[end].search(/\S/) > indent)) end++;
  return lines.slice(start + 1, end).join('\n');
}

test('PR checks cannot publish and the verified canonical main is the only Radovar deployment source', () => {
  assert.match(block(workflow, 'on', 0), /pull_request:\s*\n\s+branches: \[main\]/);
  assert.doesNotMatch(block(workflow, 'permissions', 0), /pages: write|id-token: write/);
  assert.ok(block(workflow, 'concurrency', 0).includes("group: pages-${{ github.event_name == 'pull_request' && github.ref || 'publish' }}"), 'PR checks do not queue in front of production publication');
  const jobs = block(workflow, 'jobs', 0), build = block(jobs, 'build', 2), deploy = block(jobs, 'deploy', 2);
  assert.doesNotMatch(build, /pages: write|id-token: write|environment:/);
  assert.match(deploy, /needs: build/);
  assert.match(deploy, /if: github\.repository == 'Radovar-com\/radovar-site' && github\.ref == 'refs\/heads\/main' && \(github\.event_name == 'push' \|\| github\.event_name == 'workflow_dispatch'\)/);
  assert.match(block(deploy, 'permissions', 4), /pages: write/);
  assert.match(block(deploy, 'permissions', 4), /id-token: write/);
});

test('build gates audit and real browser policy/refusal tests using an immutable common fixture', () => {
  const build = block(block(workflow, 'jobs', 0), 'build', 2);
  assert.match(build, /repository: Radovar-com\/codevalanche-site\s+ref: [a-f0-9]{40}\s+path: shared-codevalanche\s+persist-credentials: false/);
  assert.match(build, /npm audit --audit-level=high/);
  assert.match(build, /npx playwright install --with-deps chromium/);
  const security = build.indexOf('node scripts/security-browser-test.mjs'), refusal = build.indexOf('node scripts/analytics-browser-test.mjs'), upload = build.indexOf('actions/upload-pages-artifact@');
  assert.ok(security >= 0 && refusal > security && upload > refusal, 'both browser checks precede artifact publication');
  const actions = [...workflow.matchAll(/^\s*(?:-\s*)?uses:\s*([^\s#]+)/gm)].map(match => match[1]);
  assert.ok(actions.length >= 4);
  for (const action of actions) assert.match(action, /^[^@]+@[a-f0-9]{40}$/i);
});
