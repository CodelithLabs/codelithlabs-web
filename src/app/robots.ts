// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/robots.ts
// Robots.txt — Comprehensive global crawler coverage
// Covers search engines, social previews, and SEO tools worldwide.
// The wildcard rule covers every unlisted bot; explicit entries ensure
// crawlers that skip wildcards still receive a clear allow/disallow policy.
// ═══════════════════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const blocked = ['/private/', '/api/', '/_internal/'];
  const assets  = ['/_next/', '/static/', '/public/'];

  return {
    rules: [

      // ── GLOBAL WILDCARD ─────────────────────────────────────────────────
      // Covers every crawler not explicitly listed below (all island nations,
      // small-market engines, preview renderers, and future bots).
      {
        userAgent: '*',
        allow: ['/'],
        disallow: blocked,
      },

      // ── AMERICAS ────────────────────────────────────────────────────────

      // Google (USA) — all first-party Googlebot variants
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Googlebot-News',
          'Googlebot-Video',
          'Google-InspectionTool',
          'Storebot-Google',
          'GoogleOther',
          'Google-Extended',
        ],
        allow: ['/', ...assets],
        disallow: blocked,
      },

      // Microsoft Bing (USA)
      {
        userAgent: ['bingbot', 'msnbot', 'msnbot-media', 'BingPreview', 'adidxbot'],
        allow: ['/', ...assets],
        disallow: blocked,
      },

      // Yahoo! Search (USA)
      { userAgent: 'Slurp', allow: ['/'], disallow: blocked },

      // DuckDuckGo (USA)
      { userAgent: 'DuckDuckBot', allow: ['/'], disallow: blocked },

      // Amazon / Alexa Rankings (USA)
      { userAgent: ['Amazonbot', 'ia_archiver'], allow: ['/'], disallow: blocked },

      // Apple (USA) — Siri Search, Spotlight, Applebot-Extended
      { userAgent: ['Applebot', 'Applebot-Extended'], allow: ['/'], disallow: blocked },

      // Ask Jeeves / Ask.com (USA)
      { userAgent: ['Teoma', 'Ask Jeeves'], allow: ['/'], disallow: blocked },

      // Gigablast (USA)
      { userAgent: 'Gigabot', allow: ['/'], disallow: blocked },

      // Mojeek (UK — Americas & Europe audience)
      { userAgent: 'MojeekBot', allow: ['/'], disallow: blocked },

      // Ecosia (Germany, used widely across Americas)
      { userAgent: 'EcosiaBot', allow: ['/'], disallow: blocked },

      // Internet Archive / Wayback Machine (USA)
      { userAgent: 'archive.org_bot', allow: ['/'], disallow: blocked },

      // ── EUROPE ──────────────────────────────────────────────────────────

      // Yandex (Russia, CIS, Eastern Europe) — all variants
      {
        userAgent: [
          'YandexBot',
          'YandexImages',
          'YandexVideo',
          'YandexMedia',
          'YandexMetrika',
          'YandexNews',
          'YandexCatalog',
          'YandexDirect',
          'YandexMarket',
          'YandexVertis',
          'YandexAccessibilityBot',
          'YandexMobileBot',
        ],
        allow: ['/'],
        disallow: blocked,
      },

      // Mail.ru / VK (Russia)
      { userAgent: 'Mail.Ru_Bot', allow: ['/'], disallow: blocked },

      // Seznam (Czech Republic)
      { userAgent: 'SeznamBot', allow: ['/'], disallow: blocked },

      // Qwant (France)
      { userAgent: ['Qwantify', 'Qwant'], allow: ['/'], disallow: blocked },

      // Exalead (France — Dassault Systèmes)
      { userAgent: 'Exabot', allow: ['/'], disallow: blocked },

      // Cliqz (Germany)
      { userAgent: 'Cliqzbot', allow: ['/'], disallow: blocked },

      // Leit.is (Iceland)
      { userAgent: 'LeitBot', allow: ['/'], disallow: blocked },

      // Lycos (Belgium / EU)
      { userAgent: 'Lycos_Spider', allow: ['/'], disallow: blocked },

      // Goo.ne.jp (Japan, used in EU context)
      { userAgent: 'ichiro', allow: ['/'], disallow: blocked },

      // ── RUSSIA & CIS (extended) ─────────────────────────────────────────

      // Rambler (Russia)
      { userAgent: 'StackRambler', allow: ['/'], disallow: blocked },

      // ── CHINA ───────────────────────────────────────────────────────────

      // Baidu (China) — all Baiduspider variants
      {
        userAgent: [
          'Baiduspider',
          'Baiduspider-image',
          'Baiduspider-video',
          'Baiduspider-news',
          'Baiduspider-favo',
          'Baiduspider-cpro',
        ],
        allow: ['/'],
        disallow: blocked,
      },

      // Sogou (China)
      {
        userAgent: [
          'Sogou web spider',
          'Sogou inst spider',
          'Sogou News Spider',
          'Sogou Pic Spider',
          'Sogouwebspider',
        ],
        allow: ['/'],
        disallow: blocked,
      },

      // 360 Search / Qihoo (China)
      { userAgent: '360Spider', allow: ['/'], disallow: blocked },

      // ByteDance / TikTok / Douyin / Toutiao (China)
      { userAgent: 'Bytespider', allow: ['/'], disallow: blocked },

      // Yisou / CNKI (China)
      { userAgent: 'YiSouSpider', allow: ['/'], disallow: blocked },

      // Shenma / UC Browser (China — Alibaba)
      { userAgent: ['ShenmaSpider', 'Bingbot-Shenma'], allow: ['/'], disallow: blocked },

      // Huawei Petal Search (China / Global)
      { userAgent: 'PetalBot', allow: ['/'], disallow: blocked },

      // Haosou / Qihoo 360 (China)
      { userAgent: 'HaosouSpider', allow: ['/'], disallow: blocked },

      // Bing China / WeChat Search (China)
      { userAgent: 'WechatBot', allow: ['/'], disallow: blocked },

      // ── SOUTH KOREA ─────────────────────────────────────────────────────

      // Naver (South Korea)
      { userAgent: ['Yeti', 'NaverBot'], allow: ['/'], disallow: blocked },

      // Daum / Kakao (South Korea)
      { userAgent: ['DaumMoaBotFetcher', 'Daum'], allow: ['/'], disallow: blocked },

      // ── JAPAN ───────────────────────────────────────────────────────────

      // Yahoo Japan (uses Googlebot at crawl level, but has own agent)
      { userAgent: 'Yeti', allow: ['/'], disallow: blocked },

      // livedoor / NHN Japan
      { userAgent: 'Goo', allow: ['/'], disallow: blocked },

      // ── SOUTHEAST ASIA ──────────────────────────────────────────────────

      // Cốc Cốc (Vietnam)
      { userAgent: ['coccocbot', 'Coccoc'], allow: ['/'], disallow: blocked },

      // ── MIDDLE EAST ─────────────────────────────────────────────────────

      // Yandex is widely used in Turkey, Kazakhstan, and parts of MENA
      // (covered above). Google/Bing cover Saudi Arabia, UAE, Israel, Iran.

      // ── AFRICA ──────────────────────────────────────────────────────────

      // Africa primarily uses Google and Bing (covered above).
      // South Africa's Ananzi search:
      { userAgent: 'Ananzi', allow: ['/'], disallow: blocked },

      // ── INDIA & SOUTH ASIA ──────────────────────────────────────────────

      // Rediff (India)
      { userAgent: 'Rediff_Crawler', allow: ['/'], disallow: blocked },

      // ── OCEANIA / PACIFIC ISLANDS ────────────────────────────────────────
      // Australia, New Zealand, Fiji, Samoa, Tonga, Kiribati, Micronesia,
      // Vanuatu, Solomon Islands, Tuvalu, Palau, Marshall Islands, Nauru,
      // Cook Islands, Niue — all covered by Google/Bing wildcard above.

      // ── CARIBBEAN & ATLANTIC ISLANDS ─────────────────────────────────────
      // Trinidad, Jamaica, Barbados, Bahamas, Cuba, Dominican Republic,
      // Cayman, Turks & Caicos, Bermuda, Falklands, Sint Maarten, Saint
      // Kitts, Grenada, Saint Lucia, Montserrat — covered by Google/Bing.

      // ── INDIAN OCEAN ISLANDS ─────────────────────────────────────────────
      // Maldives, Seychelles, Mauritius, Réunion, Comoros, Mayotte,
      // British Indian Ocean Territory — covered by Google/Bing.

      // ── SOCIAL & PREVIEW CRAWLERS (global reach) ────────────────────────

      // Meta (Facebook / Instagram)
      { userAgent: ['facebookexternalhit', 'Facebot', 'meta-externalagent'], allow: ['/'], disallow: blocked },

      // X / Twitter
      { userAgent: 'Twitterbot', allow: ['/'], disallow: blocked },

      // LinkedIn
      { userAgent: 'LinkedInBot', allow: ['/'], disallow: blocked },

      // Slack
      { userAgent: 'Slackbot', allow: ['/'], disallow: blocked },

      // Telegram
      { userAgent: 'TelegramBot', allow: ['/'], disallow: blocked },

      // Discord
      { userAgent: 'Discordbot', allow: ['/'], disallow: blocked },

      // WhatsApp (Meta)
      { userAgent: 'WhatsApp', allow: ['/'], disallow: blocked },

      // Pinterest
      { userAgent: 'Pinterestbot', allow: ['/'], disallow: blocked },

      // LINE (Japan / Southeast Asia)
      { userAgent: ['LINE-PingService', 'LINE'], allow: ['/'], disallow: blocked },

      // WeChat / Weixin link preview (China)
      { userAgent: 'WeChat', allow: ['/'], disallow: blocked },

      // Reddit
      { userAgent: 'Redditbot', allow: ['/'], disallow: blocked },

      // Snapchat
      { userAgent: 'Snapchat', allow: ['/'], disallow: blocked },

      // Mastodon / Fediverse (ActivityPub federation crawlers)
      { userAgent: 'Mastodon', allow: ['/'], disallow: blocked },

      // ── SEO & ANALYTICS TOOLS ───────────────────────────────────────────

      { userAgent: ['AhrefsBot', 'AhrefsBot-Screenshot'], allow: ['/'], disallow: blocked },
      { userAgent: ['SemrushBot', 'SemrushBot-SA', 'SemrushBot-CT', 'SemrushBot-SI'], allow: ['/'], disallow: blocked },
      { userAgent: ['MJ12bot', 'DotBot', 'BLEXBot', 'Rogerbot', 'spbot'], allow: ['/'], disallow: blocked },

      // ── ACCESSIBILITY & READER APPS ─────────────────────────────────────

      // Googlebot-Smartphone (already in Google group above), but also:
      { userAgent: 'baiduspider-mobile', allow: ['/'], disallow: blocked },

    ],

    host: 'https://codelithlabs.in',
    sitemap: [
      'https://codelithlabs.in/sitemap.xml',
    ],
  };
}

