# Open Graph Images

## SVG Files Generated
This directory contains automatically generated Open Graph (OG) images for social media sharing.

### Main OG Image
- `og-image.svg` - Primary social sharing image (1200x630px)

### Converting to PNG
If you need PNG format for better compatibility:

**Using ImageMagick:**
```bash
magick convert og-image.svg -resize 1200x630 og-image.png
```

**Using Inkscape:**
```bash
inkscape og-image.svg --export-filename=og-image.png --export-width=1200 --export-height=630
```

**Using browser:**
1. Open og-image.svg in a browser
2. Take a screenshot or use browser dev tools to export as PNG
3. Resize to exactly 1200x630px if needed

**Online tools:**
- https://cloudconvert.com/svg-to-png
- https://www.svgtopng.com/

### Tool-Specific Images (Future)
Run `node scripts/generate-og-image.js --tools` to generate OG images for each tool.

## Schema Optimization
Make sure metadata in `src/app/layout.tsx` references the correct OG image path:
```typescript
images: [{
  url: 'https://codelithlabs.in/og-image.png', // or .svg
  width: 1200,
  height: 630,
}]
```

Note: Some social platforms (Twitter, Facebook) prefer PNG over SVG for OG images.
