"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  TrendingDown,
  Server,
  Globe,
  Code2,
  Trophy,
  Users,
  GitCommit,
  GitPullRequest,
  Shield,
  Eye,
  Wallet,
  Zap,
  Heart,
  IndianRupee,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface MemberStats {
  name: string;
  role: string;
  github: string;
  commits: number;
  pullRequests: number;
  contribution: string;
  focus: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════════════

function AnimatedBar({
  percentage,
  color,
  delay,
}: {
  percentage: number;
  color: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <div
      ref={ref}
      className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${percentage}%` } : {}}
        transition={{ duration: 1, delay, ease: [0.25, 0.4, 0.25, 1] }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REAL FINANCIAL DATA — CodelithLabs (Bootstrapped)
// ═══════════════════════════════════════════════════════════════════════════

const summaryCards = [
  {
    label: "External Revenue",
    value: "₹0",
    sub: "AdSense not started yet",
    color: "text-zinc-500",
    borderColor: "border-zinc-500/20",
    icon: IndianRupee,
  },
  {
    label: "Total Member Funding",
    value: "₹2,775",
    sub: "100% Razorpay donations",
    color: "text-glow-blue",
    borderColor: "border-glow-blue/20",
    icon: Heart,
  },
  {
    label: "Annual Infra Cost",
    value: "₹3,600",
    sub: "Domain + Server + Maintenance",
    color: "text-amber-400",
    borderColor: "border-amber-500/20",
    icon: Server,
  },
  {
    label: "Member Mandate",
    value: "₹54/mo",
    sub: "Minimum per core member",
    color: "text-glow-cyan",
    borderColor: "border-glow-cyan/20",
    icon: Wallet,
  },
];

const costBreakdown = [
  {
    label: "Ubuntu Test Server (Electricity)",
    amount: "₹2,200/yr",
    percentage: 61,
    color: "#2979FF",
    note: "Running at home",
  },
  {
    label: "Domain Registration (.in)",
    amount: "₹800/yr",
    percentage: 22,
    color: "#00E5FF",
    note: "codelithlabs.in",
  },
  {
    label: "Server Maintenance",
    amount: "₹600/yr",
    percentage: 17,
    color: "#BB86FC",
    note: "Hardware & upkeep",
  },
];

const memberFunding = [
  {
    name: "Prasanta Ray",
    role: "Founder & CEO",
    amount: "₹2,431",
    percentage: 88,
    color: "#2979FF",
  },
  {
    name: "Donbil Mwshary",
    role: "Co-Founder & CTO",
    amount: "₹244",
    percentage: 9,
    color: "#00E5FF",
  },
  {
    name: "MD Harun Mollah",
    role: "Core Member",
    amount: "₹100",
    percentage: 3,
    color: "#00E676",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD CLIENT
// ═══════════════════════════════════════════════════════════════════════════

export function TransparencyDashboardClient({
  members,
}: {
  members: MemberStats[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <main ref={sectionRef} className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── HEADER ───────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-10 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-glow-radial opacity-30" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-glow-blue" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Financial Transparency Report
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Bootstrapped &amp; Open
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            CodelithLabs is 100% internally funded through Razorpay donations
            from our core members. We have zero external revenue — every rupee
            is tracked and publicly disclosed.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs font-mono text-zinc-600">
            <Zap className="w-3 h-3 text-glow-blue" />
            <span>
              All core members contribute a minimum of ₹54/month via Razorpay to
              keep the org alive.
            </span>
          </div>
        </div>
      </section>

      {/* ── SUMMARY CARDS ────────────────────────────────────────── */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`p-5 rounded-xl border ${card.borderColor} bg-white/[0.02]`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-3.5 h-3.5 text-zinc-500" />
                    <p className="text-xs text-zinc-500 font-medium">
                      {card.label}
                    </p>
                  </div>
                  <p
                    className={`text-2xl md:text-3xl font-bold font-mono ${card.color}`}
                  >
                    {card.value}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-1.5">{card.sub}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COST BREAKDOWN & MEMBER FUNDING ──────────────────────── */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Running Costs */}
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Running Costs</h2>
                  <p className="text-xs text-zinc-600">₹3,600/year total</p>
                </div>
              </div>
              <div className="space-y-5">
                {costBreakdown.map((item, i) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-zinc-300">{item.label}</span>
                      <span className="text-xs font-mono text-zinc-400">
                        {item.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-zinc-600">
                        {item.note}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {item.percentage}%
                      </span>
                    </div>
                    <AnimatedBar
                      percentage={item.percentage}
                      color={item.color}
                      delay={i * 0.12}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-white/[0.06] text-[11px] text-zinc-600">
                + Razorpay gateway standard transaction fees on each donation
              </div>
            </div>

            {/* Member Funding */}
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-glow-blue/10 border border-glow-blue/20 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-glow-blue" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Razorpay Contributions</h2>
                  <p className="text-xs text-zinc-600">₹2,775 raised total</p>
                </div>
              </div>
              <div className="space-y-5">
                {memberFunding.map((item, i) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm text-zinc-300">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-zinc-600 ml-2">
                          {item.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-500">
                          {item.amount}
                        </span>
                        <span className="text-xs font-mono text-zinc-400 w-8 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <AnimatedBar
                      percentage={item.percentage}
                      color={item.color}
                      delay={i * 0.12 + 0.3}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400 font-medium">
                    Total Raised
                  </span>
                  <span className="text-lg font-bold font-mono text-glow-blue">
                    ₹2,775
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-2">
                  External revenue (AdSense, Sponsorships, Client Projects):{" "}
                  <span className="text-amber-400">₹0</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFRASTRUCTURE STACK ─────────────────────────────────── */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Server className="w-5 h-5 text-glow-blue" />
            Infrastructure Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Vercel Hosting",
                cost: "₹0",
                status: "Free Tier",
                icon: Globe,
              },
              {
                label: "Domain (.in)",
                cost: "₹800/yr",
                status: "Active",
                icon: Globe,
              },
              {
                label: "Ubuntu Home Server",
                cost: "₹2,200/yr",
                status: "Self-Hosted",
                icon: Server,
              },
              {
                label: "GitHub Actions CI",
                cost: "₹0",
                status: "Free Tier",
                icon: Code2,
              },
              {
                label: "Server Maintenance",
                cost: "₹600/yr",
                status: "Hardware Upkeep",
                icon: Shield,
              },
              {
                label: "Razorpay Gateway",
                cost: "Txn %",
                status: "Payment Processing",
                icon: Wallet,
              },
              {
                label: "Cloudflare CDN",
                cost: "₹0",
                status: "Free Tier",
                icon: Shield,
              },
              {
                label: "Monitoring",
                cost: "₹0",
                status: "Self-Built",
                icon: Zap,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <Icon className="w-4 h-4 text-zinc-500 mb-3" />
                  <p className="text-sm text-white font-medium mb-1">
                    {item.label}
                  </p>
                  <p className="text-lg font-mono font-bold text-glow-blue">
                    {item.cost}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{item.status}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CORE TEAM — LIVE GITHUB METRICS ──────────────────────── */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-glow-purple" />
            Core Team — Live Metrics
          </h2>
          <p className="text-xs text-zinc-600 mb-6 font-mono">
            GitHub commits &amp; PRs fetched at build time via the GitHub Search
            API
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member.github}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white">
                    {member.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    {member.role}
                  </p>
                  <a
                    href={`https://github.com/${member.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-glow-blue hover:underline font-mono mt-0.5 inline-block"
                  >
                    @{member.github}
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <GitCommit className="w-3 h-3 text-glow-blue" />
                      <span className="text-[10px] text-zinc-500">Commits</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-white">
                      {member.commits.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <GitPullRequest className="w-3 h-3 text-glow-green" />
                      <span className="text-[10px] text-zinc-500">PRs</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-white">
                      {member.pullRequests.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <IndianRupee className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] text-zinc-500">Funded</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-amber-400">
                      {member.contribution}
                    </p>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="flex flex-wrap gap-1.5">
                  {member.focus.map((area) => (
                    <span
                      key={area}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-400"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSPARENCY PRINCIPLES ──────────────────────────────── */}
      <section className="px-6 py-12 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-glow-blue" />
              Our Transparency Commitment
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Bootstrapped Reality",
                  desc: "CodelithLabs has ₹0 in external revenue. Every rupee comes from our core members\u2019 pockets via mandatory Razorpay contributions of ₹54/month. We own this reality proudly.",
                },
                {
                  title: "Zero Hidden Costs",
                  desc: "Our tools run 100% client-side. Infrastructure is a home Ubuntu server, a ₹800 domain, and free-tier cloud services. Total annual cost: ₹3,600.",
                },
                {
                  title: "Community First",
                  desc: "All funding goes directly to infrastructure. No executive salaries, no office space. When AdSense starts, that revenue goes back into the platform and open-source work.",
                },
              ].map((principle) => (
                <div key={principle.title}>
                  <h3 className="text-sm font-semibold text-white mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {principle.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
