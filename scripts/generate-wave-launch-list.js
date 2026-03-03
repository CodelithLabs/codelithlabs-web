// ═══════════════════════════════════════════════════════════════════════════
// FILE: scripts/generate-wave-launch-list.js
// Generates Wave-N launch lists from readiness report candidates
// Supports optional intent-similarity exclusion + progressive fallback
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const reportPath = path.join(ROOT, 'docs', 'reports', 'tool-readiness-report.json');
const registryPath = path.join(ROOT, 'src', 'lib', 'tools-registry.ts');
const DEFAULT_WAVE_SIZE = 25;
const DEFAULT_SIMILARITY_THRESHOLD = 2;

const INTENT_STOP_WORDS = new Set([
  'tool', 'tools', 'online', 'free', 'generator', 'calculator', 'converter',
  'checker', 'finder', 'builder', 'editor', 'formatter', 'analyzer', 'tester',
]);

function parseArgs(argv) {
  const opts = {
    wave: 1,
    size: DEFAULT_WAVE_SIZE,
    excludeSimilar: false,
    similarityThreshold: DEFAULT_SIMILARITY_THRESHOLD,
    minCategoryQuota: 0,
    progressiveFallback: false,
  };

  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--wave=')) {
      opts.wave = Number(arg.split('=')[1]);
    } else if (arg.startsWith('--size=')) {
      opts.size = Number(arg.split('=')[1]);
    } else if (arg === '--exclude-similar') {
      opts.excludeSimilar = true;
    } else if (arg.startsWith('--exclude-similar=')) {
      opts.excludeSimilar = arg.split('=')[1] === 'true';
    } else if (arg.startsWith('--threshold=')) {
      opts.similarityThreshold = Number(arg.split('=')[1]);
    } else if (arg.startsWith('--min-category-quota=')) {
      opts.minCategoryQuota = Number(arg.split('=')[1]);
    } else if (arg === '--progressive-fallback') {
      opts.progressiveFallback = true;
    } else if (arg.startsWith('--progressive-fallback=')) {
      opts.progressiveFallback = arg.split('=')[1] === 'true';
    }
  }

  if (!Number.isInteger(opts.wave) || opts.wave < 1) {
    throw new Error(`Invalid wave number: ${opts.wave}. Use --wave=<positive integer>.`);
  }

  if (!Number.isInteger(opts.size) || opts.size < 1) {
    throw new Error(`Invalid size: ${opts.size}. Use --size=<positive integer>.`);
  }

  if (!Number.isInteger(opts.similarityThreshold) || opts.similarityThreshold < 1) {
    throw new Error(`Invalid threshold: ${opts.similarityThreshold}. Use --threshold=<positive integer>.`);
  }

  if (!Number.isInteger(opts.minCategoryQuota) || opts.minCategoryQuota < 0) {
    throw new Error(`Invalid min category quota: ${opts.minCategoryQuota}. Use --min-category-quota=<non-negative integer>.`);
  }

  return opts;
}

function parseRegistry(source) {
  const toolRegex = /\{\s*slug:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?keywords:\s*\[([\s\S]*?)\][\s\S]*?processingType:\s*'([^']+)'\s*\}/g;
  const tools = [];
  let match;

  while ((match = toolRegex.exec(source)) !== null) {
    const keywords = match[4]
      .split(',')
      .map((k) => k.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);

    tools.push({
      slug: match[1],
      name: match[2],
      category: match[3],
      keywords,
      processingType: match[5],
    });
  }

  return tools;
}

function getWaveFilePath(wave, suffix = '') {
  const normalizedSuffix = suffix ? `-${suffix}` : '';
  return path.join(ROOT, 'docs', 'reports', `wave-${wave}-launch-list${normalizedSuffix}.md`);
}

function extractLaunchedSlugsFromWaveFile(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const slugs = [];
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('| # | Tool | Slug | Category | Processing |')) {
      inTable = true;
      continue;
    }

    if (!inTable) continue;

    if (trimmed.startsWith('|---|')) {
      continue;
    }

    if (!trimmed.startsWith('|')) {
      inTable = false;
      continue;
    }

    const slugMatch = trimmed.match(/`([a-z0-9-]+)`/);
    if (slugMatch) {
      slugs.push(slugMatch[1]);
    }
  }

  return Array.from(new Set(slugs));
}

function collectPreviouslyLaunchedSlugs(currentWave) {
  const launched = new Set();
  const sources = [];

  for (let wave = 1; wave < currentWave; wave += 1) {
    const baselinePath = getWaveFilePath(wave);
    const dedupePath = getWaveFilePath(wave, 'dedupe');

    const baselineSlugs = extractLaunchedSlugsFromWaveFile(baselinePath);
    if (baselineSlugs.length > 0) {
      baselineSlugs.forEach((slug) => launched.add(slug));
      sources.push({
        wave,
        mode: 'baseline',
        file: path.relative(ROOT, baselinePath),
        count: baselineSlugs.length,
      });
    }

    const dedupeSlugs = extractLaunchedSlugsFromWaveFile(dedupePath);
    if (dedupeSlugs.length > 0) {
      dedupeSlugs.forEach((slug) => launched.add(slug));
      sources.push({
        wave,
        mode: 'dedupe',
        file: path.relative(ROOT, dedupePath),
        count: dedupeSlugs.length,
      });
    }
  }

  return {
    launched,
    sources,
  };
}

function tokenizeIntent(input) {
  return new Set(
    input
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token && !INTENT_STOP_WORDS.has(token) && token.length > 2),
  );
}

function overlapCount(aSet, bSet) {
  let count = 0;
  for (const item of aSet) {
    if (bSet.has(item)) count += 1;
  }
  return count;
}

function isSimilarIntent(candidate, launchedTool, threshold, rules = {}) {
  const {
    enforceSameCategoryTokenGate = true,
    enforceSameCategoryMixedOverlapGate = true,
    enforceKeywordOverlapGate = true,
  } = rules;

  const candidateTokens = tokenizeIntent(`${candidate.slug} ${candidate.name} ${candidate.keywords.join(' ')}`);
  const launchedTokens = tokenizeIntent(`${launchedTool.slug} ${launchedTool.name} ${launchedTool.keywords.join(' ')}`);

  const keywordOverlap = overlapCount(new Set(candidate.keywords), new Set(launchedTool.keywords));
  const tokenOverlap = overlapCount(candidateTokens, launchedTokens);
  const sameCategory = candidate.category === launchedTool.category;

  if (enforceSameCategoryTokenGate && sameCategory && tokenOverlap >= threshold) return true;
  if (enforceSameCategoryMixedOverlapGate && sameCategory && keywordOverlap >= 1 && tokenOverlap >= 1) return true;
  if (enforceKeywordOverlapGate && keywordOverlap >= threshold) return true;

  return false;
}

function filterSimilarCandidates(candidates, launchedTools, threshold, rules = {}) {
  const kept = [];
  const excluded = [];

  for (const tool of candidates) {
    const similarTo = launchedTools.find((launched) => isSimilarIntent(tool, launched, threshold, rules));
    if (similarTo) {
      excluded.push({ slug: tool.slug, similarTo: similarTo.slug });
      continue;
    }
    kept.push(tool);
  }

  return { kept, excluded };
}

function buildProgressiveStages(baseThreshold) {
  return [
    {
      name: 'strict',
      threshold: baseThreshold,
      rules: {
        enforceSameCategoryTokenGate: true,
        enforceSameCategoryMixedOverlapGate: true,
        enforceKeywordOverlapGate: true,
      },
    },
    {
      name: 'relaxed-remove-mixed-overlap',
      threshold: baseThreshold,
      rules: {
        enforceSameCategoryTokenGate: true,
        enforceSameCategoryMixedOverlapGate: false,
        enforceKeywordOverlapGate: true,
      },
    },
    {
      name: 'relaxed-threshold-plus-1',
      threshold: baseThreshold + 1,
      rules: {
        enforceSameCategoryTokenGate: true,
        enforceSameCategoryMixedOverlapGate: false,
        enforceKeywordOverlapGate: true,
      },
    },
    {
      name: 'relaxed-disable-same-category-token-gate',
      threshold: baseThreshold + 1,
      rules: {
        enforceSameCategoryTokenGate: false,
        enforceSameCategoryMixedOverlapGate: false,
        enforceKeywordOverlapGate: true,
      },
    },
    {
      name: 'relaxed-keyword-threshold-plus-2',
      threshold: baseThreshold + 2,
      rules: {
        enforceSameCategoryTokenGate: false,
        enforceSameCategoryMixedOverlapGate: false,
        enforceKeywordOverlapGate: true,
      },
    },
  ];
}

function applySimilarityFilter(candidates, launchedTools, options) {
  if (!options.excludeSimilar) {
    return {
      kept: candidates,
      excluded: [],
      selectedStage: 'disabled',
      stagesTried: [],
    };
  }

  if (!options.progressiveFallback) {
    const result = filterSimilarCandidates(candidates, launchedTools, options.similarityThreshold);
    return {
      ...result,
      selectedStage: 'strict-single-pass',
      stagesTried: [
        {
          name: 'strict-single-pass',
          threshold: options.similarityThreshold,
          kept: result.kept.length,
          excluded: result.excluded.length,
        },
      ],
    };
  }

  const stages = buildProgressiveStages(options.similarityThreshold);
  const stagesTried = [];
  let best = null;

  for (const stage of stages) {
    const result = filterSimilarCandidates(candidates, launchedTools, stage.threshold, stage.rules);
    stagesTried.push({
      name: stage.name,
      threshold: stage.threshold,
      kept: result.kept.length,
      excluded: result.excluded.length,
    });

    if (!best || result.kept.length > best.kept.length) {
      best = { ...result, stage: stage.name };
    }

    if (result.kept.length >= options.size) {
      return {
        ...result,
        selectedStage: stage.name,
        stagesTried,
      };
    }
  }

  return {
    kept: best?.kept || [],
    excluded: best?.excluded || [],
    selectedStage: `${best?.stage || 'none'} (best-available)`,
    stagesTried,
  };
}

function chooseWave(candidates, size, minCategoryQuota = 0) {
  const byCategory = new Map();

  for (const tool of candidates) {
    if (!byCategory.has(tool.category)) {
      byCategory.set(tool.category, []);
    }

    byCategory.get(tool.category).push(tool);
  }

  for (const list of byCategory.values()) {
    list.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  const categories = Array.from(byCategory.keys())
    .sort((a, b) => byCategory.get(b).length - byCategory.get(a).length || a.localeCompare(b));

  const wave = [];

  if (minCategoryQuota > 0) {
    for (let quotaRound = 1; quotaRound <= minCategoryQuota; quotaRound += 1) {
      let addedInRound = false;

      for (const category of categories) {
        if (wave.length >= size) break;
        const list = byCategory.get(category);
        if (!list || list.length === 0) continue;
        wave.push(list.shift());
        addedInRound = true;
      }

      if (!addedInRound) break;
    }
  }

  if (minCategoryQuota === 0) {
    for (const category of categories) {
      if (wave.length >= size) break;
      const list = byCategory.get(category);
      if (!list || list.length === 0) continue;
      wave.push(list.shift());
    }
  }

  while (wave.length < size) {
    let added = false;

    for (const category of categories) {
      if (wave.length >= size) break;
      const list = byCategory.get(category);
      if (!list || list.length === 0) continue;
      wave.push(list.shift());
      added = true;
    }

    if (!added) break;
  }

  return wave;
}

function toMarkdown({ wave, waveNumber, options, excludedSimilar, alreadyLaunchedCount, launchedSources, availableCount, selectedFallbackStage, fallbackStages, generatedAt }) {
  const counts = wave.reduce((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1;
    return acc;
  }, {});

  const countLines = Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, count]) => `- ${category}: ${count}`)
    .join('\n');

  const rows = wave
    .map((tool, index) => `| ${index + 1} | ${tool.name} | \`${tool.slug}\` | ${tool.category} | ${tool.processingType} |`)
    .join('\n');

  const excludedPreview = excludedSimilar
    .slice(0, 10)
    .map((item) => `- \`${item.slug}\` (similar to \`${item.similarTo}\`)`)
    .join('\n');

  const launchedSourceLines = launchedSources.length > 0
    ? launchedSources
      .map((src) => `- wave-${src.wave} (${src.mode}) → \`${src.file}\` [${src.count}]`)
      .join('\n')
    : '- none';

  const fallbackLines = fallbackStages.length > 0
    ? fallbackStages
      .map((stage) => `- ${stage.name} (threshold=${stage.threshold}) → kept=${stage.kept}, excluded=${stage.excluded}`)
      .join('\n')
    : '- none';

  return `# Wave-${waveNumber} Launch List (Auto-Derived)\n\nGenerated: ${generatedAt}\n\nThis list is auto-derived from \`recommendations.readyIndexCandidates\` in \`docs/reports/tool-readiness-report.json\`.\nSelection strategy: category coverage first, then balanced round-robin fill.\n\n## Selection Settings\n\n- wave: ${waveNumber}\n- size: ${options.size}\n- excludeSimilarIntent: ${options.excludeSimilar}\n- similarityThreshold: ${options.similarityThreshold}\n- minCategoryQuota: ${options.minCategoryQuota}\n- progressiveFallback: ${options.progressiveFallback}\n- selectedFallbackStage: ${selectedFallbackStage}\n- previouslyLaunchedExcluded: ${alreadyLaunchedCount}\n- availableCandidatesAfterFilters: ${availableCount}\n- excludedBySimilarity: ${excludedSimilar.length}\n\n## Progressive Fallback Stages\n\n${fallbackLines}\n\n## Prior Wave Sources Used\n\n${launchedSourceLines}\n\n## Category Mix\n\n${countLines || '- (none)'}\n\n## Wave-${waveNumber} Tools (${wave.length})\n\n| # | Tool | Slug | Category | Processing |\n|---|------|------|----------|------------|\n${rows}\n${excludedSimilar.length > 0 ? `\n## Similarity Exclusions (top 10)\n\n${excludedPreview}\n` : ''}`;
}

function main() {
  const options = parseArgs(process.argv);

  if (!fs.existsSync(reportPath)) {
    throw new Error(`Readiness report not found: ${reportPath}. Run npm run tools:audit first.`);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const registrySource = fs.readFileSync(registryPath, 'utf8');
  const tools = parseRegistry(registrySource);
  const toolsBySlug = new Map(tools.map((t) => [t.slug, t]));

  const candidates = report.recommendations?.readyIndexCandidates || [];
  const { launched: previouslyLaunchedSlugs, sources: launchedSources } = collectPreviouslyLaunchedSlugs(options.wave);
  const launchedTools = Array.from(previouslyLaunchedSlugs)
    .map((slug) => toolsBySlug.get(slug))
    .filter(Boolean);

  const unlaunchedCandidates = candidates
    .filter((slug) => !previouslyLaunchedSlugs.has(slug))
    .map((slug) => toolsBySlug.get(slug))
    .filter(Boolean);

  const similarityResult = applySimilarityFilter(unlaunchedCandidates, launchedTools, options);
  const filteredCandidates = similarityResult.kept;
  const excludedSimilar = similarityResult.excluded;

  const wave = chooseWave(filteredCandidates, options.size, options.minCategoryQuota);
  const outPath = getWaveFilePath(options.wave, options.excludeSimilar ? 'dedupe' : '');

  if (wave.length < options.size) {
    console.warn(`⚠️ Only ${wave.length} tools selected (target ${options.size}).`);
  }

  const markdown = toMarkdown({
    wave,
    waveNumber: options.wave,
    options,
    excludedSimilar,
    alreadyLaunchedCount: previouslyLaunchedSlugs.size,
    launchedSources,
    availableCount: filteredCandidates.length,
    selectedFallbackStage: similarityResult.selectedStage,
    fallbackStages: similarityResult.stagesTried,
    generatedAt: new Date().toISOString(),
  });

  fs.writeFileSync(outPath, markdown, 'utf8');

  console.log(`🚀 Wave-${options.wave} launch list generated`);
  console.log(`   Output: ${path.relative(ROOT, outPath)}`);
  console.log(`   Size:   ${wave.length}`);
  console.log(`   Excluded launched: ${previouslyLaunchedSlugs.size}`);
  console.log(`   Excluded similar: ${excludedSimilar.length}`);
  console.log(`   Selected fallback stage: ${similarityResult.selectedStage}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
  parseArgs,
  parseRegistry,
  collectPreviouslyLaunchedSlugs,
  applySimilarityFilter,
  filterSimilarCandidates,
  chooseWave,
};
