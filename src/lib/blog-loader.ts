// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/blog-loader.ts
// Reads blog posts from content/blog/*.md at build time
// ═══════════════════════════════════════════════════════════════════════════

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { BlogPost, BlogFrontmatter } from "@/types/blog";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Estimate reading time in minutes from raw markdown */
function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}

/**
 * Load a single blog post by slug.
 * Returns null if file doesn't exist or is marked draft.
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as BlogFrontmatter;

  if (fm.draft) return null;

  const result = await remark().use(html).process(content);

  return {
    frontmatter: {
      ...fm,
      slug: fm.slug || slug,
      readingTime: fm.readingTime ?? estimateReadingTime(content),
    },
    contentHtml: result.toString(),
    rawContent: content,
  };
}

/**
 * Return all published blog posts sorted by datePublished (newest first).
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const post = await getBlogPost(slug);
    if (post) posts.push(post);
  }

  posts.sort(
    (a, b) =>
      new Date(b.frontmatter.datePublished).getTime() -
      new Date(a.frontmatter.datePublished).getTime()
  );

  return posts;
}

/**
 * Return all published blog slugs (for generateStaticParams).
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getAllBlogPosts();
  return posts.map((p) => p.frontmatter.slug);
}
