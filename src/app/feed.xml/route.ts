// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/feed.xml/route.ts
// RSS 2.0 feed for the CodelithLabs blog
// ═══════════════════════════════════════════════════════════════════════════

import { getAllBlogPosts } from '@/lib/blog-loader';

const SITE_URL = 'https://codelithlabs.in';

export async function GET() {
  const posts = await getAllBlogPosts();

  const items = posts
    .map((post) => {
      const fm = post.frontmatter;
      return `    <item>
      <title><![CDATA[${fm.title}]]></title>
      <link>${SITE_URL}/blog/${fm.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${fm.slug}/</guid>
      <description><![CDATA[${fm.description}]]></description>
      <pubDate>${new Date(fm.datePublished).toUTCString()}</pubDate>
      <author>team@codelithlabs.in (${fm.author})</author>
      ${fm.category ? `<category>${fm.category}</category>` : ''}
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CodelithLabs Developer Blog</title>
    <link>${SITE_URL}/blog/</link>
    <description>Technical tutorials, tool guides, and developer insights from the CodelithLabs engineering team.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml/" rel="self" type="application/rss+xml" />
    <managingEditor>team@codelithlabs.in (CodelithLabs Team)</managingEditor>
    <webMaster>team@codelithlabs.in (CodelithLabs Team)</webMaster>
    <image>
      <url>${SITE_URL}/icon.png</url>
      <title>CodelithLabs</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
