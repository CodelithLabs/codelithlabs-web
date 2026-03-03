#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolsDir = path.join(__dirname, '../src/components/tools/impl');

console.log(`📦 Adding React.memo to tool components in ${toolsDir}`);

const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.tsx')).sort();
console.log(`Found ${files.length} tool components\n`);

let processed = 0;
let skipped = 0;

files.forEach((file) => {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has memo
  if (content.includes('export default memo(')) {
    console.log(`⊘ ${file} - already memoized`);
    skipped++;
    return;
  }

  // Add memo to imports from 'react'
  if (content.includes("from 'react'")) {
    const reactImportMatch = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]react['"]/);
    if (reactImportMatch) {
      const imports = reactImportMatch[1];
      if (!imports.includes('memo')) {
        const newImports = `${imports}, memo`;
        content = content.replace(
          /import\s*{\s*([^}]+)\s*}\s*from\s*['"]react['"]/,
          `import { ${newImports} } from 'react'`
        );
      }
    }
  } else if (content.includes('import') && content.includes('react')) {
    // Add memo import if not present
    content = `import { memo } from 'react';\n` + content;
  }

  // Wrap export default function with memo
  content = content.replace(
    /export default function (\w+)\(/,
    'const $1Component = function $1('
  );
  
  // Add the memo wrapper at the end before closing brace
  const lastBraceIndex = content.lastIndexOf('}');
  if (lastBraceIndex !== -1) {
    const componentName = file.replace('.tsx', '');
    content = content.slice(0, lastBraceIndex + 1) + 
              `\n\nexport default memo(${componentName}Component);` +
              content.slice(lastBraceIndex + 1);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ ${file} - memoized`);
  processed++;
});

console.log(`\n✅ Complete: ${processed} updated, ${skipped} already optimized`);
