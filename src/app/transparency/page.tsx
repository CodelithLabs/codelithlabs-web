// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/transparency/page.tsx
// Server Component — Fetches live GitHub stats at build time, passes to
// the client-side dashboard. With `output: 'export'` the fetch runs once
// during `next build`; revalidate is effectively ignored but kept for
// forward-compatibility if we ever move to ISR.
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from "next";
import {
  TransparencyDashboardClient,
  MemberStats,
} from "@/components/transparency/TransparencyDashboardClient";

// ── SEO Metadata ────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Financial Transparency — CodelithLabs",
  description:
    "CodelithLabs is 100% bootstrapped through Razorpay donations from core members. View our real financial data, infrastructure costs, and live GitHub contribution metrics.",
  keywords: [
    "codelithlabs transparency",
    "bootstrapped startup",
    "open source funding",
    "razorpay donations",
    "financial transparency",
  ],
  openGraph: {
    title: "Financial Transparency — CodelithLabs",
    description:
      "Bootstrapped & Open. View our real finances, infrastructure costs, and live GitHub metrics.",
    type: "website",
    url: "https://codelithlabs.in/transparency/",
  },
  alternates: {
    canonical: "https://codelithlabs.in/transparency/",
  },
};

// ── GitHub API Helper ───────────────────────────────────────────────────

async function fetchGitHubStats(
  username: string
): Promise<{ commits: number; pullRequests: number }> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [commitsRes, prsRes] = await Promise.all([
      fetch(
        `https://api.github.com/search/commits?q=author:${username}`,
        {
          headers: {
            ...headers,
            // The commits search endpoint requires this preview header
            Accept: "application/vnd.github.cloak-preview+json",
          },
          next: { revalidate: 3600 },
        }
      ),
      fetch(
        `https://api.github.com/search/issues?q=author:${username}+type:pr`,
        {
          headers,
          next: { revalidate: 3600 },
        }
      ),
    ]);

    const commits = commitsRes.ok
      ? ((await commitsRes.json()).total_count ?? 0)
      : 0;
    const pullRequests = prsRes.ok
      ? ((await prsRes.json()).total_count ?? 0)
      : 0;

    return { commits, pullRequests };
  } catch {
    // Graceful fallback — API unreachable or rate-limited at build time
    return { commits: 0, pullRequests: 0 };
  }
}

// ── Core Team Definitions ───────────────────────────────────────────────

const coreTeam = [
  {
    name: "Prasanta Ray",
    role: "Founder & CEO",
    github: "Prasanta-ray",
    contribution: "₹2,431",
    focus: ["Architecture", "Backend", "DevOps", "Security", "Financials"],
  },
  {
    name: "Donbil Mwshary",
    role: "Co-Founder & CTO",
    github: "Donbili69",
    contribution: "₹244",
    focus: ["Frontend", "Infrastructure", "Open Source"],
  },
  {
    name: "MD Harun Mollah",
    role: "Core Member",
    github: "harun-mollah",
    contribution: "₹100",
    focus: ["Development", "Testing", "Community"],
  },
];

// ── Page (Async Server Component) ───────────────────────────────────────

export default async function TransparencyPage() {
  // Fetch live GitHub stats for each member (runs at build time)
  const members: MemberStats[] = await Promise.all(
    coreTeam.map(async (member) => {
      const stats = await fetchGitHubStats(member.github);
      return { ...member, ...stats };
    })
  );

  return <TransparencyDashboardClient members={members} />;
}
