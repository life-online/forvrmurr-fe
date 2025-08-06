import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/seo';

/**
 * Generate robots.txt content for the ForvrMurr website
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/auth/',
        '/profile/',
        '/api/',
        '/admin/',
        '/_next/',
        '/404',
        '/500',
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
