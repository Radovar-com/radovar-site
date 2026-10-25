// Same-crop mobile candidates for AppShot. Originals remain the desktop/high-DPR fallback.
// Optional audit report: node scripts/build-responsive-shots.mjs --report=.superpowers/path/report.json
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'public/media/codevalanche');
const prefix = '/media/codevalanche/';
const originals = [
  'approval.webp',
  'task-review-light.webp',
  'task-review-dark.webp',
  'task-brief.webp',
  'ai-providers.webp',
  'changes.webp',
  'approval-detail.webp',
  'approval-detail-dark.webp',
  'task-brief-detail.webp',
  'ai-providers-detail.webp',
  'changes-detail.webp',
  'task-review-detail-light.webp',
  'task-review-detail-dark.webp',
];
const widths = [640, 960, 1280];
const webp = { quality: 85, effort: 6, smartSubsample: true };
const manifest = {};
const audit = { widths, webp, sources: [] };
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

async function writeIfChanged(file, bytes) {
  try {
    if ((await readFile(file)).equals(Buffer.from(bytes))) return;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await writeFile(file, bytes);
}

for (const filename of originals) {
  const original = await readFile(path.join(directory, filename));
  const { width, height, format } = await sharp(original).metadata();
  if (format !== 'webp' || !width || !height || width <= 960) {
    throw new Error(`Expected an original WebP crop wider than 960px: ${filename}`);
  }
  const src = prefix + filename;
  const candidates = [];
  const source = { src, width, height, bytes: original.length, sha256: digest(original), variants: [] };

  for (const candidateWidth of widths.filter(candidate => candidate < width)) {
    const candidateName = filename.replace(/\.webp$/, `-${candidateWidth}.webp`);
    // Omitting height preserves the complete crop and its natural aspect ratio.
    const { data, info } = await sharp(original)
      .resize({ width: candidateWidth, withoutEnlargement: true })
      .webp(webp)
      .toBuffer({ resolveWithObject: true });
    await writeIfChanged(path.join(directory, candidateName), data);
    const candidate = { src: prefix + candidateName, width: info.width };
    candidates.push(candidate);
    source.variants.push({
      ...candidate,
      height: info.height,
      bytes: data.length,
      sha256: digest(data),
      bytesSaved: original.length - data.length,
      percentSaved: Number(((1 - data.length / original.length) * 100).toFixed(1)),
    });
  }

  candidates.push({ src, width });
  manifest[src] = { width, height, candidates };
  audit.sources.push(source);
}

await writeIfChanged(path.join(directory, 'responsive-shots.json'), JSON.stringify(manifest, null, 2) + '\n');
const report = process.argv.find(argument => argument.startsWith('--report='))?.slice('--report='.length);
if (report) {
  const reportPath = path.resolve(root, report);
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeIfChanged(reportPath, JSON.stringify(audit, null, 2) + '\n');
}
const originalBytes = audit.sources.reduce((total, source) => total + source.bytes, 0);
const mobileBytes = audit.sources.reduce((total, source) => total + source.variants[0].bytes, 0);
console.log(`Generated ${audit.sources.reduce((total, source) => total + source.variants.length, 0)} responsive screenshot candidates; 640px crops save ${originalBytes - mobileBytes} bytes (${((1 - mobileBytes / originalBytes) * 100).toFixed(1)}%).`);
