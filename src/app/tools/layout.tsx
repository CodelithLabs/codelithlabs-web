// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/tools/layout.tsx
// SEO Metadata & JSON-LD Structured Data for the /tools hub page
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from "next";
import { TOOLS_REGISTRY } from "@/lib/tools-registry";

// ── SEO Metadata ────────────────────────────────────────────────────────

const toolCount = TOOLS_REGISTRY.length;

export const metadata: Metadata = {
  title: `Free Online Developer Tools — ${toolCount}+ Utilities | CodelithLabs`,
  description: `Browse ${toolCount}+ free online tools: JSON formatter, image compressor, password generator, SEO analyzers, financial calculators, code converters & more. 100% client-side processing — no uploads, no tracking, instant results.`,
  keywords: [
    "free online tools",
    "developer tools",
    "image tools",
    "text tools",
    "SEO tools",
    "financial calculators",
    "code converter",
    "password generator",
    "json formatter",
    "base64 encoder",
    "hash generator",
    "privacy-first tools",
    "client-side processing",
    "browser tools",
    "web utilities",
    "codelithlabs",
    "productivity tools",
    "AI tools",
    "converter tools",
    "security tools",
  ],
  openGraph: {
    title: `Free Online Developer Tools — ${toolCount}+ Utilities`,
    description: `${toolCount}+ free browser-based tools for developers, designers & creators. JSON, image, text, SEO, finance & more — zero server processing.`,
    url: "https://codelithlabs.in/tools/",
    type: "website",
    siteName: "CodelithLabs",
    locale: "en_US",
    images: [
      {
        url: "https://codelithlabs.in/og-image.png",
        width: 1200,
        height: 630,
        alt: `CodelithLabs — ${toolCount}+ Free Online Tools`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Free Online Developer Tools — ${toolCount}+ Utilities | CodelithLabs`,
    description: `${toolCount}+ free client-side tools for developers, designers & content creators. No uploads, no tracking.`,
    images: ["https://codelithlabs.in/og-image.png"],
  },
  alternates: {
    canonical: "https://codelithlabs.in/tools/",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

// ── JSON-LD Structured Data ─────────────────────────────────────────────

function buildJsonLd() {
  // Pick top tools for the ItemList (first 20 for rich snippet coverage)
  const listItems = TOOLS_REGISTRY.slice(0, 20).map((tool, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: tool.name,
    url: `https://codelithlabs.in/tools/${tool.slug}/`,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Free Online Developer Tools — ${toolCount}+ Utilities`,
    description: `Browse ${toolCount}+ free online tools for developers, designers, and content creators. 100% client-side processing.`,
    url: "https://codelithlabs.in/tools/",
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "CodelithLabs",
      url: "https://codelithlabs.in",
    },
    provider: {
      "@type": "Organization",
      name: "CodelithLabs",
      url: "https://codelithlabs.in",
      logo: "https://codelithlabs.in/icon.png",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: toolCount,
      itemListElement: listItems,
    },
  };
}

// ── Layout Component ────────────────────────────────────────────────────

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />
      {children}
    </>
  );
}
