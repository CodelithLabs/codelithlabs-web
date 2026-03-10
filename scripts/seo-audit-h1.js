#!/usr/bin/env node

/**
 * H1 Audit Script
 * - Scans app route page files for visible <h1>
 * - Supports proxy component files for pages that delegate hero/header rendering
 * - Writes report to docs/reports/seo-h1-audit-report.json
 * - Exits non-zero when any indexable page lacks an h1
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APP_DIR = path.join(ROOT, 'src', 'app');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports');
const REPORT_PATH = path.join(REPORT_DIR, 'seo-h1-audit-report.json');

const SKIP_PAGES = new Set([
  'src/app/auth/signin/page.tsx',
  'src/app/dashboard/page.tsx',
  'src/app/offline/page.tsx',
]);

const H1_PROXY_FILES = {
  'src/app/page.tsx': ['src/components/landing/HeroSection.tsx'],
  'src/app/transparency/page.tsx': ['src/components/transparency/TransparencyDashboardClient.tsx'],
  'src/app/tools/[slug]/page.tsx': ['src/components/tools/ToolLayout.tsx'],
};

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function walk(dir) {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'api') continue;
      result.push(...walk(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name === 'page.tsx') {
      result.push(fullPath);
    }
  }
  return result;
}

function hasH1(content) {
  return /<(?:[a-zA-Z0-9_]+\.)?h1[\s>]/i.test(content);
}

function readIfExists(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

function main() {
  const pageFiles = walk(APP_DIR);

  const checked = [];
  const missing = [];

  for (const file of pageFiles) {
    const relativePath = toPosix(path.relative(ROOT, file));
    if (SKIP_PAGES.has(relativePath)) {
      continue;
    }

    const source = fs.readFileSync(file, 'utf8');
    const foundInPage = hasH1(source);

    const proxyFiles = H1_PROXY_FILES[relativePath] || [];
    const foundInProxy = proxyFiles.some((proxyPath) => {
      const proxySource = readIfExists(proxyPath);
      return proxySource ? hasH1(proxySource) : false;
    });

    const hasHeading = foundInPage || foundInProxy;
    checked.push({
      page: relativePath,
      foundInPage,
      proxyFiles,
      foundInProxy,
      hasHeading,
    });

    if (!hasHeading) {
      missing.push(relativePath);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      checked: checked.length,
      missing: missing.length,
      skipped: SKIP_PAGES.size,
    },
    missing,
    checked,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log('🔎 H1 audit complete');
  console.log(`   Checked pages: ${report.totals.checked}`);
  console.log(`   Missing H1:    ${report.totals.missing}`);
  console.log(`   Report:        ${path.relative(ROOT, REPORT_PATH)}`);

  if (missing.length > 0) {
    console.error('\n❌ H1 audit failed. Missing <h1> on these pages:');
    for (const page of missing) {
      console.error(`   - ${page}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
