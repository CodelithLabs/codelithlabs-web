#!/usr/bin/env node

/**
 * Tool Health Audit
 * - Verifies indexable tool slugs are mapped in tool-mapper
 * - Verifies mapped component files do not contain placeholder/dead-copy patterns
 * - Writes docs/reports/tool-health-audit-report.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'src', 'lib', 'tools-registry.ts');
const MAPPER_PATH = path.join(ROOT, 'src', 'app', 'tools', '[slug]', 'tool-mapper.tsx');
const ROLLOUT_PATH = path.join(ROOT, 'src', 'lib', 'tool-rollout.ts');
const REPORT_DIR = path.join(ROOT, 'docs', 'reports');
const REPORT_PATH = path.join(REPORT_DIR, 'tool-health-audit-report.json');

const PLACEHOLDER_PATTERNS = [
  /coming soon/i,
  /under development/i,
  /not yet implemented/i,
];

function parseRegistrySlugs(source) {
  const slugs = [];
  const regex = /slug:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    slugs.push(match[1]);
  }
  return slugs;
}

function parseNoindexSlugs(source) {
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

function parseMapperImports(source) {
  const map = new Map();
  const regex = /'([^']+)'\s*:\s*dynamic\(\(\)\s*=>\s*import\('([^']+)'\)/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    map.set(match[1], match[2]);
  }
  return map;
}

function resolveImportPath(importPath) {
  if (importPath.startsWith('@/')) {
    return path.join(ROOT, 'src', importPath.slice(2));
  }
  return path.resolve(path.dirname(MAPPER_PATH), importPath);
}

function findPlaceholderMatches(content) {
  return PLACEHOLDER_PATTERNS
    .filter((pattern) => pattern.test(content))
    .map((pattern) => pattern.toString());
}

function main() {
  const registrySource = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const mapperSource = fs.readFileSync(MAPPER_PATH, 'utf8');
  const rolloutSource = fs.readFileSync(ROLLOUT_PATH, 'utf8');

  const registrySlugs = parseRegistrySlugs(registrySource);
  const noindexSlugs = new Set(parseNoindexSlugs(rolloutSource));
  const indexableSlugs = registrySlugs.filter((slug) => !noindexSlugs.has(slug));

  const mapperImports = parseMapperImports(mapperSource);

  const missingMappings = [];
  const missingFiles = [];
  const placeholderHits = [];

  for (const slug of indexableSlugs) {
    const importPath = mapperImports.get(slug);
    if (!importPath) {
      missingMappings.push(slug);
      continue;
    }

    const componentPath = `${resolveImportPath(importPath)}.tsx`;
    if (!fs.existsSync(componentPath)) {
      missingFiles.push({ slug, componentPath: path.relative(ROOT, componentPath) });
      continue;
    }

    const source = fs.readFileSync(componentPath, 'utf8');
    const matchedPatterns = findPlaceholderMatches(source);
    if (matchedPatterns.length > 0) {
      placeholderHits.push({
        slug,
        componentPath: path.relative(ROOT, componentPath),
        matchedPatterns,
      });
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      registrySlugs: registrySlugs.length,
      indexableSlugs: indexableSlugs.length,
      mapperMappedSlugs: mapperImports.size,
      missingMappings: missingMappings.length,
      missingFiles: missingFiles.length,
      placeholderHits: placeholderHits.length,
    },
    missingMappings,
    missingFiles,
    placeholderHits,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log('🧪 Tool health audit complete');
  console.log(`   Missing mappings: ${missingMappings.length}`);
  console.log(`   Missing files:    ${missingFiles.length}`);
  console.log(`   Placeholder hits: ${placeholderHits.length}`);
  console.log(`   Report:           ${path.relative(ROOT, REPORT_PATH)}`);

  const failures = [
    ...missingMappings.map((slug) => `Indexable tool missing mapper component: ${slug}`),
    ...missingFiles.map((item) => `Mapped component file missing: ${item.slug} -> ${item.componentPath}`),
    ...placeholderHits.map((item) => `Indexable tool has placeholder pattern: ${item.slug} -> ${item.componentPath}`),
  ];

  if (failures.length > 0) {
    console.error('\n❌ Tool health audit failed:');
    failures.forEach((failure) => console.error(`   - ${failure}`));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
