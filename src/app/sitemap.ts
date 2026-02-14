// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/sitemap.ts
// Dynamic XML sitemap generation for Google Search Console
// Auto-generates from tools-registry.ts - scales to 1000+ tools
// ═══════════════════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';

const BASE_URL = 'https://codelithlabs.in';

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY PAGES - Medium priority
  // ═══════════════════════════════════════════════════════════════
  const categories = Array.from(new Set(TOOLS_REGISTRY.map(tool => tool.category)));
  const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${BASE_URL}/tools?category=${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
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
  // COMBINE ALL PAGES
  // ═══════════════════════════════════════════════════════════════
  return [
    ...staticPages,
    ...categoryPages,
    ...toolPages,
  ];
}
