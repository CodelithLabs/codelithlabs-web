// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/tools-registry.ts
// Central registry for all 199+ tools
// Add new tools here - they auto-generate routes via dynamic routing
// ═══════════════════════════════════════════════════════════════════════════

import { ToolMeta } from '@/types/tool';

export const TOOLS_REGISTRY: ToolMeta[] = [
  // ═══════════════════════════════════════════════════════════════
  // TEXT TOOLS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in your text instantly.',
    category: 'text',
    keywords: ['word count', 'character count', 'text analysis'],
    processingType: 'client'
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text to uppercase, lowercase, title case, sentence case, and more.',
    category: 'text',
    keywords: ['uppercase', 'lowercase', 'title case', 'text transform'],
    processingType: 'client'
  },
  {
    slug: 'text-diff',
    name: 'Text Diff Checker',
    description: 'Compare two texts and highlight the differences between them.',
    category: 'text',
    keywords: ['diff', 'compare text', 'text comparison'],
    processingType: 'client'
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your designs and mockups.',
    category: 'text',
    keywords: ['lorem ipsum', 'placeholder text', 'dummy text'],
    processingType: 'client'
  },
  {
    slug: 'text-to-slug',
    name: 'Text to Slug Converter',
    description: 'Convert any text into a URL-friendly slug format.',
    category: 'text',
    keywords: ['slug', 'url', 'permalink'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // DEVELOPER TOOLS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, beautify, and validate JSON data with syntax highlighting.',
    category: 'developer',
    keywords: ['json', 'format', 'validate', 'beautify'],
    processingType: 'client'
  },
  {
    slug: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 to plain text.',
    category: 'encoder',
    keywords: ['base64', 'encode', 'decode'],
    processingType: 'client'
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode or decode URLs for safe transmission.',
    category: 'encoder',
    keywords: ['url', 'encode', 'decode', 'percent encoding'],
    processingType: 'client'
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions with real-time matching.',
    category: 'developer',
    keywords: ['regex', 'regular expression', 'pattern matching'],
    processingType: 'client'
  },
  {
    slug: 'html-entity-encoder',
    name: 'HTML Entity Encoder',
    description: 'Convert special characters to HTML entities and vice versa.',
    category: 'encoder',
    keywords: ['html', 'entity', 'encode', 'special characters'],
    processingType: 'client'
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens without verification.',
    category: 'developer',
    keywords: ['jwt', 'json web token', 'decode', 'auth'],
    processingType: 'client'
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB, HSL, and other formats.',
    category: 'developer',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'convert'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // CONVERTERS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'markdown-to-html',
    name: 'Markdown to HTML',
    description: 'Convert Markdown text to clean HTML code.',
    category: 'converter',
    keywords: ['markdown', 'html', 'convert', 'md'],
    processingType: 'client'
  },
  {
    slug: 'csv-to-json',
    name: 'CSV to JSON Converter',
    description: 'Transform CSV data into JSON format instantly.',
    category: 'converter',
    keywords: ['csv', 'json', 'convert', 'data'],
    processingType: 'client'
  },
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    description: 'Convert JSON arrays to CSV format for spreadsheets.',
    category: 'converter',
    keywords: ['json', 'csv', 'convert', 'export'],
    processingType: 'client'
  },
  {
    slug: 'yaml-to-json',
    name: 'YAML to JSON Converter',
    description: 'Convert YAML configuration to JSON format.',
    category: 'converter',
    keywords: ['yaml', 'json', 'convert', 'config'],
    processingType: 'client'
  },
  {
    slug: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa.',
    category: 'converter',
    keywords: ['unix', 'timestamp', 'date', 'time'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERATORS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUIDs (v4) for your applications.',
    category: 'generator',
    keywords: ['uuid', 'guid', 'unique id', 'random'],
    processingType: 'client'
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Generate strong, secure random passwords with custom options.',
    category: 'generator',
    keywords: ['password', 'secure', 'random', 'generator'],
    processingType: 'client'
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create QR codes for URLs, text, or contact information.',
    category: 'generator',
    keywords: ['qr code', 'barcode', 'generate'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // CALCULATORS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages, percentage change, and more.',
    category: 'calculator',
    keywords: ['percentage', 'percent', 'calculate', 'math'],
    processingType: 'client'
  },
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index based on height and weight.',
    category: 'calculator',
    keywords: ['bmi', 'body mass index', 'health', 'weight'],
    processingType: 'client'
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate exact age in years, months, and days from birthdate.',
    category: 'calculator',
    keywords: ['age', 'birthday', 'date', 'calculate'],
    processingType: 'client'
  },
  {
    slug: 'loan-calculator',
    name: 'Loan EMI Calculator',
    description: 'Calculate monthly EMI payments for loans with interest.',
    category: 'calculator',
    keywords: ['loan', 'emi', 'interest', 'mortgage'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // SECURITY TOOLS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.',
    category: 'security',
    keywords: ['hash', 'md5', 'sha', 'checksum', 'crypto'],
    processingType: 'client'
  },
  {
    slug: 'password-strength-checker',
    name: 'Password Strength Checker',
    description: 'Check how strong your password is against common attacks.',
    category: 'security',
    keywords: ['password', 'strength', 'security', 'check'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // FORMATTERS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries for better readability.',
    category: 'formatter',
    keywords: ['sql', 'format', 'beautify', 'query'],
    processingType: 'client'
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    description: 'Beautify and indent HTML code for better readability.',
    category: 'formatter',
    keywords: ['html', 'format', 'beautify', 'indent'],
    processingType: 'client'
  },
  {
    slug: 'css-minifier',
    name: 'CSS Minifier',
    description: 'Minify CSS code to reduce file size for production.',
    category: 'formatter',
    keywords: ['css', 'minify', 'compress', 'optimize'],
    processingType: 'client'
  },
  {
    slug: 'js-minifier',
    name: 'JavaScript Minifier',
    description: 'Minify JavaScript code to reduce file size.',
    category: 'formatter',
    keywords: ['javascript', 'js', 'minify', 'compress'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // SEO TOOLS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    description: 'Generate SEO-optimized meta tags for your web pages.',
    category: 'seo',
    keywords: ['meta tags', 'seo', 'html', 'optimization'],
    processingType: 'client'
  },
  {
    slug: 'open-graph-generator',
    name: 'Open Graph Generator',
    description: 'Create Open Graph meta tags for social media sharing.',
    category: 'seo',
    keywords: ['open graph', 'og tags', 'social media', 'facebook'],
    processingType: 'client'
  },
  {
    slug: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    description: 'Generate robots.txt files for search engine crawlers.',
    category: 'seo',
    keywords: ['robots.txt', 'seo', 'crawlers', 'sitemap'],
    processingType: 'client'
  },
  {
    slug: 'sitemap-generator',
    name: 'Sitemap XML Generator',
    description: 'Create XML sitemaps for better search engine indexing.',
    category: 'seo',
    keywords: ['sitemap', 'xml', 'seo', 'google'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // IMAGE TOOLS (Client-side with Canvas API)
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'image-to-base64',
    name: 'Image to Base64',
    description: 'Convert images to Base64 encoded strings for embedding.',
    category: 'image',
    keywords: ['image', 'base64', 'convert', 'embed'],
    processingType: 'client'
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to specific dimensions in your browser.',
    category: 'image',
    keywords: ['image', 'resize', 'dimensions', 'scale'],
    processingType: 'client'
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images to reduce file size without losing quality.',
    category: 'image',
    keywords: ['image', 'compress', 'optimize', 'reduce size'],
    processingType: 'client'
  },
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    description: 'Crop images to custom dimensions directly in browser.',
    category: 'image',
    keywords: ['image', 'crop', 'trim', 'cut'],
    processingType: 'client'
  },
  {
    slug: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    description: 'Convert PNG images to JPG format in your browser.',
    category: 'image',
    keywords: ['png', 'jpg', 'jpeg', 'convert', 'image'],
    processingType: 'client'
  },
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    description: 'Convert JPG images to PNG format with transparency support.',
    category: 'image',
    keywords: ['jpg', 'png', 'convert', 'transparent'],
    processingType: 'client'
  },

  // Add 150+ more tools following this pattern...
  // The registry enables dynamic routing - just add to this array
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS_REGISTRY.find(tool => tool.slug === slug);
}

export function getToolsByCategory(category: string): ToolMeta[] {
  return TOOLS_REGISTRY.filter(tool => tool.category === category);
}

export function getAllSlugs(): string[] {
  return TOOLS_REGISTRY.map(tool => tool.slug);
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.toLowerCase();
  return TOOLS_REGISTRY.filter(tool => 
    tool.name.toLowerCase().includes(q) ||
    tool.description.toLowerCase().includes(q) ||
    tool.keywords.some(k => k.toLowerCase().includes(q))
  );
}

export function getToolCount(): number {
  return TOOLS_REGISTRY.length;
}

export function getCategoryStats(): Record<string, number> {
  return TOOLS_REGISTRY.reduce((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
