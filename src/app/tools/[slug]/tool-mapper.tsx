// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/tools/[slug]/tool-mapper.tsx
// Clean component mapper with lazy loading and proper error handling - 53 Tools
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// LOADING FALLBACK
// ═══════════════════════════════════════════════════════════════════════════

function ToolLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-zinc-400 text-sm">Loading tool...</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PLACEHOLDER FOR UNIMPLEMENTED TOOLS
// ═══════════════════════════════════════════════════════════════════════════

function ToolPlaceholder({ toolName }: { toolName: string }) {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
      <p className="text-zinc-400 max-w-md mx-auto">
        The <span className="text-blue-400 font-medium">{toolName}</span> tool is currently under development.
        Check back soon!
      </p>
      <div className="pt-4">
        <a
          href="/tools"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700
                   text-white font-medium rounded-lg transition-colors"
        >
          Browse All Tools
        </a>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DYNAMIC TOOL IMPORTS (Code-Split for RAM Optimization)
// 53 Production Tools Mapped
// ═══════════════════════════════════════════════════════════════════════════

const TOOL_COMPONENTS: Record<string, ComponentType<any>> = {
  // ═══ TEXT TOOLS (7 tools) ═══
  'word-counter': dynamic(() => import('@/components/tools/impl/WordCounterPro'), { loading: () => <ToolLoadingFallback /> }),
  'case-converter': dynamic(() => import('@/components/tools/impl/CaseConverter'), { loading: () => <ToolLoadingFallback /> }),
  'text-diff': dynamic(() => import('@/components/tools/impl/TextDiffChecker'), { loading: () => <ToolLoadingFallback /> }),
  'lorem-ipsum-generator': dynamic(() => import('@/components/tools/impl/LoremIpsumGen'), { loading: () => <ToolLoadingFallback /> }),
  'markdown-to-html': dynamic(() => import('@/components/tools/impl/MarkdownPreviewer'), { loading: () => <ToolLoadingFallback /> }),
  'text-to-slug': dynamic(() => import('@/components/tools/impl/TextToSlug'), { loading: () => <ToolLoadingFallback /> }),
  'duplicate-remover': dynamic(() => import('@/components/tools/impl/DuplicateRemover'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ DEVELOPER TOOLS (8 tools) ═══
  'json-formatter': dynamic(() => import('@/components/tools/impl/JsonFormatter'), { loading: () => <ToolLoadingFallback /> }),
  'base64-encoder': dynamic(() => import('@/components/tools/impl/Base64Encoder'), { loading: () => <ToolLoadingFallback /> }),
  'url-encoder': dynamic(() => import('@/components/tools/impl/UrlEncoder'), { loading: () => <ToolLoadingFallback /> }),
  'html-entity-encoder': dynamic(() => import('@/components/tools/impl/HtmlEntityEncoder'), { loading: () => <ToolLoadingFallback /> }),
  'jwt-decoder': dynamic(() => import('@/components/tools/impl/JwtDecoder'), { loading: () => <ToolLoadingFallback /> }),
  'regex-tester': dynamic(() => import('@/components/tools/impl/RegexTester'), { loading: () => <ToolLoadingFallback /> }),
  'hash-generator': dynamic(() => import('@/components/tools/impl/HashGenerator'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'password-strength-checker': dynamic(() => import('@/components/tools/impl/PasswordStrengthChecker'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ GENERATOR TOOLS (4 tools) ═══
  'uuid-generator': dynamic(() => import('@/components/tools/impl/UuidGenerator'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'password-generator': dynamic(() => import('@/components/tools/impl/PasswordGenerator'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'qr-code-generator': dynamic(() => import('@/components/tools/impl/QrCodeGenerator'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'random-number': dynamic(() => import('@/components/tools/impl/RandomNumberGen'), { loading: () => <ToolLoadingFallback />, ssr: false }),

  // ═══ CONVERTER TOOLS (9 tools) ═══
  'unix-timestamp-converter': dynamic(() => import('@/components/tools/impl/UnixTimestampConverter'), { loading: () => <ToolLoadingFallback /> }),
  'color-converter': dynamic(() => import('@/components/tools/impl/ColorConverter'), { loading: () => <ToolLoadingFallback /> }),
  'unit-converter': dynamic(() => import('@/components/tools/impl/UnitConverter'), { loading: () => <ToolLoadingFallback /> }),
  'json-to-yaml': dynamic(() => import('@/components/tools/impl/JsonToYaml'), { loading: () => <ToolLoadingFallback /> }),
  'yaml-to-json': dynamic(() => import('@/components/tools/impl/YamlToJson'), { loading: () => <ToolLoadingFallback /> }),
  'roman-numeral': dynamic(() => import('@/components/tools/impl/RomanNumeralConverter'), { loading: () => <ToolLoadingFallback /> }),
  'binary-converter': dynamic(() => import('@/components/tools/impl/BinaryConverter'), { loading: () => <ToolLoadingFallback /> }),
  'csv-to-json': dynamic(() => import('@/components/tools/impl/CsvToJson'), { loading: () => <ToolLoadingFallback /> }),
  'json-to-csv': dynamic(() => import('@/components/tools/impl/JsonToCsv'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ FORMATTER TOOLS (4 tools) ═══
  'sql-formatter': dynamic(() => import('@/components/tools/impl/SqlFormatter'), { loading: () => <ToolLoadingFallback /> }),
  'css-minifier': dynamic(() => import('@/components/tools/impl/CssMinifier'), { loading: () => <ToolLoadingFallback /> }),
  'html-formatter': dynamic(() => import('@/components/tools/impl/HtmlFormatter'), { loading: () => <ToolLoadingFallback /> }),
  'js-minifier': dynamic(() => import('@/components/tools/impl/JsMinifier'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ CALCULATOR TOOLS (7 tools) ═══
  'percentage-calculator': dynamic(() => import('@/components/tools/impl/PercentageCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'loan-calculator': dynamic(() => import('@/components/tools/impl/LoanCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'bmi-calculator': dynamic(() => import('@/components/tools/impl/BmiCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'age-calculator': dynamic(() => import('@/components/tools/impl/AgeCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'discount-calculator': dynamic(() => import('@/components/tools/impl/DiscountCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'tip-calculator': dynamic(() => import('@/components/tools/impl/TipCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'calorie-calculator': dynamic(() => import('@/components/tools/impl/CalorieCalculator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ IMAGE TOOLS (10 tools) ═══
  'image-compressor': dynamic(() => import('@/components/tools/impl/ImageCompressor'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'social-media-resizer': dynamic(() => import('@/components/tools/impl/SocialMediaResizer'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'privacy-blur': dynamic(() => import('@/components/tools/impl/PrivacyBlur'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'jpg-to-png': dynamic(() => import('@/components/tools/impl/JpgToPng'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'png-to-jpg': dynamic(() => import('@/components/tools/impl/PngToJpg'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'webp-converter': dynamic(() => import('@/components/tools/impl/WebpConverter'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'image-filters': dynamic(() => import('@/components/tools/impl/ImageFilters'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'image-cropper': dynamic(() => import('@/components/tools/impl/ImageCropper'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'image-resizer': dynamic(() => import('@/components/tools/impl/ImageResizer'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'image-to-base64': dynamic(() => import('@/components/tools/impl/ImageToBase64'), { loading: () => <ToolLoadingFallback />, ssr: false }),

  // ═══ SEO TOOLS (4 tools) ═══
  'meta-tag-generator': dynamic(() => import('@/components/tools/impl/MetaTagGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'open-graph-generator': dynamic(() => import('@/components/tools/impl/OpenGraphGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'robots-txt-generator': dynamic(() => import('@/components/tools/impl/RobotsTxtGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'sitemap-generator': dynamic(() => import('@/components/tools/impl/SitemapGenerator'), { loading: () => <ToolLoadingFallback /> }),
};

// ═══════════════════════════════════════════════════════════════════════════
// TOOL MAPPER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ToolMapperProps {
  slug: string;
  toolName?: string;
}

export default function ToolMapper({ slug, toolName = 'this tool' }: ToolMapperProps) {
  const Component = TOOL_COMPONENTS[slug];

  // If tool component exists, render it
  if (Component) {
    return <Component />;
  }

  // Otherwise show placeholder (tool registered but not implemented yet)
  return <ToolPlaceholder toolName={toolName} />;
}
