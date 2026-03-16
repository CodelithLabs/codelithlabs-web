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

const CATEGORY_CLUSTER_TAG: Record<string, string> = {
  developer: "developer tools",
  security: "security best practices",
  finance: "fintech",
  tools: "online tools",
  writing: "content optimization",
  design: "ui design",
  health: "health tools",
};

/** Estimate reading time in minutes from raw markdown */
function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}

function normalizeTags(fm: BlogFrontmatter): string[] {
  const sourceTags = Array.isArray(fm.tags) ? fm.tags : [];
  const normalized = sourceTags
    .map((tag) => tag?.toString().trim().toLowerCase())
    .filter((tag): tag is string => Boolean(tag));

  const categoryKey = fm.category?.toString().trim().toLowerCase();
  const clusterTag = categoryKey ? CATEGORY_CLUSTER_TAG[categoryKey] : undefined;

  if (clusterTag && !normalized.includes(clusterTag)) {
    normalized.push(clusterTag);
  }

  return [...new Set(normalized)];
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
      tags: normalizeTags(fm),
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

/**
 * Return top related posts based on category + tag overlap.
 */
export async function getRelatedBlogPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  const current = posts.find((post) => post.frontmatter.slug === slug);
  if (!current) return [];

  const currentTags = new Set(current.frontmatter.tags ?? []);
  const currentCategory = current.frontmatter.category?.toLowerCase() ?? "";

  const scored = posts
    .filter((post) => post.frontmatter.slug !== slug)
    .map((post) => {
      const candidateTags = post.frontmatter.tags ?? [];
      const overlap = candidateTags.reduce((score, tag) => score + (currentTags.has(tag) ? 1 : 0), 0);
      const sameCategory = (post.frontmatter.category?.toLowerCase() ?? "") === currentCategory ? 2 : 0;
      return {
        post,
        score: overlap + sameCategory,
        freshness: new Date(post.frontmatter.datePublished).getTime(),
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.freshness - a.freshness;
    })
    .slice(0, limit)
    .map((entry) => entry.post);

  return scored;
}
