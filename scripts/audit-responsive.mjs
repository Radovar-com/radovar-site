import assert from 'node:assert/strict';
import path from 'node:path';
import sharp from 'sharp';
import { chromium } from 'playwright';
import { output, serveExport, offlineContext, prefix } from './audit-support.mjs';
const server = await serveExport(), browser = await chromium.launch();
const failures = [];
try {
  for (const width of [1000, 1100, 1440]) for (const deviceScaleFactor of [1, 2]) {
    const context = await offlineContext(browser, server.origin, { viewport: { width, height: 900 }, deviceScaleFactor, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(server.origin + prefix + '/');
    await page.getByRole('button', { name: 'Decline', exact: true }).click();
    for (const image of await page.locator('.feature__visual .app-shot__img:not(.app-shot__img--dark), .explorer-shot .app-shot__img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(element => element.decode());
      const actual = await image.evaluate(element => ({ src: new URL(element.src).pathname, current: new URL(element.currentSrc).pathname, rendered: element.getBoundingClientRect().width }));
      const original = await sharp(path.join(output, actual.src.slice(prefix.length))).metadata();
      const candidate = await sharp(path.join(output, actual.current.slice(prefix.length))).metadata();
      const minimum = Math.min(original.width, actual.rendered * deviceScaleFactor);
      if (candidate.width < minimum * .95) failures.push(`${width}px DPR${deviceScaleFactor}: ${actual.current} is ${candidate.width}px for ${actual.rendered}px displayed (needs ${minimum}px)`);
    }
    await context.close();
  }
} finally { await browser.close(); await server.close(); }
assert.deepEqual(failures, []);
console.log('PASS responsive screenshot selection at 1000/1100/1440px, DPR1/DPR2.');
