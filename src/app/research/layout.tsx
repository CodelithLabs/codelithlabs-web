import { Metadata } from "next";
import { JsonLdScript } from "@/components/security/JsonLdScript";

export const metadata: Metadata = {
  title: "Research & Engineering — Technical Papers | CodelithLabs",
  description:
    "Technical papers, architectural decisions, and engineering post-mortems from the CodelithLabs team. Deep dives into systems design, web architecture, performance, and DevOps.",
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
      <JsonLdScript
        id="research-collection-schema"
        data={{
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
        }}
      />
      <JsonLdScript
        id="research-breadcrumb-schema"
        data={{
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
        }}
      />
      {children}
    </>
  );
}
