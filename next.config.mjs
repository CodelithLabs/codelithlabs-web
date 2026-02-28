/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // Enable strict TypeScript checking for production quality
  typescript: {
    ignoreBuildErrors: false,
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
