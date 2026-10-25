import { createServer } from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECURITY_HEADERS } from '../cloudflare/security-headers.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const output = path.resolve(process.env.RADOVAR_AUDIT_OUT ?? path.join(root, 'out'));
export const prefix = process.env.BASE_PATH ?? '';
export async function documents(directory = output) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await documents(filename));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(filename);
  }
  return files.sort();
}
export function routeFor(filename) {
  const relative = path.relative(output, filename).split(path.sep).join('/');
  return prefix + '/' + relative.replace(/(^|\/)index\.html$/, '$1');
}
export const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
export async function serveExport() {
  const server = createServer(async (req, res) => {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) res.setHeader(name, value);
    try {
      const url = new URL(req.url, 'http://localhost');
      let local = decodeURIComponent(url.pathname);
      if (prefix && !local.startsWith(prefix + '/')) throw new Error('Outside prefix');
      local = local.slice(prefix.length);
      if (local.endsWith('/')) local += 'index.html';
      const filename = path.resolve(output, '.' + local);
      if (!filename.startsWith(output + path.sep)) throw new Error('Outside export');
      const data = await readFile(filename);
      res.setHeader('Content-Type', mime[path.extname(filename)] ?? 'application/octet-stream');
      // Match ordinary compressed static hosting for transfer-size audits.
      const { gzipSync } = await import('node:zlib');
      if (/gzip/.test(req.headers['accept-encoding'] ?? '')) {
        res.setHeader('Content-Encoding', 'gzip');
        res.end(gzipSync(data));
      } else res.end(data);
    } catch {
      res.statusCode = 404;
      res.setHeader('Content-Type', mime['.html']);
      res.end(await readFile(path.join(output, '404.html')));
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: async () => {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  } };
}
export async function offlineContext(browser, origin, options = {}) {
  const context = await browser.newContext(options);
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  return context;
}
