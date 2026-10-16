// Offline checks for the finished production static export. Run after npm run build.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(process.env.RADOVAR_SEO_TEST_OUT_DIR ?? path.join(root, 'out'));
const site = 'https://radovar.com';
const image = `${site}/radovar-social-20261016.png`;
const pages = [
  { route: '/', title: 'Radovar', description: 'Radovar builds software that keeps people in charge of AI agents. Discover Codevalanche, our desktop workspace for AI-assisted development.' },
  { route: '/company/', title: 'About Radovar | Radovar', description: 'Radovar is the software company behind Codevalanche. Our mission is to make work with AI agents something people can understand, check and trust.' },
  { route: '/codevalanche/', title: 'Codevalanche | Radovar', description: 'Codevalanche is a desktop app for coding with AI agents: your local projects, cloud agents or local models, and a review of every change in one window.' },
  { route: '/docs/', title: 'Getting started with Codevalanche | Radovar', description: 'How to open a local project, connect a supported coding runtime, give an agent a task, and review the changes in Codevalanche.' },
  { route: '/security/', title: 'Security | Radovar', description: 'The boundaries between your local Codevalanche workspace, connected AI runtimes, and model providers.' },
  { route: '/privacy/', title: 'Privacy | Radovar', description: 'How Radovar handles website preferences, email, and the boundaries between Codevalanche’s local workspace and connected providers.' },
  { route: '/terms/', title: 'Terms | Radovar', description: 'The terms that apply to this website and to Codevalanche while it is in early access.' },
  { route: '/press/', title: 'Newsroom | Radovar', description: 'News, company facts, logos and press contact for Radovar and Codevalanche.' },
  { route: '/releases/', title: 'Releases | Radovar', description: 'Selected early-access Codevalanche releases from June and July 2026, with a link to current product and download information.' },
  { route: '/changelog/', title: 'Changelog | Radovar', description: 'An archive of Codevalanche’s early-access release dates, build counts, and version ranges from June and July 2026.' },
];

function decode(value) {
  const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (entity, code) => {
    if (code[0] !== '#') return entities[code.toLowerCase()];
    return String.fromCodePoint(code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10));
  });
}

function attributes(tag) {
  const values = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    values[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4]);
  }
  return values;
}

function headTags(html) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, 'export contains a document head');
  return [...head.matchAll(/<(meta|link)\b[^>]*>/gi)].map(match => ({ tag: match[1].toLowerCase(), ...attributes(match[0]) }));
}

function one(tags, key, value, attribute = 'content') {
  const matches = tags.filter(tag => tag[key] === value);
  assert.equal(matches.length, 1, `exactly one ${key}="${value}"`);
  assert.ok(matches[0][attribute], `${value} has ${attribute}`);
  return matches[0][attribute];
}

const titles = new Set();
const descriptions = new Set();
for (const page of pages) {
  const file = path.join(output, page.route.slice(1), 'index.html');
  const html = await readFile(file, 'utf8');
  const tags = headTags(html);
  const titleMatches = [...html.matchAll(/<title\b[^>]*>([^<]*)<\/title>/gi)];
  assert.equal(titleMatches.length, 1, `${page.route}: exactly one title`);
  const title = decode(titleMatches[0][1]);
  const description = one(tags, 'name', 'description');
  const canonical = `${site}${page.route}`;
  assert.equal(title, page.title, `${page.route}: document title`);
  assert.equal(description, page.description, `${page.route}: description`);
  assert.equal(one(tags, 'rel', 'canonical', 'href'), canonical, `${page.route}: self canonical`);
  assert.ok(!titles.has(title), `${page.route}: unique title`);
  assert.ok(!descriptions.has(description), `${page.route}: unique description`);
  titles.add(title);
  descriptions.add(description);
  for (const [property, value] of Object.entries({
    'og:type': 'website', 'og:site_name': 'Radovar', 'og:locale': 'en_US',
    'og:title': page.title, 'og:description': page.description, 'og:url': canonical,
    'og:image': image, 'og:image:width': '1200', 'og:image:height': '630',
    'og:image:type': 'image/png', 'og:image:alt': 'Radovar',
  })) assert.equal(one(tags, 'property', property), value, `${page.route}: ${property}`);
  for (const [name, value] of Object.entries({
    'twitter:card': 'summary_large_image', 'twitter:title': page.title,
    'twitter:description': page.description, 'twitter:image': image, 'twitter:image:alt': 'Radovar',
  })) assert.equal(one(tags, 'name', name), value, `${page.route}: ${name}`);
  const robots = one(tags, 'name', 'robots').toLowerCase().split(/[,\s]+/);
  assert.ok(robots.includes('index') && robots.includes('follow'), `${page.route}: index and follow`);
  assert.ok(tags.filter(tag => ['robots', 'googlebot'].includes(tag.name)).every(tag => !/\b(noindex|nofollow|none)\b/i.test(tag.content)), `${page.route}: no conflicting crawler exclusions`);
  assert.equal(attributes(html.match(/<html\b[^>]*>/i)?.[0] ?? '').lang, 'en', `${page.route}: English document`);
  assert.match(one(tags, 'name', 'viewport'), /width=device-width/, `${page.route}: mobile viewport`);
  assert.equal([...html.matchAll(/<h1(?:\s|>)/gi)].length, 1, `${page.route}: one H1`);
}

const sitemap = await readFile(path.join(output, 'sitemap.xml'), 'utf8');
assert.match(sitemap, /<urlset\b[^>]*xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
const expected = pages.map(page => `${site}${page.route}`).sort();
assert.deepEqual(locations.slice().sort(), expected, 'sitemap lists each of the ten canonical pages exactly once, with no 404');
const robotsFile = await readFile(path.join(output, 'robots.txt'), 'utf8');
assert.match(robotsFile, /^User-agent:\s*\*\s*$/mi, 'robots applies to all crawlers');
assert.match(robotsFile, /^Allow:\s*\/\s*$/mi, 'robots allows the site');
assert.match(robotsFile, /^Sitemap:\s*https:\/\/radovar\.com\/sitemap\.xml\s*$/mi, 'robots points to the canonical sitemap');
assert.ok(!robotsFile.split(/\r?\n/).some(line => /^Disallow:\s*\S/i.test(line)), 'robots has no crawl exclusions');
const notFound = await readFile(path.join(output, '404.html'), 'utf8');
assert.ok(headTags(notFound).some(tag => tag.name === 'robots' && /\bnoindex\b/i.test(tag.content)), 'exported 404 is excluded from indexing');
const social = await readFile(path.join(output, 'radovar-social-20261016.png'));
assert.equal(social.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'share asset is a real PNG');
assert.equal(social.subarray(12, 16).toString('ascii'), 'IHDR', 'share asset contains a PNG header');
assert.equal(social.readUInt32BE(16), 1200, 'share asset is 1200px wide');
assert.equal(social.readUInt32BE(20), 630, 'share asset is 630px high');
console.log('PASS SEO export: 10 unique page titles/descriptions, self canonicals, route Open Graph/Twitter tags, Radovar PNG, sitemap, robots, and noindex 404.');
