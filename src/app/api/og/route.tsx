// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/api/og/route.tsx
// Dynamic OG image generation for tool pages
// Returns a 1200×630 branded card per tool using next/og (Satori)
// Usage: /api/og?slug=json-formatter&name=JSON+Formatter&category=developer&color=%238B5CF6
// ═══════════════════════════════════════════════════════════════════════════

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const SITE_URL = 'https://codelithlabs.in';

// Fallback category colors matching TOOL_CATEGORIES
const CATEGORY_COLORS: Record<string, string> = {
  text: '#3B82F6',
  image: '#10B981',
  developer: '#8B5CF6',
  converter: '#F59E0B',
  calculator: '#EF4444',
  generator: '#EC4899',
  formatter: '#06B6D4',
  encoder: '#84CC16',
  security: '#F97316',
  seo: '#6366F1',
  ai: '#A855F7',
  finance: '#22C55E',
  geo: '#3B82F6',
  'ai-repurpose': '#F472B6',
  fintech: '#34D399',
  'local-seo': '#FB923C',
  'niche-calculator': '#A78BFA',
  business: '#0EA5E9',
  design: '#F43F5E',
  math: '#7C3AED',
  health: '#DC2626',
  writing: '#6D28D9',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get('name') ?? 'Free Online Tool';
  const category = searchParams.get('category') ?? 'developer';
  const categoryLabel = searchParams.get('label') ?? category;
  const accentColor = searchParams.get('color') ?? CATEGORY_COLORS[category] ?? '#3B82F6';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          padding: '0',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Gradient glow background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(ellipse at 30% 20%, ${accentColor}22 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, ${accentColor}11 0%, transparent 50%)`,
            display: 'flex',
          }}
        />

        {/* Grid dot pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            display: 'flex',
          }}
        />

        {/* Accent top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(to right, ${accentColor}, ${accentColor}80)`,
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 80px 56px',
            height: '100%',
            zIndex: 1,
          }}
        >
          {/* Top row: CodelithLabs wordmark + privacy badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Wordmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '3px',
                    border: '2.5px solid rgba(255,255,255,0.9)',
                    display: 'flex',
                  }}
                />
              </div>
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '22px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                CodelithLabs
              </span>
            </div>

            {/* Privacy badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '8px 18px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  display: 'flex',
                }}
              />
              <span style={{ color: '#a1a1aa', fontSize: '15px', fontWeight: 500 }}>
                100% Client-Side
              </span>
            </div>
          </div>

          {/* Center: category badge + tool name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Category pill */}
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: `${accentColor}22`,
                  border: `1px solid ${accentColor}55`,
                  borderRadius: '6px',
                  padding: '6px 14px',
                }}
              >
                <span
                  style={{
                    color: accentColor,
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {categoryLabel}
                </span>
              </div>
            </div>

            {/* Tool name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span
                style={{
                  color: '#ffffff',
                  fontSize: name.length > 28 ? '52px' : '64px',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                }}
              >
                {name}
              </span>
              <span
                style={{
                  color: '#71717a',
                  fontSize: '22px',
                  fontWeight: 400,
                }}
              >
                Free Online Tool — No sign-up required
              </span>
            </div>
          </div>

          {/* Bottom row: URL */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#52525b', fontSize: '16px' }}>codelithlabs.in/tools</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
