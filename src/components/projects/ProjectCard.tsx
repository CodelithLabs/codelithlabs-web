"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";
import { defaultLocale, locales, type Locale } from "@/i18n/request";
import enMessages from "../../../messages/en.json";
import esMessages from "../../../messages/es.json";
import ptMessages from "../../../messages/pt.json";
import frMessages from "../../../messages/fr.json";
import deMessages from "../../../messages/de.json";
import hiMessages from "../../../messages/hi.json";

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  architectureOverview: string;
  techStack: string[];
  github?: string;
  status: "active" | "completed" | "research";
  color: string;
  icon: React.ReactNode;
}

const i18nMessages: Record<Locale, any> = {
  en: enMessages,
  es: esMessages,
  pt: ptMessages,
  fr: frMessages,
  de: deMessages,
  hi: hiMessages,
};

const statusConfig = {
  active: { labelKey: "pages.projects.status.active", fallback: "Active", bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  completed: { labelKey: "pages.projects.status.completed", fallback: "Completed", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  research: { labelKey: "pages.projects.status.research", fallback: "Research", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
};

const colorMap: Record<string, { border: string; gradient: string; tag: string }> = {
  blue: {
    border: "hover:border-blue-500/30",
    gradient: "from-blue-500/20 to-blue-600/5",
    tag: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  purple: {
    border: "hover:border-purple-500/30",
    gradient: "from-purple-500/20 to-purple-600/5",
    tag: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  green: {
    border: "hover:border-green-500/30",
    gradient: "from-green-500/20 to-green-600/5",
    tag: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  indigo: {
    border: "hover:border-indigo-500/30",
    gradient: "from-indigo-500/20 to-indigo-600/5",
    tag: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
};

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const colors = colorMap[project.color] || colorMap.blue;
  const pathname = usePathname();

  const currentLocale = useMemo<Locale>(() => {
    const firstSegment = pathname?.split("/")[1] as Locale | undefined;
    return locales.includes(firstSegment as Locale)
      ? (firstSegment as Locale)
      : defaultLocale;
  }, [pathname]);

  const t = useMemo(
    () =>
      (path: string, fallback: string) => {
        const value = path
          .split(".")
          .reduce<any>(
            (acc, key) =>
              acc && typeof acc === "object" ? acc[key] : undefined,
            i18nMessages[currentLocale],
          );
        return typeof value === "string" ? value : fallback;
      },
    [currentLocale],
  );

  const status = statusConfig[project.status];
  const href = /^\/(en|es|pt|fr|de|hi)(\/|$)/.test(pathname ?? "")
    ? `/${currentLocale}/projects/${project.id}`
    : `/projects/${project.id}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={href}
        className={`group relative block h-full p-7 rounded-2xl border border-white/[0.08] bg-white/[0.02] ${colors.border} transition-all overflow-hidden`}
      >
        {/* Hover gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

        <div className="relative z-10">
          {/* Top: Icon + Status + Arrow */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                {project.icon}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md border ${status.bg} ${status.text} ${status.border}`}>
                {t(status.labelKey, status.fallback)}
              </span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-glow transition-all">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-zinc-400 leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>

          {/* Architecture Overview */}
          <p className="text-xs text-zinc-500 leading-relaxed mb-5 italic line-clamp-2">
            {project.architectureOverview}
          </p>

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech) => (
              <span key={tech} className={`text-[10px] font-mono px-2 py-1 rounded-md border ${colors.tag}`}>
                {tech}
              </span>
            ))}
          </div>

          {/* GitHub Link (if available) */}
          {project.github && (
            <div
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.open(project.github, '_blank', 'noopener,noreferrer');
              }}
            >
              <ExternalLink className="w-3 h-3" />
              {t("pages.projects.viewOnGitHub", "View on GitHub")}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
