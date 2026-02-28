// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/content-loader.ts
// Hybrid content: loads SEO markdown from content/tools/*.md at build time
// Registry data (ToolMeta) remains the source of truth for tool metadata
// ═══════════════════════════════════════════════════════════════════════════

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type {
  ToolContent,
  ToolContentFrontmatter,
  FAQEntry,
} from "@/types/tool-content";

// ─── Paths ───────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), "content", "tools");

// ─── Section header normalisation map ────────────────────────────────────
// Maps emoji-prefixed H2 headings in the markdown to clean keys

const SECTION_MAP: Record<string, keyof Pick<
  ToolContent,
  "features" | "howToUse" | "commonUseCases" | "whyChoose" | "technicalDetails" | "bestPractices"
>> = {
  features: "features",
  "how to use": "howToUse",
  "common use cases": "commonUseCases",
  "why choose": "whyChoose",
  "technical details": "technicalDetails",
  "best practices": "bestPractices",
};

function normaliseSectionKey(heading: string): string {
  // Strip emojis and leading/trailing whitespace, lowercase
  return heading
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, "")
    .trim()
    .toLowerCase();
}

// ─── Parse FAQ ───────────────────────────────────────────────────────────

function parseFaqFromMarkdown(mdSection: string): FAQEntry[] {
  const entries: FAQEntry[] = [];
  // FAQ structure: ### Question\nAnswer paragraph(s)
  const parts = mdSection.split(/^###\s+/m).filter(Boolean);

  for (const part of parts) {
    const lines = part.trim().split("\n");
    const question = lines[0]?.trim();
    const answer = lines
      .slice(1)
      .join("\n")
      .trim();
    if (question && answer) {
      entries.push({ question, answer });
    }
  }

  return entries;
}

// ─── Split markdown body into sections by H2 ────────────────────────────

function splitByH2(body: string): Map<string, string> {
  const sections = new Map<string, string>();
  const regex = /^##\s+(.+)$/gm;
  let lastKey: string | null = null;
  let lastIndex = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const match of body.matchAll(regex)) {
    if (lastKey !== null) {
      sections.set(lastKey, body.slice(lastIndex, match.index).trim());
    }
    lastKey = match[1].trim();
    lastIndex = (match.index ?? 0) + match[0].length;
  }
  // Last section
  if (lastKey !== null) {
    sections.set(lastKey, body.slice(lastIndex).trim());
  }

  return sections;
}

// ─── Convert markdown string to HTML ─────────────────────────────────────

async function mdToHtml(md: string): Promise<string> {
  const result = await remark().use(html).process(md);
  return result.toString();
}

// ─── Public API ──────────────────────────────────────────────────────────

/**
 * Load and parse the markdown content for a tool.
 * Returns null if no matching .md file exists (tool still works from registry).
 */
export async function getToolContent(
  slug: string
): Promise<ToolContent | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content: body } = matter(raw);
  const frontmatter = data as ToolContentFrontmatter;

  // Split by H2
  const sections = splitByH2(body);

  // Build result object
  const result: ToolContent = {
    frontmatter,
    features: null,
    howToUse: null,
    commonUseCases: null,
    whyChoose: null,
    technicalDetails: null,
    bestPractices: null,
    faq: [],
    fullHtml: await mdToHtml(body),
  };

  // Map each section to the result
  for (const [heading, md] of sections) {
    const normKey = normaliseSectionKey(heading);

    // FAQ section
    if (normKey.includes("faq") || normKey.includes("frequently asked")) {
      result.faq = parseFaqFromMarkdown(md);
      continue;
    }

    // Other named sections — find matching key via prefix
    for (const [prefix, field] of Object.entries(SECTION_MAP)) {
      if (normKey.includes(prefix)) {
        result[field] = await mdToHtml(md);
        break;
      }
    }
  }

  return result;
}
