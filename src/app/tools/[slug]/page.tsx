// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/tools/[slug]/page.tsx
// Dynamic route handler for all 199+ tools
// Each tool gets a unique URL: /tools/word-counter, /tools/json-formatter, etc.
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS_REGISTRY, getToolBySlug, getAllSlugs } from '@/lib/tools-registry';
import { TOOL_CATEGORIES } from '@/types/tool';
import { ToolLayout } from '@/components/tools/ToolLayout';

// Dynamic imports for tool implementations (code-split each tool)
import dynamic from 'next/dynamic';

// ═══════════════════════════════════════════════════════════════════════════
// TOOL COMPONENT LOADER
// Maps slugs to their implementation components (lazy-loaded)
// ═══════════════════════════════════════════════════════════════════════════

const toolComponents: Record<string, React.ComponentType> = {
  // Text Tools
  'word-counter': dynamic(() => import('@/components/tools/impl/WordCounter')),
  'case-converter': dynamic(() => import('@/components/tools/impl/CaseConverter')),
  'text-to-slug': dynamic(() => import('@/components/tools/impl/TextToSlug')),
  
  // Developer Tools
  'json-formatter': dynamic(() => import('@/components/tools/impl/JsonFormatter')),
  'base64-encoder': dynamic(() => import('@/components/tools/impl/Base64Encoder')),
  'url-encoder': dynamic(() => import('@/components/tools/impl/UrlEncoder')),
  'regex-tester': dynamic(() => import('@/components/tools/impl/RegexTester')),
  
  // Generators
  'uuid-generator': dynamic(() => import('@/components/tools/impl/UuidGenerator')),
  'password-generator': dynamic(() => import('@/components/tools/impl/PasswordGenerator')),
  'qr-code-generator': dynamic(() => import('@/components/tools/impl/QrCodeGenerator')),
  
  // Converters
  'unix-timestamp-converter': dynamic(() => import('@/components/tools/impl/UnixTimestamp')),
  'markdown-to-html': dynamic(() => import('@/components/tools/impl/MarkdownToHtml')),
  
  // Security
  'hash-generator': dynamic(() => import('@/components/tools/impl/HashGenerator')),
  
  // Add more mappings as you implement tools...
};

// Fallback component for tools without implementation yet
function ToolPlaceholder({ name }: { name: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-white mb-2">{name}</h2>
      <p className="text-zinc-400">This tool is coming soon!</p>
      <p className="text-zinc-500 text-sm mt-2">
        Check back later or request priority implementation.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STATIC PARAMS - Pre-generate all tool routes at build time
// ═══════════════════════════════════════════════════════════════════════════

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ═══════════════════════════════════════════════════════════════════════════
// METADATA - Dynamic SEO for each tool
// ═══════════════════════════════════════════════════════════════════════════

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    return { title: 'Tool Not Found' };
  }

  const category = TOOL_CATEGORIES[tool.category];
  
  return {
    title: `${tool.name} - Free Online Tool`,
    description: tool.description,
    keywords: [...tool.keywords, category.name, 'online tool', 'free', 'codelithlabs'].join(', '),
    openGraph: {
      title: `${tool.name} | CodelithLabs Tools`,
      description: tool.description,
      url: `https://codelithlabs.in/tools/${tool.slug}`,
      type: 'website',
      siteName: 'CodelithLabs',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.name,
      description: tool.description,
    },
    alternates: {
      canonical: `https://codelithlabs.in/tools/${tool.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    notFound();
  }

  // Get the tool implementation component or use placeholder
  const ToolComponent = toolComponents[slug] || (() => <ToolPlaceholder name={tool.name} />);

  return (
    <ToolLayout tool={tool}>
      <ToolComponent />
    </ToolLayout>
  );
}
