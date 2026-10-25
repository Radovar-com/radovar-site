import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { documents, routeFor, serveExport, prefix } from './audit-support.mjs';

// Fulfil canonical-host/collector requests locally; never contact production.
const server = await serveExport(), browser = await chromium.launch();
const receipts = [], batches = [], calls = [];
async function context(optional = {}) {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === 'https://radovar.com') {
      if (url.pathname.endsWith('/analytics/owned-analytics.js')) {
        optional.seen?.();
        if (optional.gate) await optional.gate;
        if (optional.failure === 'blocked') return route.abort();
        if (optional.failure === 'throwing') return route.fulfill({ contentType: 'text/javascript', body: 'throw new Error("fixture optional module failure")' });
      }
      const response = await fetch(server.origin + url.pathname + url.search);
      const headers = Object.fromEntries(response.headers); delete headers['content-encoding']; delete headers['content-length'];
      let body = Buffer.from(await response.arrayBuffer());
      if (optional.gate && url.pathname.endsWith('/analytics/owned-analytics.js')) body = Buffer.concat([body, Buffer.from(';globalThis.__fixtureOptionalEvaluated = true;')]);
      return route.fulfill({ status: response.status, headers, body });
    }
    if (url.hostname.endsWith('.supabase.co')) {
      const body = request.postDataJSON(); calls.push(url.pathname);
      for (const header of ['cookie', 'authorization', 'referer']) assert.equal(request.headers()[header], undefined, header);
      assert.ok(!JSON.stringify(body).includes('privacy-canary'), 'URL/query/hash canary must not leak');
      if (url.pathname.endsWith('/consent/receipts')) {
        const receipt = { receiptId: crypto.randomUUID(), ...body, issuedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString(), collectionToken: 'local_fixture_collection_capability_123', revocationProof: 'local_fixture_revocation_capability_123' };
        receipts.push(receipt);
        return route.fulfill({ json: receipt });
      }
      if (url.pathname.endsWith('/events')) {
        batches.push(body);
        for (const event of body.events) {
          assert.ok(!('url' in event || 'email' in event || 'ip' in event || 'user_agent' in event));
          assert.ok(!/https?:\/\/|privacy-canary|@/.test(JSON.stringify(event)), 'events contain semantic IDs, not raw URLs or contact data');
        }
        return route.fulfill({ json: { acceptedIds: body.events.map(event => event.event_id), duplicateIds: [], rejected: [], generation: body.generation, receivedAt: new Date().toISOString(), retryAfterMs: null } });
      }
      assert.equal(request.method(), 'DELETE');
      return route.fulfill({ json: { revoked: true } });
    }
    throw new Error(`Unexpected external resource: ${url.origin}`);
  });
  return ctx;
}
try {
  for (const file of await documents()) {
    const ctx = await context(), page = await ctx.newPage(), initial = calls.length;
    await page.goto('https://radovar.com' + routeFor(file) + '?privacy-canary=1#privacy-canary');
    await page.getByRole('button', { name: 'Decline', exact: true }).waitFor();
    assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(r => r.name.includes('/owned-analytics.js'))), false);
    assert.equal(calls.length, initial, 'no collector call before consent');
    await page.getByRole('button', { name: 'Decline', exact: true }).click();
    await page.reload();
    await page.getByRole('button', { name: 'Manage cookies', exact: true }).click();
    await page.getByRole('dialog').waitFor();
    assert.equal(await page.getByRole('checkbox', { name: 'Website analytics', exact: true }).isChecked(), false);
    assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(r => r.name.includes('/owned-analytics.js'))), false);
    assert.equal(calls.length, initial, 'persisted refusal makes no collector call');
    console.log(`PASS ${routeFor(file)}: no SDK/collector before consent or after refusal/reload`);
    await ctx.close();
  }
  const ctx = await context(), page = await ctx.newPage();
  await page.goto('https://radovar.com' + prefix + '/?privacy-canary=1#privacy-canary');
  const firstBatch = page.waitForResponse(response => response.url().endsWith('/events'), { timeout: 25000 });
  await page.getByRole('button', { name: 'Accept analytics', exact: true }).click();
  await firstBatch;
  assert.ok(receipts.length && batches.length, 'explicit grant obtains a receipt and permits collection');
  await page.getByRole('button', { name: 'Manage cookies', exact: true }).click();
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  const previous = batches.length;
  await page.getByRole('tab', { name: 'Your agents', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Manage cookies', exact: true }).click();
  assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(r => r.name.includes('/owned-analytics.js'))), false);
  assert.equal(batches.length, previous, 'withdrawal fences collection and reload');
  await ctx.close();
  console.log('PASS explicit grant, local receipt/event payload privacy checks and withdrawal.');
  for (const failure of ['blocked', 'throwing', 'held']) {
    let release, seen;
    const gate = new Promise(resolve => { release = resolve; });
    const requested = new Promise(resolve => { seen = resolve; });
    const isolated = await context({ failure, seen, ...(failure === 'held' ? { gate } : {}) });
    const p = await isolated.newPage(), errors = [];
    p.on('pageerror', error => errors.push(error.message));
    await p.goto('https://radovar.com' + prefix + '/');
    const before = batches.length;
    await p.getByRole('button', { name: 'Accept analytics', exact: true }).click();
    await requested;
    if (failure !== 'held') await p.getByText('Cookie preferences are temporarily unavailable.', { exact: false }).waitFor({ state: 'attached' });
    await p.locator(`.nav__links a[href="${prefix}/docs/"]`).click();
    await p.waitForURL('https://radovar.com' + prefix + '/docs/');
    await p.getByRole('button', { name: 'Manage cookies', exact: true }).click();
    await p.getByRole('button', { name: 'Decline', exact: true }).click();
    if (failure === 'held') {
      release();
      await p.waitForFunction(() => window.__fixtureOptionalEvaluated === true);
    }
    assert.equal(await p.evaluate(() => localStorage.getItem('owned_analytics:radovar:identity')), null);
    assert.equal(await p.evaluate(() => localStorage.getItem('owned_analytics:radovar:queue')), null);
    await p.reload();
    await p.getByRole('button', { name: 'Manage cookies', exact: true }).click();
    assert.equal(await p.getByRole('checkbox', { name: 'Website analytics', exact: true }).isChecked(), false);
    assert.equal(batches.length, before, 'failed/late optional import cannot collect after withdrawal');
    assert.deepEqual(errors, []);
    await isolated.close();
    console.log(`PASS optional client ${failure}: navigation and withdrawal remain usable; no events or identity`);
  }
} finally { await browser.close(); await server.close(); }
