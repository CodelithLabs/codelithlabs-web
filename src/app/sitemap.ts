// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/sitemap.ts
// Dynamic XML sitemap generation for Google Search Console
// Auto-generates from tools-registry.ts - scales to 1000+ tools
// Includes all locale variants (en, es, pt, fr, de, hi)
// ═══════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';
import { TOOLS_REGISTRY, getIndexableTools } from '@/lib/tools-registry';
import { getAllBlogPosts } from '@/lib/blog-loader';
import { locales, type Locale } from '@/i18n/request';

export const dynamic = 'force-static';

const BASE_URL = 'https://codelithlabs.in';
const DEFAULT_LAST_MODIFIED = new Date('2026-03-01T00:00:00.000Z');

function withLocaleAndTrailingSlash(locale: Locale, pathname: string): string {
  if (!pathname || pathname === '/') {
    return `${BASE_URL}/${locale}/`;
  }

  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${BASE_URL}/${locale}${normalizedPath.replace(/\/+$/, '')}/`;
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

  // Static pages paths (without locale prefix)
  const staticPagePaths = [
    '/',
    '/tools',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/refund',
    '/blog',
    '/pricing',
    '/premium',
    '/research',
    '/team',
    '/projects',
    '/tech-stack',
    '/transparency',
  ];

  // Generate static pages for all locales
  const staticPages: MetadataRoute.Sitemap = staticPagePaths.flatMap((pagePath) =>
    locales.map((locale) => {
      let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
      let priority = 0.5;
      
      if (pagePath === '/') {
        changeFrequency = 'daily';
        priority = 1.0;
      } else if (pagePath === '/tools') {
        changeFrequency = 'daily';
        priority = 0.9;
      } else if (pagePath === '/blog') {
        changeFrequency = 'weekly';
        priority = 0.7;
      } else if (pagePath === '/pricing' || pagePath === '/premium') {
        priority = 0.7;
      } else if (['/privacy', '/terms', '/refund'].includes(pagePath)) {
        changeFrequency = 'yearly';
        priority = 0.3;
      } else if (pagePath === '/transparency') {
        priority = 0.4;
      }

      const lastModified = pagePath === '/blog' ? latestBlogContentDate : siteLastModified;

      return {
        url: withLocaleAndTrailingSlash(locale, pagePath),
        lastModified,
        changeFrequency,
        priority,
      };
    })
  );

  // Generate category pages for all locales
  const categories = Array.from(new Set(indexableTools.map((tool) => tool.category)));
  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((category) =>
    locales.map((locale) => ({
      url: withLocaleAndTrailingSlash(locale, `/tools/category/${category}`),
      lastModified: latestToolContentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

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

  // Generate tool pages for all locales
  const toolPages: MetadataRoute.Sitemap = indexableTools.flatMap((tool) =>
    locales.map((locale) => ({
      url: withLocaleAndTrailingSlash(locale, `/tools/${tool.slug}`),
      lastModified: toolLastModifiedMap.get(tool.slug) ?? latestToolContentDate,
      changeFrequency: 'weekly' as const,
      priority: priorityMap[tool.category] ?? 0.6,
    }))
  );

  // Generate blog pages for all locales
  const blogPages: MetadataRoute.Sitemap = blogPosts.flatMap((post) =>
    locales.map((locale) => ({
      url: withLocaleAndTrailingSlash(locale, `/blog/${post.frontmatter.slug}`),
      lastModified: parseDateOrFallback(
        post.frontmatter.dateModified || post.frontmatter.datePublished,
        latestBlogContentDate
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  // Generate project pages for all locales
  const projectSlugs = ['vectordefense', 'citk-connect'];
  const projectPages: MetadataRoute.Sitemap = projectSlugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: withLocaleAndTrailingSlash(locale, `/projects/${slug}`),
      lastModified: siteLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  );

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPages, ...projectPages];
}
