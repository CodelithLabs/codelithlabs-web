"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import {
  ArrowRight, Code2, Hash, ImageDown, KeyRound, QrCode, FileCode2
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function ToolHighlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const t = useTranslations("home.toolHighlights");
  const locale = useLocale();

  const tools = useMemo(
    () => [
      {
        slug: "json-formatter",
        name: t("items.jsonFormatter.name"),
        description: t("items.jsonFormatter.description"),
        icon: Code2,
        color: "text-violet-400",
        bgColor: "bg-violet-500/10",
        span: "md:col-span-2 md:row-span-2",
        large: true,
      },
      {
        slug: "hash-generator",
        name: t("items.hashGenerator.name"),
        description: t("items.hashGenerator.description"),
        icon: Hash,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        span: "md:col-span-1",
        large: false,
      },
      {
        slug: "image-compressor",
        name: t("items.imageCompressor.name"),
        description: t("items.imageCompressor.description"),
        icon: ImageDown,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        span: "md:col-span-1",
        large: false,
      },
      {
        slug: "password-generator",
        name: t("items.passwordGenerator.name"),
        description: t("items.passwordGenerator.description"),
        icon: KeyRound,
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        span: "md:col-span-1",
        large: false,
      },
      {
        slug: "qr-code-generator",
        name: t("items.qrCodeGenerator.name"),
        description: t("items.qrCodeGenerator.description"),
        icon: QrCode,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        span: "md:col-span-1",
        large: false,
      },
      {
        slug: "base64-encoder",
        name: t("items.base64Encoder.name"),
        description: t("items.base64Encoder.description"),
        icon: FileCode2,
        color: "text-lime-400",
        bgColor: "bg-lime-500/10",
        span: "md:col-span-2",
        large: false,
      },
    ],
    [t]
  );

  const withLocale = (href: string) => `/${locale}${href}`;

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-zinc-950/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="accent-bar mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t("title")}
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={tool.span}
              >
                <Link
                  href={withLocale(`/tools/${tool.slug}`)}
                  className="group relative flex flex-col h-full p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] transition-all overflow-hidden"
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.03] to-transparent" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl ${tool.bgColor} border border-white/[0.08] flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${tool.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className={`font-bold text-white mb-2 ${tool.large ? "text-xl" : "text-base"}`}>
                      {tool.name}
                    </h3>
                    <p className={`text-zinc-400 leading-relaxed flex-grow ${tool.large ? "text-sm" : "text-xs"}`}>
                      {tool.description}
                    </p>

                    {/* Arrow */}
                    <div className="mt-4 flex items-center gap-1 text-sm text-glow-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {t("openTool")}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <Link
            href={withLocale("/tools")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white text-sm font-medium hover:bg-white/[0.06] hover:border-white/[0.15] transition-all"
          >
            {t("browseAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
