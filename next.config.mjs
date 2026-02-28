/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // Trailing slashes for clean static file URLs on Vercel/CDN
  trailingSlash: true,

  // Strict TypeScript — never ship broken types
  typescript: {
    ignoreBuildErrors: false,
  },

  // Static export requires unoptimized images (no server-side loader)
  images: {
    unoptimized: true,
  },

  // Opt out of anonymous telemetry
  experimental: {
    workerThreads: false,
    cpus: 2,
  },

  // Compile-time environment variables (safe to expose — no secrets)
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://codelithlabs.in',
  },
};

export default nextConfig;
