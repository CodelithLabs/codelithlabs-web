// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/types/blog.ts
// Type definitions for the markdown-based blog system
// ═══════════════════════════════════════════════════════════════════════════

export interface BlogFrontmatter {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  author: string;
  /** Optional category tag for filtering */
  category?: string;
  /** Tags for related-post matching */
  tags?: string[];
  /** Reading time in minutes (auto-computed if omitted) */
  readingTime?: number;
  /** Whether the post should appear in listings */
  draft?: boolean;
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  /** Full rendered HTML body */
  contentHtml: string;
  /** Raw markdown body (for word count / reading time) */
  rawContent: string;
}
