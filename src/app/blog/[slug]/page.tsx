// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/blog/[slug]/page.tsx
// Dynamic blog post page with full markdown rendering + SEO schemas
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getAllBlogSlugs, getRelatedBlogPosts } from "@/lib/blog-loader";
import { GiscusComments } from "@/components/blog/GiscusComments";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { BlogAdTop, BlogAdMid, BlogAdBottom } from "@/components/ads/BlogAds";
import { BlogShareButtons } from "@/components/blog/BlogShareButtons";
import { PopularTools } from "@/components/blog/PopularTools";
import { JsonLdScript } from "@/components/security/JsonLdScript";
import {
  getLocaleUrl,
  getLocaleAlternates,
  getOgAlternateLocales,
  getOgLocale,
  getPrimaryLocaleCanonical,
} from "@/lib/locale-meta";
import { defaultLocale, type Locale } from "@/i18n/request";

// ─── Static Params ───────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string; locale?: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post Not Found — CodelithLabs" };

  const fm = post.frontmatter;
  const canonicalPath = `/blog/${fm.slug}/`;
  const canonicalUrl = getPrimaryLocaleCanonical(canonicalPath);
  const { languages } = getLocaleAlternates(canonicalPath, "en");
  const ogImage = `https://codelithlabs.in/api/og?${new URLSearchParams({
    name: fm.title,
    category: 'developer',
    label: fm.category || 'Blog',
    locale: defaultLocale,
    path: '/en/blog',
    subtitle: fm.description.slice(0, 70),
  }).toString()}`;

  return {
    title: `${fm.title} | CodelithLabs Blog`,
    description: fm.description,
    keywords: fm.tags?.join(", "),
    openGraph: {
      title: fm.title,
      description: fm.description,
      url: canonicalUrl,
      type: "article",
      siteName: "CodelithLabs",
      publishedTime: fm.datePublished,
      modifiedTime: fm.dateModified,
      authors: [fm.author],
      tags: fm.tags,
      section: fm.category,
      locale: getOgLocale("en"),
      alternateLocale: getOgAlternateLocales("en"),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${fm.title} — CodelithLabs Blog`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: { index: true, follow: true },
  };
}

// ─── Page Component ──────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const relatedPosts = await getRelatedBlogPosts(slug, 3);

  const fm = post.frontmatter;
  const activeLocale = locale ?? defaultLocale;
  const entityUrl = getLocaleUrl(`/blog/${fm.slug}/`, activeLocale);
  const ogImage = `https://codelithlabs.in/api/og?${new URLSearchParams({
    name: fm.title,
    category: 'developer',
    label: fm.category || 'Blog',
    locale: activeLocale,
    path: `/${activeLocale}/blog`,
    subtitle: fm.description.slice(0, 70),
  }).toString()}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: fm.title,
    description: fm.description,
    datePublished: fm.datePublished,
    dateModified: fm.dateModified,
    author: { "@type": "Person", name: fm.author },
    image: ogImage,
    inLanguage: activeLocale,
    publisher: {
      "@type": "Organization",
      name: "CodelithLabs",
      url: "https://codelithlabs.in",
    },
    mainEntityOfPage: entityUrl,
    url: entityUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getLocaleUrl('/', activeLocale) },
      { "@type": "ListItem", position: 2, name: "Blog", item: getLocaleUrl('/blog/', activeLocale) },
      { "@type": "ListItem", position: 3, name: fm.title, item: entityUrl },
    ],
  };

  return (
    <>
      <JsonLdScript id="blog-post-schema" data={articleSchema} />
      <JsonLdScript id="blog-breadcrumb-schema" data={breadcrumbSchema} />

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

          {/* Ad — leaderboard above article */}
          <BlogAdTop />

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

            {/* Social share buttons */}
            <div className="mt-6">
              <BlogShareButtons
                url={entityUrl}
                title={fm.title}
                description={fm.description}
              />
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

          {/* Ad — rectangle between body and tags */}
          <BlogAdMid />

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

          {/* Popular Tools — internal linking for SEO */}
          <PopularTools />

          {/* Related blog guides — contextual internal links */}
          {relatedPosts.length > 0 && (
            <section className="mt-10 pt-8 border-t border-zinc-800">
              <h2 className="text-xl font-semibold text-white mb-4">Related Guides</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.frontmatter.slug}
                    href={`/blog/${related.frontmatter.slug}`}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-blue-500/40 transition-colors"
                  >
                    <p className="text-xs text-blue-400 mb-2">{related.frontmatter.category || "Guide"}</p>
                    <h3 className="text-sm font-medium text-zinc-100 leading-snug line-clamp-3">
                      {related.frontmatter.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
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

          {/* Newsletter Signup */}
          <div className="mt-12">
            <NewsletterSignup />
          </div>

          {/* Comments (Giscus — GitHub Discussions) */}
          <GiscusComments term={fm.slug} />

          {/* Ad — leaderboard below comments */}
          <BlogAdBottom />
        </article>
      </div>
    </>
  );
}
