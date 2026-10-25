import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { documents, routeFor, serveExport, offlineContext } from './audit-support.mjs';

const server = await serveExport();
const browser = await chromium.launch();
const results = [], failures = [];
try {
  for (const file of await documents()) for (const theme of ['light', 'dark']) for (const width of [390, 1440]) {
    const context = await offlineContext(browser, server.origin, { colorScheme: theme, viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    try {
      await page.goto(server.origin + routeFor(file));
      await page.getByRole('button', { name: 'Decline', exact: true }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
      results.push({ route: routeFor(file), theme, width, url: new URL(page.url()).pathname, violations: audit.violations, incomplete: audit.incomplete.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) })) });
      if (audit.violations.length) failures.push(`${routeFor(file)} ${theme}/${width}: ${audit.violations.map(v => v.id).join(', ')}`);
      // Exercise actual focus, not click-only semantics.
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.activeElement?.tagName === 'MAIN', null, { timeout: 3000 });
      const manage = page.getByRole('button', { name: 'Manage cookies', exact: true });
      await manage.focus(); await page.keyboard.press('Enter');
      await page.getByRole('dialog').waitFor();
      const dialogAudit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
      results.push({ route: routeFor(file), theme, width, state: 'preferences', violations: dialogAudit.violations });
      if (dialogAudit.violations.length) failures.push(`${routeFor(file)} ${theme}/${width} preferences: ${dialogAudit.violations.map(v => v.id).join(', ')}`);
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.locator(':focus').textContent(), 'Save preferences');
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').textContent(), 'Close preferences');
      await page.keyboard.press('Escape');
      assert.equal(await manage.evaluate(element => element === document.activeElement), true);
      if (width === 390) {
        const menu = page.locator('.nav__menu summary');
        await menu.focus(); await page.keyboard.press('Enter');
        assert.ok(await page.locator('.nav__menu').getAttribute('open') !== null);
        await page.keyboard.press('Tab');
        assert.ok(await page.locator(':focus').evaluate(element => !!element.closest('.nav__panel')));
        await page.keyboard.press('Escape');
        assert.equal(await menu.evaluate(element => element === document.activeElement), true);
      }
      const tabs = page.getByRole('tab');
      if (await tabs.count()) {
        await tabs.first().focus(); await page.keyboard.press('ArrowRight');
        assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
        await page.keyboard.press('End');
        assert.equal(await tabs.last().getAttribute('aria-selected'), 'true');
      }
      console.log(`${routeFor(file)} ${theme}/${width}: ${audit.violations.length} axe violations; keyboard OK`);
    } catch (error) { failures.push(`${routeFor(file)} ${theme}/${width}: ${error.message}`); }
    finally { await context.close(); }
  }
} finally {
  if (process.env.RADOVAR_AUDIT_REPORT) await writeFile(process.env.RADOVAR_AUDIT_REPORT, JSON.stringify(results, null, 2));
  await browser.close(); await server.close();
}
assert.deepEqual(failures, []);
