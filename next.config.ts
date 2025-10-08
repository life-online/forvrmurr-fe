import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'storage.cloud.google.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.shopify.com",
              "connect-src 'self' https://api.forvrmurr.com https://www.google-analytics.com https://analytics.google.com https://yi21n2-vf.myshopify.com https://cdn.shopify.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' data:",
              "style-src 'self' 'unsafe-inline'",
              "frame-src 'self' https://www.google.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;
