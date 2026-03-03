// ═══════════════════════════════════════════════════════════════════════════
// FILE: scripts/audit-tool-readiness.js
// Audits registry vs implementation mapper vs content markdown presence
// Helps enforce noindex-until-ready at scale for 200+ tools rollout
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const registryPath = path.join(ROOT, 'src', 'lib', 'tools-registry.ts');
const mapperPath = path.join(ROOT, 'src', 'app', 'tools', '[slug]', 'tool-mapper.tsx');
const contentDir = path.join(ROOT, 'content', 'tools');
const reportDir = path.join(ROOT, 'docs', 'reports');
const reportPath = path.join(reportDir, 'tool-readiness-report.json');

function parseRegistrySlugs(source) {
  const regex = /slug:\s*'([^']+)'/g;
  const slugs = new Set();
  let match;

  while ((match = regex.exec(source)) !== null) {
    slugs.add(match[1]);
  }

  return Array.from(slugs);
}

function parseMapperSlugs(source) {
  const regex = /'([^']+)'\s*:\s*dynamic\(/g;
  const slugs = new Set();
  let match;

  while ((match = regex.exec(source)) !== null) {
    slugs.add(match[1]);
  }

  return Array.from(slugs);
}

function getContentSlugs() {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((name) => name.endsWith('.md') && name !== 'README.md')
    .map((name) => name.replace(/\.md$/, ''));
}

function toSortedArray(setLike) {
  return Array.from(setLike).sort((a, b) => a.localeCompare(b));
}

function main() {
  const registrySource = fs.readFileSync(registryPath, 'utf8');
  const mapperSource = fs.readFileSync(mapperPath, 'utf8');

  const registrySlugs = parseRegistrySlugs(registrySource);
  const mapperSlugs = parseMapperSlugs(mapperSource);
  const contentSlugs = getContentSlugs();

  const registrySet = new Set(registrySlugs);
  const mapperSet = new Set(mapperSlugs);
  const contentSet = new Set(contentSlugs);

  const fullyReady = toSortedArray(
    registrySlugs.filter((slug) => mapperSet.has(slug) && contentSet.has(slug)),
  );

  const implementationOnly = toSortedArray(
    mapperSlugs.filter((slug) => registrySet.has(slug) && !contentSet.has(slug)),
  );

  const contentOnly = toSortedArray(
    contentSlugs.filter((slug) => registrySet.has(slug) && !mapperSet.has(slug)),
  );

  const missingImplementation = toSortedArray(
    registrySlugs.filter((slug) => !mapperSet.has(slug)),
  );

  const missingContent = toSortedArray(
    registrySlugs.filter((slug) => !contentSet.has(slug)),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      registry: registrySlugs.length,
      mapper: mapperSlugs.length,
      content: contentSlugs.length,
      fullyReady: fullyReady.length,
      implementationOnly: implementationOnly.length,
      contentOnly: contentOnly.length,
      missingImplementation: missingImplementation.length,
      missingContent: missingContent.length,
    },
    recommendations: {
      readyIndexCandidates: fullyReady,
      keepNoindexUntilReady: toSortedArray(
        new Set([...implementationOnly, ...contentOnly, ...missingImplementation]),
      ),
    },
    details: {
      implementationOnly,
      contentOnly,
      missingImplementation,
      missingContent,
    },
  };

  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log('🔍 Tool readiness audit complete');
  console.log(`   Registry tools:         ${report.totals.registry}`);
  console.log(`   Implemented in mapper:  ${report.totals.mapper}`);
  console.log(`   Content markdown files: ${report.totals.content}`);
  console.log(`   Fully ready (impl+md):  ${report.totals.fullyReady}`);
  console.log(`   Missing implementation: ${report.totals.missingImplementation}`);
  console.log(`   Missing content:        ${report.totals.missingContent}`);
  console.log(`\n📄 Report written to: ${path.relative(ROOT, reportPath)}`);
}

if (require.main === module) {
  main();
}

module.exports = { main };
