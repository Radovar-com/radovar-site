import test from 'node:test';
import assert from 'node:assert/strict';

const headers = await import('../cloudflare/security-headers.mjs').catch(() => null);
const worker = await import('../cloudflare/worker.mjs').catch(() => null);

test('edge adapter adds header-only defenses while preserving upstream body, status and stricter CSP', async () => {
  assert.equal(typeof headers?.withSecurityHeaders, 'function');
  const original = new Response('unchanged static page', { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': "script-src 'self'", 'Cache-Control': 'max-age=600', 'Set-Cookie': 'essential=choice; Secure; SameSite=Lax' } });
  const secured = headers.withSecurityHeaders(original);
  assert.equal(secured.status, 404);
  assert.equal(await secured.text(), 'unchanged static page');
  assert.equal(secured.headers.get('Content-Type'), 'text/html; charset=utf-8');
  assert.equal(secured.headers.get('Cache-Control'), 'max-age=600');
  assert.equal(secured.headers.get('Set-Cookie'), 'essential=choice; Secure; SameSite=Lax');
  assert.ok(secured.headers.get('Content-Security-Policy').includes("script-src 'self'"));
  assert.ok(secured.headers.get('Content-Security-Policy').includes("frame-ancestors 'none'"));
  assert.equal(secured.headers.get('X-Frame-Options'), 'DENY');
  assert.equal(secured.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(secured.headers.get('Strict-Transport-Security'), 'max-age=31536000');
  assert.equal(secured.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  assert.ok(secured.headers.get('Permissions-Policy').includes('camera=()'));
  assert.doesNotMatch(secured.headers.get('Content-Security-Policy'), /unsafe-inline|unsafe-eval|connect-src|script-src.*https:/);
});

test('worker passes the original request to the origin without changing redirect behavior', async () => {
  assert.equal(typeof worker?.default?.fetch, 'function');
  const originalFetch = globalThis.fetch;
  const request = new Request('https://radovar.com/docs/?source=menu', { headers: { Accept: 'text/html' } });
  let forwarded;
  try {
    globalThis.fetch = async actual => { forwarded = actual; return new Response(null, { status: 301, headers: { Location: 'https://radovar.com/docs/', ETag: '"fixture"' } }); };
    const response = await worker.default.fetch(request);
    assert.equal(forwarded, request);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), 'https://radovar.com/docs/');
    assert.equal(response.headers.get('ETag'), '"fixture"');
    assert.equal(response.headers.get('X-Frame-Options'), 'DENY');
  } finally { globalThis.fetch = originalFetch; }
});
