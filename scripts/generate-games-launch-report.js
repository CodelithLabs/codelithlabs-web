const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'src', 'lib', 'games-registry.ts');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'reports', 'games-launch-report.md');

function parseGamesRegistry(source) {
  const entries = [];
  const objectRegex = /\{[\s\S]*?slug:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?isLive:\s*(true|false)[\s\S]*?tags:\s*\[([\s\S]*?)\][\s\S]*?releaseDate:\s*'([^']+)'[\s\S]*?\}/g;
  let match;

  while ((match = objectRegex.exec(source)) !== null) {
    const tags = match[4]
      .split(',')
      .map((raw) => raw.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);

    entries.push({
      slug: match[1],
      title: match[2],
      isLive: match[3] === 'true',
      tags,
      releaseDate: match[5],
    });
  }

  return entries;
}

function getWaveNumber(tags) {
  const waveTag = tags.find((tag) => /^launch-wave-\d+$/.test(tag));
  if (!waveTag) return null;
  return Number(waveTag.replace('launch-wave-', ''));
}

function toMarkdown(games, sourceHash = 'unknown') {
  const liveGames = games.filter((g) => g.isLive);
  const upcomingGames = games.filter((g) => !g.isLive);

  const waveMap = new Map();
  const liveWithoutWave = [];

  for (const game of liveGames) {
    const wave = getWaveNumber(game.tags);
    if (!wave) {
      liveWithoutWave.push(game);
      continue;
    }
    if (!waveMap.has(wave)) waveMap.set(wave, []);
    waveMap.get(wave).push(game);
  }

  const sortedWaves = Array.from(waveMap.keys()).sort((a, b) => a - b);

  const summaryLines = [
    `- Total games in registry: ${games.length}`,
    `- Live games: ${liveGames.length}`,
    `- Upcoming games: ${upcomingGames.length}`,
    `- Live games with launch-wave tags: ${sortedWaves.reduce((acc, wave) => acc + waveMap.get(wave).length, 0)}`,
  ].join('\n');

  const waveSections = sortedWaves
    .map((wave) => {
      const waveGames = waveMap
        .get(wave)
        .slice()
        .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.slug.localeCompare(b.slug));

      const rows = waveGames
        .map((g, index) => `| ${index + 1} | ${g.title} | \`${g.slug}\` | ${g.releaseDate} |`)
        .join('\n');

      return `## Wave-${wave} (${waveGames.length})\n\n| # | Game | Slug | Release Date |\n|---|------|------|--------------|\n${rows}`;
    })
    .join('\n\n');

  const liveWithoutWaveSection = liveWithoutWave.length > 0
    ? `## Live Games Without launch-wave Tag (${liveWithoutWave.length})\n\n${liveWithoutWave
      .slice()
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map((g) => `- ${g.title} (\`${g.slug}\`)`)
      .join('\n')}`
    : '## Live Games Without launch-wave Tag (0)\n\n- none';

  const upcomingSection = upcomingGames.length > 0
    ? `## Upcoming Games (${upcomingGames.length})\n\n${upcomingGames
      .slice()
      .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.slug.localeCompare(b.slug))
      .map((g) => `- ${g.title} (\`${g.slug}\`) — ${g.releaseDate}`)
      .join('\n')}`
    : '## Upcoming Games (0)\n\n- none';

  return `# Games Launch Report (Auto-Derived)\n\nGenerated-From-Hash: ${sourceHash}\n\nSource: \`src/lib/games-registry.ts\`\n\n## Summary\n\n${summaryLines}\n\n${waveSections}\n\n${liveWithoutWaveSection}\n\n${upcomingSection}\n`;
}

function main() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Games registry not found at ${REGISTRY_PATH}`);
  }

  const source = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const games = parseGamesRegistry(source);

  if (games.length === 0) {
    throw new Error('No game entries were parsed from games registry.');
  }

  const sourceHash = crypto.createHash('sha256').update(source).digest('hex').slice(0, 12);
  const markdown = toMarkdown(games, sourceHash);
  fs.writeFileSync(OUTPUT_PATH, markdown, 'utf8');

  console.log('🎮 Games launch report generated');
  console.log(`   Output: ${path.relative(ROOT, OUTPUT_PATH)}`);
  console.log(`   Total:  ${games.length}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  parseGamesRegistry,
  getWaveNumber,
  toMarkdown,
  main,
};
