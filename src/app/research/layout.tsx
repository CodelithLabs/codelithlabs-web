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
    url: "https://codelithlabs.in/research",
    type: "website",
    siteName: "CodelithLabs",
  },
  alternates: { canonical: "https://codelithlabs.in/research" },
};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
