// Local UI qualification only. Never enables analytics or contacts a live provider.
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
import { chromium } from 'playwright';
const origin = process.env.RADOVAR_THEME_TEST_ORIGIN ?? 'http://127.0.0.1:4188';
assert.ok(/^http:\/\/127\.0\.0\.1:\d+$/.test(origin), 'Only an explicit local server is allowed');
const browser = await chromium.launch({ headless: true });
const errors = [];
let checks = 0;
function check(value, message) { assert.ok(value, message); checks += 1; }
async function context(options = {}) {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', colorScheme: 'light', ...options });
  await ctx.route('https://**/*', route => route.abort());
  ctx.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  return ctx;
}
async function ready(page, route = '/') {
  await page.goto(origin + route);
  await page.getByRole('button', { name: /Switch to (dark|light) theme/ }).waitFor();
  await page.waitForFunction(() => document.documentElement.dataset.theme);
  await page.waitForFunction(() => window.RadovarAnalytics?.consentManager);
  const decline = page.getByRole('button', { name: 'Decline', exact: true });
  if (await decline.isVisible()) {
    await decline.click();
    await decline.waitFor({ state: 'hidden' });
  }
}
async function expectTheme(page, theme) {
  await page.waitForFunction(value => document.documentElement.dataset.theme === value, theme);
  check(await page.locator('html').getAttribute('data-theme') === theme, `Theme is ${theme}`);
}
try {
  const ctx = await context();
  const page = await ctx.newPage();
  await ready(page);
  const toggle = page.locator('footer .theme-toggle');
  check(await page.locator('.theme-toggle').count() === 1, 'Exactly one theme control');
  check(await page.locator('header .theme-toggle, header .theme-switch, header .nav__actions').count() === 0, 'Header has no theme switch or empty actions wrapper');
  check(await toggle.textContent() === '', 'Icon control has no visible Light/Dark text');
  check(await toggle.getAttribute('title') === 'Switch to dark theme', 'Accessible title describes the next action');
  await toggle.scrollIntoViewIfNeeded();
  const geometry = await toggle.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height, pointer: getComputedStyle(element).pointerEvents, hit: element.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)) };
  });
  check(geometry.width >= 44 && geometry.height >= 44, '44px pointer target');
  check(geometry.pointer === 'auto' && geometry.hit, 'Footer scenery does not intercept pointer interaction');
  await toggle.click();
  await expectTheme(page, 'dark');
  check(await toggle.getAttribute('aria-label') === 'Switch to light theme', 'Accessible label changes with state');
  check(await page.evaluate(() => localStorage.getItem('radovar-theme')) === 'dark', 'Preference stored');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expectTheme(page, 'light');
  check(await toggle.evaluate(element => element.matches(':focus-visible')), 'Keyboard focus stays visible');
  await page.keyboard.press('Space');
  await expectTheme(page, 'dark');
  await page.reload();
  await expectTheme(page, 'dark');
  await page.locator('header .nav__links a').filter({ hasText: 'Docs' }).click();
  await page.waitForURL('**/docs/');
  await expectTheme(page, 'dark');
  check(await page.locator('footer .theme-toggle').count() === 1, 'Theme control remains available on inner pages');
  const second = await ctx.newPage();
  await ready(second);
  await second.locator('footer .theme-toggle').click();
  await expectTheme(page, 'light');
  await expectTheme(second, 'light');
  await ctx.close();

  const mobile = await context({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobile.newPage();
  await ready(mobilePage);
  await mobilePage.locator('.nav__menu summary').click();
  check(await mobilePage.locator('.nav__menu').getAttribute('open') !== null, 'Mobile menu opens');
  await mobilePage.locator('.nav__panel a').filter({ hasText: 'Company' }).click();
  check(await mobilePage.locator('.nav__menu').getAttribute('open') === null, 'Mobile menu closes after navigation');
  await mobilePage.locator('footer .theme-toggle').click();
  await expectTheme(mobilePage, 'dark');
  check(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'Mobile has no horizontal overflow');
  check(await mobilePage.locator('.scenic-footer__utilities a').textContent() === 'Back to top', 'Back-to-top remains alongside the icon');
  await mobile.close();

  const fallback = await context({ colorScheme: 'dark' });
  await fallback.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Unavailable', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Unavailable', 'SecurityError'); };
  });
  const fallbackPage = await fallback.newPage();
  await ready(fallbackPage);
  await expectTheme(fallbackPage, 'dark');
  await fallbackPage.locator('footer .theme-toggle').click();
  await expectTheme(fallbackPage, 'light');
  await fallback.close();
  check(errors.length === 0, `No client exceptions: ${errors.join('; ')}`);
  console.log(JSON.stringify({ status: 'passed', checks, origin, scope: 'local actual UI; no analytics activation' }));
} finally {
  await browser.close();
}
