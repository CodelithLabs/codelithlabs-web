// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/tools-registry.ts
// Central registry for all 205 tools
// Add new tools here - they auto-generate routes via dynamic routing
// ═══════════════════════════════════════════════════════════════════════════

import { ToolMeta } from '@/types/tool';
import { TOOL_STATUS_MAP } from '@/lib/tool-status-map';

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
  {
    slug: 'calorie-calculator',
    name: 'Calorie Calculator',
    description: 'Calculate daily calorie needs based on age, weight, height, and activity level.',
    category: 'calculator',
    keywords: ['calorie', 'calories', 'diet', 'nutrition', 'bmr', 'tdee'],
    processingType: 'client'
  },
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    description: 'Calculate discounted prices, savings, and percentage off instantly.',
    category: 'calculator',
    keywords: ['discount', 'sale', 'price', 'savings', 'percentage off'],
    processingType: 'client'
  },
  {
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    description: 'Calculate tip amounts and split bills among multiple people easily.',
    category: 'calculator',
    keywords: ['tip', 'gratuity', 'bill split', 'restaurant', 'service'],
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

  // ═══════════════════════════════════════════════════════════════════════════
  // AI REPURPOSING TOOLS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'blog-to-twitter-thread',
    name: 'Blog to Twitter Thread',
    description: 'Convert any blog post into a numbered Twitter/X thread with optimized character counts and hashtags.',
    category: 'ai-repurpose',
    keywords: ['blog', 'twitter', 'thread', 'x', 'social media', 'convert', 'repurpose'],
    processingType: 'client'
  },
  {
    slug: 'blog-to-linkedin-post',
    name: 'Blog to LinkedIn Post',
    description: 'Transform blog articles into engaging LinkedIn posts with hooks, bullets, and hashtags.',
    category: 'ai-repurpose',
    keywords: ['blog', 'linkedin', 'post', 'social media', 'convert', 'professional'],
    processingType: 'client'
  },
  {
    slug: 'article-to-bullet-points',
    name: 'Article to Bullet Points',
    description: 'Summarize any article into clean bullet points using extractive key-sentence analysis.',
    category: 'ai-repurpose',
    keywords: ['article', 'summary', 'bullet points', 'summarize', 'key points', 'extract'],
    processingType: 'client'
  },
  {
    slug: 'youtube-script-to-blog',
    name: 'YouTube Script to Blog',
    description: 'Convert YouTube video scripts and transcripts into structured, SEO-ready blog posts.',
    category: 'ai-repurpose',
    keywords: ['youtube', 'script', 'blog', 'transcript', 'convert', 'video to text'],
    processingType: 'client'
  },
  {
    slug: 'podcast-notes-generator',
    name: 'Podcast Notes Generator',
    description: 'Generate professional podcast show notes with topics, timestamps, and resources from transcripts.',
    category: 'ai-repurpose',
    keywords: ['podcast', 'show notes', 'transcript', 'timestamps', 'generate'],
    processingType: 'client'
  },
  {
    slug: 'email-to-tweet',
    name: 'Email Newsletter to Tweet',
    description: 'Convert email newsletter content into multiple tweet variations with hooks and CTAs.',
    category: 'ai-repurpose',
    keywords: ['email', 'newsletter', 'tweet', 'twitter', 'convert', 'repurpose'],
    processingType: 'client'
  },
  {
    slug: 'long-form-to-short',
    name: 'Long Form to Short Form',
    description: 'Condense long-form content into platform-specific short formats for Twitter, LinkedIn, Instagram, and TikTok.',
    category: 'ai-repurpose',
    keywords: ['long form', 'short form', 'condense', 'social media', 'convert', 'platform'],
    processingType: 'client'
  },
  {
    slug: 'text-to-faq',
    name: 'Text to FAQ Generator',
    description: 'Generate FAQ question-answer pairs from any article with JSON-LD FAQPage schema output.',
    category: 'ai-repurpose',
    keywords: ['text', 'faq', 'generate', 'schema', 'json-ld', 'questions', 'seo'],
    processingType: 'client'
  },
  {
    slug: 'content-to-carousel',
    name: 'Content to Carousel Slides',
    description: 'Transform blog content into slide-by-slide carousel format for LinkedIn and Instagram.',
    category: 'ai-repurpose',
    keywords: ['carousel', 'slides', 'linkedin', 'instagram', 'content', 'convert'],
    processingType: 'client'
  },
  {
    slug: 'meeting-to-actions',
    name: 'Meeting Notes to Action Items',
    description: 'Extract action items, assignees, and deadlines from meeting notes automatically.',
    category: 'ai-repurpose',
    keywords: ['meeting', 'action items', 'notes', 'extract', 'tasks', 'agenda'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEVELOPER UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'typescript-to-js',
    name: 'TypeScript to JavaScript',
    description: 'Strip TypeScript type annotations, interfaces, and generics to get clean JavaScript code.',
    category: 'developer',
    keywords: ['typescript', 'javascript', 'convert', 'strip types', 'ts to js', 'compiler'],
    processingType: 'client'
  },
  {
    slug: 'json-schema-generator',
    name: 'JSON Schema Generator',
    description: 'Auto-generate JSON Schema (Draft-07 / 2020-12) from any JSON object with nested definitions.',
    category: 'developer',
    keywords: ['json', 'schema', 'generate', 'validation', 'api', 'draft-07'],
    processingType: 'client'
  },
  {
    slug: 'sql-to-mongodb',
    name: 'SQL to MongoDB Query',
    description: 'Convert SQL SELECT statements to MongoDB find/aggregate queries with projections and sorting.',
    category: 'developer',
    keywords: ['sql', 'mongodb', 'convert', 'query', 'nosql', 'database', 'migrate'],
    processingType: 'client'
  },
  {
    slug: 'graphql-query-builder',
    name: 'GraphQL Query Builder',
    description: 'Build GraphQL queries, mutations, and fragments visually without writing raw syntax.',
    category: 'developer',
    keywords: ['graphql', 'query', 'builder', 'mutation', 'fragment', 'api', 'visual'],
    processingType: 'client'
  },
  {
    slug: 'docker-compose-generator',
    name: 'Docker Compose Generator',
    description: 'Generate docker-compose.yml files visually with service presets for Nginx, Postgres, Redis, and more.',
    category: 'developer',
    keywords: ['docker', 'compose', 'yaml', 'container', 'nginx', 'postgres', 'redis'],
    processingType: 'client'
  },
  {
    slug: 'dotenv-editor',
    name: '.env File Editor',
    description: 'Parse, edit, and export .env files visually. 100% client-side — your secrets never leave your browser.',
    category: 'developer',
    keywords: ['env', 'dotenv', 'environment', 'variables', 'editor', 'secrets', 'config'],
    processingType: 'client'
  },
  {
    slug: 'gitignore-generator',
    name: 'Git Ignore Generator',
    description: 'Generate .gitignore files by selecting languages and frameworks. Combine templates and download instantly.',
    category: 'developer',
    keywords: ['gitignore', 'git', 'ignore', 'template', 'language', 'framework'],
    processingType: 'client'
  },
  {
    slug: 'chmod-calculator',
    name: 'Chmod Calculator',
    description: 'Calculate Linux file permissions visually. Toggle read/write/execute and get octal + symbolic notation.',
    category: 'developer',
    keywords: ['chmod', 'permissions', 'linux', 'unix', 'file', 'octal', 'symbolic'],
    processingType: 'client'
  },
  {
    slug: 'http-status-codes',
    name: 'HTTP Status Code Reference',
    description: 'Searchable reference for all HTTP status codes (1xx–5xx) with descriptions, causes, and examples.',
    category: 'developer',
    keywords: ['http', 'status', 'code', 'reference', '404', '500', '200', 'api'],
    processingType: 'client'
  },
  {
    slug: 'regex-library',
    name: 'Regex Patterns Library',
    description: '100+ ready-to-use regex patterns for email, phone, URL, dates, IP, and more. Copy and test instantly.',
    category: 'developer',
    keywords: ['regex', 'patterns', 'library', 'email', 'phone', 'url', 'validation'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FINTECH & COMPLIANCE TOOLS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'gst-calculator-india',
    name: 'GST Calculator (India)',
    description: 'Calculate GST with CGST/SGST/IGST breakdown for all slabs (5%, 12%, 18%, 28%). Add or remove GST from any amount.',
    category: 'fintech',
    keywords: ['gst', 'calculator', 'india', 'cgst', 'sgst', 'igst', 'tax', 'goods and services'],
    processingType: 'client'
  },
  {
    slug: 'ppf-calculator',
    name: 'PPF Calculator (India)',
    description: 'Calculate Public Provident Fund maturity with year-by-year breakdown. Latest PPF interest rate with 15-25 year projections.',
    category: 'fintech',
    keywords: ['ppf', 'calculator', 'india', 'public provident fund', 'interest', 'tax saving'],
    processingType: 'client'
  },
  {
    slug: 'sip-stepup-calculator',
    name: 'SIP Step-Up Calculator',
    description: 'Calculate SIP returns with annual step-up increases. Compare regular vs step-up SIP corpus growth over time.',
    category: 'fintech',
    keywords: ['sip', 'step up', 'calculator', 'mutual fund', 'india', 'investment', 'annual increase'],
    processingType: 'client'
  },
  {
    slug: 'fd-calculator-india',
    name: 'FD Interest Calculator (India)',
    description: 'Calculate Fixed Deposit maturity with quarterly/monthly compounding and TDS deduction. Senior citizen rates supported.',
    category: 'fintech',
    keywords: ['fd', 'fixed deposit', 'calculator', 'india', 'interest', 'tds', 'maturity'],
    processingType: 'client'
  },
  {
    slug: 'gratuity-calculator-india',
    name: 'Gratuity Calculator (India)',
    description: 'Calculate gratuity as per Indian law. Enter salary and service years for exact amount with eligibility check.',
    category: 'fintech',
    keywords: ['gratuity', 'calculator', 'india', 'salary', 'service years', 'employment', 'law'],
    processingType: 'client'
  },
  {
    slug: 'nps-calculator-india',
    name: 'NPS Calculator (India)',
    description: 'Calculate NPS corpus and monthly pension at retirement. Estimate annuity and lump sum withdrawal amounts.',
    category: 'fintech',
    keywords: ['nps', 'pension', 'calculator', 'india', 'retirement', 'annuity', 'national pension'],
    processingType: 'client'
  },
  {
    slug: 'vat-calculator',
    name: 'VAT Calculator',
    description: 'Calculate VAT for any country. Add or remove VAT with pre-loaded rates for EU, UK, and 50+ countries.',
    category: 'fintech',
    keywords: ['vat', 'calculator', 'tax', 'eu', 'uk', 'value added tax', 'global'],
    processingType: 'client'
  },
  {
    slug: 'freelance-rate-calculator',
    name: 'Freelance Rate Calculator',
    description: 'Calculate your freelance hourly, daily, and project rates based on income goals, expenses, and taxes.',
    category: 'fintech',
    keywords: ['freelance', 'rate', 'calculator', 'hourly', 'pricing', 'income', 'expenses'],
    processingType: 'client'
  },
  {
    slug: 'roi-calculator',
    name: 'ROI Calculator',
    description: 'Calculate Return on Investment as percentage and absolute gain. Supports annualized ROI for multi-year periods.',
    category: 'fintech',
    keywords: ['roi', 'return', 'investment', 'calculator', 'marketing', 'business', 'profit'],
    processingType: 'client'
  },
  {
    slug: 'markup-vs-margin',
    name: 'Markup vs Margin Calculator',
    description: 'Understand and calculate the difference between markup and margin. Enter cost price and get both instantly.',
    category: 'fintech',
    keywords: ['markup', 'margin', 'calculator', 'pricing', 'profit', 'cost', 'difference'],
    processingType: 'client'
  },
  {
    slug: 'car-loan-emi-calculator-india',
    name: 'Car Loan EMI Calculator (India)',
    description: 'Calculate car loan EMI, total interest, and payment schedule for Indian banks. Compare rates across HDFC, SBI, ICICI.',
    category: 'fintech',
    keywords: ['car loan', 'emi', 'calculator', 'india', 'auto loan', 'vehicle finance', 'interest rate'],
    processingType: 'client'
  },
  {
    slug: 'home-loan-calculator-india',
    name: 'Home Loan Calculator (India)',
    description: 'Calculate home loan EMI and eligibility for Indian banks. Get amortization schedule and tax benefit estimates.',
    category: 'fintech',
    keywords: ['home loan', 'housing loan', 'emi', 'calculator', 'india', 'mortgage', 'property'],
    processingType: 'client'
  },
  {
    slug: 'income-tax-calculator-india',
    name: 'Income Tax Calculator (India)',
    description: 'Calculate income tax under old and new regime for FY 2024-25. Compare tax liability with HRA, 80C, and other deductions.',
    category: 'fintech',
    keywords: ['income tax', 'calculator', 'india', 'fy 2024-25', 'old regime', 'new regime', 'deductions'],
    processingType: 'client'
  },
  {
    slug: 'sip-calculator-india',
    name: 'SIP Calculator (India)',
    description: 'Calculate SIP returns and maturity value for mutual funds. See how monthly investments grow with compound interest.',
    category: 'fintech',
    keywords: ['sip', 'calculator', 'india', 'mutual fund', 'investment', 'returns', 'wealth creation'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LOCAL SEO TOOLS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'local-business-schema',
    name: 'Local Business Schema Generator',
    description: 'Generate LocalBusiness JSON-LD schema for Google rich results. Fill out the form, copy valid structured data.',
    category: 'local-seo',
    keywords: ['local business', 'schema', 'json-ld', 'structured data', 'google', 'rich results'],
    processingType: 'client'
  },
  {
    slug: 'nap-checker',
    name: 'NAP Consistency Checker',
    description: 'Check Name, Address, Phone consistency across business listings. Find and fix mismatches for local SEO.',
    category: 'local-seo',
    keywords: ['nap', 'consistency', 'local seo', 'name', 'address', 'phone', 'citations'],
    processingType: 'client'
  },
  {
    slug: 'review-response-generator',
    name: 'Review Response Generator',
    description: 'Generate professional responses to Google reviews. Templates for positive, negative, and neutral reviews.',
    category: 'local-seo',
    keywords: ['review', 'response', 'google', 'template', 'positive', 'negative', 'business'],
    processingType: 'client'
  },
  {
    slug: 'gmb-post-generator',
    name: 'GMB Post Generator',
    description: 'Create engaging Google Business Profile posts for updates, events, and offers with CTA buttons.',
    category: 'local-seo',
    keywords: ['gmb', 'google my business', 'post', 'business profile', 'update', 'event', 'offer'],
    processingType: 'client'
  },
  {
    slug: 'service-area-schema',
    name: 'Service Area Schema Generator',
    description: 'Generate ServiceAreaBusiness JSON-LD schema for businesses without a storefront. Define service areas by city or radius.',
    category: 'local-seo',
    keywords: ['service area', 'schema', 'json-ld', 'business', 'local seo', 'geo'],
    processingType: 'client'
  },
  {
    slug: 'citation-formatter',
    name: 'Local Citation Formatter',
    description: 'Format business info for local citations across Yelp, BBB, YellowPages, and 10+ directories consistently.',
    category: 'local-seo',
    keywords: ['citation', 'local seo', 'format', 'yelp', 'directory', 'nap', 'listing'],
    processingType: 'client'
  },
  {
    slug: 'local-keywords-generator',
    name: 'Local Keywords Generator',
    description: 'Generate 50+ local SEO keyword variations from a seed keyword and location. "Near me" combos included.',
    category: 'local-seo',
    keywords: ['local', 'keywords', 'generator', 'seo', 'near me', 'city', 'location'],
    processingType: 'client'
  },
  {
    slug: 'hours-schema-generator',
    name: 'Hours of Operation Schema',
    description: 'Generate OpeningHoursSpecification JSON-LD for Google. Set hours per day with lunch breaks and special hours.',
    category: 'local-seo',
    keywords: ['opening hours', 'schema', 'json-ld', 'business hours', 'google', 'local'],
    processingType: 'client'
  },
  {
    slug: 'faq-schema-generator',
    name: 'FAQ Schema Generator',
    description: 'Generate FAQPage JSON-LD schema for Google rich results. Add Q&A pairs and copy valid structured data.',
    category: 'local-seo',
    keywords: ['faq', 'schema', 'json-ld', 'structured data', 'google', 'rich results', 'questions'],
    processingType: 'client'
  },
  {
    slug: 'product-schema-generator',
    name: 'Product Schema Generator',
    description: 'Generate Product JSON-LD schema for Google Shopping rich results with price, reviews, and availability.',
    category: 'local-seo',
    keywords: ['product', 'schema', 'json-ld', 'shopping', 'ecommerce', 'rich results', 'google'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NICHE CALCULATORS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'wedding-budget-calculator',
    name: 'Indian Wedding Budget Calculator',
    description: 'Plan your Indian wedding budget across venue, catering, decor, photography, and more. Track allocation and spending.',
    category: 'niche-calculator',
    keywords: ['wedding', 'budget', 'calculator', 'india', 'planning', 'venue', 'catering'],
    processingType: 'client'
  },
  {
    slug: 'electricity-bill-calculator',
    name: 'Electricity Bill Calculator (India)',
    description: 'Calculate electricity bill with state-wise tariff slabs. Domestic and commercial rates with fuel surcharge.',
    category: 'niche-calculator',
    keywords: ['electricity', 'bill', 'calculator', 'india', 'tariff', 'slab', 'units'],
    processingType: 'client'
  },
  {
    slug: 'paint-calculator',
    name: 'Paint Calculator',
    description: 'Calculate paint needed for walls. Enter room dimensions, number of coats, subtract doors/windows. Get liters and cost.',
    category: 'niche-calculator',
    keywords: ['paint', 'calculator', 'wall', 'square feet', 'liters', 'room', 'coat'],
    processingType: 'client'
  },
  {
    slug: 'fuel-cost-calculator',
    name: 'Fuel Cost Calculator',
    description: 'Calculate fuel cost for road trips. Enter distance, vehicle mileage, and fuel price. Round-trip support.',
    category: 'niche-calculator',
    keywords: ['fuel', 'cost', 'calculator', 'trip', 'mileage', 'petrol', 'diesel', 'road trip'],
    processingType: 'client'
  },
  {
    slug: 'tile-calculator',
    name: 'Tile Calculator',
    description: 'Calculate tiles needed for floors and walls. Enter dimensions, tile size, and wastage percentage for accurate counts.',
    category: 'niche-calculator',
    keywords: ['tile', 'calculator', 'floor', 'wall', 'square feet', 'wastage', 'count'],
    processingType: 'client'
  },
  {
    slug: 'home-loan-affordability',
    name: 'Home Loan Affordability Calculator',
    description: 'Calculate how much home loan you can afford based on income, EMIs, and FOIR rules. India-specific eligibility.',
    category: 'niche-calculator',
    keywords: ['home loan', 'affordability', 'calculator', 'india', 'emi', 'eligibility', 'income'],
    processingType: 'client'
  },
  {
    slug: 'emi-principal-calculator',
    name: 'EMI to Principal Interest Breakdown',
    description: 'See how your EMI splits between principal and interest. Full amortization schedule with month-wise breakdown.',
    category: 'niche-calculator',
    keywords: ['emi', 'principal', 'interest', 'breakdown', 'amortization', 'loan', 'schedule'],
    processingType: 'client'
  },
  {
    slug: 'water-intake-calculator',
    name: 'Daily Water Intake Calculator',
    description: 'Calculate daily water intake based on weight, activity level, and climate. Hourly hydration schedule included.',
    category: 'niche-calculator',
    keywords: ['water', 'intake', 'calculator', 'daily', 'weight', 'hydration', 'health'],
    processingType: 'client'
  },
  {
    slug: 'sleep-cycle-calculator',
    name: 'Sleep Cycle Calculator',
    description: 'Find optimal bedtime or wake time based on 90-minute sleep cycles. Wake up refreshed every morning.',
    category: 'niche-calculator',
    keywords: ['sleep', 'cycle', 'calculator', 'bedtime', 'wake up', 'rem', '90 minutes'],
    processingType: 'client'
  },
  {
    slug: 'carbon-footprint-calculator',
    name: 'Carbon Footprint Calculator',
    description: 'Calculate your carbon footprint from travel, energy, diet, and shopping. India-specific emission factors included.',
    category: 'niche-calculator',
    keywords: ['carbon', 'footprint', 'calculator', 'emissions', 'india', 'environment', 'co2'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BUSINESS & PRODUCTIVITY TOOLS (BATCH 2)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'meeting-cost-calculator',
    name: 'Meeting Cost Calculator',
    description: 'Calculate the true cost of meetings based on attendee salaries and duration. Optimize team productivity.',
    category: 'business',
    keywords: ['meeting', 'cost', 'calculator', 'salary', 'productivity', 'time', 'team'],
    processingType: 'client'
  },
  {
    slug: 'pricing-calculator',
    name: 'Product Pricing Calculator',
    description: 'Calculate optimal product pricing with cost, markup, and profit margin analysis.',
    category: 'business',
    keywords: ['pricing', 'calculator', 'product', 'markup', 'profit', 'margin', 'cost'],
    processingType: 'client'
  },
  {
    slug: 'invoice-number-generator',
    name: 'Invoice Number Generator',
    description: 'Generate sequential invoice numbers with customizable prefixes and formats.',
    category: 'business',
    keywords: ['invoice', 'number', 'generator', 'sequential', 'prefix', 'business', 'billing'],
    processingType: 'client'
  },
  {
    slug: 'business-name-generator',
    name: 'Business Name Generator',
    description: 'Generate creative business name ideas based on keywords, industry, and style preferences.',
    category: 'business',
    keywords: ['business name', 'generator', 'startup', 'brand', 'company', 'creative'],
    processingType: 'client'
  },
  {
    slug: 'swot-analysis-generator',
    name: 'SWOT Analysis Generator',
    description: 'Create structured SWOT analysis for business planning. Export as PDF or share link.',
    category: 'business',
    keywords: ['swot', 'analysis', 'strengths', 'weaknesses', 'opportunities', 'threats', 'business'],
    processingType: 'client'
  },
  {
    slug: 'payroll-calculator',
    name: 'Payroll Calculator',
    description: 'Calculate employee payroll with deductions, taxes, and net salary. India-specific PF and ESI support.',
    category: 'business',
    keywords: ['payroll', 'calculator', 'salary', 'deductions', 'pf', 'esi', 'employee'],
    processingType: 'client'
  },
  {
    slug: 'working-days-calculator',
    name: 'Working Days Calculator',
    description: 'Calculate working days between dates excluding weekends and Indian holidays.',
    category: 'business',
    keywords: ['working days', 'calculator', 'business days', 'holidays', 'india', 'date'],
    processingType: 'client'
  },
  {
    slug: 'contract-generator',
    name: 'Contract Generator',
    description: 'Generate basic freelance and service contracts with customizable terms and conditions.',
    category: 'business',
    keywords: ['contract', 'generator', 'freelance', 'agreement', 'terms', 'legal', 'template'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DESIGN & CREATIVE TOOLS (BATCH 2)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Calculator',
    description: 'Calculate aspect ratios and resize dimensions while maintaining proportions.',
    category: 'design',
    keywords: ['aspect ratio', 'calculator', 'dimensions', 'resize', 'proportion', 'video', 'image'],
    processingType: 'client'
  },
  {
    slug: 'svg-to-png',
    name: 'SVG to PNG Converter',
    description: 'Convert SVG vector graphics to PNG images with custom resolution and background.',
    category: 'image',
    keywords: ['svg', 'png', 'converter', 'vector', 'image', 'resolution', 'export'],
    processingType: 'client'
  },
  {
    slug: 'favicon-generator',
    name: 'Favicon Generator',
    description: 'Generate favicons in all sizes from a single image. Includes ICO, PNG, and Apple Touch icons.',
    category: 'design',
    keywords: ['favicon', 'generator', 'icon', 'ico', 'apple touch', 'website', 'browser'],
    processingType: 'client'
  },
  {
    slug: 'pixel-to-rem',
    name: 'Pixel to REM Converter',
    description: 'Convert pixels to REM units for responsive web design. Customizable base font size.',
    category: 'design',
    keywords: ['pixel', 'rem', 'converter', 'css', 'responsive', 'font size', 'web design'],
    processingType: 'client'
  },
  {
    slug: 'box-shadow-generator',
    name: 'CSS Box Shadow Generator',
    description: 'Create and preview CSS box shadows with visual controls. Copy ready-to-use code.',
    category: 'design',
    keywords: ['box shadow', 'css', 'generator', 'shadow', 'blur', 'spread', 'web design'],
    processingType: 'client'
  },
  {
    slug: 'border-radius-generator',
    name: 'Border Radius Generator',
    description: 'Create custom border radius shapes with visual preview. Generate CSS code instantly.',
    category: 'design',
    keywords: ['border radius', 'css', 'generator', 'rounded', 'corners', 'shape', 'web design'],
    processingType: 'client'
  },
  {
    slug: 'color-shades-generator',
    name: 'Color Shades Generator',
    description: 'Generate lighter and darker shades of any color. Perfect for creating color palettes.',
    category: 'design',
    keywords: ['color', 'shades', 'generator', 'tint', 'palette', 'lighter', 'darker'],
    processingType: 'client'
  },
  {
    slug: 'glassmorphism-generator',
    name: 'Glassmorphism Generator',
    description: 'Create glassmorphism effects with visual preview. Generate CSS for frosted glass UI.',
    category: 'design',
    keywords: ['glassmorphism', 'css', 'generator', 'frosted', 'glass', 'blur', 'ui design'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEVELOPER TOOLS (BATCH 3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'html-to-markdown',
    name: 'HTML to Markdown Converter',
    description: 'Convert HTML to clean Markdown format. Preserves links, images, and formatting.',
    category: 'developer',
    keywords: ['html', 'markdown', 'converter', 'md', 'format', 'text', 'documentation'],
    processingType: 'client'
  },
  {
    slug: 'json-to-typescript',
    name: 'JSON to TypeScript Types',
    description: 'Generate TypeScript interfaces from JSON data. Supports nested objects and arrays.',
    category: 'developer',
    keywords: ['json', 'typescript', 'types', 'interface', 'converter', 'code', 'generation'],
    processingType: 'client'
  },
  {
    slug: 'sql-to-prisma',
    name: 'SQL to Prisma Schema',
    description: 'Convert SQL DDL statements to Prisma schema format for modern database workflows.',
    category: 'developer',
    keywords: ['sql', 'prisma', 'schema', 'converter', 'database', 'orm', 'ddl'],
    processingType: 'client'
  },
  {
    slug: 'css-to-tailwind',
    name: 'CSS to Tailwind Converter',
    description: 'Convert vanilla CSS to Tailwind CSS classes. Map common CSS properties to utility classes.',
    category: 'developer',
    keywords: ['css', 'tailwind', 'converter', 'utility', 'classes', 'postcss', 'design'],
    processingType: 'client'
  },
  {
    slug: 'npm-package-checker',
    name: 'NPM Package Checker',
    description: 'Check NPM package stats, downloads, dependencies, and security vulnerabilities.',
    category: 'developer',
    keywords: ['npm', 'package', 'checker', 'downloads', 'dependencies', 'security', 'node'],
    processingType: 'client'
  },
  {
    slug: 'curl-to-fetch',
    name: 'cURL to Fetch Converter',
    description: 'Convert cURL commands to JavaScript fetch code. Supports headers, body, and auth.',
    category: 'developer',
    keywords: ['curl', 'fetch', 'converter', 'javascript', 'http', 'request', 'api'],
    processingType: 'client'
  },
  {
    slug: 'json-to-go',
    name: 'JSON to Go Struct',
    description: 'Generate Go struct definitions from JSON data with proper field tags.',
    category: 'developer',
    keywords: ['json', 'go', 'golang', 'struct', 'converter', 'types', 'code'],
    processingType: 'client'
  },
  {
    slug: 'base64-image-encoder',
    name: 'Base64 Image Encoder',
    description: 'Convert images to Base64 encoded data URIs for embedding in HTML/CSS.',
    category: 'developer',
    keywords: ['base64', 'image', 'encoder', 'data uri', 'embed', 'html', 'css'],
    processingType: 'client'
  },
  {
    slug: 'git-command-generator',
    name: 'Git Command Generator',
    description: 'Generate complex Git commands with visual interface. Supports branching, rebasing, cherry-pick.',
    category: 'developer',
    keywords: ['git', 'command', 'generator', 'branch', 'rebase', 'cherry-pick', 'merge'],
    processingType: 'client'
  },
  {
    slug: 'env-to-json',
    name: 'ENV to JSON Converter',
    description: 'Convert .env environment files to JSON format and vice versa.',
    category: 'developer',
    keywords: ['env', 'json', 'converter', 'environment', 'config', 'dotenv', 'settings'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MATH & SCIENCE TOOLS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'scientific-calculator',
    name: 'Scientific Calculator',
    description: 'Full-featured scientific calculator with trigonometry, logarithms, and memory functions.',
    category: 'math',
    keywords: ['scientific', 'calculator', 'math', 'trigonometry', 'logarithm', 'sine', 'cosine'],
    processingType: 'client'
  },
  {
    slug: 'fraction-calculator',
    name: 'Fraction Calculator',
    description: 'Add, subtract, multiply, and divide fractions. Simplify and convert to decimals.',
    category: 'math',
    keywords: ['fraction', 'calculator', 'add', 'subtract', 'simplify', 'decimal', 'math'],
    processingType: 'client'
  },
  {
    slug: 'quadratic-equation-solver',
    name: 'Quadratic Equation Solver',
    description: 'Solve quadratic equations and find roots. Shows step-by-step solution.',
    category: 'math',
    keywords: ['quadratic', 'equation', 'solver', 'roots', 'formula', 'algebra', 'math'],
    processingType: 'client'
  },
  {
    slug: 'matrix-calculator',
    name: 'Matrix Calculator',
    description: 'Perform matrix operations: addition, multiplication, determinant, inverse.',
    category: 'math',
    keywords: ['matrix', 'calculator', 'determinant', 'inverse', 'multiplication', 'linear algebra'],
    processingType: 'client'
  },
  {
    slug: 'probability-calculator',
    name: 'Probability Calculator',
    description: 'Calculate probabilities for various events and distributions.',
    category: 'math',
    keywords: ['probability', 'calculator', 'statistics', 'chance', 'odds', 'distribution'],
    processingType: 'client'
  },
  {
    slug: 'area-calculator',
    name: 'Area Calculator',
    description: 'Calculate area of various shapes: circle, triangle, rectangle, trapezoid, and more.',
    category: 'math',
    keywords: ['area', 'calculator', 'circle', 'triangle', 'rectangle', 'geometry', 'shape'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HEALTH & FITNESS TOOLS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    description: 'Estimate body fat percentage using Navy method. Enter measurements for accurate results.',
    category: 'health',
    keywords: ['body fat', 'calculator', 'percentage', 'navy method', 'fitness', 'health'],
    processingType: 'client'
  },
  {
    slug: 'ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    description: 'Calculate your ideal weight based on height, age, and gender using multiple formulas.',
    category: 'health',
    keywords: ['ideal weight', 'calculator', 'bmi', 'height', 'health', 'fitness', 'goal'],
    processingType: 'client'
  },
  {
    slug: 'macro-calculator',
    name: 'Macro Calculator',
    description: 'Calculate daily macronutrient needs (protein, carbs, fat) based on your fitness goals.',
    category: 'health',
    keywords: ['macro', 'calculator', 'protein', 'carbs', 'fat', 'diet', 'fitness'],
    processingType: 'client'
  },
  {
    slug: 'heart-rate-zone-calculator',
    name: 'Heart Rate Zone Calculator',
    description: 'Calculate target heart rate zones for optimal cardio training.',
    category: 'health',
    keywords: ['heart rate', 'zone', 'calculator', 'cardio', 'training', 'fitness', 'max hr'],
    processingType: 'client'
  },
  {
    slug: 'pregnancy-due-date-calculator',
    name: 'Pregnancy Due Date Calculator',
    description: 'Calculate estimated due date and pregnancy milestones from last period or conception date.',
    category: 'health',
    keywords: ['pregnancy', 'due date', 'calculator', 'conception', 'trimester', 'baby', 'weeks'],
    processingType: 'client'
  },
  {
    slug: 'pace-calculator',
    name: 'Running Pace Calculator',
    description: 'Calculate running pace, time, or distance for marathons and training.',
    category: 'health',
    keywords: ['pace', 'calculator', 'running', 'marathon', 'training', 'speed', 'distance'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WRITING & CONTENT TOOLS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'headline-analyzer',
    name: 'Headline Analyzer',
    description: 'Analyze headlines for emotional appeal, power words, and click-worthiness.',
    category: 'writing',
    keywords: ['headline', 'analyzer', 'title', 'ctr', 'emotional', 'power words', 'seo'],
    processingType: 'client'
  },
  {
    slug: 'reading-time-calculator',
    name: 'Reading Time Calculator',
    description: 'Calculate estimated reading time for articles and blog posts.',
    category: 'writing',
    keywords: ['reading time', 'calculator', 'minutes', 'article', 'blog', 'content', 'medium'],
    processingType: 'client'
  },
  {
    slug: 'cta-generator',
    name: 'Call to Action Generator',
    description: 'Generate compelling CTAs for landing pages, emails, and ads.',
    category: 'writing',
    keywords: ['cta', 'generator', 'call to action', 'button', 'conversion', 'marketing', 'copy'],
    processingType: 'client'
  },
  {
    slug: 'bio-generator',
    name: 'Professional Bio Generator',
    description: 'Generate professional bios for LinkedIn, Twitter, and websites.',
    category: 'writing',
    keywords: ['bio', 'generator', 'professional', 'linkedin', 'twitter', 'about me', 'profile'],
    processingType: 'client'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITY CONVERTERS (BATCH 2)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'temperature-converter',
    name: 'Temperature Converter',
    description: 'Convert between Celsius, Fahrenheit, and Kelvin temperatures.',
    category: 'converter',
    keywords: ['temperature', 'converter', 'celsius', 'fahrenheit', 'kelvin', 'degrees'],
    processingType: 'client'
  },
  {
    slug: 'speed-converter',
    name: 'Speed Converter',
    description: 'Convert speed between km/h, mph, m/s, knots, and more.',
    category: 'converter',
    keywords: ['speed', 'converter', 'kmph', 'mph', 'velocity', 'knots', 'meters'],
    processingType: 'client'
  },
  {
    slug: 'weight-converter',
    name: 'Weight Converter',
    description: 'Convert weight between kg, lbs, ounces, grams, and stones.',
    category: 'converter',
    keywords: ['weight', 'converter', 'kg', 'lbs', 'pounds', 'grams', 'ounces'],
    processingType: 'client'
  },
  {
    slug: 'length-converter',
    name: 'Length Converter',
    description: 'Convert length between meters, feet, inches, miles, and kilometers.',
    category: 'converter',
    keywords: ['length', 'converter', 'meters', 'feet', 'inches', 'miles', 'cm'],
    processingType: 'client'
  },
  {
    slug: 'data-size-converter',
    name: 'Data Size Converter',
    description: 'Convert between bytes, KB, MB, GB, TB with binary and decimal units.',
    category: 'converter',
    keywords: ['data size', 'converter', 'bytes', 'megabytes', 'gigabytes', 'storage'],
    processingType: 'client'
  },
  {
    slug: 'number-to-words',
    name: 'Number to Words Converter',
    description: 'Convert numbers to written words in English and Hindi for cheques and documents.',
    category: 'converter',
    keywords: ['number', 'words', 'converter', 'cheque', 'english', 'hindi', 'amount'],
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

/**
 * Resolve effective rollout status for a tool using:
 * 1) explicit inline values in TOOLS_REGISTRY (highest priority)
 * 2) generated status map from readiness audit
 * 3) safe defaults
 */
export function getToolRolloutStatus(tool: ToolMeta): {
  implementationStatus: 'planned' | 'in-progress' | 'ready';
  indexingStatus: 'index' | 'noindex';
} {
  const mapStatus = TOOL_STATUS_MAP[tool.slug];

  const implementationStatus = tool.implementationStatus
    ?? mapStatus?.implementationStatus
    ?? 'ready';

  const indexingStatus = tool.indexingStatus
    ?? mapStatus?.indexingStatus
    ?? (implementationStatus === 'ready' ? 'index' : 'noindex');

  return {
    implementationStatus,
    indexingStatus,
  };
}

/**
 * A tool is indexable only when it's implementation-ready and not explicitly noindexed.
 * Defaults preserve existing behavior for legacy entries.
 */
export function isToolIndexable(tool: ToolMeta): boolean {
  const status = getToolRolloutStatus(tool);
  return status.implementationStatus === 'ready' && status.indexingStatus === 'index';
}

/**
 * Returns tools that should be submitted to search engines and included in sitemap.
 */
export function getIndexableTools(): ToolMeta[] {
  return TOOLS_REGISTRY.filter(isToolIndexable);
}
