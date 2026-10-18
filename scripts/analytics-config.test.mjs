import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

test('SDK asset URL follows the reviewed distribution hash and BASE_PATH without enabling collection', async () => {
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
      assert.equal(config.analyticsConfig.enabled, false);
      assert.equal(config.analyticsConfig.baseUrl, '');
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
