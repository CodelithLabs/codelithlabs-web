import withBundleAnalyzer from '@next/bundle-analyzer';
import withPWAInit from '@ducanh2912/next-pwa';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  fallbacks: {
    document: '/offline',
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Full Next.js deployment on Vercel (SSR, API routes, ISR enabled)
  // output: 'export' removed to unlock API routes, middleware, and server actions

  // Trailing slashes for clean URLs on Vercel
  trailingSlash: true,

  // Strict TypeScript — never ship broken types
  typescript: {
    ignoreBuildErrors: false,
  },

  // Vercel Image Optimization enabled (no longer unoptimized)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile images
      },
      {
        protocol: 'https',
        hostname: 'codelithlabs.in',
      },
    ],
  },

  experimental: {},

  // Allow webpack-based PWA plugin alongside Turbopack
  turbopack: {},

  // Compile-time environment variables (safe to expose — no secrets)
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://codelithlabs.in',
    NEXT_PUBLIC_AUTH_ENABLED: String(Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)),
  },
};

export default withNextIntl(withAnalyzer(withPWA(nextConfig)));
