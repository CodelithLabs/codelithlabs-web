import { Metadata } from "next";
import { JsonLdScript } from "@/components/security/JsonLdScript";

export const metadata: Metadata = {
  title: "Meet the Team — CodelithLabs Engineering Leadership",
  description:
    "Meet the expert team behind CodelithLabs — founders and engineers driving innovation in cloud infrastructure, system architecture, and full-stack development. Based in Kokrajhar, Assam, India.",
  keywords: [
    "CodelithLabs team",
    "Prasanta Ray",
    "Donbil Mwshahary",
    "Harun Al Roshid",
    "software engineering team",
    "Indian tech startup",
  ],
  openGraph: {
    title: "Meet the CodelithLabs Team",
    description:
      "Meet the engineers building 200+ free online tools at CodelithLabs.",
    url: "https://codelithlabs.in/team/",
    type: "website",
    siteName: "CodelithLabs",
  },
  alternates: { canonical: "https://codelithlabs.in/team/" },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdScript
        id="team-about-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "CodelithLabs Team",
          description:
            "Meet the engineering team behind CodelithLabs.",
          url: "https://codelithlabs.in/team/",
          mainEntity: [
            {
              "@type": "Person",
              name: "Prasanta Ray",
              jobTitle: "CEO & Founder",
              worksFor: {
                "@type": "Organization",
                name: "CodelithLabs",
              },
              url: "https://prasanta.codelithlabs.in",
            },
            {
              "@type": "Person",
              name: "Donbil Mwshahary",
              jobTitle: "Co-Founder & CTO",
              worksFor: {
                "@type": "Organization",
                name: "CodelithLabs",
              },
            },
            {
              "@type": "Person",
              name: "Harun Al Roshid",
              jobTitle: "Co-Founder & COO",
              worksFor: {
                "@type": "Organization",
                name: "CodelithLabs",
              },
            },
          ],
        }}
      />
      <JsonLdScript
        id="team-breadcrumb-schema"
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
              name: "Team",
              item: "https://codelithlabs.in/team/",
            },
          ],
        }}
      />
      {children}
    </>
  );
}
