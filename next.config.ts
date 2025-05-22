import type { NextConfig } from "next";

// next.config.js
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.cloud.google.com',
      },
    ],
  },
};

export default nextConfig;
