// Local visual/navigation qualification of the company site. No provider access.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
import { chromium } from 'playwright';
const origin = process.env.RADOVAR_CONTENT_TEST_ORIGIN ?? 'http://127.0.0.1:4188';
assert.ok(/^http:\/\/127\.0\.0\.1:\d+$/.test(origin));
const output = path.join(root, '.superpowers/sdd/2026-10-15-owned-web-account-analytics/radovar-content-redesign');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const checks = [], errors = [];
function check(value, label) { assert.ok(value, label); checks.push(label); }
async function ready(page, route) {
  await page.goto(origin + route);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.RadovarAnalytics?.consentManager);
  const decline = page.getByRole('button', { name: 'Decline', exact: true });
  if (await decline.isVisible()) await decline.click();
}
try {
  for (const width of [320, 940, 1440]) for (const colorScheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme, reducedMotion: 'reduce' });
    await ctx.route('https://**/*', route => route.abort());
    const page = await ctx.newPage();
    page.on('pageerror', error => errors.push(error.message));
    if (!process.argv.includes('--supporting-only')) {
    await ready(page, '/');
    check(await page.locator('.intro-kicker').count() === 0 && !(await page.locator('.introduction').innerText()).includes('Software by Radovar'), `${width}/${colorScheme}: rejected hero label removed`);
    const intro = page.locator('.introduction');
    check(await intro.locator('.app-shot, img[src*="media/"]').count() === 0 && await intro.locator('a[href*="codevalanche"]:not([href="#codevalanche"])').count() === 0 && await intro.locator('.intro-story li').count() === 3 && (await intro.locator('h1').innerText()).includes('Radovar'), `${width}/${colorScheme}: hero tells the Radovar story, with no product invitation or screenshot`);
    await page.locator('#codevalanche .feature .app-shot').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('#codevalanche .feature .app-shot__img')].some(image => image.offsetParent && image.complete && image.naturalWidth > 0));
    const productShot = await page.locator('#codevalanche .feature .app-shot__img').evaluateAll(images => images.filter(image => image.offsetParent).map(image => ({ src: image.currentSrc, alt: image.alt })));
    check(productShot.length === 1 && productShot[0].alt.includes('Codevalanche') && (colorScheme === 'dark' ? productShot[0].src.includes('approval-detail-dark') : productShot[0].src.includes('approval-detail') && !productShot[0].src.includes('-dark')) && (await page.locator('#codevalanche .feature figcaption').innerText()).length > 0, `${width}/${colorScheme}: product section shows a real Codevalanche screenshot in the current theme`);
    check(await page.locator('#codevalanche .feature').count() === 1 && await page.locator('#company .statement').count() === 1 && await page.locator('[data-analytics-section="resources"] .cards--four .card').count() === 4, `${width}/${colorScheme}: product feature, mission and latest links available`);
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}/${colorScheme}: homepage fits viewport`);
    await page.screenshot({ path: path.join(output, `hero-${width}-${colorScheme}.png`) });
    if (width === 1440 && colorScheme === 'light') await page.screenshot({ path: path.join(output, 'home-full.png'), fullPage: true });
    }

    if (!process.argv.includes('--hero-only')) for (const route of ['/company/', '/codevalanche/', '/press/']) {
      await ready(page, route);
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}/${colorScheme}: ${route} fits viewport`);
      check(await page.locator('main h1').count() === 1 && await page.locator('main img[src*="media/"]:not([src*="media/codevalanche/"])').count() === 0, `${width}/${colorScheme}: ${route} has one heading and no recycled landscape imagery`);
      check(await page.locator('[data-analytics-section]').evaluateAll(elements => elements.every(element => ['intro', 'codevalanche', 'company', 'resources', 'footer'].includes(element.dataset.analyticsSection))), `${width}/${colorScheme}: ${route} uses only registered section IDs`);
      if (route === '/codevalanche/') {
        await page.waitForFunction(() => [...document.querySelectorAll('.page-hero ~ .shell .app-shot__img')].some(image => image.offsetParent && image.complete && image.naturalWidth > 0));
        const shown = await page.locator('main .app-shot--stage .app-shot__img').evaluateAll(images => images.filter(image => image.offsetParent).map(image => ({ src: image.currentSrc, alt: image.alt })));
        check(shown.length === 1 && shown[0].alt.includes('Codevalanche') && shown[0].src.includes(colorScheme === 'dark' ? '-dark' : '-light') && shown[0].src.includes('detail') === (width <= 760), `${width}/${colorScheme}: product screenshot follows the theme and uses the close-up on phones`);
        check((await page.locator('main .app-shot--stage figcaption').innerText()).includes('sample project'), `${width}/${colorScheme}: product screenshot caption says it uses a sample project`);
      }
      if (width === 1440) await page.screenshot({ path: path.join(output, `page${route.replaceAll('/', '-')}${colorScheme}.png`), fullPage: true });
    }
    if (!process.argv.includes('--hero-only')) for (const route of ['/docs/', '/security/', '/changelog/', '/privacy/', '/terms/']) {
      await ready(page, route);
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}/${colorScheme}: ${route} fits viewport`);
      check(await page.locator('.docHead img').count() === 0, `${width}/${colorScheme}: ${route} has no recycled landscape thumbnail`);
      const links = await page.getByRole('navigation', { name: 'On this page', exact: true }).locator('a').evaluateAll(elements => elements.map(element => element.getAttribute('href').slice(1)));
      check(links.length > 0 && new Set(links).size === links.length && await page.evaluate(ids => ids.every(id => document.getElementById(id)?.tagName === 'H2'), links), `${width}/${colorScheme}: ${route} chapter links resolve uniquely`);
      if (route === '/docs/') {
        await page.screenshot({ path: path.join(output, `guide-${width}-${colorScheme}.png`) });
        await page.getByRole('navigation', { name: 'On this page', exact: true }).locator('a').last().click();
        await page.waitForFunction(() => location.hash.startsWith('#article-'));
        check(await page.evaluate(() => {
          const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
          const rect = target.getBoundingClientRect(), header = document.querySelector('header.nav').getBoundingClientRect();
          return target === document.activeElement && rect.top >= header.bottom && rect.top <= header.bottom + 50;
        }), `${width}/${colorScheme}: native chapter link focuses a visible heading below the sticky header`);
      }
    }
    await ctx.close();
  }
  if (!process.argv.includes('--supporting-only')) for (const width of [360, 768, 1101, 1280, 1440, 1600, 2048, 2560]) {
    const ctx = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
    await ctx.route('https://**/*', route => route.abort());
    const page = await ctx.newPage();
    await ready(page, '/');
    const fit = await page.evaluate(() => {
      const intro = document.querySelector('.introduction'), h1 = intro.querySelector('h1'), box = h1.getBoundingClientRect();
      const lines = [...h1.children].map(part => { const range = document.createRange(); range.selectNodeContents(part); return range.getBoundingClientRect(); });
      const below = [...intro.querySelectorAll('.intro-lead, .intro-actions a, .intro-story')].map(element => element.getBoundingClientRect());
      return lines.every(line => line.left >= box.left - 1 && line.right <= box.right + 1) && below.every(rect => rect.top >= box.bottom - 1)
        && [...intro.querySelectorAll('.intro-story li')].every(item => item.scrollWidth <= item.clientWidth + 1);
    });
    check(fit, `${width}: hero heading stays inside its box and never covers the text, buttons or story`);
    await ctx.close();
  }
  if (!process.argv.includes('--hero-only')) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' });
    await ctx.route('https://**/*', route => route.abort());
    const page = await ctx.newPage();
    const allowed = new Set(['info@radovar.com', 'press@radovar.com', 'security@radovar.com']);
    for (const route of ['/', '/company/', '/codevalanche/', '/press/', '/docs/', '/security/', '/changelog/', '/privacy/', '/terms/']) {
      await ready(page, route);
      const addresses = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="mailto:"]')].map(link => link.getAttribute('href').slice(7).split('?')[0].toLowerCase()).concat((document.body.innerText.match(/[\w.+-]+@radovar\.com/gi) ?? []).map(text => text.toLowerCase())))]);
      check(addresses.every(address => allowed.has(address)), `${route}: only the public info, press and security mailboxes are referenced (${addresses.join(', ')})`);
    }
    check(await page.evaluate(() => !document.documentElement.classList.contains('motion') && [...document.querySelectorAll('.flight')].every(flight => getComputedStyle(flight).display === 'none') && document.getAnimations().length === 0), 'Reduced motion: no scroll motion, no birds and no running animations');
    await ctx.close();
    const moving = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
    await moving.route('https://**/*', route => route.abort());
    const motionPage = await moving.newPage();
    motionPage.on('pageerror', error => errors.push(error.message));
    await ready(motionPage, '/');
    await motionPage.waitForFunction(() => document.documentElement.classList.contains('motion'));
    await motionPage.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 300) { scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 60)); } });
    await motionPage.waitForTimeout(2500);
    check(await motionPage.evaluate(() => document.querySelectorAll('[data-motion="reveal"]:not([data-inview])').length === 0 && [...document.querySelectorAll('[data-motion="reveal"]')].every(element => getComputedStyle(element).opacity === '1')), 'Every section that rises into view ends fully visible after scrolling');
    check(await motionPage.evaluate(() => document.querySelectorAll('[data-motion="flight"][data-inview]').length === 3 && !document.getAnimations().some(animation => animation.playState === 'running' && animation.animationName === 'motion-terrain')), 'Birds cross each section once and the contour drift pauses off screen');
    await moving.close();
  }
  check(errors.length === 0, `No client exceptions: ${errors.join('; ')}`);
  const mode = process.argv.includes('--supporting-only') ? 'supporting' : process.argv.includes('--hero-only') ? 'hero' : 'all';
  const result = { status: 'passed', mode, checks: checks.length, assertions: checks, scope: 'Local UI at 320/940/1440px in light and dark themes; no live analytics or provider qualification' };
  await writeFile(path.join(output, `results-${mode}.json`), JSON.stringify(result, null, 2));
  console.log(`PASS content redesign (${mode}): ${checks.length} checks; mobile/desktop and both themes`);
} finally { await browser.close(); }
