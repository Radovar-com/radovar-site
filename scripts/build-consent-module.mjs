// Extract only essential preference/receipt management from the reviewed SDK.
// Optional observation, event validation and queue code stay behind consent.
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
await build({
  stdin: { contents: 'export { createConsentManager, createConsentTransport } from "./public/analytics/owned-analytics.js";', resolveDir: root, sourcefile: 'consent-entry.js' },
  outfile: fileURLToPath(new URL('../public/analytics/consent-manager.js', import.meta.url)),
  bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: true,
});
