// Qualifies the actual production export on localhost. The attack response is
// an in-memory fixture; no output/source file or production policy is changed.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(process.env.RADOVAR_SECURITY_OUT ?? path.join(root, 'out'));
const shared = process.env.OWNED_ANALYTICS_SITE_ROOT ?? path.resolve(root, '../owned-analytics-site-20261015');
const { chromium } = createRequire(path.join(shared, 'package.json'))('playwright');
const prefix = process.env.BASE_PATH ?? '';
const routes = ['/', '/codevalanche/', '/company/', '/press/', '/docs/', '/security/', '/privacy/', '/terms/', '/changelog/', '/releases/'];
const pageIds = { '/': 'home', '/codevalanche/': 'codevalanche', '/company/': 'company', '/press/': 'press', '/docs/': 'docs', '/security/': 'security', '/privacy/': 'privacy', '/terms/': 'terms', '/changelog/': 'changelog_archive', '/releases/': 'releases_archive' };
const inline = /<script\b([^>]*?)>([\s\S]*?)<\/script\s*>/gi;
const cspMeta = /<meta http-equiv="Content-Security-Policy" content="([^"]+)" data-radovar-security="export">/g;
const problems = [];
const violations = [];
const documents = [];
const observedHashes = new Set();

async function exportedHtml(directory) {
  const filenames = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) filenames.push(...await exportedHtml(filename));
    else if (entry.isFile() && entry.name.endsWith('.html')) filenames.push(filename);
  }
  return filenames.sort();
}

for (const filename of await exportedHtml(output)) {
  const html = await readFile(filename, 'utf8');
  const policies = [...html.matchAll(cspMeta)];
  assert.equal(policies.length, 1, `${path.relative(output, filename)} has one enforced CSP`);
  const leadingCharset = html.match(/<head\b[^>]*>\s*(<meta\b[^>]*\bcharset\s*=\s*(?:"utf-8"|'utf-8'|utf-8)[^>]*>)<meta http-equiv="Content-Security-Policy"/i);
  assert.ok(leadingCharset, 'policy immediately follows the leading charset before every resource or script');
  const charsetEnd = html.indexOf(leadingCharset[1]) + leadingCharset[1].length;
  assert.ok(Buffer.byteLength(html.slice(0, charsetEnd), 'utf8') <= 1024, 'complete charset declaration stays within the first 1024 bytes');
  for (const match of html.matchAll(inline)) {
    if (/\bsrc\s*=/i.test(match[1])) continue;
    const normalized = match[2].replace(/\r\n?/g, '\n').replace(/\0/g, '\ufffd');
    const hash = `'sha256-${createHash('sha256').update(normalized).digest('base64')}'`;
    observedHashes.add(hash);
    assert.ok(policies[0][1].split(/[; ]+/).includes(hash), `${path.relative(output, filename)} inline script is covered`);
  }
  documents.push({ filename, policy: policies[0][1] });
}
assert.ok(documents.length >= routes.length, 'all public routes were exported');
assert.equal(new Set(documents.map(({ policy }) => policy)).size, 1, 'same policy across routes and 404 aliases');
const policy = documents[0].policy;
const directives = new Map(policy.split('; ').map((part) => { const [name, ...values] = part.split(' '); return [name, values]; }));
assert.deepEqual(new Set(directives.get('script-src')), new Set(["'self'", ...observedHashes]), 'no stale, unbounded, or missing inline-script permission');
assert.deepEqual(directives.get('connect-src'), ["'self'"]);
assert.ok(!policy.includes('unsafe-eval'));
assert.ok(!directives.get('script-src').includes("'unsafe-inline'"));
assert.equal(directives.has('frame-ancestors'), false, 'meta does not claim unsupported frame-ancestor enforcement');

// Omit the response charset so the actual export must declare its own encoding.
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.txt': 'text/plain', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://fixture');
    if (prefix && !url.pathname.startsWith(`${prefix}/`)) { res.writeHead(404); res.end(); return; }
    let local = decodeURIComponent(url.pathname.slice(prefix.length));
    if (local.endsWith('/')) local += 'index.html';
    const filename = path.resolve(output, `.${local}`);
    assert.ok(filename.startsWith(output + path.sep), 'fixture request remains inside the static export');
    let data;
    try { data = await readFile(filename); }
    catch { data = await readFile(path.join(output, '404.html')); local = '/404.html'; res.statusCode = 404; }
    if (url.searchParams.get('__security_injection') === '1' && local === '/index.html') {
      data = data.toString().replace('</head>', '<script>window.__radovarUnhashedScript=true;</script></head>');
    }
    res.setHeader('Content-Type', mime[path.extname(local)] ?? 'application/octet-stream');
    res.end(data);
  } catch (error) {
    problems.push(error.message);
    res.writeHead(500); res.end();
  }
});
let collectorHits = 0;
const collector = createServer((_req, res) => {
  collectorHits++;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end('unexpected collector request');
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
await new Promise((resolve) => collector.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const collectorOrigin = `http://127.0.0.1:${collector.address().port}`;
const browser = await chromium.launch({ headless: true });

async function context(options = {}) {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', colorScheme: 'light', ...options });
  // Both allowed origins are local fixtures. The collector is deliberately
  // reachable here, so only the real page CSP can stop the attack request.
  await ctx.route('**/*', (route) => [origin, collectorOrigin].includes(new URL(route.request().url()).origin) ? route.continue() : route.abort());
  await ctx.addInitScript(() => {
    window.__securityCspViolations = [];
    window.addEventListener('securitypolicyviolation', (event) => {
      window.__securityCspViolations.push({ directive: event.effectiveDirective, blocked: event.blockedURI });
    });
  });
  ctx.on('page', (page) => page.on('pageerror', (error) => problems.push(error.message)));
  return ctx;
}

async function ready(page, route = '/') {
  await page.goto(origin + prefix + route);
  assert.equal(await page.evaluate(() => document.characterSet), 'UTF-8', 'export charset works without a response encoding header');
  await page.waitForFunction(() => window.RadovarAnalytics?.consentManager);
  await page.waitForFunction((expected) => window.RadovarAnalytics.pageId === expected, pageIds[route.split('?')[0]] ?? 'not_found');
  assert.equal(await page.evaluate(() => window.RadovarAnalytics.status()), 'not_configured', 'actual export keeps analytics disabled');
}

async function takeViolations(page) {
  violations.push(...await page.evaluate(() => window.__securityCspViolations.splice(0)));
}

try {
  const ctx = await context();
  const page = await ctx.newPage();
  await ready(page);
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light', 'hashed pre-hydration theme script ran');
  await page.getByRole('tab', { name: 'Your review', exact: true }).click();
  assert.equal(await page.getByRole('tab', { name: 'Your review', exact: true }).getAttribute('aria-selected'), 'true');
  await page.getByRole('tab', { name: 'Your agents', exact: true }).click();
  assert.equal(await page.getByRole('tab', { name: 'Your agents', exact: true }).getAttribute('aria-selected'), 'true');
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await page.getByRole('button', { name: 'Manage cookies', exact: true }).click();
  await page.getByRole('dialog', { name: 'Cookie preferences', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Accept analytics', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[role="dialog"]') === null);
  assert.equal(await page.evaluate(() => window.RadovarAnalytics.consentManager.getCollectionContext({ touchActivity: false })), null, 'consent cannot enable the disabled production collector');
  await page.getByRole('button', { name: 'Switch to dark theme', exact: true }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.evaluate(() => { window.__securityOriginalDocument = true; });
  for (const route of routes.slice(1)) {
    await page.locator(`footer a[href="${prefix}${route}"]`).first().click();
    await page.waitForURL(origin + prefix + route);
    await page.waitForFunction((expected) => window.RadovarAnalytics.pageId === expected, pageIds[route]);
    await page.getByRole('heading', { level: 1 }).waitFor();
    assert.equal(await page.evaluate(() => window.__securityOriginalDocument), true, `real Next client navigation to ${route}`);
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await takeViolations(page);
  }
  await page.goBack();
  await page.waitForURL(origin + prefix + routes.at(-2));
  await page.waitForFunction((expected) => window.RadovarAnalytics.pageId === expected, pageIds[routes.at(-2)]);
  assert.equal(await page.evaluate(() => window.__securityOriginalDocument), true, 'Back retains the client document');
  await takeViolations(page);
  for (const route of [...routes, '/missing-security-fixture/']) {
    await ready(page, route);
    await page.getByRole('heading', { level: 1 }).waitFor();
    await takeViolations(page);
  }
  assert.deepEqual(violations, [], 'normal direct/client routes, theme, tabs and consent have no CSP violations');
  await ctx.close();

  const mobile = await context({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const m = await mobile.newPage();
  await ready(m);
  assert.equal(await m.locator('html').getAttribute('data-theme'), 'dark');
  await m.getByRole('button', { name: 'Decline', exact: true }).click();
  await m.locator('.nav__menu summary').click();
  await m.locator('.nav__panel a').filter({ hasText: 'Company' }).click();
  await m.waitForURL(origin + prefix + '/company/');
  assert.equal(await m.locator('.nav__menu').getAttribute('open'), null);
  await m.getByRole('button', { name: 'Switch to light theme', exact: true }).click();
  assert.equal(await m.locator('html').getAttribute('data-theme'), 'light');
  await takeViolations(m);
  assert.deepEqual(violations, [], 'mobile navigation and theme have no CSP violations');
  await mobile.close();

  const attack = await context();
  const a = await attack.newPage();
  await ready(a, '/?__security_injection=1');
  await a.waitForFunction(() => window.__securityCspViolations.some(({ directive, blocked }) => directive === 'script-src-elem' && blocked === 'inline'));
  assert.equal(await a.evaluate(() => window.__radovarUnhashedScript), undefined, 'unhashed inline injection did not execute');
  const blocked = await a.evaluate(async (collectorUrl) => {
    try { await fetch(collectorUrl, { method: 'POST', body: 'local CSP qualification' }); return false; }
    catch { return true; }
  }, collectorOrigin + '/collector');
  assert.equal(blocked, true);
  await a.waitForFunction(() => window.__securityCspViolations.some(({ directive }) => directive === 'connect-src'));
  assert.equal(collectorHits, 0, 'external-origin collector was blocked before network I/O');
  await attack.close();
  assert.deepEqual(problems, [], 'no client or fixture exceptions');
  console.log(`PASS production CSP: ${documents.length} HTML files/${observedHashes.size} exact shared hashes; ${routes.length} direct and client routes + 404; desktop/mobile theme, tabs and consent; zero normal violations; inline injection and external-origin collector blocked.`);
} finally {
  await browser.close();
  server.closeAllConnections();
  collector.closeAllConnections();
  await Promise.all([new Promise((resolve) => server.close(resolve)), new Promise((resolve) => collector.close(resolve))]);
}
