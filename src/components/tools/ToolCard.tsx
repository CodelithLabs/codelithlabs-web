"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ToolMeta, TOOL_CATEGORIES } from "@/types/tool";

interface ToolCardProps {
  tool: ToolMeta;
  index?: number;
  animate?: boolean;
}

export function ToolCard({ tool, index = 0, animate = true }: ToolCardProps) {
  const categoryInfo = TOOL_CATEGORIES[tool.category];
  const accentColor = categoryInfo?.color || "#2979FF";

  const card = (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col h-full p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all overflow-hidden"
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-3">
        {/* Category badge */}
        <span
          className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md border"
          style={{
            color: accentColor,
            backgroundColor: `${accentColor}15`,
            borderColor: `${accentColor}25`,
          }}
        >
          {categoryInfo?.name || tool.category}
        </span>

        {/* Processing type */}
        <span className="text-[10px] font-mono text-zinc-600 uppercase">
          {tool.processingType}
        </span>
      </div>

      <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-glow-blue transition-colors line-clamp-1">
        {tool.name}
      </h3>

      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 flex-grow mb-3">
        {tool.description}
      </p>

      <div className="flex items-center gap-1 text-xs text-glow-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Open Tool
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );

  if (!animate) return card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      {card}
    </motion.div>
  );
}
