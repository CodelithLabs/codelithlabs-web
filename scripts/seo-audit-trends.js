#!/usr/bin/env node

/**
 * SEO Audit Trends Wrapper
 * - Runs SEO + tool-health audit scripts (H1, sitemap, indexing, tool health)
 * - Diffs current report metrics vs previous report metrics
 * - Writes trend snapshots for PR-friendly review
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports');
const TREND_JSON = path.join(REPORT_DIR, 'seo-audit-trend-report.json');
const TREND_MD = path.join(REPORT_DIR, 'seo-audit-trend-report.md');

const AUDITS = [
  {
    id: 'h1',
    label: 'H1 Coverage',
    script: path.join(ROOT, 'scripts', 'seo-audit-h1.js'),
    reportPath: path.join(REPORT_DIR, 'seo-h1-audit-report.json'),
    metrics: (report) => ({
      checked: report?.totals?.checked ?? 0,
      missing: report?.totals?.missing ?? 0,
      skipped: report?.totals?.skipped ?? 0,
    }),
    rules: {
      checked: 'higher-better',
      missing: 'lower-better',
      skipped: 'equal-preferred',
    },
  },
  {
    id: 'sitemap',
    label: 'Sitemap Completeness',
    script: path.join(ROOT, 'scripts', 'seo-audit-sitemap.js'),
    reportPath: path.join(REPORT_DIR, 'seo-sitemap-audit-report.json'),
    metrics: (report) => ({
      missingStaticRoutes: report?.importantStaticRoutes?.missing?.length ?? 0,
      missingProjectSlugs: report?.projects?.missing?.length ?? 0,
      flaggedMissingInRegistry: report?.flaggedToolSlugs?.missingInRegistry?.length ?? 0,
      flaggedNoindexed: report?.flaggedToolSlugs?.currentlyNoindexed?.length ?? 0,
      hasDynamicToolPages: report?.checks?.hasDynamicToolPages ? 1 : 0,
      hasDynamicBlogPages: report?.checks?.hasDynamicBlogPages ? 1 : 0,
      hasCategoryPages: report?.checks?.hasCategoryPages ? 1 : 0,
    }),
    rules: {
      missingStaticRoutes: 'lower-better',
      missingProjectSlugs: 'lower-better',
      flaggedMissingInRegistry: 'lower-better',
      flaggedNoindexed: 'lower-better',
      hasDynamicToolPages: 'boolean-true',
      hasDynamicBlogPages: 'boolean-true',
      hasCategoryPages: 'boolean-true',
    },
  },
  {
    id: 'indexing',
    label: 'Indexing Friction',
    script: path.join(ROOT, 'scripts', 'seo-audit-indexing.js'),
    reportPath: path.join(REPORT_DIR, 'seo-indexing-friction-report.json'),
    metrics: (report) => ({
      noindexCount: report?.summary?.noindexCount ?? 0,
      redirectCount: report?.summary?.redirectCount ?? 0,
      notFound404Count: report?.summary?.notFound404Count ?? 0,
      serverErrors5xxCount: report?.summary?.serverErrors5xxCount ?? 0,
      requestErrorCount: report?.summary?.requestErrorCount ?? 0,
      canonicalMismatchCount: report?.summary?.canonicalMismatchCount ?? 0,
    }),
    rules: {
      noindexCount: 'lower-better',
      redirectCount: 'lower-better',
      notFound404Count: 'lower-better',
      serverErrors5xxCount: 'lower-better',
      requestErrorCount: 'lower-better',
      canonicalMismatchCount: 'lower-better',
    },
  },
  {
    id: 'tool-health',
    label: 'Tool Health',
    script: path.join(ROOT, 'scripts', 'tool-health-audit.js'),
    reportPath: path.join(REPORT_DIR, 'tool-health-audit-report.json'),
    metrics: (report) => ({
      missingMappings: report?.totals?.missingMappings ?? 0,
      missingFiles: report?.totals?.missingFiles ?? 0,
      placeholderHits: report?.totals?.placeholderHits ?? 0,
    }),
    rules: {
      missingMappings: 'lower-better',
      missingFiles: 'lower-better',
      placeholderHits: 'lower-better',
    },
  },
];

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function evaluateMetric(rule, previousValue, currentValue) {
  if (previousValue === null || previousValue === undefined) {
    return { status: 'baseline', regression: false };
  }

  if (rule === 'lower-better') {
    if (currentValue > previousValue) return { status: 'regressed', regression: true };
    if (currentValue < previousValue) return { status: 'improved', regression: false };
    return { status: 'unchanged', regression: false };
  }

  if (rule === 'higher-better') {
    if (currentValue < previousValue) return { status: 'regressed', regression: true };
    if (currentValue > previousValue) return { status: 'improved', regression: false };
    return { status: 'unchanged', regression: false };
  }

  if (rule === 'boolean-true') {
    if (currentValue === 1 && previousValue === 0) return { status: 'improved', regression: false };
    if (currentValue === 0 && previousValue === 1) return { status: 'regressed', regression: true };
    return { status: 'unchanged', regression: false };
  }

  return { status: 'unchanged', regression: false };
}

function runAuditScript(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: ROOT,
    stdio: 'inherit',
  });

  return result.status === null ? 1 : result.status;
}

function statusIcon(status) {
  if (status === 'improved') return '🟢';
  if (status === 'regressed') return '🔴';
  if (status === 'baseline') return '🆕';
  return '⚪';
}

function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const previousReports = Object.fromEntries(
    AUDITS.map((audit) => [audit.id, readJsonIfExists(audit.reportPath)]),
  );

  let exitCode = 0;
  for (const audit of AUDITS) {
    const code = runAuditScript(audit.script);
    if (code !== 0) {
      exitCode = 1;
    }
  }

  const currentReports = Object.fromEntries(
    AUDITS.map((audit) => [audit.id, readJsonIfExists(audit.reportPath)]),
  );

  const trend = {
    generatedAt: new Date().toISOString(),
    hasBaseline: Object.values(previousReports).some(Boolean),
    audits: [],
    regressions: [],
    exitCode,
  };

  for (const audit of AUDITS) {
    const previous = previousReports[audit.id];
    const current = currentReports[audit.id];

    const previousMetrics = previous ? audit.metrics(previous) : null;
    const currentMetrics = current ? audit.metrics(current) : null;

    const metricDiffs = [];
    if (currentMetrics) {
      for (const [metric, currentValue] of Object.entries(currentMetrics)) {
        const previousValue = previousMetrics ? previousMetrics[metric] : null;
        const delta = previousValue === null || previousValue === undefined
          ? null
          : currentValue - previousValue;
        const rule = audit.rules[metric] || 'equal-preferred';
        const evaluation = evaluateMetric(rule, previousValue, currentValue);

        const metricEntry = {
          metric,
          previous: previousValue,
          current: currentValue,
          delta,
          rule,
          status: evaluation.status,
        };

        metricDiffs.push(metricEntry);

        if (evaluation.regression) {
          trend.regressions.push({
            audit: audit.label,
            metric,
            previous: previousValue,
            current: currentValue,
            delta,
          });
        }
      }
    }

    trend.audits.push({
      id: audit.id,
      label: audit.label,
      hasPrevious: Boolean(previous),
      metricDiffs,
    });
  }

  fs.writeFileSync(TREND_JSON, `${JSON.stringify(trend, null, 2)}\n`, 'utf8');

  const markdownLines = [
    '# SEO Audit Trend Snapshot',
    '',
    `Generated: ${trend.generatedAt}`,
    `Baseline available: ${trend.hasBaseline ? 'yes' : 'no (first recorded run)'}`,
    '',
  ];

  for (const audit of trend.audits) {
    markdownLines.push(`## ${audit.label}`);
    markdownLines.push('');

    if (audit.metricDiffs.length === 0) {
      markdownLines.push('- No metrics available (report missing).');
      markdownLines.push('');
      continue;
    }

    markdownLines.push('| Metric | Previous | Current | Δ | Status |');
    markdownLines.push('|---|---:|---:|---:|---|');
    for (const metric of audit.metricDiffs) {
      const prev = metric.previous === null || metric.previous === undefined ? '—' : metric.previous;
      const delta = metric.delta === null || metric.delta === undefined
        ? '—'
        : `${metric.delta > 0 ? '+' : ''}${metric.delta}`;
      markdownLines.push(`| ${metric.metric} | ${prev} | ${metric.current} | ${delta} | ${statusIcon(metric.status)} ${metric.status} |`);
    }
    markdownLines.push('');
  }

  if (trend.regressions.length > 0) {
    markdownLines.push('## Regressions detected');
    markdownLines.push('');
    for (const regression of trend.regressions) {
      const delta = regression.delta === null || regression.delta === undefined
        ? 'n/a'
        : `${regression.delta > 0 ? '+' : ''}${regression.delta}`;
      markdownLines.push(`- ${regression.audit} · ${regression.metric}: ${regression.previous} -> ${regression.current} (${delta})`);
    }
    markdownLines.push('');
  } else {
    markdownLines.push('## Regressions detected');
    markdownLines.push('');
    markdownLines.push('- None 🎉');
    markdownLines.push('');
  }

  fs.writeFileSync(TREND_MD, `${markdownLines.join('\n')}\n`, 'utf8');

  console.log('📈 SEO trend snapshot generated');
  console.log(`   JSON: ${path.relative(ROOT, TREND_JSON)}`);
  console.log(`   MD:   ${path.relative(ROOT, TREND_MD)}`);

  if (exitCode !== 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
