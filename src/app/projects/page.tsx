"use client";

import { useState } from "react";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ShieldCheck, Globe, Cpu, Server } from "lucide-react";
import { ProjectCard, ProjectData } from "@/components/projects/ProjectCard";
import { defaultLocale, locales, type Locale } from "@/i18n/request";
import enMessages from "../../../messages/en.json";
import esMessages from "../../../messages/es.json";
import ptMessages from "../../../messages/pt.json";
import frMessages from "../../../messages/fr.json";
import deMessages from "../../../messages/de.json";
import hiMessages from "../../../messages/hi.json";

interface ProjectConfig
  extends Omit<ProjectData, "category" | "description" | "architectureOverview"> {
  categoryKey: "webApp" | "gameDev" | "systems";
  descriptionKey: string;
  architectureKey: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED PROJECT DATA
// ═══════════════════════════════════════════════════════════════════════════

const i18nMessages: Record<Locale, any> = {
  en: enMessages,
  es: esMessages,
  pt: ptMessages,
  fr: frMessages,
  de: deMessages,
  hi: hiMessages,
};

const projectConfigs: ProjectConfig[] = [
  {
    id: "vectordefense",
    title: "VectorDefense",
    categoryKey: "gameDev",
    descriptionKey: "vectordefense.description",
    architectureKey: "vectordefense.architectureOverview",
    techStack: ["C++17", "OpenGL", "ECS", "SFML", "CMake"],
    github: "https://github.com/codelithlabs/vectordefense",
    status: "active",
    color: "blue",
    icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
  },
  {
    id: "citk-connect",
    title: "CITK-Connect",
    categoryKey: "webApp",
    descriptionKey: "citkConnect.description",
    architectureKey: "citkConnect.architectureOverview",
    techStack: ["Next.js", "PostgreSQL", "Prisma", "REST API", "JWT"],
    github: "https://github.com/codelithlabs/citk-connect",
    status: "active",
    color: "purple",
    icon: <Globe className="w-5 h-5 text-purple-400" />,
  },
  {
    id: "core-s",
    title: "Core-S Infrastructure",
    categoryKey: "systems",
    descriptionKey: "coreS.description",
    architectureKey: "coreS.architectureOverview",
    techStack: ["Linux", "Docker", "Nginx", "Grafana", "Bash"],
    status: "completed",
    color: "green",
    icon: <Server className="w-5 h-5 text-green-400" />,
  },
  {
    id: "codelith-web",
    title: "CodelithLabs Platform",
    categoryKey: "webApp",
    descriptionKey: "codelithWeb.description",
    architectureKey: "codelithWeb.architectureOverview",
    techStack: ["Next.js 16", "TypeScript", "Tailwind", "Web Workers", "Vercel"],
    github: "https://github.com/codelithlabs/codelithlabs-web",
    status: "active",
    color: "indigo",
    icon: <Cpu className="w-5 h-5 text-indigo-400" />,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function ProjectsIndex() {
  const [filter, setFilter] = useState("All");
  const pathname = usePathname();
  const filterKeyMap: Record<string, string> = {
    "Web App": "webApp",
    "Game Dev": "gameDev",
    Systems: "systems",
  };

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

  const categories = useMemo(
    () => [
      { id: "All", label: t("pages.projects.filters.all", "All") },
      { id: "Web App", label: t("pages.projects.filters.webApp", "Web App") },
      { id: "Game Dev", label: t("pages.projects.filters.gameDev", "Game Dev") },
      { id: "Systems", label: t("pages.projects.filters.systems", "Systems") },
    ],
    [t],
  );

  const projects: ProjectData[] = useMemo(
    () =>
      projectConfigs.map((project) => ({
        ...project,
        category: t(
          `pages.projects.filters.${project.categoryKey}`,
          project.categoryKey,
        ),
        description: t(
          `pages.projects.items.${project.descriptionKey}`,
          project.descriptionKey,
        ),
        architectureOverview: t(
          `pages.projects.items.${project.architectureKey}`,
          project.architectureKey,
        ),
      })),
    [t],
  );

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter(
          (p) =>
            p.category ===
            t(`pages.projects.filters.${filterKeyMap[filter]}`, filter),
        );

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="accent-bar mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("pages.projects.title", "Our Work")}
            </h1>
            <p className="text-zinc-400 max-w-xl">
              {t(
                "pages.projects.subtitle",
                "A collection of research initiatives, client deliverables, and open-source contributions from the CodelithLabs engineering team.",
              )}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  filter === cat.id
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-zinc-500 border-white/[0.08] hover:border-white/[0.20] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}