// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/blog/[slug]/page.tsx
// Dynamic blog post page with full markdown rendering + SEO schemas
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getAllBlogSlugs } from "@/lib/blog-loader";

// ─── Static Params ───────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post Not Found — CodelithLabs" };

  const fm = post.frontmatter;
  return {
    title: `${fm.title} | CodelithLabs Blog`,
    description: fm.description,
    keywords: fm.tags?.join(", "),
    openGraph: {
      title: fm.title,
      description: fm.description,
      url: `https://codelithlabs.in/blog/${fm.slug}`,
      type: "article",
      siteName: "CodelithLabs",
      publishedTime: fm.datePublished,
      modifiedTime: fm.dateModified,
      authors: [fm.author],
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.description,
    },
    alternates: { canonical: `https://codelithlabs.in/blog/${fm.slug}` },
    robots: { index: true, follow: true },
  };
}

// ─── Page Component ──────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const fm = post.frontmatter;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: fm.title,
    description: fm.description,
    datePublished: fm.datePublished,
    dateModified: fm.dateModified,
    author: { "@type": "Person", name: fm.author },
    publisher: {
      "@type": "Organization",
      name: "CodelithLabs",
      url: "https://codelithlabs.in",
    },
    mainEntityOfPage: `https://codelithlabs.in/blog/${fm.slug}`,
    url: `https://codelithlabs.in/blog/${fm.slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://codelithlabs.in" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://codelithlabs.in/blog" },
      { "@type": "ListItem", position: 3, name: fm.title, item: `https://codelithlabs.in/blog/${fm.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-[#0a0a0a] py-12 sm:py-16 px-4 sm:px-6">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-zinc-300 transition">Home</Link>
            <span className="text-zinc-700">/</span>
            <Link href="/blog" className="hover:text-zinc-300 transition">Blog</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300 truncate">{fm.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            {fm.category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
                {fm.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              {fm.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              <span>By {fm.author}</span>
              <span>·</span>
              <time dateTime={fm.datePublished}>{fm.datePublished}</time>
              <span>·</span>
              <span>{fm.readingTime ?? 5} min read</span>
            </div>
          </header>

          {/* Body */}
          <div
            className="prose prose-invert prose-lg max-w-none
                       prose-headings:text-white prose-headings:font-semibold
                       prose-p:text-zinc-400 prose-p:leading-relaxed
                       prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-zinc-200
                       prose-ul:text-zinc-400 prose-ol:text-zinc-400
                       prose-li:my-1
                       prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                       prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl
                       prose-blockquote:border-blue-500/50 prose-blockquote:text-zinc-400
                       prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Tags */}
          {fm.tags && fm.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-500 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {fm.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-zinc-800/50 text-zinc-400 text-xs rounded-full border border-zinc-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
