import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { serveExport, offlineContext, prefix } from './audit-support.mjs';
const server = await serveExport(), browser = await chromium.launch();
const failures = [];
try {
  const context = await offlineContext(browser, server.origin, { reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(server.origin + prefix + '/');
  await page.getByRole('button', { name: 'Decline', exact: true }).waitFor();
  const social = page.locator('.footer__social');
  try { await social.getAttribute('aria-label').then(label => assert.ok(label?.includes('Follow us on X'), 'social accessible name must contain its visible label')); } catch (error) { failures.push(error.message); }
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  try { await page.waitForFunction(() => document.activeElement?.tagName === 'MAIN', null, { timeout: 3000 }); } catch { failures.push('Skip to content must move keyboard focus to main'); }
  const sdk = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => /owned-analytics\.js/.test(r.name)).length);
  try { assert.equal(sdk, 0, 'optional analytics SDK must not load before consent'); } catch (error) { failures.push(error.message); }
  await page.goto(server.origin + prefix + '/codevalanche/');
  const screenshot = page.locator('.app-shot__img').first();
  await screenshot.scrollIntoViewIfNeeded();
  await screenshot.evaluate(image => image.decode());
  try { assert.match(await screenshot.evaluate(image => image.currentSrc), /task-review-light-(960|1280)\.webp$/, 'desktop screenshot should use a correctly sized candidate'); } catch (error) { failures.push(error.message); }
  await context.close();
} finally { await browser.close(); await server.close(); }
assert.deepEqual(failures, []);
