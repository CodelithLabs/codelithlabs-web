#!/usr/bin/env node

/**
 * Sitemap Completeness Audit
 * - Verifies important static routes are represented in src/app/sitemap.ts
 * - Verifies critical project slugs are included
 * - Verifies flagged tool slugs exist and are not blocked by rollout noindex set
 * - Writes report to docs/reports/seo-sitemap-audit-report.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT, 'src', 'app', 'sitemap.ts');
const REGISTRY_PATH = path.join(ROOT, 'src', 'lib', 'tools-registry.ts');
const ROLLOUT_PATH = path.join(ROOT, 'src', 'lib', 'tool-rollout.ts');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports');
const REPORT_PATH = path.join(REPORT_DIR, 'seo-sitemap-audit-report.json');

const IMPORTANT_STATIC_ROUTES = [
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

const IMPORTANT_PROJECT_SLUGS = ['vectordefense', 'citk-connect'];
const FLAGGED_TOOL_SLUGS = ['case-converter', 'age-calculator', 'qr-code-generator'];

function parseQuotedListFromArrayLiteral(source, arrayName) {
  const arrayMatch = source.match(new RegExp(`${arrayName}\\s*=\\s*\\[([\\s\\S]*?)\\]`, 'm'));
  if (!arrayMatch) return [];

  const values = [];
  const regex = /'([^']+)'/g;
  let match;
  while ((match = regex.exec(arrayMatch[1])) !== null) {
    values.push(match[1]);
  }
  return values;
}

function parseRolloutNoindexSlugs(source) {
  const setMatch = source.match(/NOINDEX_UNTIL_READY_SLUGS\s*=\s*new Set<string>\(\[([\s\S]*?)\]\)/m);
  if (!setMatch) return [];

  const slugs = [];
  const regex = /'([^']+)'/g;
  let match;
  while ((match = regex.exec(setMatch[1])) !== null) {
    slugs.push(match[1]);
  }
  return slugs;
}

function parseRegistrySlugs(source) {
  const slugs = [];
  const regex = /slug:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    slugs.push(match[1]);
  }
  return slugs;
}

function main() {
  const sitemapSource = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const registrySource = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const rolloutSource = fs.readFileSync(ROLLOUT_PATH, 'utf8');

  const missingStaticRoutes = IMPORTANT_STATIC_ROUTES.filter((route) => {
    if (route === '/') {
      return !/\{\s*url:\s*BASE_URL/.test(sitemapSource);
    }
    return !sitemapSource.includes(`withTrailingSlash('${route}')`);
  });

  const projectSlugs = parseQuotedListFromArrayLiteral(sitemapSource, 'projectSlugs');
  const missingProjectSlugs = IMPORTANT_PROJECT_SLUGS.filter((slug) => !projectSlugs.includes(slug));

  const registrySlugs = new Set(parseRegistrySlugs(registrySource));
  const noindexSlugs = new Set(parseRolloutNoindexSlugs(rolloutSource));

  const missingFlaggedRegistrySlugs = FLAGGED_TOOL_SLUGS.filter((slug) => !registrySlugs.has(slug));
  const flaggedSlugsNoindexed = FLAGGED_TOOL_SLUGS.filter((slug) => noindexSlugs.has(slug));

  const hasDynamicToolPages = /const toolPages: MetadataRoute\.Sitemap\s*=\s*indexableTools\.map/.test(sitemapSource);
  const hasDynamicBlogPages = /const blogPages: MetadataRoute\.Sitemap\s*=\s*blogPosts\.map/.test(sitemapSource);
  const hasCategoryPages = /const categoryPages: MetadataRoute\.Sitemap\s*=\s*categories\.map/.test(sitemapSource);

  const report = {
    generatedAt: new Date().toISOString(),
    checks: {
      hasDynamicToolPages,
      hasDynamicBlogPages,
      hasCategoryPages,
    },
    importantStaticRoutes: {
      expected: IMPORTANT_STATIC_ROUTES,
      missing: missingStaticRoutes,
    },
    projects: {
      expectedSlugs: IMPORTANT_PROJECT_SLUGS,
      configuredSlugs: projectSlugs,
      missing: missingProjectSlugs,
    },
    flaggedToolSlugs: {
      expected: FLAGGED_TOOL_SLUGS,
      missingInRegistry: missingFlaggedRegistrySlugs,
      currentlyNoindexed: flaggedSlugsNoindexed,
    },
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const failures = [
    ...missingStaticRoutes.map((route) => `Missing static route in sitemap.ts: ${route}`),
    ...missingProjectSlugs.map((slug) => `Missing project slug in sitemap.ts: ${slug}`),
    ...missingFlaggedRegistrySlugs.map((slug) => `Flagged tool missing in registry: ${slug}`),
    ...flaggedSlugsNoindexed.map((slug) => `Flagged tool still in noindex rollout set: ${slug}`),
    ...(hasDynamicToolPages ? [] : ['Dynamic toolPages mapping is missing in sitemap.ts']),
    ...(hasDynamicBlogPages ? [] : ['Dynamic blogPages mapping is missing in sitemap.ts']),
    ...(hasCategoryPages ? [] : ['Dynamic categoryPages mapping is missing in sitemap.ts']),
  ];

  console.log('🗺️ Sitemap audit complete');
  console.log(`   Missing static routes: ${missingStaticRoutes.length}`);
  console.log(`   Missing project slugs: ${missingProjectSlugs.length}`);
  console.log(`   Flagged tool issues:   ${missingFlaggedRegistrySlugs.length + flaggedSlugsNoindexed.length}`);
  console.log(`   Report:                ${path.relative(ROOT, REPORT_PATH)}`);

  if (failures.length > 0) {
    console.error('\n❌ Sitemap completeness audit failed:');
    failures.forEach((failure) => console.error(`   - ${failure}`));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
