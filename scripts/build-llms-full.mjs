// Runs after `next build`: writes out/llms-full.txt, the plain text of every
// indexed page, taken from the exported HTML so it never drifts from the site.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const output = path.resolve(process.argv[2] ?? fileURLToPath(new URL('../out/', import.meta.url)));
const site = 'https://radovar.com';
const routes = ['/', '/company/', '/codevalanche/', '/docs/', '/security/', '/privacy/', '/terms/', '/press/', '/changelog/'];
const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', mdash: '—', ndash: '–', hellip: '…' };

function decode(text) {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, name) => {
    if (name[0] === '#') return String.fromCodePoint(name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10));
    return named[name.toLowerCase()] ?? entity;
  });
}

function pageText(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) throw new Error('page has no <main>');
  return decode(main
    .replace(/<(script|style|svg|noscript|template)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]*\baria-hidden="true"[^>]*\/>/gi, '')
    .replace(/<h([1-3])\b[^>]*>/gi, (_, level) => `\n\n${'#'.repeat(Number(level) + 1)} `)
    .replace(/<\/(a|button)>(\s*<(?:a|button)\b)/gi, '</$1>\n$2')
    .replace(/<(li|dt)\b[^>]*>/gi, '\n- ')
    .replace(/<\/?(p|div|section|header|footer|article|dl|dd|ul|ol|figure|figcaption|table|tr|br|h[1-6])\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ''))
    .split('\n').map(line => line.replace(/[ \t]+/g, ' ').trim()).filter(Boolean)
    .join('\n').replace(/\n(#+ )/g, '\n\n$1');
}

const parts = [
  '# Radovar: full site text',
  '',
  '> The plain text of every page on radovar.com, for language models and other readers. The short index is https://radovar.com/llms.txt.',
];
for (const route of routes) {
  const html = await readFile(path.join(output, route.slice(1), 'index.html'), 'utf8');
  const title = decode(html.match(/<title\b[^>]*>([^<]*)<\/title>/i)[1]);
  parts.push('', '---', '', `## ${title}`, '', `URL: ${site}${route}`, '', pageText(html));
}
await writeFile(path.join(output, 'llms-full.txt'), `${parts.join('\n')}\n`);
console.log(`llms-full.txt: ${routes.length} pages`);
