import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

test('production fonts build offline from the exact existing Radovar font bytes', async () => {
  const layout = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  assert.match(layout, /from "next\/font\/local"/);
  assert.doesNotMatch(layout, /next\/font\/google/);
  const fonts = {
    'newsreader-latin.woff2': '2a69ec1c0fb79a464de0e19957cdb3a65b5f626d85fffd164f9de557d3a64878',
    'newsreader-italic-latin.woff2': '19a83cc7ce02aab990c0f5fb8bd8f12f2f8e4f56430d5a3459521cabd852a51c',
    'geist-latin.woff2': '9b6f5ff45b278c744b5f379a2c4ecbaf858a842b8eaf82ac8d21b699ca16c608',
  };
  for (const [file, hash] of Object.entries(fonts)) {
    assert.ok(layout.includes(`../public/fonts/${file}`));
    const bytes = await readFile(new URL(`../public/fonts/${file}`, import.meta.url));
    assert.equal(bytes.subarray(0, 4).toString(), 'wOF2');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, `${file} preserves the published typeface`);
  }
  assert.match(layout, /variable: "--font-serif"/);
  assert.match(layout, /variable: "--font-sans"/);
  assert.match(layout, /weight: "300 400"/);
  assert.match(layout, /weight: "400 700"/);
  assert.match(await readFile(new URL('../public/fonts/OFL.txt', import.meta.url), 'utf8'), /SIL OPEN FONT LICENSE/);
});
