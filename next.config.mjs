/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Only use valid keys for Next.js 14+
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 2,
  },
};

export default nextConfig;
