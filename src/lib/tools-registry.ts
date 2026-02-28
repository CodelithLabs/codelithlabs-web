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
  {
    slug: 'social-media-resizer',
    name: 'Social Media Image Resizer',
    description: 'Resize images to perfect dimensions for Instagram, Twitter, Facebook, YouTube, and more.',
    category: 'image',
    keywords: ['social media', 'resize', 'instagram', 'twitter', 'facebook', 'youtube'],
    processingType: 'client'
  },
  {
    slug: 'privacy-blur',
    name: 'Privacy Blur Tool',
    description: 'Blur sensitive content (faces, text) in images for privacy protection.',
    category: 'image',
    keywords: ['privacy', 'blur', 'redact', 'anonymize', 'face blur'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // UNIT CONVERTERS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between length, weight, temperature, and other measurement units.',
    category: 'converter',
    keywords: ['unit', 'convert', 'length', 'weight', 'temperature', 'measurement'],
    processingType: 'client'
  },
  {
    slug: 'json-to-yaml',
    name: 'JSON to YAML Converter',
    description: 'Convert JSON data to YAML format for configuration files.',
    category: 'converter',
    keywords: ['json', 'yaml', 'convert', 'config'],
    processingType: 'client'
  },
  {
    slug: 'webp-converter',
    name: 'WebP Converter',
    description: 'Convert images to modern WebP format for better web performance.',
    category: 'image',
    keywords: ['webp', 'image', 'convert', 'optimize', 'compression'],
    processingType: 'client'
  },
  {
    slug: 'image-filters',
    name: 'Image Filters',
    description: 'Apply filters to images: grayscale, sepia, invert, brightness, contrast, blur.',
    category: 'image',
    keywords: ['image', 'filter', 'grayscale', 'sepia', 'effects'],
    processingType: 'client'
  },
  {
    slug: 'text-to-slug',
    name: 'Text to Slug Converter',
    description: 'Convert text to URL-friendly slugs for permalinks and SEO.',
    category: 'text',
    keywords: ['slug', 'url', 'permalink', 'seo', 'convert'],
    processingType: 'client'
  },
  {
    slug: 'duplicate-remover',
    name: 'Duplicate Line Remover',
    description: 'Remove duplicate lines from text while preserving unique entries.',
    category: 'text',
    keywords: ['duplicate', 'remove', 'unique', 'lines', 'text'],
    processingType: 'client'
  },
  {
    slug: 'random-number',
    name: 'Random Number Generator',
    description: 'Generate random numbers within a specified range.',
    category: 'generator',
    keywords: ['random', 'number', 'generate', 'dice', 'lottery'],
    processingType: 'client'
  },
  {
    slug: 'roman-numeral',
    name: 'Roman Numeral Converter',
    description: 'Convert between numbers and Roman numerals (I, V, X, L, C, D, M).',
    category: 'converter',
    keywords: ['roman', 'numeral', 'convert', 'number', 'ancient'],
    processingType: 'client'
  },
  {
    slug: 'binary-converter',
    name: 'Binary Converter',
    description: 'Convert text to binary and binary to text.',
    category: 'converter',
    keywords: ['binary', 'text', 'convert', '01', 'bits'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // AI-POWERED TOOLS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'sentiment-analyzer',
    name: 'Sentiment Analyzer',
    description: 'Analyze the emotional tone and sentiment of any text using AI algorithms.',
    category: 'ai',
    keywords: ['sentiment', 'emotion', 'analysis', 'nlp', 'text analysis'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // FINANCE TOOLS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'crypto-converter',
    name: 'Crypto Converter',
    description: 'Convert cryptocurrency to fiat currency with real-time exchange rates.',
    category: 'finance',
    keywords: ['crypto', 'bitcoin', 'ethereum', 'cryptocurrency', 'converter', 'price'],
    processingType: 'client'
  },
  {
    slug: 'currency-converter',
    name: 'Currency Converter',
    description: 'Convert between 150+ world currencies using live exchange rates.',
    category: 'finance',
    keywords: ['currency', 'exchange rate', 'forex', 'money', 'converter'],
    processingType: 'client'
  },
  {
    slug: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    description: 'Calculate monthly payments, total interest, and amortization schedule for home loans.',
    category: 'finance',
    keywords: ['mortgage', 'loan', 'emi', 'calculator', 'interest', 'amortization'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // GEO / GEOGRAPHIC TOOLS
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'timezone-converter',
    name: 'Timezone Converter',
    description: 'Convert times between different timezones with automatic DST handling.',
    category: 'geo',
    keywords: ['timezone', 'time', 'converter', 'utc', 'dst', 'world clock'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // AI-POWERED TOOLS (NEW BATCH)
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'text-summarizer',
    name: 'Text Summarizer',
    description: 'Automatically summarize long texts into concise key points using extractive summarization.',
    category: 'ai',
    keywords: ['summarize', 'summary', 'tldr', 'text', 'ai', 'extract'],
    processingType: 'client'
  },
  {
    slug: 'paraphraser',
    name: 'Text Paraphraser',
    description: 'Rewrite and paraphrase text in different styles — formal, casual, shorter, or longer.',
    category: 'ai',
    keywords: ['paraphrase', 'rewrite', 'rephrase', 'synonym', 'ai'],
    processingType: 'client'
  },
  {
    slug: 'grammar-checker',
    name: 'Grammar Checker',
    description: 'Check your text for common grammar mistakes, passive voice, and style issues.',
    category: 'ai',
    keywords: ['grammar', 'spell check', 'writing', 'proofread', 'ai'],
    processingType: 'client'
  },
  {
    slug: 'ai-color-palette',
    name: 'AI Color Palette Generator',
    description: 'Generate beautiful color palettes from keywords, moods, or themes using AI.',
    category: 'ai',
    keywords: ['color', 'palette', 'design', 'ai', 'theme', 'mood'],
    processingType: 'client'
  },
  {
    slug: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text to natural-sounding speech using your browser\'s built-in voices.',
    category: 'ai',
    keywords: ['tts', 'speech', 'voice', 'read aloud', 'audio', 'ai'],
    processingType: 'client'
  },
  {
    slug: 'word-frequency-counter',
    name: 'Word Frequency Counter',
    description: 'Analyze word frequency, find most-used words, and get detailed text statistics.',
    category: 'ai',
    keywords: ['word frequency', 'text analysis', 'statistics', 'count'],
    processingType: 'client'
  },
  {
    slug: 'code-explainer',
    name: 'Code Explainer',
    description: 'Paste code and get a line-by-line explanation of what it does, with language detection.',
    category: 'ai',
    keywords: ['code', 'explain', 'programming', 'learn', 'ai'],
    processingType: 'client'
  },
  {
    slug: 'ai-translator',
    name: 'Multi-Language Translator',
    description: 'Translate common phrases between 10+ languages instantly with offline dictionary.',
    category: 'ai',
    keywords: ['translate', 'language', 'translation', 'multilingual', 'ai'],
    processingType: 'client'
  },
  {
    slug: 'email-generator',
    name: 'Professional Email Generator',
    description: 'Generate professional emails from templates — formal, follow-up, apology, and more.',
    category: 'ai',
    keywords: ['email', 'template', 'professional', 'business', 'ai'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // FINANCE TOOLS (NEW BATCH)
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    description: 'Calculate compound interest with monthly contributions and see year-by-year growth projections.',
    category: 'finance',
    keywords: ['compound interest', 'investment', 'growth', 'savings', 'calculator'],
    processingType: 'client'
  },
  {
    slug: 'tax-calculator-india',
    name: 'Income Tax Calculator (India)',
    description: 'Calculate India income tax under Old and New regime for FY 2025-26 with Section 87A rebate.',
    category: 'finance',
    keywords: ['income tax', 'india', 'tax calculator', 'old regime', 'new regime', 'section 87a'],
    processingType: 'client'
  },
  {
    slug: 'salary-calculator',
    name: 'CTC to In-Hand Salary Calculator',
    description: 'Calculate monthly in-hand salary from annual CTC including PF, HRA, and deductions (India).',
    category: 'finance',
    keywords: ['salary', 'ctc', 'in-hand', 'pf', 'hra', 'india', 'take home'],
    processingType: 'client'
  },
  {
    slug: 'investment-comparator',
    name: 'Investment Comparator (India)',
    description: 'Compare returns across FD, PPF, NPS, Gold, Nifty 50, and more Indian investment options.',
    category: 'finance',
    keywords: ['investment', 'compare', 'fd', 'ppf', 'nps', 'gold', 'nifty', 'india'],
    processingType: 'client'
  },
  {
    slug: 'gold-silver-calculator',
    name: 'Gold & Silver Price Calculator',
    description: 'Calculate jewelry cost with making charges, GST, and purity for gold and silver.',
    category: 'finance',
    keywords: ['gold', 'silver', 'jewelry', 'price', 'making charge', 'gst', 'karat'],
    processingType: 'client'
  },
  {
    slug: 'breakeven-calculator',
    name: 'Break-Even Calculator',
    description: 'Find how many units to sell to cover costs with profit/loss visualization.',
    category: 'finance',
    keywords: ['breakeven', 'break even', 'business', 'profit', 'loss', 'calculator'],
    processingType: 'client'
  },
  {
    slug: 'profit-margin-calculator',
    name: 'Profit Margin Calculator',
    description: 'Calculate gross profit, margin percentage, and markup from cost and revenue.',
    category: 'finance',
    keywords: ['profit', 'margin', 'markup', 'revenue', 'business', 'calculator'],
    processingType: 'client'
  },
  {
    slug: 'invoice-generator',
    name: 'Invoice Generator',
    description: 'Create professional invoices with itemized billing, tax calculations, and downloadable output.',
    category: 'finance',
    keywords: ['invoice', 'billing', 'receipt', 'business', 'generator'],
    processingType: 'client'
  },
  {
    slug: 'expense-splitter',
    name: 'Expense Splitter',
    description: 'Split bills equally among friends with automatic settlement calculation.',
    category: 'finance',
    keywords: ['expense', 'split', 'bill', 'friends', 'settle', 'money'],
    processingType: 'client'
  },
  {
    slug: 'retirement-calculator',
    name: 'Retirement Calculator (India)',
    description: 'Plan retirement corpus with inflation, returns, and monthly expense projections.',
    category: 'finance',
    keywords: ['retirement', 'pension', 'corpus', 'inflation', 'india', 'planning'],
    processingType: 'client'
  },
  {
    slug: 'stock-calculator',
    name: 'Stock Profit/Loss Calculator',
    description: 'Calculate trading profit/loss after brokerage and STT, or find average buy price.',
    category: 'finance',
    keywords: ['stock', 'trading', 'profit', 'loss', 'brokerage', 'stt', 'average price'],
    processingType: 'client'
  },
  {
    slug: 'capital-gains-tax',
    name: 'Capital Gains Tax Calculator (India)',
    description: 'Calculate LTCG/STCG tax on equity, debt funds, and real estate with new 12.5% rate.',
    category: 'finance',
    keywords: ['capital gains', 'ltcg', 'stcg', 'tax', 'equity', 'india'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // GEO / GEOGRAPHIC TOOLS (NEW BATCH)
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'distance-calculator',
    name: 'Distance Calculator',
    description: 'Calculate the distance between two locations using the Haversine formula.',
    category: 'geo',
    keywords: ['distance', 'haversine', 'coordinates', 'location', 'maps'],
    processingType: 'client'
  },
  {
    slug: 'coordinate-converter',
    name: 'Coordinate Converter',
    description: 'Convert between Decimal Degrees, DMS, and DDM coordinate formats.',
    category: 'geo',
    keywords: ['coordinates', 'latitude', 'longitude', 'dms', 'gps', 'converter'],
    processingType: 'client'
  },
  {
    slug: 'ip-geolocation',
    name: 'IP Geolocation Lookup',
    description: 'Find the geographic location, ISP, timezone, and details for any IP address.',
    category: 'geo',
    keywords: ['ip', 'geolocation', 'location', 'isp', 'address', 'lookup'],
    processingType: 'client'
  },
  {
    slug: 'world-clock',
    name: 'World Clock',
    description: 'Track current time across multiple time zones with live updates.',
    category: 'geo',
    keywords: ['world clock', 'timezone', 'time', 'global', 'live'],
    processingType: 'client'
  },
  {
    slug: 'sunrise-sunset',
    name: 'Sunrise & Sunset Calculator',
    description: 'Calculate sunrise, sunset, and day length for any location and date.',
    category: 'geo',
    keywords: ['sunrise', 'sunset', 'solar', 'daylight', 'dawn', 'dusk'],
    processingType: 'client'
  },
  {
    slug: 'country-info',
    name: 'Country Information',
    description: 'Quick reference for country details including capital, population, currency, and more.',
    category: 'geo',
    keywords: ['country', 'information', 'capital', 'population', 'currency', 'flag'],
    processingType: 'client'
  },
  {
    slug: 'lat-long-finder',
    name: 'Latitude & Longitude Finder',
    description: 'Find coordinates for any address or get your current location\'s coordinates.',
    category: 'geo',
    keywords: ['latitude', 'longitude', 'coordinates', 'geocode', 'address', 'location'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // DEVELOPER TOOLS (NEW BATCH)
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'api-tester',
    name: 'API Tester',
    description: 'Test REST API endpoints with custom methods, headers, and body — like Postman in your browser.',
    category: 'developer',
    keywords: ['api', 'rest', 'postman', 'http', 'request', 'endpoint', 'test'],
    processingType: 'client'
  },
  {
    slug: 'cron-expression-generator',
    name: 'Cron Expression Generator',
    description: 'Build cron expressions visually with human-readable descriptions and upcoming run times.',
    category: 'developer',
    keywords: ['cron', 'schedule', 'crontab', 'job', 'timer', 'generator'],
    processingType: 'client'
  },
  {
    slug: 'html-to-jsx',
    name: 'HTML to JSX Converter',
    description: 'Convert HTML to React JSX — transforms class→className, styles→objects, self-closes tags.',
    category: 'developer',
    keywords: ['html', 'jsx', 'react', 'converter', 'component'],
    processingType: 'client'
  },
  {
    slug: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare two texts side by side and see additions, removals using LCS algorithm.',
    category: 'developer',
    keywords: ['diff', 'compare', 'merge', 'git', 'changes', 'code review'],
    processingType: 'client'
  },
  {
    slug: 'json-path-finder',
    name: 'JSON Path Finder',
    description: 'Explore JSON data, discover all paths, and query values using JSONPath-like syntax.',
    category: 'developer',
    keywords: ['json', 'path', 'query', 'explorer', 'data', 'jsonpath'],
    processingType: 'client'
  },
  {
    slug: 'regex-generator',
    name: 'Regex Pattern Generator',
    description: 'Choose from common regex patterns or build your own with real-time testing.',
    category: 'developer',
    keywords: ['regex', 'pattern', 'generator', 'regular expression', 'match'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // IMAGE / MEDIA TOOLS (NEW BATCH)
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'image-watermark',
    name: 'Image Watermark',
    description: 'Add text watermarks to images with customizable position, opacity, size, and color.',
    category: 'image',
    keywords: ['watermark', 'image', 'protect', 'copyright', 'text overlay'],
    processingType: 'client'
  },
  {
    slug: 'background-remover',
    name: 'Background Remover',
    description: 'Remove solid-color backgrounds from images using color-matching algorithm.',
    category: 'image',
    keywords: ['background', 'remove', 'transparent', 'cutout', 'image'],
    processingType: 'client'
  },
  {
    slug: 'color-picker',
    name: 'Color Picker & Converter',
    description: 'Pick colors and convert between HEX, RGB, HSL, CMYK with shades and contrast preview.',
    category: 'converter',
    keywords: ['color', 'picker', 'hex', 'rgb', 'hsl', 'cmyk', 'converter'],
    processingType: 'client'
  },
  {
    slug: 'pdf-to-image',
    name: 'PDF to Image Converter',
    description: 'Convert PDF documents to high-quality PNG/JPG images page by page.',
    category: 'converter',
    keywords: ['pdf', 'image', 'png', 'jpg', 'converter', 'document'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════
  // WEB / DESIGN TOOLS (NEW BATCH)
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'font-pair-suggester',
    name: 'Font Pair Suggester',
    description: 'Discover beautiful Google Font pairings for your website with live preview.',
    category: 'seo',
    keywords: ['font', 'typography', 'pairing', 'google fonts', 'design', 'web'],
    processingType: 'client'
  },
  {
    slug: 'responsive-checker',
    name: 'Responsive Design Checker',
    description: 'Preview any URL at different device sizes — mobile, tablet, and desktop viewports.',
    category: 'seo',
    keywords: ['responsive', 'mobile', 'tablet', 'desktop', 'viewport', 'preview'],
    processingType: 'client'
  },
  {
    slug: 'readme-generator',
    name: 'README Generator',
    description: 'Create professional GitHub README files with badges, features, and installation steps.',
    category: 'developer',
    keywords: ['readme', 'github', 'markdown', 'documentation', 'project'],
    processingType: 'client'
  },
  {
    slug: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    description: 'Create beautiful linear, radial, and conic gradients with live preview and copy-ready CSS.',
    category: 'developer',
    keywords: ['gradient', 'css', 'linear', 'radial', 'conic', 'design', 'background'],
    processingType: 'client'
  },
  {
    slug: 'website-security-checker',
    name: 'Website Security Checker',
    description: 'Quick security analysis — checks HTTPS, domain trust, phishing patterns, and more.',
    category: 'seo',
    keywords: ['security', 'https', 'ssl', 'phishing', 'website', 'check', 'safe'],
    processingType: 'client'
  },
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

/**
 * Get related tools by category + keyword overlap.
 * Returns up to `limit` tools excluding the given slug.
 */
export function getRelatedTools(slug: string, limit = 4): ToolMeta[] {
  const tool = TOOLS_REGISTRY.find(t => t.slug === slug);
  if (!tool) return [];

  return TOOLS_REGISTRY
    .filter(t => t.slug !== slug)
    .map(t => ({
      tool: t,
      score: (t.category === tool.category ? 3 : 0) +
             t.keywords.filter(k => tool.keywords.includes(k)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(entry => entry.tool);
}

/**
 * Get all unique categories from the registry.
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(TOOLS_REGISTRY.map(t => t.category)));
}
