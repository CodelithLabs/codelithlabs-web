// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/sitemap.ts
// Dynamic XML sitemap generation for Google Search Console
// Auto-generates from tools-registry.ts - scales to 1000+ tools
// ═══════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';
import { TOOLS_REGISTRY, getIndexableTools } from '@/lib/tools-registry';
import { getAllBlogPosts } from '@/lib/blog-loader';

export const dynamic = 'force-static';

const BASE_URL = 'https://codelithlabs.in';
const DEFAULT_LAST_MODIFIED = new Date('2026-03-01T00:00:00.000Z');

function withTrailingSlash(pathname: string): string {
  if (!pathname || pathname === '/') {
    return BASE_URL;
  }

  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${BASE_URL}${normalizedPath.replace(/\/+$/, '')}/`;
}

function parseDateOrFallback(input: string | undefined, fallback: Date): Date {
  if (!input) return fallback;

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function getToolLastModifiedMap(): Map<string, Date> {
  const map = new Map<string, Date>();
  const toolsContentDir = path.join(process.cwd(), 'content', 'tools');

  for (const tool of TOOLS_REGISTRY) {
    const filePath = path.join(toolsContentDir, `${tool.slug}.md`);
    if (!fs.existsSync(filePath)) continue;

    const stat = fs.statSync(filePath);
    map.set(tool.slug, stat.mtime);
  }

  return map;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getAllBlogPosts();
  const toolLastModifiedMap = getToolLastModifiedMap();
  const indexableTools = getIndexableTools();

  const latestBlogContentDate = blogPosts.reduce<Date>(
    (latest, post) => {
      const date = parseDateOrFallback(
        post.frontmatter.dateModified || post.frontmatter.datePublished,
        DEFAULT_LAST_MODIFIED,
      );
      return date > latest ? date : latest;
    },
    DEFAULT_LAST_MODIFIED,
  );

  const latestToolContentDate = Array.from(toolLastModifiedMap.values()).reduce<Date>(
    (latest, date) => (date > latest ? date : latest),
    DEFAULT_LAST_MODIFIED,
  );

  const siteLastModified = latestBlogContentDate > latestToolContentDate
    ? latestBlogContentDate
    : latestToolContentDate;

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: siteLastModified, changeFrequency: 'daily', priority: 1.0 },
    { url: withTrailingSlash('/tools'), lastModified: siteLastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: withTrailingSlash('/about'), lastModified: siteLastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: withTrailingSlash('/contact'), lastModified: siteLastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: withTrailingSlash('/privacy'), lastModified: siteLastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: withTrailingSlash('/terms'), lastModified: siteLastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: withTrailingSlash('/blog'), lastModified: latestBlogContentDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: withTrailingSlash('/hire-us'), lastModified: siteLastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: withTrailingSlash('/pricing'), lastModified: siteLastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: withTrailingSlash('/research'), lastModified: siteLastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: withTrailingSlash('/team'), lastModified: siteLastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: withTrailingSlash('/projects'), lastModified: siteLastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: withTrailingSlash('/tech-stack'), lastModified: siteLastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: withTrailingSlash('/transparency'), lastModified: siteLastModified, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const categories = Array.from(new Set(indexableTools.map((tool) => tool.category)));
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: withTrailingSlash(`/tools/category/${category}`),
    lastModified: latestToolContentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const priorityMap: Record<string, number> = {
    developer: 0.8,
    converter: 0.8,
    generator: 0.8,
    text: 0.7,
    image: 0.7,
    formatter: 0.6,
    calculator: 0.6,
    encoder: 0.6,
    security: 0.6,
    seo: 0.6,
  };

  const toolPages: MetadataRoute.Sitemap = indexableTools.map((tool) => ({
    url: withTrailingSlash(`/tools/${tool.slug}`),
    lastModified: toolLastModifiedMap.get(tool.slug) ?? latestToolContentDate,
    changeFrequency: 'weekly',
    priority: priorityMap[tool.category] ?? 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: withTrailingSlash(`/blog/${post.frontmatter.slug}`),
    lastModified: parseDateOrFallback(post.frontmatter.dateModified || post.frontmatter.datePublished, latestBlogContentDate),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const projectSlugs = ['vectordefense', 'citk-connect'];
  const projectPages: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: withTrailingSlash(`/projects/${slug}`),
    lastModified: siteLastModified,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPages, ...projectPages];
}
