#!/usr/bin/env node

/**
 * Indexing Friction Audit
 * Buckets:
 * - noindex (rollout-set + live-page robots checks)
 * - redirects (live critical URL redirects)
 * - 404 (live critical URL final status)
 * - 5xx (live critical URL final status)
 *
 * Writes docs/reports/seo-indexing-friction-report.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ROLLOUT_PATH = path.join(ROOT, 'src', 'lib', 'tool-rollout.ts');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports');
const REPORT_PATH = path.join(REPORT_DIR, 'seo-indexing-friction-report.json');

const SITE_URL = (process.env.SEO_AUDIT_BASE_URL || 'https://codelithlabs.in').replace(/\/$/, '');
const REQUEST_TIMEOUT_MS = Number(process.env.SEO_AUDIT_TIMEOUT_MS || 12000);

const FLAGGED_TOOL_SLUGS = ['case-converter', 'age-calculator', 'qr-code-generator'];

const CRITICAL_PATHS = [
  '/',
  '/tools/',
  '/blog/',
  '/tools/case-converter/',
  '/tools/age-calculator/',
  '/tools/qr-code-generator/',
];

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

function isNoindexHtml(html) {
  const robotsMeta = /<meta[^>]+name=["']robots["'][^>]*>/gi;
  const matches = html.match(robotsMeta) || [];
  return matches.some((tag) => /noindex/i.test(tag));
}

async function fetchWithTimeout(url, options = {}) {
  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  return fetch(url, {
    ...options,
    headers: {
      'user-agent': 'codelithlabs-seo-audit/1.0 (+https://codelithlabs.in)',
      accept: 'text/html,application/xhtml+xml',
      ...(options.headers || {}),
    },
    signal: timeoutSignal,
  });
}

async function checkUrl(pathname) {
  const url = `${SITE_URL}${pathname}`;
  const expectedCanonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

  const entry = {
    url,
    expectedCanonical,
    initialStatus: null,
    redirectLocation: null,
    finalStatus: null,
    finalUrl: null,
    hasNoindexMeta: false,
    error: null,
  };

  try {
    const initial = await fetchWithTimeout(url, { redirect: 'manual' });
    entry.initialStatus = initial.status;
    entry.redirectLocation = initial.headers.get('location');

    const final = await fetchWithTimeout(url, { redirect: 'follow' });
    entry.finalStatus = final.status;
    entry.finalUrl = final.url;

    const html = await final.text();
    entry.hasNoindexMeta = isNoindexHtml(html);
  } catch (error) {
    entry.error = error instanceof Error ? error.message : String(error);
  }

  return entry;
}

async function main() {
  const rolloutSource = fs.readFileSync(ROLLOUT_PATH, 'utf8');
  const noindexRolloutSlugs = parseRolloutNoindexSlugs(rolloutSource);

  const rolloutFlaggedNoindex = FLAGGED_TOOL_SLUGS.filter((slug) => noindexRolloutSlugs.includes(slug));

  const checks = [];
  for (const pathname of CRITICAL_PATHS) {
    checks.push(await checkUrl(pathname));
  }

  const buckets = {
    noindex: {
      rollout: rolloutFlaggedNoindex.map((slug) => `/tools/${slug}/`),
      live: checks.filter((entry) => entry.hasNoindexMeta).map((entry) => entry.url),
    },
    redirects: checks
      .filter((entry) => entry.initialStatus && [301, 302, 307, 308].includes(entry.initialStatus))
      .map((entry) => ({
        url: entry.url,
        status: entry.initialStatus,
        location: entry.redirectLocation,
      })),
    notFound404: checks
      .filter((entry) => entry.finalStatus === 404)
      .map((entry) => ({ url: entry.url, finalUrl: entry.finalUrl })),
    serverErrors5xx: checks
      .filter((entry) => entry.finalStatus && entry.finalStatus >= 500)
      .map((entry) => ({ url: entry.url, status: entry.finalStatus, finalUrl: entry.finalUrl })),
    requestErrors: checks.filter((entry) => entry.error).map((entry) => ({ url: entry.url, error: entry.error })),
  };

  const canonicalMismatches = checks
    .filter((entry) => entry.finalUrl && entry.finalUrl !== entry.expectedCanonical)
    .map((entry) => ({
      url: entry.url,
      expected: entry.expectedCanonical,
      actual: entry.finalUrl,
    }));

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: SITE_URL,
    timeoutMs: REQUEST_TIMEOUT_MS,
    criticalPaths: CRITICAL_PATHS,
    checks,
    buckets,
    canonicalMismatches,
    summary: {
      noindexCount: buckets.noindex.rollout.length + buckets.noindex.live.length,
      redirectCount: buckets.redirects.length,
      notFound404Count: buckets.notFound404.length,
      serverErrors5xxCount: buckets.serverErrors5xx.length,
      requestErrorCount: buckets.requestErrors.length,
      canonicalMismatchCount: canonicalMismatches.length,
    },
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log('📊 Indexing friction audit complete');
  console.log(`   noindex:    ${report.summary.noindexCount}`);
  console.log(`   redirects:  ${report.summary.redirectCount}`);
  console.log(`   404:        ${report.summary.notFound404Count}`);
  console.log(`   5xx:        ${report.summary.serverErrors5xxCount}`);
  console.log(`   req errors: ${report.summary.requestErrorCount}`);
  console.log(`   canonical:  ${report.summary.canonicalMismatchCount}`);
  console.log(`   Report:     ${path.relative(ROOT, REPORT_PATH)}`);

  const failures = [];
  if (buckets.noindex.rollout.length > 0) {
    failures.push(...buckets.noindex.rollout.map((url) => `Flagged URL is rollout-noindexed: ${url}`));
  }
  if (buckets.noindex.live.length > 0) {
    failures.push(...buckets.noindex.live.map((url) => `Critical URL has noindex robots meta: ${url}`));
  }
  if (buckets.notFound404.length > 0) {
    failures.push(...buckets.notFound404.map((item) => `Critical URL returns 404: ${item.url}`));
  }
  if (buckets.serverErrors5xx.length > 0) {
    failures.push(...buckets.serverErrors5xx.map((item) => `Critical URL returns 5xx: ${item.url} (${item.status})`));
  }
  if (buckets.requestErrors.length > 0) {
    failures.push(...buckets.requestErrors.map((item) => `Request failed: ${item.url} (${item.error})`));
  }
  if (canonicalMismatches.length > 0) {
    failures.push(...canonicalMismatches.map((item) => `Canonical mismatch: ${item.url} -> ${item.actual}`));
  }

  if (failures.length > 0) {
    console.error('\n❌ Indexing friction audit failed:');
    failures.forEach((failure) => console.error(`   - ${failure}`));
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Unexpected audit failure:', error);
    process.exit(1);
  });
}

module.exports = { main };
