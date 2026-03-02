import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research & Engineering — Technical Papers | CodelithLabs",
  description:
    "Technical papers, architectural decisions, and engineering post-mortems from the CodelithLabs team. Systems engineering, web architecture, DevOps, and more.",
  keywords: [
    "engineering research",
    "technical papers",
    "web architecture",
    "systems engineering",
    "CodelithLabs research",
  ],
  openGraph: {
    title: "Research & Engineering — CodelithLabs",
    description:
      "Technical papers and engineering insights from the CodelithLabs team.",
    url: "https://codelithlabs.in/research/",
    type: "website",
    siteName: "CodelithLabs",
  },
  alternates: { canonical: "https://codelithlabs.in/research/" },
};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "CodelithLabs Research & Engineering",
            description:
              "Technical papers and engineering insights from the CodelithLabs team.",
            url: "https://codelithlabs.in/research/",
            provider: {
              "@type": "Organization",
              name: "CodelithLabs",
              url: "https://codelithlabs.in",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://codelithlabs.in",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Research",
                item: "https://codelithlabs.in/research/",
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
