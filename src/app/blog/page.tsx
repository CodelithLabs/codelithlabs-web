// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/blog/page.tsx
// Blog landing page — pulls from content/blog/*.md
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog-loader";

export const metadata: Metadata = {
  title: "Blog — Developer Insights & Tool Guides | CodelithLabs",
  description:
    "Technical tutorials, tool guides, and developer insights from the CodelithLabs engineering team. Learn JSON, regex, web performance, security, and more.",
  keywords: [
    "developer blog",
    "technical tutorials",
    "tool guides",
    "json guide",
    "regex tutorial",
    "web performance",
  ],
  alternates: { canonical: "https://codelithlabs.in/blog/" },
  openGraph: {
    title: "Blog — CodelithLabs Developer Insights",
    description:
      "Technical tutorials, tool guides, and developer tips from the CodelithLabs engineering team.",
    url: "https://codelithlabs.in/blog/",
    type: "website",
    siteName: "CodelithLabs",
  },
  robots: { index: true, follow: true },
};

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY COLORS
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORY_COLORS: Record<string, string> = {
  Guide: "#3B82F6",
  Tutorial: "#8B5CF6",
  Performance: "#10B981",
  Security: "#EF4444",
  SEO: "#F59E0B",
  Engineering: "#06B6D4",
  Developer: "#8B5CF6",
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "CodelithLabs Developer Blog",
    description:
      "Technical tutorials and developer insights from CodelithLabs.",
    url: "https://codelithlabs.in/blog/",
    publisher: {
      "@type": "Organization",
      name: "CodelithLabs",
      url: "https://codelithlabs.in",
    },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.frontmatter.title,
      description: p.frontmatter.description,
      datePublished: p.frontmatter.datePublished,
      dateModified: p.frontmatter.dateModified,
      author: { "@type": "Person", name: p.frontmatter.author },
      url: `https://codelithlabs.in/blog/${p.frontmatter.slug}/`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <div className="min-h-screen bg-[#0a0a0a] py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
              <Link href="/" className="hover:text-zinc-300 transition">
                Home
              </Link>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300">Blog</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Developer Blog
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Technical tutorials, tool guides, and engineering insights from
              the CodelithLabs team. Learn to build better software, one article
              at a time.
            </p>
          </header>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => {
                const fm = post.frontmatter;
                const catColor =
                  CATEGORY_COLORS[fm.category ?? "Guide"] || "#6366F1";
                return (
                  <Link
                    key={fm.slug}
                    href={`/blog/${fm.slug}`}
                    className="block p-6 border border-zinc-800 rounded-xl bg-zinc-900/30
                               hover:border-zinc-600 hover:bg-zinc-900/50 transition-all group"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {fm.category && (
                        <span
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${catColor}15`,
                            color: catColor,
                            border: `1px solid ${catColor}30`,
                          }}
                        >
                          {fm.category}
                        </span>
                      )}
                      <span className="text-xs text-zinc-500">
                        {fm.readingTime ?? 5} min read
                      </span>
                      <span className="text-xs text-zinc-600">
                        {fm.datePublished}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                      {fm.title}
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                      {fm.description}
                    </p>

                    {fm.tags && fm.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {fm.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-full bg-zinc-800/50 text-zinc-500 border border-zinc-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 border border-zinc-800 rounded-xl bg-zinc-900/20 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Blog Coming Soon
              </h3>
              <p className="text-zinc-400 text-sm">
                We&apos;re preparing developer tutorials and tool guides. Check
                back soon!
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-6 border border-zinc-800 rounded-xl bg-zinc-900/20 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              More Articles Coming Soon
            </h3>
            <p className="text-zinc-400 text-sm">
              We publish new developer guides and tutorials regularly. Explore
              our{" "}
              <Link href="/tools" className="text-blue-400 hover:underline">
                100+ free tools
              </Link>{" "}
              in the meantime.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
