import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images from external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Server actions config
  serverExternalPackages: ['@prisma/client', 'prisma'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
