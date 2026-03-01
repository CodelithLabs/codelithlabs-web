// ═══════════════════════════════════════════════════════════════════════════
// FILE: scripts/generate-og-png.mjs
// Convert the SVG OG image to PNG for social media compatibility.
// Usage: node scripts/generate-og-png.mjs
// ═══════════════════════════════════════════════════════════════════════════

import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const svgPath = resolve(ROOT, 'public/og-image.svg');
const pngPath = resolve(ROOT, 'public/og-image.png');

if (!existsSync(svgPath)) {
  console.error('❌  public/og-image.svg not found — run generate-og-image.js first');
  process.exit(1);
}

const svg = readFileSync(svgPath);

await sharp(svg)
  .resize(1200, 630)
  .png({ quality: 90 })
  .toFile(pngPath);

console.log('✅  public/og-image.png generated (1200×630)');
