// The mobile dark-mode regressions reported by the owner, checked on local UI.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
import { chromium } from 'playwright';
const origin = process.env.RADOVAR_APPEARANCE_ORIGIN ?? 'http://127.0.0.1:4188';
assert.ok(/^http:\/\/127\.0\.0\.1:\d+$/.test(origin), 'Local qualification only');
const output = path.join(root, '.superpowers/sdd/2026-10-16-technical-audit/dark-mode');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const findings = [];
try {
  for (const width of [393, 1440]) for (const colorScheme of ['dark', 'light']) {
    const ctx = await browser.newContext({ viewport: { width, height: 852 }, colorScheme, reducedMotion: 'reduce' });
    await ctx.route('https://**/*', route => route.abort());
    const page = await ctx.newPage();
    await page.goto(origin);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => window.RadovarAnalytics?.consentManager);
    const decline = page.getByRole('button', { name: 'Decline', exact: true });
    if (await decline.isVisible()) await decline.click();
    await page.evaluate(() => window.scrollTo(0, document.querySelector('#company').offsetTop - 90));
    if (colorScheme === 'dark') assert.ok(await page.locator('#company').evaluate(element => {
      const style = getComputedStyle(element);
      return style.boxShadow === 'none' && ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'].every(key => parseFloat(style[key]) === 0);
    }), 'Mission section has no enclosing border or inset shadow');
    await page.screenshot({ path: path.join(output, `mission-${width}-${colorScheme}.png`) });
    const art = page.locator('footer .landscape-scene__art');
    await page.evaluate(() => window.scrollTo(0, document.querySelector('footer').offsetTop + (innerWidth < 761 ? 210 : -120)));
    await page.waitForFunction(() => [...document.querySelectorAll('footer img')].every(image => image.complete && image.naturalWidth > 0));
    assert.ok(await art.evaluate(element => getComputedStyle(element).maskImage !== 'none' && getComputedStyle(element).webkitMaskImage !== 'none'), 'Artwork fades at its own edge on standard and WebKit engines');
    await page.screenshot({ path: path.join(output, `footer-${width}-${colorScheme}.png`) });
    if (width === 393 && colorScheme === 'dark') {
      const rect = await art.boundingBox();
      const screenshot = await page.screenshot();
      const { data, info } = await sharp(screenshot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const edge = Math.round(rect.y);
      assert.ok(edge > 80 && edge < 650, 'Shifted image edge is in the visible test region');
      const row = y => [0, 1, 2].map(channel => {
        let sum = 0;
        for (let x = 4; x < 14; x++) sum += data[(y * info.width + x) * 3 + channel];
        return sum / 10;
      });
      const above = row(edge - 2), below = row(edge + 2);
      const delta = Math.max(...above.map((value, index) => Math.abs(value - below[index])));
      assert.ok(delta <= 3, `No hard artwork edge across dark gutter: RGB delta ${delta}`);
      findings.push({ width, colorScheme, edge, above, below, maximumChannelDelta: delta });
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
    await ctx.close();
  }
  await writeFile(path.join(output, 'results.json'), JSON.stringify({ status: 'passed', findings, scope: 'Local Chromium, mobile/desktop, light/dark; Safari device not claimed' }, null, 2));
  console.log('PASS appearance: mobile/desktop light/dark; mission frame removed; footer edge RGB continuity verified.');
} finally { await browser.close(); }
