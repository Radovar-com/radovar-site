import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

test('desktop screenshot candidates preserve the complete crop and avoid full-size downloads', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/media/codevalanche/responsive-shots.json', import.meta.url), 'utf8'));
  for (const name of ['approval.webp', 'task-review-light.webp', 'task-review-dark.webp', 'task-brief.webp', 'ai-providers.webp', 'changes.webp']) {
    const shot = manifest['/media/codevalanche/' + name];
    assert.ok(shot, `${name}: desktop responsive candidates missing`);
    const candidate = shot.candidates.find(item => item.width === 960);
    assert.ok(candidate);
    const original = await readFile(new URL('../public/media/codevalanche/' + name, import.meta.url));
    const bytes = await readFile(new URL('../public' + candidate.src, import.meta.url));
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, 960);
    assert.ok(Math.abs(metadata.height - shot.height * 960 / shot.width) <= 1, 'same crop/aspect ratio');
    assert.ok(bytes.length < original.length, `${name}: 960px saves bytes`);
  }
});
