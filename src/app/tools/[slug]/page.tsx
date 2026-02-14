// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/tools/[slug]/page.tsx
// Dynamic tool page with proper error handling
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllSlugs } from '@/lib/tools-registry';
import { TOOL_CATEGORIES } from '@/types/tool';
import { ToolLayout } from '@/components/tools/ToolLayout';
import ToolMapper from './tool-mapper';

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
    return {
      title: 'Tool Not Found - CodelithLabs',
      description: 'The requested tool could not be found.'
    };
  }

  const category = TOOL_CATEGORIES[tool.category];

  return {
    title: `${tool.name} - Free Online Tool | CodelithLabs`,
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

  // Show 404 if tool doesn't exist
  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <ToolMapper slug={slug} toolName={tool.name} />
    </ToolLayout>
  );
}
