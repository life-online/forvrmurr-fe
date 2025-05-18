/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Disable ESLint errors during build (they will still show as warnings)
  eslint: {
    // Warning rather than error
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;
