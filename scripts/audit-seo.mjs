import './seo-export-test.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseHTML } from 'linkedom';
import sharp from 'sharp';
import { documents, output } from './audit-support.mjs';
const images = new Set(), types = new Set();
for (const file of await documents()) {
  const { document } = parseHTML(await readFile(file, 'utf8'));
  const canonicals = document.querySelectorAll('link[rel="canonical"]');
  assert.equal(canonicals.length, 1, `${file}: exactly one canonical`);
  assert.ok(new URL(canonicals[0].getAttribute('href')).origin === 'https://radovar.com');
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    const data = JSON.parse(script.textContent);
    assert.equal(data['@context'], 'https://schema.org');
    for (const node of data['@graph'] ?? [data]) {
      assert.ok(typeof node['@type'] === 'string'); types.add(node['@type']);
      if (node['@id']) assert.ok(new URL(node['@id']).protocol === 'https:');
      if (node['@type'] === 'BreadcrumbList') {
        assert.deepEqual(node.itemListElement.map(item => item.position), node.itemListElement.map((_, i) => i + 1));
        for (const item of node.itemListElement) { assert.ok(item.name); assert.equal(new URL(item.item).origin, 'https://radovar.com'); }
      }
      if (node['@type'] === 'WebPage') { assert.equal(node.url, canonicals[0].getAttribute('href')); assert.ok(node.name && node.description); }
      if (node['@type'] === 'FAQPage') for (const item of node.mainEntity) { assert.equal(item['@type'], 'Question'); assert.equal(item.acceptedAnswer['@type'], 'Answer'); assert.ok(item.acceptedAnswer.text); }
    }
  }
  for (const node of document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')) images.add(node.getAttribute('content'));
}
for (const url of images) {
  const metadata = await sharp(await readFile(path.join(output, new URL(url).pathname))).metadata();
  assert.equal(metadata.format, 'png'); assert.equal(metadata.width, 1200); assert.equal(metadata.height, 630);
}
assert.deepEqual(await readFile(path.join(output, 'social-card.png')), await readFile(path.join(output, 'radovar-social-20261016.png')), 'legacy share URL matches the generated card');
console.log(`PASS JSON-LD structure and breadcrumbs (${[...types].join(', ')}); all ${images.size} social cards are real 1200x630 PNGs.`);
