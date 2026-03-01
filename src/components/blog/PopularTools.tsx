// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/blog/PopularTools.tsx
// Shows a curated grid of popular tool cards inside blog posts.
// Drives internal linking for SEO + user engagement.
// ═══════════════════════════════════════════════════════════════════════════

import Link from 'next/link';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';

/** Curated slugs of the most popular / highest-traffic tools */
const POPULAR_SLUGS = [
  'json-formatter',
  'image-compressor',
  'password-generator',
  'base64-encoder',
  'word-counter',
  'hash-generator',
  'color-picker',
  'markdown-to-html',
];

export function PopularTools() {
  const tools = POPULAR_SLUGS.map((slug) =>
    TOOLS_REGISTRY.find((t) => t.slug === slug)
  ).filter(Boolean);

  if (tools.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-zinc-800">
      <h3 className="text-lg font-semibold text-white mb-4">
        Popular Free Tools
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <Link
            key={tool!.slug}
            href={`/tools/${tool!.slug}`}
            className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/40
                       hover:border-blue-500/40 hover:bg-zinc-900 transition-all group"
          >
            <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate">
              {tool!.name}
            </h4>
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
              {tool!.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
