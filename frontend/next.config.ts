import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disabled React Compiler for faster dev compilation
  // reactCompiler: true,
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
