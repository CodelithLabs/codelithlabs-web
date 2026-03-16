// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/monetization/PremiumFeaturesGrid.tsx
// Grid of 25 premium-exclusive features displayed on the pricing page
// ═══════════════════════════════════════════════════════════════════════════
"use client";

import {
  BadgeCheck,
  BellOff,
  Bookmark,
  Brush,
  Crown,
  Download,
  Eye,
  FlaskConical,
  Gamepad2,
  History,
  Keyboard,
  Lock,
  Monitor,
  Moon,
  Package,
  PinOff,
  Settings2,
  Share2,
  Sparkles,
  Star,
  ThumbsUp,
  Users,
  Zap,
  Search,
  Languages,
} from "lucide-react";

const FEATURES: { icon: React.ElementType; title: string; desc: string }[] = [
  {
    icon: BellOff,
    title: "100% Ad-Free",
    desc: "Zero banners, popups, or interstitials — ever. Clean, distraction-free workspace.",
  },
  {
    icon: History,
    title: "Tool History",
    desc: "Your last 100 inputs per tool saved in your account so you pick up right where you left off.",
  },
  {
    icon: Bookmark,
    title: "Pinned Tools",
    desc: "Pin your most-used tools to the top of the hub for instant one-click access.",
  },
  {
    icon: Brush,
    title: "Exclusive Themes",
    desc: "Unlock premium colour schemes — Midnight Blue, Deep Purple, Rose Gold, and more.",
  },
  {
    icon: Moon,
    title: "OLED Dark Mode",
    desc: "True pitch-black OLED dark mode that saves battery on AMOLED screens.",
  },
  {
    icon: Download,
    title: "Export Presets",
    desc: "Save tool configurations as reusable presets and export your results in PDF and CSV.",
  },
  {
    icon: Crown,
    title: "Early Access",
    desc: "Try new tools and features weeks before they roll out to the general public.",
  },
  {
    icon: Zap,
    title: "Priority Processing",
    desc: "AI-powered tools get a dedicated fast lane — no queue throttling for premium accounts.",
  },
  {
    icon: Star,
    title: "Vote on Features",
    desc: "Cast premium votes on the public roadmap to steer which tools we build next.",
  },
  {
    icon: ThumbsUp,
    title: "Custom Tool Requests",
    desc: "Submit one custom tool request per month and we'll evaluate it for the next sprint.",
  },
  {
    icon: Users,
    title: "Priority Support",
    desc: "Jump the queue — premium tickets are answered within 24 hours on business days.",
  },
  {
    icon: BadgeCheck,
    title: "Premium Profile Badge",
    desc: "Your account displays a verified ⚡ PRO badge visible on comments and community posts.",
  },
  {
    icon: Gamepad2,
    title: "Exclusive Game Skins",
    desc: "Unlock premium visual skins for VOID, Snake, 2048, and every future CodelithLabs game.",
  },
  {
    icon: Monitor,
    title: "Distraction-Free Focus Mode",
    desc: "Collapse the navbar and footer to enter full-screen tool focus mode with one click.",
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    desc: "Global keyboard shortcut palette (Cmd+K / Ctrl+K) to launch any tool instantly.",
  },
  {
    icon: Search,
    title: "Advanced Search Filters",
    desc: "Filter tools by category, language, or premium status with full-text tool search.",
  },
  {
    icon: Share2,
    title: "Shareable Outputs",
    desc: "Generate a permanent shareable link for any tool output to send to clients or teammates.",
  },
  {
    icon: FlaskConical,
    title: "Beta Lab Access",
    desc: "Opt in to experimental features still in active development before they hit production.",
  },
  {
    icon: Languages,
    title: "Full i18n Unlock",
    desc: "Access all 6 language variants simultaneously and switch without page reload.",
  },
  {
    icon: Package,
    title: "Bulk Operations",
    desc: "Process multiple files or inputs at once — batch image compression, batch encoding, and more.",
  },
  {
    icon: Lock,
    title: "Private Tool Vault",
    desc: "Store sensitive tool outputs (API keys, tokens) in an encrypted vault only you can access.",
  },
  {
    icon: Settings2,
    title: "Tool Customisation",
    desc: "Adjust default settings for every tool — precision, locale, output format — saved to your profile.",
  },
  {
    icon: PinOff,
    title: "No Nag Prompts",
    desc: "Free tier upgrade prompts are hidden entirely once you're a premium member.",
  },
  {
    icon: Eye,
    title: "Analytics Dashboard",
    desc: "See your personal usage stats — most-used tools, sessions, and time saved.",
  },
  {
    icon: Sparkles,
    title: "AI Credits",
    desc: "Monthly AI credits that refill on your billing date for AI Translator, Color Palette, and more.",
  },
];

export function PremiumFeaturesGrid() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Everything you get with{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Premium
          </span>
        </h2>
        <p className="text-zinc-400 text-sm">
          25 exclusive features — all for ₹99/month introductory price.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="shrink-0 mt-0.5 p-1.5 rounded-lg bg-blue-500/10">
              <Icon className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">{title}</p>
              <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
