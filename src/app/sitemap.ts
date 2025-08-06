import { MetadataRoute } from 'next';
type ChangeFrequency = 'daily' | 'weekly' | 'always' | 'hourly' | 'monthly' | 'yearly' | 'never';
import productService from '@/services/product';
import { siteConfig } from '@/config/seo';

/**
 * Generate sitemap for the ForvrMurr website
 * This will include all static pages and dynamically generated product and collection pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Define static pages
  const staticPages = [
    '',
    '/shop',
    '/shop/gifting',
    '/shop/travel-case',
    '/about',
    '/about/story',
    '/about/founders',
    '/about/faq',
    '/about/contact',
    '/discover',
    '/discover/why-decants',
    '/discover/quiz',
    '/subscriptions',
    '/subscriptions/prime',
    '/subscriptions/premium',
    '/subscriptions/manage',
    '/privacy',
    '/terms',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as ChangeFrequency,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Fetch all products for dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    // Using our new getAllProducts method to fetch all products for the sitemap
    const products = await productService.getAllProducts();
    
    // Map products to sitemap entries
    productPages = products.map(product => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: new Date(product.updatedAt || product.createdAt || Date.now()),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Define collection pages for Prime and Premium product types
  const collectionPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/shop?type=prime`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shop?type=premium`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.7,
    }
  ];
  
  // Note: If you add more collection types in the future, add them to the array above

  // Combine all pages
  return [...staticPages, ...collectionPages, ...productPages];
}
