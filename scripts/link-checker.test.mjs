import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';

async function runFixture(html) {
  const server = createServer((req, res) => {
    if (req.url === '/') { res.setHeader('Content-Type', 'text/html'); res.end(html); }
    else if (req.url === '/ok/') { res.setHeader('Content-Type', 'text/html'); res.end('<h1 id="target">OK</h1>'); }
    else { res.statusCode = 404; res.end('<h1>Not found</h1>'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const child = spawn(process.execPath, ['scripts/check-links.mjs', `http://127.0.0.1:${server.address().port}/`]);
    let text = '';
    child.stdout.on('data', data => { text += data; });
    child.stderr.on('data', data => { text += data; });
    const status = await new Promise(resolve => child.on('exit', resolve));
    return { status, text };
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}
test('link checker rejects an actual HTTP 404 including a missing image', async () => {
  const result = await runFixture('<a href="/ok/#target">OK</a><img src="/missing.webp">');
  assert.equal(result.status, 1);
  assert.match(result.text, /404.*missing\.webp/);
});
test('link checker rejects a broken same-origin fragment', async () => {
  const result = await runFixture('<a href="/ok/#absent">Broken</a>');
  assert.equal(result.status, 1);
  assert.match(result.text, /fragment.*absent/);
});
test('link checker accepts valid links and skips non-HTTP actions', async () => {
  const result = await runFixture('<a href="/ok/#target">OK</a><a href="mailto:info@example.invalid">Mail</a>');
  assert.equal(result.status, 0, result.text);
});
test('link checker catches missing responsive candidates in React-exported srcSet', async () => {
  const result = await runFixture('<picture><source srcSet="/ok/ 640w, /missing.webp 960w"><img src="/ok/"></picture>');
  assert.equal(result.status, 1);
  assert.match(result.text, /404.*missing\.webp/);
});
test('link checker rejects a missing decorative image referenced by inline CSS', async () => {
  const result = await runFixture('<div style="background-image:url(/missing.webp)"></div>');
  assert.equal(result.status, 1);
  assert.match(result.text, /404.*missing\.webp/);
});
