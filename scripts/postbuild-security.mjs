// Runs only after `next build`: development HTML remains free of this policy.
// Hashes cover the browser's inline-script text (HTML normalizes CRLF to LF).
// A shared union keeps the first document's policy valid on Next client routes.
// Charset remains first, within the HTML encoding prescan's first 1024 bytes;
// CSP immediately follows it, before any resource, style, or script element.
// This meta policy cannot supply frame-ancestors, X-Frame-Options, or
// X-Content-Type-Options; those require real response headers at the host.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyticsConfig, analyticsCollectorOrigin } from '../app/analytics/config.ts';

const output = path.resolve(process.argv[2] ?? fileURLToPath(new URL('../out/', import.meta.url)));
const tagAttributes = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
const metaTag = /<meta\b((?:[^"'<>]|"[^"]*"|'[^']*')*)>/gi;
const scriptTag = /<script\b((?:[^"'<>]|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi;

function attributes(source) {
  const values = new Map();
  for (const match of source.matchAll(tagAttributes)) {
    const name = match[1].toLowerCase();
    if (values.has(name)) throw new Error(`Duplicate HTML attribute: ${name}`);
    values.set(name, match[2] ?? match[3] ?? match[4] ?? '');
  }
  return values;
}

function decodeAttribute(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', colon: ':', sol: '/', bsol: '\\', Tab: '\t', NewLine: '\n' };
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z][\da-z]*);?/gi, (entity, name) => {
    if (name.startsWith('#')) {
      const number = name[1].toLowerCase() === 'x' ? Number.parseInt(name.slice(2), 16) : Number.parseInt(name.slice(1), 10);
      if (number > 0 && number <= 0x10ffff) return String.fromCodePoint(number);
    } else if (Object.hasOwn(named, name)) return named[name];
    throw new Error(`Unrecognized entity in script source: ${entity}`);
  });
}

function validateScriptSource(source, filename) {
  const decoded = decodeAttribute(source).trim();
  const localOrigin = 'https://static-export.invalid';
  // A literal URL is unnecessary in this export. Resolve browser-normalized
  // URLs as well, so //host, backslashes, and entities cannot disguise an origin.
  if (!decoded || /[\u0000-\u001f\u007f\\]/.test(decoded) || /^[a-z][a-z\d+.-]*:/i.test(decoded) || new URL(decoded, `${localOrigin}/page/`).origin !== localOrigin) {
    throw new Error(`Unexpected script source in ${filename}: ${JSON.stringify(source)}. Review the origin explicitly; the CSP is not widened automatically.`);
  }
}

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink in static export: ${filename}`);
    if (entry.isDirectory()) files.push(...await htmlFiles(filename));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(filename);
  }
  return files.sort();
}

try {
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
    throw new Error('CSP postbuild is for production static exports only.');
  }
  const filenames = await htmlFiles(output);
  if (!filenames.length) throw new Error(`No exported HTML found in ${output}`);
  const documents = [];
  const hashes = new Set();
  for (const filename of filenames) {
    const relative = path.relative(output, filename);
    let html = await readFile(filename, 'utf8');
    let existingCount = 0;
    html = html.replace(metaTag, (tag, source) => {
      const attrs = attributes(source);
      if (attrs.get('http-equiv')?.toLowerCase() !== 'content-security-policy') return tag;
      if (++existingCount > 1 || attrs.get('data-radovar-security') !== 'export') {
        throw new Error(`Existing unmanaged or duplicate CSP in ${relative}; review it before rebuilding.`);
      }
      return '';
    });
    if ((html.match(/<head\b[^>]*>/gi) ?? []).length !== 1 || !/<\/head\s*>/i.test(html)) {
      throw new Error(`Expected one complete document head in ${relative}`);
    }
    const leadingCharset = /<head\b[^>]*>\s*<meta\b((?:[^"'<>]|"[^"]*"|'[^']*')*)>/i.exec(html);
    if (!leadingCharset || attributes(leadingCharset[1]).get('charset')?.trim().toLowerCase() !== 'utf-8') {
      throw new Error(`Expected a leading UTF-8 charset meta in ${relative}; CSP must follow encoding metadata and precede resources.`);
    }
    const policyPosition = leadingCharset.index + leadingCharset[0].length;
    if (Buffer.byteLength(html.slice(0, policyPosition), 'utf8') > 1024) {
      throw new Error(`Charset metadata exceeds the first 1024 bytes in ${relative}`);
    }
    let scriptCount = 0;
    for (const match of html.matchAll(scriptTag)) {
      scriptCount++;
      const attrs = attributes(match[1]);
      if (attrs.has('src')) validateScriptSource(attrs.get('src'), relative);
      else {
        const text = match[2].replace(/\r\n?/g, '\n').replace(/\0/g, '\ufffd');
        hashes.add(`'sha256-${createHash('sha256').update(text).digest('base64')}'`);
      }
    }
    // The exporter emits ordinary script elements, not malformed HTML. Fail
    // rather than silently skip a script if that output assumption changes.
    if (scriptCount !== (html.match(/<script\b/gi) ?? []).length) {
      throw new Error(`Unrecognized script markup in ${relative}`);
    }
    documents.push({ filename, html, policyPosition });
  }

  const policy = [
    "default-src 'self'",
    `script-src 'self'${hashes.size ? ` ${[...hashes].sort().join(' ')}` : ''}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    // Match the reviewed activation config; do not permit arbitrary HTTPS hosts.
    `connect-src 'self'${analyticsConfig.enabled ? ` ${analyticsCollectorOrigin}` : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'none'",
    "manifest-src 'self'",
    "media-src 'self'",
    "worker-src 'self'",
  ].join('; ');
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}" data-radovar-security="export">`;
  // Validate every file before writing any policy; an unexpected origin fails
  // the build instead of leaving a partially hardened publishable export.
  for (const { filename, html, policyPosition } of documents) {
    await writeFile(filename, html.slice(0, policyPosition) + meta + html.slice(policyPosition));
  }
  console.log(`CSP: hardened ${documents.length} static HTML files with ${hashes.size} shared inline SHA-256 hashes; connect-src permits self${analyticsConfig.enabled ? ' and the reviewed collector only' : ' only'}.`);
} catch (error) {
  console.error(`CSP postbuild failed: ${error.message}`);
  process.exitCode = 1;
}
