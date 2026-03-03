// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/tools/[slug]/tool-mapper.tsx
// Clean component mapper with lazy loading and proper error handling
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
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
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700
                   text-white font-medium rounded-lg transition-colors"
        >
          Browse All Tools
        </Link>
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

  // ═══ AI REPURPOSE TOOLS (existing) ═══
  'blog-to-linkedin-post': dynamic(() => import('@/components/tools/impl/BlogToLinkedinPost'), { loading: () => <ToolLoadingFallback /> }),
  'blog-to-twitter-thread': dynamic(() => import('@/components/tools/impl/BlogToTwitterThread'), { loading: () => <ToolLoadingFallback /> }),
  'content-to-carousel': dynamic(() => import('@/components/tools/impl/ContentToCarousel'), { loading: () => <ToolLoadingFallback /> }),
  'email-to-tweet': dynamic(() => import('@/components/tools/impl/EmailToTweet'), { loading: () => <ToolLoadingFallback /> }),
  'long-form-to-short': dynamic(() => import('@/components/tools/impl/LongFormToShort'), { loading: () => <ToolLoadingFallback /> }),
  'meeting-to-actions': dynamic(() => import('@/components/tools/impl/MeetingToActions'), { loading: () => <ToolLoadingFallback /> }),
  'podcast-notes-generator': dynamic(() => import('@/components/tools/impl/PodcastNotesGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'text-to-faq': dynamic(() => import('@/components/tools/impl/TextToFaq'), { loading: () => <ToolLoadingFallback /> }),
  'youtube-script-to-blog': dynamic(() => import('@/components/tools/impl/YoutubeScriptToBlog'), { loading: () => <ToolLoadingFallback /> }),
  'article-to-bullet-points': dynamic(() => import('@/components/tools/impl/ArticleToBulletPoints'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ INDIA FINANCE TOOLS (existing) ═══
  'emi-principal-calculator': dynamic(() => import('@/components/tools/impl/EmiPrincipalCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'fd-calculator-india': dynamic(() => import('@/components/tools/impl/FdCalculatorIndia'), { loading: () => <ToolLoadingFallback /> }),
  'gratuity-calculator-india': dynamic(() => import('@/components/tools/impl/GratuityCalculatorIndia'), { loading: () => <ToolLoadingFallback /> }),
  'gst-calculator-india': dynamic(() => import('@/components/tools/impl/GstCalculatorIndia'), { loading: () => <ToolLoadingFallback /> }),
  'home-loan-affordability': dynamic(() => import('@/components/tools/impl/HomeLoanAffordability'), { loading: () => <ToolLoadingFallback /> }),
  'nps-calculator-india': dynamic(() => import('@/components/tools/impl/NpsCalculatorIndia'), { loading: () => <ToolLoadingFallback /> }),
  'ppf-calculator': dynamic(() => import('@/components/tools/impl/PpfCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'roi-calculator': dynamic(() => import('@/components/tools/impl/RoiCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'sip-stepup-calculator': dynamic(() => import('@/components/tools/impl/SipStepupCalculator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ DEVELOPER TOOLS (ADDITIONAL 9 tools) ═══
  'chmod-calculator': dynamic(() => import('@/components/tools/impl/ChmodCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'docker-compose-generator': dynamic(() => import('@/components/tools/impl/DockerComposeGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'dotenv-editor': dynamic(() => import('@/components/tools/impl/DotenvEditor'), { loading: () => <ToolLoadingFallback /> }),
  'gitignore-generator': dynamic(() => import('@/components/tools/impl/GitignoreGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'graphql-query-builder': dynamic(() => import('@/components/tools/impl/GraphqlQueryBuilder'), { loading: () => <ToolLoadingFallback /> }),
  'http-status-codes': dynamic(() => import('@/components/tools/impl/HttpStatusCodes'), { loading: () => <ToolLoadingFallback /> }),
  'json-schema-generator': dynamic(() => import('@/components/tools/impl/JsonSchemaGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'sql-to-mongodb': dynamic(() => import('@/components/tools/impl/SqlToMongodb'), { loading: () => <ToolLoadingFallback /> }),
  'typescript-to-js': dynamic(() => import('@/components/tools/impl/TypescriptToJs'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ LOCAL SEO SCHEMA TOOLS (9 tools) ═══
  'faq-schema-generator': dynamic(() => import('@/components/tools/impl/FaqSchemaGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'gmb-post-generator': dynamic(() => import('@/components/tools/impl/GmbPostGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'hours-schema-generator': dynamic(() => import('@/components/tools/impl/HoursSchemaGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'local-business-schema': dynamic(() => import('@/components/tools/impl/LocalBusinessSchema'), { loading: () => <ToolLoadingFallback /> }),
  'local-keywords-generator': dynamic(() => import('@/components/tools/impl/LocalKeywordsGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'nap-checker': dynamic(() => import('@/components/tools/impl/NapChecker'), { loading: () => <ToolLoadingFallback /> }),
  'product-schema-generator': dynamic(() => import('@/components/tools/impl/ProductSchemaGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'service-area-schema': dynamic(() => import('@/components/tools/impl/ServiceAreaSchema'), { loading: () => <ToolLoadingFallback /> }),
  'review-response-generator': dynamic(() => import('@/components/tools/impl/ReviewResponseGenerator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ NICHE CALCULATORS (11 tools) ═══
  'carbon-footprint-calculator': dynamic(() => import('@/components/tools/impl/CarbonFootprintCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'electricity-bill-calculator': dynamic(() => import('@/components/tools/impl/ElectricityBillCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'freelance-rate-calculator': dynamic(() => import('@/components/tools/impl/FreelanceRateCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'fuel-cost-calculator': dynamic(() => import('@/components/tools/impl/FuelCostCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'markup-vs-margin': dynamic(() => import('@/components/tools/impl/MarkupVsMargin'), { loading: () => <ToolLoadingFallback /> }),
  'paint-calculator': dynamic(() => import('@/components/tools/impl/PaintCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'tile-calculator': dynamic(() => import('@/components/tools/impl/TileCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'sleep-cycle-calculator': dynamic(() => import('@/components/tools/impl/SleepCycleCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'water-intake-calculator': dynamic(() => import('@/components/tools/impl/WaterIntakeCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'wedding-budget-calculator': dynamic(() => import('@/components/tools/impl/WeddingBudgetCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'vat-calculator': dynamic(() => import('@/components/tools/impl/VatCalculator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ REFERENCE TOOLS (2 tools) ═══
  'citation-formatter': dynamic(() => import('@/components/tools/impl/CitationFormatter'), { loading: () => <ToolLoadingFallback /> }),
  'regex-library': dynamic(() => import('@/components/tools/impl/RegexLibrary'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ INDIA FINANCE TOOLS (NEW 4 tools) ═══
  'car-loan-emi-calculator-india': dynamic(() => import('@/components/tools/impl/CarLoanEmiCalculatorIndia'), { loading: () => <ToolLoadingFallback /> }),
  'home-loan-calculator-india': dynamic(() => import('@/components/tools/impl/HomeLoanCalculatorIndia'), { loading: () => <ToolLoadingFallback /> }),
  'income-tax-calculator-india': dynamic(() => import('@/components/tools/impl/IncomeTaxCalculatorIndia'), { loading: () => <ToolLoadingFallback /> }),
  'sip-calculator-india': dynamic(() => import('@/components/tools/impl/SipCalculatorIndia'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ BUSINESS & PRODUCTIVITY TOOLS (8 tools) ═══
  'meeting-cost-calculator': dynamic(() => import('@/components/tools/impl/MeetingCostCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'pricing-calculator': dynamic(() => import('@/components/tools/impl/PricingCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'invoice-number-generator': dynamic(() => import('@/components/tools/impl/InvoiceNumberGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'business-name-generator': dynamic(() => import('@/components/tools/impl/BusinessNameGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'swot-analysis-generator': dynamic(() => import('@/components/tools/impl/SwotAnalysisGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'payroll-calculator': dynamic(() => import('@/components/tools/impl/PayrollCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'working-days-calculator': dynamic(() => import('@/components/tools/impl/WorkingDaysCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'contract-generator': dynamic(() => import('@/components/tools/impl/ContractGenerator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ DESIGN & CREATIVE TOOLS (8 tools) ═══
  'aspect-ratio-calculator': dynamic(() => import('@/components/tools/impl/AspectRatioCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'svg-to-png': dynamic(() => import('@/components/tools/impl/SvgToPng'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'favicon-generator': dynamic(() => import('@/components/tools/impl/FaviconGenerator'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'pixel-to-rem': dynamic(() => import('@/components/tools/impl/PixelToRem'), { loading: () => <ToolLoadingFallback /> }),
  'box-shadow-generator': dynamic(() => import('@/components/tools/impl/BoxShadowGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'border-radius-generator': dynamic(() => import('@/components/tools/impl/BorderRadiusGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'color-shades-generator': dynamic(() => import('@/components/tools/impl/ColorShadesGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'glassmorphism-generator': dynamic(() => import('@/components/tools/impl/GlassmorphismGenerator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ DEVELOPER TOOLS BATCH 3 (10 tools) ═══
  'html-to-markdown': dynamic(() => import('@/components/tools/impl/HtmlToMarkdown'), { loading: () => <ToolLoadingFallback /> }),
  'json-to-typescript': dynamic(() => import('@/components/tools/impl/JsonToTypescript'), { loading: () => <ToolLoadingFallback /> }),
  'sql-to-prisma': dynamic(() => import('@/components/tools/impl/SqlToPrisma'), { loading: () => <ToolLoadingFallback /> }),
  'css-to-tailwind': dynamic(() => import('@/components/tools/impl/CssToTailwind'), { loading: () => <ToolLoadingFallback /> }),
  'npm-package-checker': dynamic(() => import('@/components/tools/impl/NpmPackageChecker'), { loading: () => <ToolLoadingFallback /> }),
  'curl-to-fetch': dynamic(() => import('@/components/tools/impl/CurlToFetch'), { loading: () => <ToolLoadingFallback /> }),
  'json-to-go': dynamic(() => import('@/components/tools/impl/JsonToGo'), { loading: () => <ToolLoadingFallback /> }),
  'base64-image-encoder': dynamic(() => import('@/components/tools/impl/Base64ImageEncoder'), { loading: () => <ToolLoadingFallback />, ssr: false }),
  'git-command-generator': dynamic(() => import('@/components/tools/impl/GitCommandGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'env-to-json': dynamic(() => import('@/components/tools/impl/EnvToJson'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ MATH & SCIENCE TOOLS (6 tools) ═══
  'scientific-calculator': dynamic(() => import('@/components/tools/impl/ScientificCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'fraction-calculator': dynamic(() => import('@/components/tools/impl/FractionCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'quadratic-equation-solver': dynamic(() => import('@/components/tools/impl/QuadraticEquationSolver'), { loading: () => <ToolLoadingFallback /> }),
  'matrix-calculator': dynamic(() => import('@/components/tools/impl/MatrixCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'probability-calculator': dynamic(() => import('@/components/tools/impl/ProbabilityCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'area-calculator': dynamic(() => import('@/components/tools/impl/AreaCalculator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ HEALTH & FITNESS TOOLS (6 tools) ═══
  'body-fat-calculator': dynamic(() => import('@/components/tools/impl/BodyFatCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'ideal-weight-calculator': dynamic(() => import('@/components/tools/impl/IdealWeightCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'macro-calculator': dynamic(() => import('@/components/tools/impl/MacroCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'heart-rate-zone-calculator': dynamic(() => import('@/components/tools/impl/HeartRateZoneCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'pregnancy-due-date-calculator': dynamic(() => import('@/components/tools/impl/PregnancyDueDateCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'pace-calculator': dynamic(() => import('@/components/tools/impl/PaceCalculator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ WRITING & CONTENT TOOLS (4 tools) ═══
  'headline-analyzer': dynamic(() => import('@/components/tools/impl/HeadlineAnalyzer'), { loading: () => <ToolLoadingFallback /> }),
  'reading-time-calculator': dynamic(() => import('@/components/tools/impl/ReadingTimeCalculator'), { loading: () => <ToolLoadingFallback /> }),
  'cta-generator': dynamic(() => import('@/components/tools/impl/CtaGenerator'), { loading: () => <ToolLoadingFallback /> }),
  'bio-generator': dynamic(() => import('@/components/tools/impl/BioGenerator'), { loading: () => <ToolLoadingFallback /> }),

  // ═══ UTILITY CONVERTERS (6 tools) ═══
  'temperature-converter': dynamic(() => import('@/components/tools/impl/TemperatureConverter'), { loading: () => <ToolLoadingFallback /> }),
  'speed-converter': dynamic(() => import('@/components/tools/impl/SpeedConverter'), { loading: () => <ToolLoadingFallback /> }),
  'weight-converter': dynamic(() => import('@/components/tools/impl/WeightConverter'), { loading: () => <ToolLoadingFallback /> }),
  'length-converter': dynamic(() => import('@/components/tools/impl/LengthConverter'), { loading: () => <ToolLoadingFallback /> }),
  'data-size-converter': dynamic(() => import('@/components/tools/impl/DataSizeConverter'), { loading: () => <ToolLoadingFallback /> }),
  'number-to-words': dynamic(() => import('@/components/tools/impl/NumberToWords'), { loading: () => <ToolLoadingFallback /> }),

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
