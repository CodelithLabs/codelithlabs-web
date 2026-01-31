/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // <--- Forces static HTML generation (creates 'out' folder)
  images: {
    unoptimized: true, // <--- Required for GitHub Pages (cannot optimize images on the fly)
  },
};

export default nextConfig;
