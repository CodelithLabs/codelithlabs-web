# Wave-3 Launch List (Auto-Derived)

Generated: 2026-03-03T02:09:45.535Z

This list is auto-derived from `recommendations.readyIndexCandidates` in `docs/reports/tool-readiness-report.json`.
Selection strategy: category coverage first, then balanced round-robin fill.

## Selection Settings

- wave: 3
- size: 25
- excludeSimilarIntent: true
- similarityThreshold: 2
- minCategoryQuota: 1
- progressiveFallback: true
- selectedFallbackStage: relaxed-threshold-plus-1
- previouslyLaunchedExcluded: 61
- availableCandidatesAfterFilters: 31
- excludedBySimilarity: 6

## Progressive Fallback Stages

- strict (threshold=2) → kept=9, excluded=28
- relaxed-remove-mixed-overlap (threshold=2) → kept=23, excluded=14
- relaxed-threshold-plus-1 (threshold=3) → kept=31, excluded=6

## Prior Wave Sources Used

- wave-1 (baseline) → `docs\reports\wave-1-launch-list.md` [25]
- wave-2 (baseline) → `docs\reports\wave-2-launch-list.md` [25]
- wave-2 (dedupe) → `docs\reports\wave-2-launch-list-dedupe.md` [25]

## Category Mix

- ai: 4
- converter: 4
- developer: 5
- finance: 5
- image: 4
- seo: 2
- text: 1

## Wave-3 Tools (25)

| # | Tool | Slug | Category | Processing |
|---|------|------|----------|------------|
| 1 | Expense Splitter | `expense-splitter` | finance | client |
| 2 | JSON Formatter & Validator | `json-formatter` | developer | client |
| 3 | Text Paraphraser | `paraphraser` | ai | client |
| 4 | JSON to YAML Converter | `json-to-yaml` | converter | client |
| 5 | Image to Base64 | `image-to-base64` | image | client |
| 6 | Robots.txt Generator | `robots-txt-generator` | seo | client |
| 7 | Word Counter | `word-counter` | text | client |
| 8 | Gold & Silver Price Calculator | `gold-silver-calculator` | finance | client |
| 9 | JSON Path Finder | `json-path-finder` | developer | client |
| 10 | Sentiment Analyzer | `sentiment-analyzer` | ai | client |
| 11 | Markdown to HTML | `markdown-to-html` | converter | client |
| 12 | Image Watermark | `image-watermark` | image | client |
| 13 | Sitemap XML Generator | `sitemap-generator` | seo | client |
| 14 | Investment Comparator (India) | `investment-comparator` | finance | client |
| 15 | JWT Decoder | `jwt-decoder` | developer | client |
| 16 | Text Summarizer | `text-summarizer` | ai | client |
| 17 | Roman Numeral Converter | `roman-numeral` | converter | client |
| 18 | JPG to PNG Converter | `jpg-to-png` | image | client |
| 19 | Invoice Generator | `invoice-generator` | finance | client |
| 20 | README Generator | `readme-generator` | developer | client |
| 21 | Text to Speech | `text-to-speech` | ai | client |
| 22 | Unit Converter | `unit-converter` | converter | client |
| 23 | WebP Converter | `webp-converter` | image | client |
| 24 | Retirement Calculator (India) | `retirement-calculator` | finance | client |
| 25 | Regex Pattern Generator | `regex-generator` | developer | client |

## Similarity Exclusions (top 10)

- `image-resizer` (similar to `social-media-resizer`)
- `lat-long-finder` (similar to `coordinate-converter`)
- `mortgage-calculator` (similar to `loan-calculator`)
- `png-to-jpg` (similar to `pdf-to-image`)
- `profit-margin-calculator` (similar to `breakeven-calculator`)
- `world-clock` (similar to `timezone-converter`)
