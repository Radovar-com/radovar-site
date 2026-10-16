// Actual local UI/asset checks. No provider requests or analytics activation.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shared = process.env.OWNED_ANALYTICS_SITE_ROOT ?? path.resolve(root, '../owned-analytics-site-20261015');
const { chromium } = createRequire(path.join(shared, 'package.json'))('playwright');
const sharp = createRequire(path.join(root, 'package.json'))('sharp');
const origin = process.env.RADOVAR_HEADER_TEST_ORIGIN ?? 'http://127.0.0.1:4188';
assert.ok(/^http:\/\/127\.0\.0\.1:\d+$/.test(origin), 'Only a local server is allowed');
const output = process.env.RADOVAR_HEADER_TEST_OUTPUT ?? path.join(root, '.superpowers/sdd/2026-10-15-owned-web-account-analytics/radovar-header-refinement');
await mkdir(output, { recursive: true });
const checks = [];
const errors = [];
const geometry = {};
function check(value, name) { assert.ok(value, name); checks.push(name); }
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const committed = filename => execFileSync('git', ['show', `HEAD:${filename}`], { cwd: root, maxBuffer: 1024 * 1024 });
const dPaths = svg => [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(match => match[1]);
const originalLogo = committed('public/radovar-logo.svg');
const logo = await readFile(path.join(root, 'public/radovar-logo.svg'));
const originalIcon = committed('public/radovar-icon.svg');
const icon = await readFile(path.join(root, 'public/radovar-icon.svg'));
check(logo.equals(originalLogo), 'Full wordmark bytes exactly match the existing committed Radovar identity');
const iconPaths = dPaths(icon.toString());
check(iconPaths.length === 2 && dPaths(originalIcon.toString()).includes(iconPaths[1]), 'Favicon combines the exact original R with its optically refined signature arc');
const samePath = (left, right) => {
  const numbers = value => [...value.matchAll(/-?(?:\d*\.)?\d+(?:e[+-]?\d+)?/gi)].map(match => Number(match[0]));
  const a = numbers(left), b = numbers(right);
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) < .001);
};
const ico = await readFile(path.join(root, 'public/favicon.ico'));
check(ico.readUInt16LE(0) === 0 && ico.readUInt16LE(2) === 1, 'Favicon is a valid ICO container');
const sizes = Array.from({ length: ico.readUInt16LE(4) }, (_, index) => {
  const offset = 6 + index * 16;
  return [ico[offset] || 256, ico[offset + 1] || 256];
});
check([16, 32, 48].every(size => sizes.some(([width, height]) => width === size && height === size)), 'ICO contains 16, 32 and 48 pixel images');
const apple = await readFile(path.join(root, 'app/apple-icon.png'));
check(apple.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && apple.readUInt32BE(16) === 180 && apple.readUInt32BE(20) === 180, 'Apple touch icon is a 180 by 180 PNG');

const browser = await chromium.launch({ headless: true });
async function context(viewport) {
  const ctx = await browser.newContext({ viewport, reducedMotion: 'reduce', colorScheme: 'light' });
  await ctx.route('https://**/*', route => route.abort());
  ctx.on('page', page => page.on('pageerror', error => errors.push(error.message)));
  return ctx;
}
async function ready(page) {
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.RadovarAnalytics?.consentManager);
  const decline = page.getByRole('button', { name: 'Decline', exact: true });
  if (await decline.isVisible()) { await decline.click(); await decline.waitFor({ state: 'hidden' }); }
  await page.waitForFunction(() => document.querySelector('.nav')?.dataset.compact === 'false');
}
async function compact(page, expected) {
  await page.waitForFunction(value => document.querySelector('.nav')?.dataset.compact === value, String(expected));
  check(await page.locator('header.nav').getAttribute('data-compact') === String(expected), `Header ${expected ? 'retains original R after scrolling' : 'shows full wordmark near the top'}`);
}
async function pinned(page, label) {
  const rect = await page.locator('header.nav').boundingBox();
  check(rect && Math.abs(rect.y) <= 1, `${label}: header remains pinned to viewport top`);
  check(Math.abs(rect.height - geometry.desktopHeaderHeight) <= 1, `${label}: compact state keeps the same header height`);
}
async function anchorArrived(page, id) {
  // Native anchors can scroll smoothly; wait for the destination, not just the URL hash.
  await page.waitForFunction(value => {
    const rect = document.getElementById(value)?.getBoundingClientRect();
    const header = document.querySelector('header.nav')?.getBoundingClientRect();
    return rect && header && rect.top >= header.bottom && rect.top <= header.bottom + 45;
  }, id);
  check(await page.locator('#' + id).evaluate(element => {
    const rect = element.getBoundingClientRect();
    const header = document.querySelector('header.nav').getBoundingClientRect();
    return rect.top >= header.bottom && rect.top <= header.bottom + 45;
  }), `${id}: native anchor places the section directly below the pinned header`);
}
try {
  const ctx = await context({ width: 1280, height: 720 });
  const page = await ctx.newPage();
  await ready(page);
  const header = page.locator('header.nav');
  geometry.desktopHeaderHeight = (await header.boundingBox()).height;
  check(await header.evaluate(element => getComputedStyle(element).position) === 'sticky', 'Header remains available during document scrolling');
  const cta = page.locator('.introduction').getByRole('link', { name: 'Our mission', exact: true });
  const ctaRect = await cta.boundingBox();
  geometry.desktopHeroCta = ctaRect;
  check(ctaRect && ctaRect.y >= geometry.desktopHeaderHeight && ctaRect.y + ctaRect.height <= 720 && ctaRect.x >= 0 && ctaRect.x + ctaRect.width <= 1280, 'Full primary hero action is above the fold at 1280 by 720 after fonts load');
  check(await cta.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return element.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
  }), 'Above-fold hero action has an unobstructed pointer target');
  check(await page.locator('a, button, summary').evaluateAll(elements => elements.every(element => !/[↗↘↙↖→←↑↓]/u.test(element.textContent ?? ''))), 'Interactive controls contain no decorative arrow characters');
  check(await page.locator('.header-brand__art path').evaluateAll(elements => elements.every(element => getComputedStyle(element).transitionDuration.split(',').every(value => parseFloat(value) === 0))), 'Reduced-motion mode disables every letter and arc transition');
  check(await header.evaluate(element => getComputedStyle(element).transitionDuration.split(',').every(value => parseFloat(value) === 0)), 'Reduced-motion mode disables header transitions');
  await page.screenshot({ path: path.join(output, 'desktop-hero.png') });

  await page.evaluate(() => window.scrollTo(0, 80));
  await compact(page, false);
  await page.evaluate(() => window.scrollTo(0, 120));
  await compact(page, true);
  await pinned(page, 'After scrolling below the wordmark threshold');
  const signature = await page.locator('.header-brand__art').evaluate(element => {
    const initial = element.querySelector('.header-brand__initial');
    const arc = element.querySelector('.header-brand__arc');
    const coordinates = [...getComputedStyle(arc).d.matchAll(/-?(?:\d*\.)?\d+(?:e[+-]?\d+)?/gi)].map(match => Number(match[0]));
    const points = Array.from({ length: coordinates.length / 2 }, (_, index) => ({ x: coordinates[index * 2], y: coordinates[index * 2 + 1] }));
    const left = points.reduce((best, point) => point.x < best.x ? point : best);
    const right = points.reduce((best, point) => point.x > best.x ? point : best);
    const screen = arc.getScreenCTM();
    const endpoints = [left, right].map(point => new DOMPoint(point.x, point.y).matrixTransform(screen));
    return {
      clip: getComputedStyle(element).clipPath,
      initial: initial.getBoundingClientRect().toJSON(),
      arc: arc.getBoundingClientRect().toJSON(),
      matrices: [arc, initial].map(shape => getComputedStyle(shape).transform),
      arcPath: getComputedStyle(arc).d,
      endpoints: endpoints.map(point => ({ x: point.x, y: point.y })),
      hidden: [...element.querySelectorAll('.header-brand__letter')].every(shape => getComputedStyle(shape).opacity === '0'),
    };
  });
  check(signature.clip === 'none' && signature.hidden, 'Compact logo moves individual letterforms without clipping the wordmark');
  check(signature.initial.width > 24 && signature.initial.width < 32 && signature.arc.width > 24 && signature.arc.width < 34, 'Compact R and arc form one legible symbol at actual header size');
  const [arcLeft, arcRight] = signature.endpoints;
  check(Math.abs(arcLeft.y - arcRight.y) < .01 && arcLeft.y - signature.initial.bottom > 2, 'Both arc tips have the same visible clearance below the R baseline');
  check(Math.abs((signature.initial.left - arcLeft.x) - (arcRight.x - signature.initial.right)) < .02, 'Arc extends equally beyond the left and right edges of the R');
  check(signature.initial.y >= 0 && signature.arc.bottom < geometry.desktopHeaderHeight, 'Complete compact symbol stays inside the sticky header');
  const iconMatrices = [...icon.toString().matchAll(/<path\b[^>]*\btransform="([^"]+)"/g)].map(match => match[1].replace(/\s/g, ''));
  check(signature.matrices[1].replace(/\s/g, '') === iconMatrices[0] && samePath(signature.arcPath, iconPaths[0]), 'Header endpoint and favicon share the exact same R and refined arc geometry');

  await page.locator('.introduction').getByRole('link', { name: 'Our mission', exact: true }).click();
  await page.waitForURL('**/#company');
  await anchorArrived(page, 'company');
  await compact(page, true);
  await pinned(page, 'After Company anchor navigation');
  check(await page.locator('#company').evaluate(element => element.getBoundingClientRect().bottom > 80 && element.getBoundingClientRect().top < window.innerHeight), 'Mission anchor reaches its intended visible section');
  await page.screenshot({ path: path.join(output, 'desktop-company-header.png') });
  await page.locator('.introduction').getByRole('link', { name: 'What we build', exact: true }).click();
  await page.waitForURL('**/#codevalanche');
  await anchorArrived(page, 'codevalanche');
  await compact(page, true);
  await pinned(page, 'After Product anchor navigation');
  check(await page.locator('#codevalanche').evaluate(element => element.getBoundingClientRect().bottom > 80 && element.getBoundingClientRect().top < window.innerHeight), 'Product navigation reaches its intended visible section');
  for (const [name, route] of [['Company', '/company/'], ['Codevalanche', '/codevalanche/'], ['Newsroom', '/press/']]) {
    await page.getByRole('navigation', { name: 'Primary', exact: true }).getByRole('link', { name, exact: true }).click();
    await page.waitForURL((url) => url.pathname === route);
    await page.locator('main h1').waitFor();
    await pinned(page, `After ${name} page navigation`);
    check(await page.locator('.nav__links a[aria-current="page"]').innerText() === name, `Header marks the ${name} page as current`);
  }
  check(await page.locator('header.nav .nav__cta').evaluate(element => element.getAttribute('href') === 'https://codevalanche.com' && element.dataset.analyticsAction === 'product' && element.dataset.analyticsPlacement === 'header'), 'Header product action keeps its analytics markers');
  await page.goto(origin + '/');
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await compact(page, true);

  const theme = page.locator('footer .theme-toggle');
  check(await page.locator('.theme-toggle').count() === 1 && await theme.count() === 1, 'Exactly one discreet theme icon remains in the footer');
  await theme.click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  check(await theme.getAttribute('aria-label') === 'Switch to light theme', 'Footer theme icon still switches to dark mode');
  await theme.click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  check(await theme.getAttribute('aria-label') === 'Switch to dark theme', 'Footer theme icon still switches back to light mode');
  await page.getByRole('link', { name: 'Back to top', exact: true }).click();
  await page.waitForFunction(() => window.scrollY <= 1);
  await compact(page, false);
  check(await page.evaluate(() => window.scrollY) <= 96, 'Back to top restores the full wordmark region');
  await pinned(page, 'After Back to top');
  check(await page.locator('.header-brand__art path').evaluateAll(elements => elements.every(element => new DOMMatrix(getComputedStyle(element).transform).isIdentity && getComputedStyle(element).opacity === '1')), 'Back to top restores all original letterforms and the full signature arc');
  const expandedSvg = await page.locator('.header-brand__art').evaluate(element => {
    const copy = element.cloneNode(true);
    copy.querySelector('.header-brand__arc-fallback')?.remove();
    return copy.outerHTML;
  });
  // Separate compound paths can antialias slightly differently at source resolution.
  // Compare the actual 160px display size, using the same original ink and background.
  const actualPixels = await sharp(Buffer.from(expandedSvg.replaceAll('currentColor', '#1B1B1B'))).resize(160).flatten({ background: '#faf9f5' }).raw().toBuffer();
  const originalPixels = await sharp(originalLogo).resize(160).flatten({ background: '#faf9f5' }).raw().toBuffer();
  check(actualPixels.equals(originalPixels), 'Expanded artwork matches the original logo pixel-for-pixel at its 160px display size');

  const logoSources = await page.locator('footer .radovar-logo').evaluateAll(elements => elements.map(element => element.getAttribute('src')));
  check(logoSources.length === 1 && new URL(logoSources[0], origin).pathname === '/radovar-logo.svg' && new URL(logoSources[0], origin).searchParams.get('v') === '20261016-original', 'Footer retains the unchanged original logo asset');
  const servedLogo = await page.request.get(new URL(logoSources[0], origin).href);
  check(servedLogo.status() === 200 && (await servedLogo.body()).equals(originalLogo), 'Browser serves the original wordmark bytes successfully');
  const iconLinks = await page.locator('link[rel="icon"], link[rel="apple-touch-icon"]').evaluateAll(elements => elements.map(element => ({ href: element.getAttribute('href'), sizes: element.getAttribute('sizes') })));
  for (const [filename, bytes] of [['radovar-icon.svg', icon], ['favicon.ico', ico], ['apple-icon.png', apple]]) {
    const link = iconLinks.find(item => new URL(item.href, origin).pathname === '/' + filename);
    check(link && new URL(link.href, origin).searchParams.get('v') === '20261016r7', `${filename}: refreshed icon metadata has the new cache version`);
    const response = await page.request.get(new URL(link.href, origin).href);
    check(response.status() === 200 && (await response.body()).equals(bytes), `${filename}: browser receives the exact generated asset successfully`);
  }
  await ctx.close();

  const mobile = await context({ width: 320, height: 740 });
  const mobilePage = await mobile.newPage();
  await ready(mobilePage);
  check(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), '320px home page has no horizontal overflow');
  await mobilePage.screenshot({ path: path.join(output, 'mobile-hero-320.png') });
  const summary = mobilePage.locator('.nav__menu > summary');
  check(await summary.getAttribute('aria-label') === 'Open menu', 'Native mobile summary has a clear accessible name');
  await summary.click();
  check(await mobilePage.locator('.nav__menu').getAttribute('open') !== null, 'Native mobile menu opens');
  await mobilePage.getByRole('navigation', { name: 'Mobile primary', exact: true }).getByRole('link', { name: 'Company', exact: true }).click();
  await mobilePage.waitForURL((url) => url.pathname === '/company/');
  await mobilePage.locator('main h1').waitFor();
  check(await mobilePage.locator('.nav__menu').getAttribute('open') === null, 'Native mobile menu closes after selecting a destination');
  await mobilePage.evaluate(() => window.scrollTo(0, 1400));
  await compact(mobilePage, true);
  check(Math.abs((await mobilePage.locator('header.nav').boundingBox()).y) <= 1, 'Mobile header remains pinned on the Company page');
  const mobileScroll = await mobilePage.evaluate(() => window.scrollY);
  // Click the already-visible sticky summary at its viewport coordinates. Locator.click's
  // automatic scroll-into-view can move the document even though this sticky child is visible.
  const summaryRect = await summary.boundingBox();
  check(summaryRect && summaryRect.y >= 0 && summaryRect.y + summaryRect.height <= 74, 'Scrolled mobile menu is directly reachable inside the pinned header');
  await mobilePage.mouse.click(summaryRect.x + summaryRect.width / 2, summaryRect.y + summaryRect.height / 2);
  check(await mobilePage.locator('.nav__menu').getAttribute('open') !== null, 'A direct pointer click opens the already-visible sticky mobile menu');
  await summary.press('Escape');
  check(await mobilePage.locator('.nav__menu').getAttribute('open') === null && await summary.evaluate(element => element === document.activeElement), 'Escape closes the mobile menu and retains summary focus');
  check(Math.abs(await mobilePage.evaluate(() => window.scrollY) - mobileScroll) <= 1, 'Opening and closing the mobile menu keeps the reading position');
  check(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), '320px Company page remains free of horizontal overflow');
  geometry.mobileFinalScroll = mobileScroll;
  await mobilePage.screenshot({ path: path.join(output, 'mobile-company-header-320.png') });
  await mobile.close();
  // Normal-motion behavior: actual scroll triggers, intermediate frames, quick reversal,
  // settled endpoints and no idle loop. The reduced-motion contexts above stay instant.
  const motionContext = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2, reducedMotion: 'no-preference', colorScheme: 'light' });
  await motionContext.route('https://**/*', route => route.abort());
  const motionPage = await motionContext.newPage();
  motionPage.on('pageerror', error => errors.push(error.message));
  await ready(motionPage);
  const sample = () => motionPage.locator('.header-brand__art').evaluate(element => ({
    initial: getComputedStyle(element.querySelector('.header-brand__initial')).transform,
    arc: getComputedStyle(element.querySelector('.header-brand__arc')).transform,
    arcPath: getComputedStyle(element.querySelector('.header-brand__arc')).d,
    letters: [...element.querySelectorAll('.header-brand__letter')].map(shape => Number(getComputedStyle(shape).opacity)),
    active: element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length,
    x: element.closest('a').getBoundingClientRect().x,
    width: element.closest('a').getBoundingClientRect().width,
  }));
  const before = await sample();
  await motionPage.evaluate(() => window.scrollTo(0, 130));
  await compact(motionPage, true);
  await motionPage.waitForTimeout(100);
  const during = await sample();
  check(during.active > 0 && during.initial !== before.initial && during.initial !== signature.matrices[1], 'Scroll produces a real intermediate R transformation');
  check(during.arcPath !== before.arcPath && !samePath(during.arcPath, signature.arcPath) && during.letters.some(opacity => opacity > 0 && opacity < 1), 'Signature arc genuinely reshapes while the original letters retract progressively');
  check(during.x === before.x && during.width === before.width, 'Motion leaves the navigation layout and click target stationary');
  await motionPage.screenshot({ path: path.join(output, 'motion-collapse-intermediate.png') });
  await motionPage.evaluate(() => window.scrollTo(0, 0));
  await compact(motionPage, false);
  await motionPage.waitForTimeout(850);
  const reversed = await sample();
  check(reversed.initial === 'none' && reversed.arc === 'none' && samePath(reversed.arcPath, before.arcPath) && reversed.letters.every(value => value === 1), 'Quick reverse scroll returns cleanly to the complete original identity');
  check(reversed.active === 0, 'Logo is still when scrolling stops; no idle animation loop');
  await motionPage.evaluate(() => window.scrollTo(0, 130));
  await compact(motionPage, true);
  await motionPage.waitForTimeout(850);
  const settled = await sample();
  check(settled.initial === signature.matrices[1] && samePath(settled.arcPath, signature.arcPath) && settled.letters.every(value => value === 0) && settled.active === 0, 'Normal motion settles into the same refined R plus arc as reduced-motion and favicon');
  await motionPage.screenshot({ path: path.join(output, 'motion-compact-endpoint.png') });
  if (process.env.RADOVAR_CAPTURE_BRAND_MOTION === '1') {
    await motionPage.evaluate(() => window.scrollTo(0, 0));
    await compact(motionPage, false);
    await motionPage.waitForTimeout(850);
    const box = await motionPage.locator('.header-brand').boundingBox();
    const clip = { x: Math.floor(box.x - 12), y: Math.floor(box.y - 12), width: 188, height: 68 };
    const frames = [], delays = [];
    async function frame(delay) {
      const png = await motionPage.screenshot({ clip });
      frames.push(await sharp(png).ensureAlpha().raw().toBuffer());
      delays.push(delay);
    }
    await frame(450);
    for (const position of [130, 0]) {
      await motionPage.evaluate(y => window.scrollTo(0, y), position);
      for (let index = 0; index < 20; index++) { await motionPage.waitForTimeout(40); await frame(60); }
      delays[delays.length - 1] = 450;
    }
    const width = clip.width * 2, pageHeight = clip.height * 2;
    await sharp(Buffer.concat(frames), { raw: { width, height: pageHeight * frames.length, channels: 4, pageHeight } }).gif({ delay: delays, loop: 0 }).toFile(path.join(output, 'radovar-signature-motion.gif'));
  }
  await motionContext.close();
  check(errors.length === 0, `No client runtime exceptions: ${errors.join('; ')}`);
  const result = { status: 'passed', checks: checks.length, assertions: checks, geometry, sourceHead: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), wordmarkSha256: sha(logo), originalRGlyphPathSha256: sha(iconPaths[1]), icoSizes: sizes, scope: 'Local actual browser and assets only; no deployment or live-provider qualification' };
  await writeFile(path.join(output, 'results.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result));
} catch (error) {
  const pages = await Promise.all(browser.contexts().flatMap(ctx => ctx.pages()).map(async page => ({ url: page.url(), position: await page.evaluate(() => ({ scrollY, viewport: innerHeight, header: document.querySelector('header.nav')?.getBoundingClientRect().toJSON(), company: document.getElementById('company')?.getBoundingClientRect().toJSON() })) })));
  await writeFile(path.join(output, 'failure.json'), JSON.stringify({ status: 'failed', passedChecks: checks, error: error.message, pages }, null, 2) + '\n');
  throw error;
} finally { await browser.close(); }
