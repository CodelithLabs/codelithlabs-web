// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/blog/page.tsx
// Blog landing page — Developer tutorials, tool guides, tech insights
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Developer Insights & Tool Guides | CodelithLabs',
  description: 'Technical tutorials, tool guides, and developer insights from the CodelithLabs engineering team. Learn JSON, regex, web performance, security, and more.',
  keywords: ['developer blog', 'technical tutorials', 'tool guides', 'json guide', 'regex tutorial', 'web performance'],
  alternates: { canonical: 'https://codelithlabs.in/blog' },
  openGraph: {
    title: 'Blog — CodelithLabs Developer Insights',
    description: 'Technical tutorials, tool guides, and developer tips from the CodelithLabs engineering team.',
    url: 'https://codelithlabs.in/blog',
    type: 'website',
    siteName: 'CodelithLabs',
  },
  robots: { index: true, follow: true },
};

// ═══════════════════════════════════════════════════════════════════════════
// BLOG POST DATA
// ═══════════════════════════════════════════════════════════════════════════

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  tools?: string[];  // related tool slugs
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'complete-guide-json-formatting',
    title: 'The Complete Guide to JSON Formatting & Validation',
    excerpt: 'Learn about JSON syntax, common errors, formatting best practices, and how to validate JSON structures like a pro. Includes real-world examples and debugging tips.',
    date: '2026-03-01',
    category: 'Guide',
    readTime: '8 min read',
    tools: ['json-formatter', 'json-to-csv', 'json-to-yaml'],
  },
  {
    slug: 'mastering-regex-patterns',
    title: 'Mastering Regular Expressions: From Basics to Advanced Patterns',
    excerpt: 'A hands-on guide to regex patterns covering character classes, quantifiers, lookaheads, and practical examples for email, URL, and phone validation.',
    date: '2026-03-01',
    category: 'Tutorial',
    readTime: '12 min read',
    tools: ['regex-tester', 'regex-generator'],
  },
  {
    slug: 'web-image-optimization-guide',
    title: 'Web Image Optimization: Formats, Compression & Performance',
    excerpt: 'Everything you need to know about optimizing images for the web — WebP, AVIF, lazy loading, responsive images, and Core Web Vitals impact.',
    date: '2026-03-01',
    category: 'Performance',
    readTime: '10 min read',
    tools: ['image-compressor', 'webp-converter', 'image-resizer'],
  },
  {
    slug: 'password-security-best-practices',
    title: 'Password Security in 2026: Best Practices for Developers',
    excerpt: 'Understanding password hashing, bcrypt vs scrypt, strength requirements, and why client-side generation matters for privacy.',
    date: '2026-03-01',
    category: 'Security',
    readTime: '7 min read',
    tools: ['password-generator', 'password-strength-checker', 'hash-generator'],
  },
  {
    slug: 'jwt-tokens-explained',
    title: 'JWT Tokens Explained: Structure, Signing, and Common Pitfalls',
    excerpt: 'Deep dive into JSON Web Tokens — header, payload, signature, RS256 vs HS256, expiration handling, and security considerations.',
    date: '2026-03-01',
    category: 'Security',
    readTime: '9 min read',
    tools: ['jwt-decoder', 'base64-encoder'],
  },
  {
    slug: 'seo-meta-tags-complete-guide',
    title: 'SEO Meta Tags: The Complete Guide for 2026',
    excerpt: 'How to craft title tags, meta descriptions, Open Graph tags, Twitter Cards, and structured data that boost your click-through rates.',
    date: '2026-03-01',
    category: 'SEO',
    readTime: '11 min read',
    tools: ['meta-tag-generator', 'open-graph-generator', 'robots-txt-generator'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY COLORS
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORY_COLORS: Record<string, string> = {
  Guide: '#3B82F6',
  Tutorial: '#8B5CF6',
  Performance: '#10B981',
  Security: '#EF4444',
  SEO: '#F59E0B',
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function BlogPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "CodelithLabs Developer Blog",
    description: "Technical tutorials and developer insights from CodelithLabs.",
    url: "https://codelithlabs.in/blog",
    publisher: {
      "@type": "Organization",
      name: "CodelithLabs",
      url: "https://codelithlabs.in"
    }
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
              <Link href="/" className="hover:text-zinc-300 transition">Home</Link>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300">Blog</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Developer Blog
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Technical tutorials, tool guides, and engineering insights from the CodelithLabs team. 
              Learn to build better software, one article at a time.
            </p>
          </header>

          {/* Posts Grid */}
          <div className="space-y-6">
            {BLOG_POSTS.map(post => {
              const catColor = CATEGORY_COLORS[post.category] || '#6366F1';
              return (
                <article 
                  key={post.slug}
                  className="block p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 
                             hover:border-zinc-600 hover:bg-zinc-900/50 transition-all group"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span 
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${catColor}15`,
                        color: catColor,
                        border: `1px solid ${catColor}30`
                      }}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs text-zinc-500">{post.readTime}</span>
                    <span className="text-xs text-zinc-600">{post.date}</span>
                  </div>

                  <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  {/* Related tools links */}
                  {post.tools && post.tools.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tools.map(toolSlug => (
                        <Link
                          key={toolSlug}
                          href={`/tools/${toolSlug}`}
                          className="text-xs px-2.5 py-1 rounded-full bg-zinc-800/50 text-zinc-400 
                                     hover:text-blue-400 hover:bg-zinc-800 transition-colors border border-zinc-700/50"
                        >
                          Try {toolSlug.replace(/-/g, ' ')} →
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-12 p-6 border border-zinc-800 rounded-xl bg-zinc-900/20 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">More Articles Coming Soon</h3>
            <p className="text-zinc-400 text-sm">
              We&apos;re publishing new developer guides and tutorials every week. 
              Check back regularly for fresh content.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
