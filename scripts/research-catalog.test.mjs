import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const shared = process.env.OWNED_ANALYTICS_SITE_ROOT ?? path.resolve(root, '../owned-analytics-site-20261015');
const { PAGE_SECTION_SCOPE } = await import(pathToFileURL(path.join(shared, 'supabase/functions/_shared/metricDefinitions.ts')));
const { PAGE_REGISTRY } = await import(pathToFileURL(path.join(shared, 'supabase/functions/_shared/websiteAnalyticsContract.ts')));

test('research measurement opportunities match page and inherited footer markers exactly', async () => {
  const markers = html => [...html.matchAll(/data-analytics-section="([^"]+)"/g)].map(match => match[1]);
  const footer = markers(await readFile(new URL('../app/_components/SiteFooter.tsx', import.meta.url), 'utf8'));
  assert.deepEqual(footer, ['footer']);
  for (const [pageId, source] of [['research', 'research/page.tsx'], ['research_wave_ai', 'research/wave-ai/page.tsx']]) {
    assert.ok(PAGE_REGISTRY.radovar.includes(pageId), `${pageId} is registered in the collector`);
    const page = markers(await readFile(new URL(`../app/${source}`, import.meta.url), 'utf8'));
    assert.deepEqual([...page, ...footer], PAGE_SECTION_SCOPE.radovar[pageId]);
    assert.equal(new Set([...page, ...footer]).size, page.length + footer.length);
  }
});
