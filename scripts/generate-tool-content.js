// ═══════════════════════════════════════════════════════════════════════════
// FILE: scripts/generate-tool-content.js
// Automated Content Generation System for Tools
// Generates SEO-optimized articles for all tools without manual work
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════

const generateArticleContent = (tool) => {
  const { name, slug, description, category, keywords } = tool;

  // Generate SEO-optimized title variations
  const titleVariations = {
    converter: `Free ${name} - Convert Online Instantly`,
    generator: `${name} - Generate Free Online`,
    calculator: `${name} - Calculate Free Online`,
    formatter: `${name} - Format Online Free`,
    default: `${name} - Free Online Tool`
  };

  const title = titleVariations[category] || titleVariations.default;

  return `---
title: "${title}"
description: "${description}"
keywords: ${JSON.stringify(keywords)}
category: "${category}"
slug: "${slug}"
datePublished: "${new Date().toISOString()}"
dateModified: "${new Date().toISOString()}"
author: "CodelithLabs Team"
---

# ${name}

${description}

## 🚀 Features

- **100% Client-Side Processing** - Your data never leaves your browser
- **Instant Results** - Real-time processing with no server delays
- **No Sign-Up Required** - Start using immediately
- **Privacy-First** - Zero data collection or storage
- **Mobile-Friendly** - Works perfectly on all devices
- **Completely Free** - No hidden costs or premium tiers

## 📖 How to Use ${name}

1. **Open the Tool**: Navigate to the ${name.toLowerCase()} on CodelithLabs
2. **Enter Your Data**: Input or paste your content into the tool
3. **Process**: Click the appropriate button to ${category === 'converter' ? 'convert' : category === 'generator' ? 'generate' : 'process'} your data
4. **Get Results**: View and copy your results instantly
5. **Download/Export**: Save your results if needed

## 💡 Common Use Cases

### For Developers
- Quick ${name.toLowerCase()} during coding sessions
- Testing and debugging workflows
- Batch processing of files
- Integration with development pipelines

### For Designers
- Preparing assets for projects
- Optimizing resources
- Format conversions
- Quick prototyping

### For Content Creators
- Content preparation and optimization
- Format standardization
- Quick editing and processing
- Publishing workflows

## 🎯 Why Choose CodelithLabs?

### Privacy & Security
All processing happens in your browser using JavaScript. Your data is never uploaded to our servers, ensuring complete privacy and security.

### Speed & Performance
Client-side processing means instant results without waiting for server responses or upload times.

### No Installation Required
Access ${name.toLowerCase()} directly from your browser - no downloads, installations, or configurations needed.

### Always Available
Works offline once loaded. Perfect for traveling or working with sensitive data in air-gapped environments.

## 🔧 Technical Details

### Processing Technology
- **Client-Side JavaScript**: All computations run in your browser
- **Modern Web APIs**: Utilizes Canvas, FileReader, and Web Crypto APIs
- **Zero Dependencies**: Lightweight and fast
- **Cross-Browser Compatible**: Works in Chrome, Firefox, Safari, Edge

### Supported Formats
${generateSupportedFormats(category)}

### Performance Specs
- Processing Speed: Instant (< 100ms for most operations)
- File Size Limits: Up to 50MB (browser-dependent)
- Batch Processing: Supported
- Real-Time Preview: Available

## 📝 Best Practices

1. **Check Your Input**: Ensure your data is in the correct format
2. **Use Latest Browser**: For best performance and compatibility
3. **Clear Cache**: If experiencing issues, clear browser cache
4. **Mobile Usage**: Rotate to landscape for better UI on mobile
5. **Bookmark**: Save this page for quick access

## ❓ Frequently Asked Questions

### Is ${name} really free?
Yes! All tools on CodelithLabs are 100% free with no hidden costs, premium tiers, or usage limits.

### Do you store my data?
No. All processing happens in your browser. We never see, store, or transmit your data.

### Can I use this for commercial projects?
Absolutely! Use ${name.toLowerCase()} for personal, educational, or commercial projects without restrictions.

### Does it work offline?
Yes, once the page is loaded, the tool works offline since all processing is client-side.

### What browsers are supported?
All modern browsers: Chrome, Firefox, Safari, Edge, Opera. Mobile browsers fully supported.

## 🌟 Related Tools

${generateRelatedTools(category, slug)}

## 📊 Tool Statistics

- **Category**: ${category.charAt(0).toUpperCase() + category.slice(1)}
- **Processing Type**: Client-Side
- **Data Transmission**: None
- **Server Requirements**: None
- **Cost**: Free Forever

## 💬 Feedback & Support

Have suggestions or found a bug? We'd love to hear from you!

- **Email**: contact@codelithlabs.in
- **GitHub**: [CodelithLabs Repository](https://github.com/codelithlabs)
- **Feedback Page**: [Send Feedback](/contact)

## 🔐 Privacy Commitment

Your privacy is our priority:
- ✅ No data collection
- ✅ No user tracking beyond basic analytics
- ✅ No server-side storage
- ✅ No third-party data sharing (except Google Analytics/AdSense)
- ✅ Open-source transparency

## 📱 Share This Tool

Help others discover ${name}:
- Share on social media
- Bookmark for quick access
- Add to your development toolkit
- Recommend to your team

---

**Last Updated**: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

**Author**: CodelithLabs Engineering Team

**License**: Free to use for all purposes

---

Ready to get started? [Use ${name} Now →](/tools/${slug})
`;
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const generateSupportedFormats = (category) => {
  const formats = {
    converter: 'Input formats: JSON, YAML, CSV, XML, Base64, and more\nOutput formats: Multiple industry-standard formats',
    generator: 'Output types: Secure random values, standardized formats, customizable options',
    calculator: 'Input types: Numeric values, measurements, dates, percentages',
    formatter: 'Input formats: Plain text, code, markup languages\nOutput formats: Beautified, minified, validated',
    image: 'Supported formats: JPG, PNG, WEBP, GIF, SVG\nProcessing: Compression, conversion, editing',
    default: 'Various input/output formats supported'
  };

  return formats[category] || formats.default;
};

const generateRelatedTools = (category, currentSlug) => {
  const relatedByCategory = {
    converter: ['json-to-yaml', 'yaml-to-json', 'csv-to-json', 'base64-encoder'],
    generator: ['password-generator', 'uuid-generator', 'qr-code-generator', 'lorem-ipsum-generator'],
    calculator: ['bmi-calculator', 'age-calculator', 'percentage-calculator', 'loan-calculator'],
    formatter: ['json-formatter', 'sql-formatter', 'html-formatter', 'css-minifier'],
    image: ['image-compressor', 'image-cropper', 'jpg-to-png', 'webp-converter'],
  };

  const related = relatedByCategory[category] || relatedByCategory.converter;

  return related
    .filter(slug => slug !== currentSlug)
    .slice(0, 4)
    .map(slug => `- [${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}](/tools/${slug})`)
    .join('\n');
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GENERATION LOGIC
// ═══════════════════════════════════════════════════════════════════════════

const generateAllContent = () => {
  console.log('🚀 Starting Automated Content Generation...\n');

  // Load tools registry
  const registryPath = path.join(__dirname, '..', 'src', 'lib', 'tools-registry.ts');
  const registryContent = fs.readFileSync(registryPath, 'utf8');

  // Extract tools array (simple parsing for this script)
  const toolsMatch = registryContent.match(/export const TOOLS_REGISTRY.*?=\s*\[([\s\S]*?)\];/);

  if (!toolsMatch) {
    console.error('❌ Could not parse TOOLS_REGISTRY');
    return;
  }

  // Parse tools safely using dynamic import instead of eval()
  // SECURITY FIX: Replaced eval() with proper module require
  const toolsRegistryModule = require(registryPath.replace(/\.ts$/, ''));
  const toolsData = toolsRegistryModule.TOOLS_REGISTRY || [];

  // Create content directory
  const contentDir = path.join(__dirname, '..', 'content', 'tools');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  let successCount = 0;
  let errorCount = 0;

  // Generate content for each tool
  toolsData.forEach((tool) => {
    try {
      const articleContent = generateArticleContent(tool);
      const filePath = path.join(contentDir, `${tool.slug}.md`);

      fs.writeFileSync(filePath, articleContent, 'utf8');
      console.log(`✅ Generated: ${tool.name} (${tool.slug}.md)`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error generating ${tool.name}:`, error.message);
      errorCount++;
    }
  });

  console.log(`\n📊 Generation Complete!`);
  console.log(`   ✅ Success: ${successCount} articles`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📁 Location: ${contentDir}\n`);

  // Generate index file
  generateIndexFile(toolsData, contentDir);
};

const generateIndexFile = (tools, contentDir) => {
  const indexContent = `# CodelithLabs Tools Content

Auto-generated on: ${new Date().toISOString()}

Total Tools: ${tools.length}

## Categories

${Object.entries(
  tools.reduce((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1;
    return acc;
  }, {})
).map(([cat, count]) => `- **${cat}**: ${count} tools`).join('\n')}

## All Tools

${tools.map(t => `- [${t.name}](${t.slug}.md) - ${t.description}`).join('\n')}

---

Generated by CodelithLabs Automated Content System
`;

  fs.writeFileSync(path.join(contentDir, 'README.md'), indexContent, 'utf8');
  console.log('📝 Generated index file: README.md\n');
};

// ═══════════════════════════════════════════════════════════════════════════
// EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

if (require.main === module) {
  generateAllContent();
}

module.exports = { generateArticleContent, generateAllContent };
