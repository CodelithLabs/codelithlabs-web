// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/api/indexnow/route.ts
// IndexNow API endpoint — submits URLs to Bing/Yandex/search engines
// POST /api/indexnow  (requires INDEXNOW_SECRET Bearer token)
// GET  /api/indexnow  (returns info/status)
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { getIndexableTools } from '@/lib/tools-registry';
import { locales } from '@/i18n/request';

const INDEXNOW_KEY = '44a3630285764b5cad4c0d104f0e4d6b';
const BASE_URL = 'https://codelithlabs.in';

/**
 * Build the full list of public URLs for the site.
 */
function buildUrlList(): string[] {
  const urls = new Set<string>();
  const indexableTools = getIndexableTools();

  // Static pages (locale-prefix aligned with middleware localePrefix=always)
  const staticPaths = [
    '/', '/tools', '/about', '/contact', '/privacy', '/terms', '/refund',
    '/blog', '/pricing', '/premium', '/research', '/team',
    '/projects', '/tech-stack', '/transparency',
  ];
  for (const locale of locales) {
    for (const routePath of staticPaths) {
      const localizedPath = routePath === '/' ? `/${locale}` : `/${locale}${routePath}`;
      urls.add(`${BASE_URL}${localizedPath}`);
    }
  }

  // Category pages
  const categories = Array.from(new Set(indexableTools.map(t => t.category)));
  for (const locale of locales) {
    for (const cat of categories) {
      urls.add(`${BASE_URL}/${locale}/tools/category/${cat}`);
    }
  }

  // Tool pages
  for (const locale of locales) {
    for (const tool of indexableTools) {
      urls.add(`${BASE_URL}/${locale}/tools/${tool.slug}`);
    }
  }

  // Project pages
  const projectSlugs = ['vectordefense', 'citk-connect'];
  for (const locale of locales) {
    for (const slug of projectSlugs) {
      urls.add(`${BASE_URL}/${locale}/projects/${slug}`);
    }
  }

  return Array.from(urls);
}

/**
 * POST — Submit all site URLs to IndexNow
 * Requires Authorization: Bearer <INDEXNOW_SECRET>
 */
export async function POST(request: NextRequest) {
  // Validate secret
  const authHeader = request.headers.get('authorization');
  const secret = process.env.INDEXNOW_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: 'INDEXNOW_SECRET not configured' },
      { status: 500 }
    );
  }

  const expected = `Bearer ${secret}`;
  const provided = authHeader ?? '';
  // Use timing-safe comparison to prevent timing oracle attacks
  const isAuthorized =
    provided.length === expected.length &&
    timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const urlList = buildUrlList();

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'codelithlabs.in',
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });

    return NextResponse.json({
      success: true,
      status: response.status,
      urlsSubmitted: urlList.length,
      message: response.status === 200
        ? 'URLs submitted successfully'
        : `IndexNow responded with status ${response.status}`,
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to submit to IndexNow', details: errorMessage },
      { status: 502 }
    );
  }
}

/**
 * GET — Return info about the IndexNow integration
 */
export async function GET() {
  const urlList = buildUrlList();
  return NextResponse.json({
    service: 'IndexNow',
    key: INDEXNOW_KEY,
    keyFile: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    totalUrls: urlList.length,
    submitEndpoint: 'POST /api/indexnow (requires Bearer token)',
  });
}
