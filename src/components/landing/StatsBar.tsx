"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Wrench, Shield, IndianRupee, Infinity } from "lucide-react";
import { useTranslations } from "next-intl";

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  numericValue?: number;
  label: string;
  color: string;
  delay: number;
}

function StatCard({ icon: Icon, value, numericValue, label, color, delay }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(numericValue ? "0" : value);

  useEffect(() => {
    if (!isInView || !numericValue) return;
    let start = 0;
    const end = numericValue;
    const duration = 1500;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * end);
      setDisplayValue(`${start}+`);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafId); };
  }, [isInView, numericValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
        <Icon className={`w-6 h-6 ${color} mb-3`} />
        <p className="text-3xl font-bold text-white font-mono tracking-tight mb-1">
          {numericValue ? displayValue : value}
        </p>
        <p className="text-sm text-zinc-500">{label}</p>
      </div>
    </motion.div>
  );
}

interface StatsBarProps {
  toolCount: number;
}

export function StatsBar({ toolCount }: StatsBarProps) {
  const t = useTranslations("home.stats");

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Wrench} numericValue={toolCount} value="" label={t("tools")} color="text-glow-blue" delay={0} />
          <StatCard icon={Shield} value="100%" label={t("clientSide")} color="text-glow-green" delay={0.1} />
          <StatCard icon={IndianRupee} value="₹0" label={t("zeroCost")} color="text-glow-cyan" delay={0.2} />
          <StatCard icon={Infinity} value="∞" label={t("privacy")} color="text-glow-purple" delay={0.3} />
        </div>
      </div>
    </section>
  );
}
