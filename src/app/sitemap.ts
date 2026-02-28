// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/sitemap.ts
// Dynamic XML sitemap generation for Google Search Console
// Auto-generates from tools-registry.ts - scales to 1000+ tools
// ═══════════════════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';
import { getAllBlogPosts } from '@/lib/blog-loader';

export const dynamic = "force-static";

const BASE_URL = 'https://codelithlabs.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // ═══════════════════════════════════════════════════════════════
  // STATIC PAGES - High priority, frequently updated
  // ═══════════════════════════════════════════════════════════════
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/hire-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/research`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/team`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/tech-stack`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY PAGES - Dedicated landing pages for SEO
  // ═══════════════════════════════════════════════════════════════
  const categories = Array.from(new Set(TOOLS_REGISTRY.map(tool => tool.category)));
  const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${BASE_URL}/tools/category/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // ═══════════════════════════════════════════════════════════════
  // TOOL PAGES - One entry per tool (199+ and counting)
  // Priority based on category importance for SEO
  // ═══════════════════════════════════════════════════════════════
  const toolPages: MetadataRoute.Sitemap = TOOLS_REGISTRY.map(tool => {
    // Assign priority based on tool category
    const priorityMap: Record<string, number> = {
      'developer': 0.8,  // High demand
      'converter': 0.8,  // High demand
      'generator': 0.8,  // High demand
      'text': 0.7,
      'image': 0.7,
      'formatter': 0.6,
      'calculator': 0.6,
      'encoder': 0.6,
      'security': 0.6,
      'seo': 0.6,
    };

    return {
      url: `${BASE_URL}/tools/${tool.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: priorityMap[tool.category] || 0.6,
    };
  });

  // ═══════════════════════════════════════════════════════════════
  // BLOG POST PAGES
  // ═══════════════════════════════════════════════════════════════
  const blogPosts = await getAllBlogPosts();
  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${BASE_URL}/blog/${post.frontmatter.slug}`,
    lastModified: new Date(post.frontmatter.dateModified || post.frontmatter.datePublished),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // ═══════════════════════════════════════════════════════════════
  // COMBINE ALL PAGES
  // ═══════════════════════════════════════════════════════════════
  return [
    ...staticPages,
    ...categoryPages,
    ...toolPages,
    ...blogPages,
  ];
}
