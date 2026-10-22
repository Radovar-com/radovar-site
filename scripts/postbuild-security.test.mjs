import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('./postbuild-security.mjs', import.meta.url));
const html = (body) => `<!doctype html><html><head><meta charset="utf-8"></head><body>${body}</body></html>`;
const hash = (source) => `'sha256-${createHash('sha256').update(source).digest('base64')}'`;
const csp = (source) => source.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)" data-radovar-security="export">/)?.[1];

async function fixture(files, run) {
  const temporaryParent = path.resolve(os.tmpdir());
  const fixturePrefix = path.join(temporaryParent, 'radovar-csp-');
  const directory = await mkdtemp(fixturePrefix);
  try {
    for (const [name, contents] of Object.entries(files)) {
      await mkdir(path.dirname(path.join(directory, name)), { recursive: true });
      await writeFile(path.join(directory, name), contents);
    }
    await run(directory);
  } finally {
    const resolvedDirectory = path.resolve(directory);
    assert.ok(resolvedDirectory.startsWith(fixturePrefix) && path.dirname(resolvedDirectory) === temporaryParent, 'recursive cleanup stays inside the owned temporary fixture');
    await rm(resolvedDirectory, { recursive: true, force: true });
  }
}

function harden(directory, nodeEnv = 'production') {
  return spawnSync(process.execPath, [script, directory], {
    encoding: 'utf8', env: { ...process.env, NODE_ENV: nodeEnv },
  });
}

// Missing hashing, per-page hashes, misplaced meta, or a broad script fallback
// would allow an injection or break a client navigation to another exported page.
test('puts one shared hash policy after the leading charset without changing approved markup', async () => {
  const theme = 'document.documentElement.dataset.theme="dark";';
  const next = 'self.__next_f.push([1,"page B"]);';
  const jsonLd = '{"@context":"https://schema.org","@type":"Organization"}';
  const files = {
    'index.html': html(`<script>${theme}</script><script src="/_next/static/app.js" async></script><p style="color:red">Home</p>`),
    'docs/index.html': html(`<script>${next}</script><script type="application/ld+json">${jsonLd}</script><script src="../runtime.js"></script>`),
    '404.html': html('<h1>Not found</h1>'),
  };
  await fixture(files, async (directory) => {
    const result = harden(directory);
    assert.equal(result.status, 0, result.stderr);
    const policies = new Set();
    for (const [name, original] of Object.entries(files)) {
      const output = await readFile(path.join(directory, name), 'utf8');
      const policy = csp(output);
      assert.ok(policy, `CSP emitted in ${name}`);
      policies.add(policy);
      assert.match(output, /<head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy"/);
      assert.equal(output.replace(/<meta http-equiv="Content-Security-Policy"[^>]+>/, ''), original);
    }
    assert.equal(policies.size, 1, 'the first document permits all exported inline navigation scripts');
    const policy = [...policies][0];
    const directives = new Map(policy.split('; ').map((part) => { const [name, ...values] = part.split(' '); return [name, values]; }));
    assert.deepEqual(new Set(directives.get('script-src')), new Set(["'self'", hash(theme), hash(next), hash(jsonLd)]));
    assert.deepEqual(directives.get('script-src-attr'), ["'none'"]);
    assert.deepEqual(directives.get('connect-src'), ["'self'", 'https://hvevaxsfeyiikjhcsafi.supabase.co'], 'only the reviewed collector origin is permitted');
    assert.deepEqual(directives.get('style-src'), ["'self'", "'unsafe-inline'"]);
    assert.deepEqual(directives.get('object-src'), ["'none'"]);
    assert.deepEqual(directives.get('base-uri'), ["'self'"]);
    assert.deepEqual(directives.get('form-action'), ["'self'"]);
    assert.equal(directives.has('frame-ancestors'), false, 'meta cannot enforce frame ancestors');
    assert.ok(!policy.includes('unsafe-eval'));
    assert.ok(!directives.get('script-src').includes("'unsafe-inline'"));
    const before = await readFile(path.join(directory, 'index.html'), 'utf8');
    const repeated = harden(directory);
    assert.equal(repeated.status, 0, repeated.stderr);
    assert.equal(await readFile(path.join(directory, 'index.html'), 'utf8'), before, 'rerunning is idempotent');
  });
});

// A union of inline hashes can exceed 1 KiB. Putting CSP ahead of charset
// would make standalone HTML rely on the host's response encoding header.
test('keeps the complete charset declaration within 1024 bytes with a large shared hash union', async () => {
  const charset = '<meta data-export="encoding" CHARSET=\'UTF-8\'>';
  const original = `<!doctype html><html><head>\n  ${charset}\n<link rel="stylesheet" href="/site.css"><script src="/runtime.js"></script></head><body><p>Știință și creație.</p></body></html>`;
  const scripts = Array.from({ length: 64 }, (_, index) => `<script>self.exportPage=${index};</script>`).join('');
  await fixture({ 'index.html': original, 'docs/index.html': html(scripts) }, async (directory) => {
    const result = harden(directory);
    assert.equal(result.status, 0, result.stderr);
    const output = await readFile(path.join(directory, 'index.html'), 'utf8');
    assert.ok(csp(output).length > 1024, 'fixture exercises a policy larger than the encoding prescan');
    const charsetEnd = output.indexOf(charset) + charset.length;
    assert.ok(Buffer.byteLength(output.slice(0, charsetEnd), 'utf8') <= 1024, 'charset stays entirely inside the encoding prescan');
    assert.ok(output.startsWith(`<!doctype html><html><head>\n  ${charset}<meta http-equiv="Content-Security-Policy"`), 'CSP immediately follows charset before resources');
    assert.equal(output.replace(/<meta http-equiv="Content-Security-Policy"[^>]+>/, ''), original, 'original charset, whitespace, resources, and non-ASCII content survive');
    const repeated = harden(directory);
    assert.equal(repeated.status, 0, repeated.stderr);
    assert.equal(await readFile(path.join(directory, 'index.html'), 'utf8'), output, 'placement remains stable on a second pass');
  });
});

test('rejects missing, non-leading, or late charset metadata before writing', async () => {
  for (const original of [
    html('<p>Home</p>').replace('<meta charset="utf-8">', ''),
    html('<p>Home</p>').replace('<head>', '<head><link rel="stylesheet" href="/site.css">'),
    html('<p>Home</p>').replace('<head>', `<head>${' '.repeat(1024)}`),
  ]) {
    await fixture({ 'index.html': original }, async (directory) => {
      const result = harden(directory);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /charset/i);
      assert.equal(await readFile(path.join(directory, 'index.html'), 'utf8'), original);
    });
  }
});

// An unexpected script origin must fail the whole export before any file is
// rewritten, including browser-normalized protocol-relative/escaped origins.
for (const source of [
  'https://collector.invalid/tracker.js', '//collector.invalid/a.js',
  '&#47;&#47;collector.invalid/a.js', 'javascript:alert(1)', 'data:text/javascript,alert(1)',
  '\\\\collector.invalid/a.js', 'https&colon;//collector.invalid/a.js',
]) {
  test(`rejects unexpected script URL ${source} before writing any page`, async () => {
    const original = html('<script>self.good=true</script>');
    await fixture({ 'index.html': original, 'other/index.html': html(`<script src="${source}"></script>`) }, async (directory) => {
      const result = harden(directory);
      assert.notEqual(result.status, 0, 'unexpected external script must fail closed');
      assert.match(result.stderr, /script source/i);
      assert.equal(await readFile(path.join(directory, 'index.html'), 'utf8'), original);
    });
  });
}

test('rejects an unmanaged CSP instead of silently replacing a deployment policy', async () => {
  const original = html('<p>Home</p>').replace('<head>', '<head><meta http-equiv="Content-Security-Policy" content="default-src https:">');
  await fixture({ 'index.html': original }, async (directory) => {
    const result = harden(directory);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /existing.*CSP/i);
    assert.equal(await readFile(path.join(directory, 'index.html'), 'utf8'), original);
  });
});

test('refuses development exports and incomplete HTML without mutating them', async () => {
  await fixture({ 'index.html': html('<p>Home</p>') }, async (directory) => {
    const original = await readFile(path.join(directory, 'index.html'), 'utf8');
    const result = harden(directory, 'development');
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /production/i);
    assert.equal(await readFile(path.join(directory, 'index.html'), 'utf8'), original);
  });
  await fixture({ 'index.html': '<p>No document head</p>' }, async (directory) => {
    const result = harden(directory);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /head/i);
    assert.equal(await readFile(path.join(directory, 'index.html'), 'utf8'), '<p>No document head</p>');
  });
});
