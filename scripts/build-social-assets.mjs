// The company's share card uses its original vector identity, not the product logo.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logo = await readFile(path.join(root, 'public/radovar-logo.svg'), 'utf8');
const artwork = logo.replace(/<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '');
// Keep the complete wordmark inside the central square crop used by previews.
const width = 560, scale = width / 1184, height = 230 * scale;
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#faf9f5"/><g transform="translate(${(1200 - width) / 2} ${(630 - height) / 2}) scale(${scale})">${artwork}</g></svg>`;
const png = await sharp(Buffer.from(card)).png().toBuffer();
await writeFile(path.join(root, 'public/radovar-social-20261016.png'), png);
// Older cached metadata can still request the previous URL. Keep it on-brand too.
await writeFile(path.join(root, 'public/social-card.png'), png);
console.log('Generated Radovar social card: original wordmark, 1200×630, safe central crop.');
