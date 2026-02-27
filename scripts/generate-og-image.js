// ═══════════════════════════════════════════════════════════════════════════
// FILE: scripts/generate-og-image.js
// Generate Open Graph images for social media sharing
// Creates 1200x630px images with brand colors and proper text
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

/**
 * Generate SVG-based OG image (no dependencies required)
 * SVG can be converted to PNG using browser or ImageMagick if needed
 */
function generateOGImageSVG(title, subtitle, outputPath) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
    </linearGradient>
    
    <radialGradient id="accentGlow" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  
  <!-- Accent glow -->
  <circle cx="200" cy="150" r="250" fill="url(#accentGlow)"/>
  <circle cx="1000" cy="480" r="200" fill="url(#accentGlow)"/>
  
  <!-- Grid pattern overlay -->
  <g opacity="0.1">
    ${Array.from({ length: 12 }, (_, i) => 
      `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="630" stroke="#3b82f6" stroke-width="1"/>`
    ).join('\n    ')}
    ${Array.from({ length: 7 }, (_, i) => 
      `<line x1="0" y1="${i * 90}" x2="1200" y2="${i * 90}" stroke="#3b82f6" stroke-width="1"/>`
    ).join('\n    ')}
  </g>
  
  <!-- Logo/Icon area -->
  <circle cx="150" cy="315" r="80" fill="#3b82f6" opacity="0.2"/>
  <text 
    x="150" 
    y="335" 
    font-family="Arial, sans-serif" 
    font-size="80" 
    font-weight="bold" 
    fill="#3b82f6" 
    text-anchor="middle"
  >&lt;/&gt;</text>
  
  <!-- Main title -->
  <text 
    x="280" 
    y="280" 
    font-family="Arial, sans-serif" 
    font-size="72" 
    font-weight="bold" 
    fill="#ffffff" 
    letter-spacing="2"
  >${escapeXml(title)}</text>
  
  <!-- Subtitle -->
  <text 
    x="280" 
    y="350" 
    font-family="Arial, sans-serif" 
    font-size="36" 
    fill="#94a3b8" 
  >${escapeXml(subtitle)}</text>
  
  <!-- URL watermark -->
  <text 
    x="280" 
    y="420" 
    font-family="Arial, sans-serif" 
    font-size="28" 
    fill="#64748b" 
    opacity="0.8"
  >codelithlabs.in</text>
  
  <!-- Badge -->
  <rect x="280" y="450" width="280" height="50" rx="25" fill="#3b82f6" opacity="0.2"/>
  <text 
    x="420" 
    y="485" 
    font-family="Arial, sans-serif" 
    font-size="24" 
    font-weight="600" 
    fill="#3b82f6" 
    text-anchor="middle"
  >100% Client-Side • Free</text>
</svg>`;

  fs.writeFileSync(outputPath, svg, 'utf8');
  console.log(`✅ Generated OG image (SVG): ${outputPath}`);
}

/**
 * Escape XML special characters
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate tool-specific OG images
 */
function generateToolOGImage(toolName, category, outputPath) {
  const categoryIcons = {
    converter: '⇄',
    generator: '✨',
    calculator: '🧮',
    formatter: '📝',
    image: '🖼️',
    text: '📄',
    developer: '👨‍💻',
    security: '🔒',
    seo: '🎯',
  };

  const icon = categoryIcons[category] || '🔧';

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  
  <!-- Tool icon -->
  <text 
    x="600" 
    y="220" 
    font-size="120" 
    text-anchor="middle"
  >${icon}</text>
  
  <!-- Tool name -->
  <text 
    x="600" 
    y="340" 
    font-family="Arial, sans-serif" 
    font-size="56" 
    font-weight="bold" 
    fill="#ffffff" 
    text-anchor="middle"
  >${escapeXml(toolName)}</text>
  
  <!-- Category badge -->
  <rect x="460" y="370" width="280" height="45" rx="22.5" fill="#3b82f6" opacity="0.3"/>
  <text 
    x="600" 
    y="402" 
    font-family="Arial, sans-serif" 
    font-size="22" 
    font-weight="600" 
    fill="#3b82f6" 
    text-anchor="middle"
  >${escapeXml(category.toUpperCase())}</text>
  
  <!-- Bottom branding -->
  <text 
    x="600" 
    y="500" 
    font-family="Arial, sans-serif" 
    font-size="32" 
    fill="#64748b" 
    text-anchor="middle"
  >CodelithLabs • Free Online Tools</text>
</svg>`;

  fs.writeFileSync(outputPath, svg, 'utf8');
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

const publicDir = path.join(__dirname, '..', 'public');

// Generate main OG image
generateOGImageSVG(
  'CodelithLabs',
  'Free Online Tools Platform',
  path.join(publicDir, 'og-image.svg')
);

// Also create a simple note about PNG conversion
const readmeContent = `# Open Graph Images

## SVG Files Generated
This directory contains automatically generated Open Graph (OG) images for social media sharing.

### Main OG Image
- \`og-image.svg\` - Primary social sharing image (1200x630px)

### Converting to PNG
If you need PNG format for better compatibility:

**Using ImageMagick:**
\`\`\`bash
magick convert og-image.svg -resize 1200x630 og-image.png
\`\`\`

**Using Inkscape:**
\`\`\`bash
inkscape og-image.svg --export-filename=og-image.png --export-width=1200 --export-height=630
\`\`\`

**Using browser:**
1. Open og-image.svg in a browser
2. Take a screenshot or use browser dev tools to export as PNG
3. Resize to exactly 1200x630px if needed

**Online tools:**
- https://cloudconvert.com/svg-to-png
- https://www.svgtopng.com/

### Tool-Specific Images (Future)
Run \`node scripts/generate-og-image.js --tools\` to generate OG images for each tool.

## Schema Optimization
Make sure metadata in \`src/app/layout.tsx\` references the correct OG image path:
\`\`\`typescript
images: [{
  url: 'https://codelithlabs.in/og-image.png', // or .svg
  width: 1200,
  height: 630,
}]
\`\`\`

Note: Some social platforms (Twitter, Facebook) prefer PNG over SVG for OG images.
`;

fs.writeFileSync(path.join(publicDir, 'OG-IMAGES-README.md'), readmeContent, 'utf8');

console.log('\n✅ OG Image generation complete!');
console.log('📝 Created og-image.svg in public/ directory');
console.log('💡 Convert to PNG for better social media compatibility');
console.log('📖 See public/OG-IMAGES-README.md for conversion instructions\n');
