import { Metadata } from "next";
import { JsonLdScript } from "@/components/security/JsonLdScript";

export const metadata: Metadata = {
  title: "Projects & Portfolio — Open-Source Engineering",
  description:
    "Explore CodelithLabs open-source projects including VectorDefense (C++ game engine) and CITK-Connect (campus web platform). Built with modern architectures and best practices.",
  keywords: [
    "CodelithLabs projects",
    "open source",
    "VectorDefense",
    "CITK-Connect",
    "C++ game engine",
    "campus platform",
    "software portfolio",
  ],
  openGraph: {
    title: "Projects — CodelithLabs",
    description:
      "Open-source engineering projects by CodelithLabs — game engines, campus platforms, and developer tools.",
    url: "https://codelithlabs.in/projects/",
    type: "website",
    siteName: "CodelithLabs",
  },
  alternates: { canonical: "https://codelithlabs.in/projects/" },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdScript
        id="projects-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "CodelithLabs Projects",
          description:
            "Open-source engineering projects by CodelithLabs.",
          url: "https://codelithlabs.in/projects/",
          provider: {
            "@type": "Organization",
            name: "CodelithLabs",
            url: "https://codelithlabs.in",
          },
        }}
      />
      <JsonLdScript
        id="projects-breadcrumb-schema"
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
              name: "Projects",
              item: "https://codelithlabs.in/projects/",
            },
          ],
        }}
      />
      {children}
    </>
  );
}
