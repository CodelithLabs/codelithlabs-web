import { Metadata } from "next";

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
      "Meet the engineers building 100+ free online tools at CodelithLabs.",
    url: "https://codelithlabs.in/team",
    type: "website",
    siteName: "CodelithLabs",
  },
  alternates: { canonical: "https://codelithlabs.in/team" },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
