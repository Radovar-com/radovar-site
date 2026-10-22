import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

test('qualified collector and SDK hash stay coordinated across BASE_PATH values', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/analytics/manifest.json', import.meta.url), 'utf8'));
  const sdk = await readFile(new URL('../public/analytics/owned-analytics.js', import.meta.url));
  assert.equal(createHash('sha256').update(sdk).digest('hex'), manifest.sha256, 'reviewed manifest describes the shipped bytes');
  assert.equal(sdk.length, manifest.bytes);
  const previous = process.env.BASE_PATH;
  try {
    for (const prefix of ['', '/radovar-site']) {
      process.env.BASE_PATH = prefix;
      const config = await import(new URL(`../app/analytics/config.ts?prefix=${encodeURIComponent(prefix)}`, import.meta.url));
      assert.equal(config.analyticsAsset, `${prefix}/analytics/owned-analytics.js?v=${manifest.sha256}`);
      assert.equal(config.analyticsConfig.enabled, true);
      assert.equal(config.analyticsConfig.baseUrl, 'https://hvevaxsfeyiikjhcsafi.supabase.co/functions/v1/website-analytics/v1');
      for (const [route, pageId] of [['/research/', 'research'], ['/research/wave-ai/', 'research_wave_ai']]) {
        assert.equal(config.analyticsPageId(`${prefix}${route}`), pageId);
        assert.equal(config.analyticsPageId(`${prefix}${route.slice(0, -1)}`), pageId);
      }
    }
  } finally {
    if (previous === undefined) delete process.env.BASE_PATH;
    else process.env.BASE_PATH = previous;
  }
});

test('only canonical HTTPS Radovar hosts inherit the production collector', async () => {
  const { resolveAnalyticsConfig } = await import('../app/analytics/config.ts');
  for (const hostname of ['radovar.com']) {
    assert.equal(resolveAnalyticsConfig({ hostname, protocol: 'https:' }).enabled, true);
    assert.equal(resolveAnalyticsConfig({ hostname, protocol: 'http:' }).enabled, false);
  }
  for (const hostname of ['localhost', '127.0.0.1', '[::1]', 'preview.invalid', 'radovar-com.github.io', 'radovar.com.evil.invalid', 'codevalanche.com', 'www.radovar.com']) {
    const config = resolveAnalyticsConfig({ hostname, protocol: 'https:' });
    assert.equal(config.enabled, false, hostname);
    assert.equal(config.baseUrl, '', hostname);
  }
});

test('test overrides are loopback-only and cannot send preview data to production', async () => {
  const { resolveAnalyticsConfig } = await import('../app/analytics/config.ts');
  const fixture = { enabled: true, baseUrl: 'http://127.0.0.1:4198/collector', pageVersion: 'local_fixture' };
  for (const hostname of ['localhost', '127.0.0.1', '[::1]']) {
    assert.deepEqual(resolveAnalyticsConfig({ hostname, protocol: 'http:' }, fixture), fixture);
    for (const baseUrl of ['https://hvevaxsfeyiikjhcsafi.supabase.co/functions/v1/website-analytics/v1', 'https://foreign.invalid/collector', '/collector', 'http://user:pass@localhost/collector', 'http://localhost/collector?secret=1', 'http://localhost/collector#fragment', 'http://[::1]:4198/collector']) {
      assert.equal(resolveAnalyticsConfig({ hostname, protocol: 'http:' }, { ...fixture, baseUrl }).enabled, false, baseUrl);
    }
  }
  assert.equal(resolveAnalyticsConfig({ hostname: 'preview.invalid', protocol: 'https:' }, fixture).enabled, false);
  assert.notEqual(resolveAnalyticsConfig({ hostname: 'radovar.com', protocol: 'https:' }, fixture).baseUrl, fixture.baseUrl);
});

test('an active analytics release cannot publish a privacy notice denying analytics', async () => {
  const { analyticsConfig } = await import('../app/analytics/config.ts');
  const source = await readFile(new URL('../app/privacy/page.tsx', import.meta.url), 'utf8');
  const currentNotice = source.split('<h2>Changes</h2>')[0];
  if (analyticsConfig.enabled) assert.doesNotMatch(currentNotice, /We do not run analytics|If we ever turn on website measurement|if it is ever switched on/i, 'the notice must match the activated collector');
});
