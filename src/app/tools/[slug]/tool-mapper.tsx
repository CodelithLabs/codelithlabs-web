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
  'markdown-to-html': dynamic(() => import('@/components/tools/impl/MarkdownPreviewer'), { loading: () => <ToolLoadingFallback />, ssr: false }),
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

  // ═══ AI-POWERED TOOLS (1+ tools) ═══
  'sentiment-analyzer': dynamic(() => import('@/components/tools/impl/SentimentAnalyzer'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ FINANCE TOOLS (3+ tools) ═══
  'crypto-converter': dynamic(() => import('@/components/tools/impl/CryptoConverter'), { loading: () => <ToolLoadingFallback /> }),
  'currency-converter': dynamic(() => import('@/components/tools/impl/CurrencyConverter'), { loading: () => <ToolLoadingFallback /> }),
  'mortgage-calculator': dynamic(() => import('@/components/tools/impl/MortgageCalculator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ GEO TOOLS (1+ tools) ═══
  'timezone-converter': dynamic(() => import('@/components/tools/impl/TimezoneConverter'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ AI-POWERED TOOLS (NEW BATCH) ═══
  'text-summarizer': dynamic(() => import('@/components/tools/impl/TextSummarizer'), { loading: () => <ToolLoadingFallback /> }),
  'paraphraser': dynamic(() => import('@/components/tools/impl/Paraphraser'), { loading: () => <ToolLoadingFallback /> }),
  'grammar-checker': dynamic(() => import('@/components/tools/impl/GrammarChecker'), { loading: () => <ToolLoadingFallback /> }),
  'ai-color-palette': dynamic(() => import('@/components/tools/impl/AiColorPalette'), { loading: () => <ToolLoadingFallback /> }),
  'text-to-speech': dynamic(() => import('@/components/tools/impl/TextToSpeech'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'word-frequency-counter': dynamic(() => import('@/components/tools/impl/WordFrequencyCounter'), { loading: () => <ToolLoadingFallback /> }),
  'code-explainer': dynamic(() => import('@/components/tools/impl/CodeExplainer'), { loading: () => <ToolLoadingFallback /> }),
  'ai-translator': dynamic(() => import('@/components/tools/impl/AiTranslator'), { loading: () => <ToolLoadingFallback /> }),
  'email-generator': dynamic(() => import('@/components/tools/impl/EmailGenerator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ FINANCE TOOLS (NEW BATCH) ═══
  'compound-interest-calculator': dynamic(() => import('@/components/tools/impl/CompoundInterestCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'tax-calculator-india': dynamic(() => import('@/components/tools/impl/TaxCalculatorIndia'), { loading: () => <ToolLoadingFallback /> }),
  'salary-calculator': dynamic(() => import('@/components/tools/impl/SalaryCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'investment-comparator': dynamic(() => import('@/components/tools/impl/InvestmentComparator'), { loading: () => <ToolLoadingFallback /> }),
  'gold-silver-calculator': dynamic(() => import('@/components/tools/impl/GoldSilverCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'breakeven-calculator': dynamic(() => import('@/components/tools/impl/BreakevenCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'profit-margin-calculator': dynamic(() => import('@/components/tools/impl/ProfitMarginCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'invoice-generator': dynamic(() => import('@/components/tools/impl/InvoiceGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'expense-splitter': dynamic(() => import('@/components/tools/impl/ExpenseSplitter'), { loading: () => <ToolLoadingFallback /> }),
  'retirement-calculator': dynamic(() => import('@/components/tools/impl/RetirementCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'stock-calculator': dynamic(() => import('@/components/tools/impl/StockCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'capital-gains-tax': dynamic(() => import('@/components/tools/impl/CapitalGainsTax'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ GEO TOOLS (NEW BATCH) ═══
  'distance-calculator': dynamic(() => import('@/components/tools/impl/DistanceCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'coordinate-converter': dynamic(() => import('@/components/tools/impl/CoordinateConverter'), { loading: () => <ToolLoadingFallback /> }),
  'ip-geolocation': dynamic(() => import('@/components/tools/impl/IpGeolocation'), { loading: () => <ToolLoadingFallback /> }),
  'world-clock': dynamic(() => import('@/components/tools/impl/WorldClock'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'sunrise-sunset': dynamic(() => import('@/components/tools/impl/SunriseSunsetCalc'), { loading: () => <ToolLoadingFallback /> }),
  'country-info': dynamic(() => import('@/components/tools/impl/CountryInfo'), { loading: () => <ToolLoadingFallback /> }),
  'lat-long-finder': dynamic(() => import('@/components/tools/impl/LatLongFinder'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ DEVELOPER TOOLS (NEW BATCH) ═══
  'api-tester': dynamic(() => import('@/components/tools/impl/ApiTester'), { loading: () => <ToolLoadingFallback /> }),
  'cron-expression-generator': dynamic(() => import('@/components/tools/impl/CronExpressionGen'), { loading: () => <ToolLoadingFallback /> }),
  'html-to-jsx': dynamic(() => import('@/components/tools/impl/HtmlToJsx'), { loading: () => <ToolLoadingFallback /> }),
  'diff-checker': dynamic(() => import('@/components/tools/impl/DiffChecker'), { loading: () => <ToolLoadingFallback /> }),
  'json-path-finder': dynamic(() => import('@/components/tools/impl/JsonPathFinder'), { loading: () => <ToolLoadingFallback /> }),
  'regex-generator': dynamic(() => import('@/components/tools/impl/RegexGenerator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ IMAGE / MEDIA TOOLS (NEW BATCH) ═══
  'image-watermark': dynamic(() => import('@/components/tools/impl/ImageWatermark'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'background-remover': dynamic(() => import('@/components/tools/impl/BackgroundRemover'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'color-picker': dynamic(() => import('@/components/tools/impl/ColorPicker'), { loading: () => <ToolLoadingFallback /> }),
  'pdf-to-image': dynamic(() => import('@/components/tools/impl/PdfToImage'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ WEB / DESIGN TOOLS (NEW BATCH) ═══
  'font-pair-suggester': dynamic(() => import('@/components/tools/impl/FontPairSuggester'), { loading: () => <ToolLoadingFallback /> }),
  'responsive-checker': dynamic(() => import('@/components/tools/impl/ResponsiveChecker'), { loading: () => <ToolLoadingFallback /> }),
  'readme-generator': dynamic(() => import('@/components/tools/impl/ReadmeGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'css-gradient-generator': dynamic(() => import('@/components/tools/impl/CssGradientGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'website-security-checker': dynamic(() => import('@/components/tools/impl/WebsiteSecurityChecker'), { loading: () => <ToolLoadingFallback /> }),
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
