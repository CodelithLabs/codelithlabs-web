// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/types/tool-content.ts
// Type definitions for parsed markdown tool content
// ═══════════════════════════════════════════════════════════════════════════

export interface ToolContentFrontmatter {
  title: string;
  description: string;
  keywords: string[];
  category: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  author: string;
}

/** A single FAQ entry parsed from the markdown */
export interface FAQEntry {
  question: string;
  answer: string;
}

/**
 * Parsed markdown content split into named SEO sections.
 * Each section is raw HTML (already converted from markdown).
 * Returns null values for sections that don't exist in the .md file.
 */
export interface ToolContent {
  frontmatter: ToolContentFrontmatter;
  /** "## Features" section HTML */
  features: string | null;
  /** "## How to Use" section HTML */
  howToUse: string | null;
  /** "## Common Use Cases" section HTML */
  commonUseCases: string | null;
  /** "## Why Choose CodelithLabs" section HTML */
  whyChoose: string | null;
  /** "## Technical Details" section HTML */
  technicalDetails: string | null;
  /** "## Best Practices" section HTML */
  bestPractices: string | null;
  /** Parsed FAQ entries from "## Frequently Asked Questions" */
  faq: FAQEntry[];
  /** Full rendered HTML body (all sections) */
  fullHtml: string;
}
