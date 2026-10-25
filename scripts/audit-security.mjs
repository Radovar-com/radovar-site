import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { parseHTML } from 'linkedom';
import { documents, routeFor, serveExport, prefix } from './audit-support.mjs';
const server = await serveExport();
const policies = new Set();
try {
  for (const route of [...(await documents()).map(routeFor), `${prefix}/missing-security-audit/`]) {
    const response = await fetch(server.origin + route);
    assert.equal(response.status, route.endsWith('/missing-security-audit/') ? 404 : 200);
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('strict-transport-security'), 'max-age=31536000');
    assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    assert.match(response.headers.get('permissions-policy'), /camera=\(\), microphone=\(\), geolocation=\(\)/);
    assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    const { document } = parseHTML(await response.text());
    const metas = [...document.querySelectorAll('meta[http-equiv]')].filter(node => node.getAttribute('http-equiv').toLowerCase() === 'content-security-policy');
    assert.equal(metas.length, 1, route);
    const policy = metas[0].getAttribute('content'); policies.add(policy);
    assert.match(policy, /script-src-attr 'none'/);
    assert.doesNotMatch(policy, /unsafe-eval|script-src [^;]*'unsafe-inline'/);
    for (const script of document.querySelectorAll('script:not([src])')) {
      const text = script.textContent.replace(/\r\n?/g, '\n').replace(/\0/g, '\ufffd');
      assert.ok(policy.includes(`'sha256-${createHash('sha256').update(text).digest('base64')}'`), `${route}: script hash`);
    }
  }
  assert.equal(policies.size, 1, 'same effective meta CSP for all documents, aliases and HTTP 404');
  console.log('PASS security headers and identical CSP on every exported page and actual HTTP 404 (local Cloudflare adapter).');
} finally { await server.close(); }
