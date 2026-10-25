import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { createServer } from 'node:net';
import { documents, output, root, routeFor, serveExport } from './audit-support.mjs';

const destination = process.env.RADOVAR_AUDIT_REPORT;
// Reports are opt-in and stay outside the source tree.
if (destination) assert.ok(!path.resolve(destination).startsWith(path.resolve(root) + path.sep), 'Report destination must be outside the repository');
const reservation = createServer();
await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
const port = reservation.address().port;
await new Promise(resolve => reservation.close(resolve));
const server = await serveExport();
const browser = await chromium.launch({ args: [`--remote-debugging-port=${port}`], headless: true });
const results = [];
try {
  for (const filename of await documents()) for (const mode of ['mobile', 'desktop']) {
    const { lhr } = await lighthouse(server.origin + routeFor(filename), {
      port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      // No optional telemetry or third-party service is contacted by the audit.
      blockedUrlPatterns: ['*supabase.co*'],
    }, mode === 'desktop' ? desktopConfig : undefined);
    assert.ok(!lhr.runtimeError, `${filename}: ${lhr.runtimeError?.message}`);
    const result = { file: path.relative(output, filename), mode, finalUrl: new URL(lhr.finalDisplayedUrl).pathname,
      warnings: lhr.runWarnings, settings: lhr.configSettings,
      scores: Object.fromEntries(Object.entries(lhr.categories).map(([id, value]) => [id, Math.round(value.score * 100)])),
      metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index', 'total-byte-weight'].map(id => [id, lhr.audits[id]?.numericValue])),
      findings: Object.values(lhr.audits).filter(audit => audit.score !== null && audit.score < 1 || ['cls-culprits-insight', 'lcp-breakdown-insight', 'lcp-discovery-insight', 'font-display-insight'].includes(audit.id)).map(({ id, score, displayValue, details }) => ({ id, score, displayValue, details })),
    };
    results.push(result);
    if (destination) {
      await mkdir(path.dirname(path.resolve(destination)), { recursive: true });
      await writeFile(destination, JSON.stringify({ lighthouseVersion: lhr.lighthouseVersion, results }, null, 2));
    }
    console.log(`${result.file} ${mode}: ${JSON.stringify(result.scores)} CLS=${result.metrics['cumulative-layout-shift']}`);
  }
} finally { await browser.close(); await server.close(); }
