/**
 * SEO Configuration for ForvrMurr
 * This file contains the default SEO settings and metadata for the ForvrMurr website
 */

export const siteConfig = {
  name: 'ForvrMurr',
  url: 'https://forvrmurr.com',
  ogImage: '/images/og-image.jpg', // Path relative to public folder
  description: 'Explore coveted fragrances in 8ml portions. Smell rich. Explore more. No full bottle pressure.',
  keywords: ['luxury perfume', 'perfume samples', 'fragrance decants', 'niche perfume', 'designer fragrances'],
  twitter: {
    handle: '@forvrmurr',
    site: '@forvrmurr',
    cardType: 'summary_large_image',
  },
};

export type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    locale?: string;
    type?: string;
  };
  twitter?: {
    card?: string;
    site?: string;
    handle?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  additionalMetaTags?: Array<{
    name?: string;
    content?: string;
    property?: string;
  }>;
  additionalLinkTags?: Array<{
    rel: string;
    href: string;
    sizes?: string;
    type?: string;
  }>;
};

export const defaultSeo: SeoProps = {
  title: `${siteConfig.name} | Meet Your Next Obsession`,
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Meet Your Next Obsession`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    handle: siteConfig.twitter.handle,
    site: siteConfig.twitter.site,
    card: siteConfig.twitter.cardType,
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: siteConfig.keywords.join(', '),
    },
    {
      name: 'author',
      content: siteConfig.name,
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.png',
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon.png',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
};

/**
 * Generate metadata for specific pages
 * @param props Custom SEO properties to override defaults
 * @returns Merged SEO properties
 */
export function getSeoProps(props: SeoProps = {}): SeoProps {
  return {
    ...defaultSeo,
    ...props,
    openGraph: {
      ...defaultSeo.openGraph,
      ...props.openGraph,
    },
    twitter: {
      ...defaultSeo.twitter,
      ...props.twitter,
    },
    additionalMetaTags: [
      ...(defaultSeo.additionalMetaTags || []),
      ...(props.additionalMetaTags || []),
    ],
    additionalLinkTags: [
      ...(defaultSeo.additionalLinkTags || []),
      ...(props.additionalLinkTags || []),
    ],
  };
}

/**
 * Generate product page SEO metadata
 * @param product Product data
 * @returns SEO properties for product page
 */
export function getProductSeoProps(product: {
  name: string;
  description?: string;
  images?: Array<{ url: string }>;
  brand?: { name: string };
  price?: number;
  slug?: string;
}): SeoProps {
  const title = `${product.brand?.name || ''} ${product.name} | ${siteConfig.name}`;
  const description = product.description || `Discover ${product.name} at ForvrMurr. Luxury fragrance samples in 8ml portions.`;
  const url = `${siteConfig.url}/shop/${product.slug || ''}`;
  
  // Handle image URLs - ensure they are absolute URLs
  let imageUrl = product.images?.[0]?.url || siteConfig.ogImage;
  
  // If the image URL doesn't start with http or https, prepend the site URL
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `${siteConfig.url}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  return getSeoProps({
    title,
    description,
    canonical: url,
    openGraph: {
      title,
      description,
      url,
      type: 'product',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      // Add product-specific OpenGraph metadata
      // Note: Next.js only supports 'website' type in the metadata API, but we include these for completeness
      /* For reference, these would be the product-specific tags if supported:
      price: product.price?.toString() || '',
      currency: 'NGN',
      availability: 'instock',
      */
      
    },
    twitter: {
      title,
      description,
      image: imageUrl,
    },
    additionalMetaTags: [
      {
        property: 'product:price:amount',
        content: product.price?.toString() || '',
      },
      {
        property: 'product:price:currency',
        content: 'NGN',
      },
    ],
  });
}

/**
 * Generate category page SEO metadata
 * @param category Category data
 * @returns SEO properties for category page
 */
export function getCategorySeoProps(category: {
  name: string;
  description?: string;
  image?: string;
  slug?: string;
}): SeoProps {
  const title = `${category.name} Fragrances | ${siteConfig.name}`;
  const description = category.description || `Explore our collection of ${category.name.toLowerCase()} fragrances at ForvrMurr. Luxury perfume samples in 8ml portions.`;
  const url = `${siteConfig.url}/shop/collection/${category.slug || ''}`;
  const image = category.image || siteConfig.ogImage;

  return getSeoProps({
    title,
    description,
    canonical: url,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: category.name,
        },
      ],
    },
    twitter: {
      title,
      description,
      image,
    },
  });
}
