"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  TrendingUp, TrendingDown, Server, Globe, Code2,
  Trophy, Users, GitCommit, GitPullRequest, Clock,
  Shield, Eye
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// DATA — All financial data is hardcoded (static export, no API)
// ═══════════════════════════════════════════════════════════════════════════

const summaryCards = [
  { label: "Monthly Revenue", value: "₹12,400", trend: "+8.2%", up: true, color: "text-green-400", borderColor: "border-green-500/20" },
  { label: "Monthly Expenses", value: "₹9,850", trend: "+3.1%", up: true, color: "text-red-400", borderColor: "border-red-500/20" },
  { label: "Net Position", value: "₹2,550", trend: "+22.4%", up: true, color: "text-glow-blue", borderColor: "border-glow-blue/20" },
  { label: "Runway", value: "18 mo", trend: "Stable", up: true, color: "text-glow-cyan", borderColor: "border-glow-cyan/20" },
];

const expenseBreakdown = [
  { label: "Server Infrastructure", amount: "₹3,450", percentage: 35, color: "#2979FF" },
  { label: "Domain & Hosting", amount: "₹1,480", percentage: 15, color: "#00E5FF" },
  { label: "Development Tools & APIs", amount: "₹1,970", percentage: 20, color: "#BB86FC" },
  { label: "Hackathon & Events Fund", amount: "₹1,970", percentage: 20, color: "#00E676" },
  { label: "Miscellaneous", amount: "₹980", percentage: 10, color: "#F59E0B" },
];

const revenueStreams = [
  { label: "Client Projects", amount: "₹ Nill", percentage: 58, color: "#2979FF" },
  { label: "Ad Revenue (AdSense)", amount: "₹ Not Started", percentage: 25, color: "#00E676" },
  { label: "Open Source Sponsorships", amount: "₹ Till now Zero", percentage: 17, color: "#BB86FC" },
];

const memberContributions = [
  {
    name: "Prasanta Ray",
    role: "Founder & CEO",
    commits: 847,
    pullRequests: 124,
    hoursPerWeek: 35,
    focus: ["Backend", "Architecture", "DevOps", "Security", "Community", "Open Source", "Financials", "Transparency"],
  },
  {
    name: "Donbil Mwshary",
    role: "Co-Founder & CTO",
    commits: 623,
    pullRequests: 98,
    hoursPerWeek: 30,
    focus: ["Frontend", "Infrastructure", "Open Source", "Community"],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS BAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function AnimatedBar({ percentage, color, delay }: { percentage: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <div ref={ref} className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
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
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

export function TransparencyDashboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <main ref={sectionRef} className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Header */}
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
            Complete Operational Disclosure
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            CodelithLabs.in operates with full financial transparency. Every rupee earned and spent is tracked and disclosed publicly.
          </p>
        </div>
      </section>

      {/* ── SUMMARY CARDS ── */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`p-5 rounded-xl border ${card.borderColor} bg-white/[0.02]`}
              >
                <p className="text-xs text-zinc-500 mb-2 font-medium">{card.label}</p>
                <p className={`text-2xl md:text-3xl font-bold font-mono ${card.color}`}>{card.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {card.up ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className="text-xs text-zinc-400">{card.trend}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPENSE BREAKDOWN ── */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Expenses */}
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                </div>
                <h2 className="text-lg font-bold">Expense Breakdown</h2>
              </div>
              <div className="space-y-5">
                {expenseBreakdown.map((item, i) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-zinc-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-500">{item.amount}</span>
                        <span className="text-xs font-mono text-zinc-400 w-8 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                    <AnimatedBar percentage={item.percentage} color={item.color} delay={i * 0.1} />
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue */}
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <h2 className="text-lg font-bold">Revenue Sources</h2>
              </div>
              <div className="space-y-5">
                {revenueStreams.map((item, i) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-zinc-300">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-500">{item.amount}</span>
                        <span className="text-xs font-mono text-zinc-400 w-8 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                    <AnimatedBar percentage={item.percentage} color={item.color} delay={i * 0.1 + 0.3} />
                  </div>
                ))}
              </div>

              {/* Total box */}
              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400 font-medium">Total Monthly Revenue</span>
                  <span className="text-lg font-bold font-mono text-green-400">₹ Nill</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFRASTRUCTURE ALLOCATION ── */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Server className="w-5 h-5 text-glow-blue" />
            Infrastructure Allocation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Vercel Hosting", cost: "₹0", status: "Free Tier", icon: Globe },
              { label: "Domain (.in)", cost: "₹800/yr", status: "Active", icon: Globe },
              { label: "GitHub Actions CI", cost: "₹0", status: "Free Tier", icon: Code2 },
              { label: "Monitoring & CDN", cost: "₹0", status: "Cloudflare Free", icon: Shield },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <Icon className="w-4 h-4 text-zinc-500 mb-3" />
                  <p className="text-sm text-white font-medium mb-1">{item.label}</p>
                  <p className="text-lg font-mono font-bold text-glow-blue">{item.cost}</p>
                  <p className="text-xs text-zinc-500 mt-1">{item.status}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MEMBER CONTRIBUTIONS ── */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-glow-purple" />
            Member Contribution Metrics
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {memberContributions.map((member) => (
              <div key={member.name} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="text-xs text-zinc-500 font-mono">{member.role}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <GitCommit className="w-3 h-3 text-glow-blue" />
                      <span className="text-xs text-zinc-500">Commits</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-white">{member.commits}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <GitPullRequest className="w-3 h-3 text-glow-green" />
                      <span className="text-xs text-zinc-500">PRs</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-white">{member.pullRequests}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3 text-glow-cyan" />
                      <span className="text-xs text-zinc-500">Hrs/Week</span>
                    </div>
                    <p className="text-xl font-bold font-mono text-white">{member.hoursPerWeek}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {member.focus.map((area) => (
                    <span
                      key={area}
                      className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-400"
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

      {/* ── TRANSPARENCY PRINCIPLES ── */}
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
                  title: "Open Books",
                  desc: "Every financial transaction is recorded and disclosed. We believe openness builds trust with our community."
                },
                {
                  title: "Zero Hidden Costs",
                  desc: "Our tools are free because our infrastructure costs are minimal. We pass those savings directly to users."
                },
                {
                  title: "Community First",
                  desc: "Revenue is reinvested into infrastructure, hackathons, and open-source contributions — not executive salaries."
                },
              ].map((principle) => (
                <div key={principle.title}>
                  <h3 className="text-sm font-semibold text-white mb-2">{principle.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{principle.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
