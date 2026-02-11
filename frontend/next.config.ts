import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disabled React Compiler for faster dev compilation
  // reactCompiler: true,
  typescript: {
    // Skip type checking during production builds (handled by CI/CD)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint during production builds (handled by CI/CD)
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
