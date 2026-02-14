/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker (smaller image, faster starts)
  output: 'standalone',
  
  // 1. Ignore TypeScript Errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. Ignore ESLint Errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 3. Ensure images work in Docker
  images: {
    unoptimized: true,
  },
  // 4. Optimize for low-memory builds
  experimental: {
    // Reduce memory usage during build
    workerThreads: false,
    cpus: 2,
  },
  // 5. Enable compression
  compress: true,
  // 6. Generate ETags for caching
  generateEtags: true,
  // 7. Power off by default X-Powered-By header
  poweredByHeader: false,
};

export default nextConfig;