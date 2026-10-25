import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { documents, routeFor, serveExport, prefix } from './audit-support.mjs';

const supplied = process.argv.find(arg => /^https?:\/\//.test(arg));
const external = process.argv.includes('--external');
const server = supplied ? null : await serveExport();
const origin = supplied ? new URL(supplied).origin : server.origin;
const queue = supplied ? [supplied] : (await documents()).map(file => origin + routeFor(file));
const visited = new Map(), fragments = [], failures = [];
function enqueue(value, parent) {
  let url;
  try { url = new URL(value, parent); } catch { failures.push(`Invalid URL from ${parent}`); return; }
  if (!['http:', 'https:'].includes(url.protocol)) return;
  if (!supplied && url.origin === 'https://radovar.com') url = new URL(prefix + url.pathname + url.search + url.hash, origin);
  if (url.origin !== origin && !external) return;
  if (url.hash && url.origin === origin) fragments.push({ url: url.href, parent });
  url.hash = '';
  if (!visited.has(url.href)) queue.push(url.href);
}
try {
  while (queue.length) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.set(url, null);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) { failures.push(`HTTP ${response.status}: ${url}`); continue; }
      if (new URL(response.url).origin !== origin) continue;
      const type = response.headers.get('content-type') ?? '';
      if (type.includes('text/css')) {
        for (const match of (await response.text()).matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) enqueue(match[1], response.url);
        continue;
      }
      if (!/text\/html|(?:application|text)\/xml/.test(type)) continue;
      const { document } = parseHTML(await response.text());
      for (const node of document.querySelectorAll('loc')) enqueue(node.textContent, response.url);
      for (const node of document.querySelectorAll('[style], style')) {
        const css = node.getAttribute('style') ?? node.textContent;
        for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) enqueue(match[1], response.url);
      }
      visited.set(url, document);
      for (const node of document.querySelectorAll('a[href], area[href], link[href], script[src], img[src], source[src], video[src], audio[src], iframe[src], video[poster]')) {
        enqueue(node.getAttribute('href') ?? node.getAttribute('src') ?? node.getAttribute('poster'), response.url);
      }
      // React's static export spells this srcSet; HTML attribute lookup in
      // lightweight parsers can preserve that spelling unlike the browser DOM.
      for (const node of document.querySelectorAll('img, source')) {
        const srcset = [...node.attributes].find(attribute => attribute.name.toLowerCase() === 'srcset')?.value;
        if (srcset) for (const candidate of srcset.split(',')) enqueue(candidate.trim().split(/\s+/)[0], response.url);
      }
    } catch (error) { failures.push(`${url}: ${error.message}`); }
  }
  for (const { url, parent } of fragments) {
    const target = new URL(url), id = decodeURIComponent(target.hash.slice(1)); target.hash = '';
    const document = visited.get(target.href);
    if (document && id && !document.getElementById(id) && ![...document.querySelectorAll('a[name]')].some(node => node.getAttribute('name') === id)) failures.push(`Missing fragment #${id}: ${url} from ${parent}`);
  }
} finally { await server?.close(); }
for (const failure of failures) console.error(failure);
console.log(`Checked ${visited.size} URLs, ${fragments.length} fragments (${external ? 'including external links' : 'same origin'}).`);
if (failures.length) process.exitCode = 1;
assert.ok(visited.size > 0, 'At least one URL must be checked');
