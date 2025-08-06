import { Metadata } from 'next';
import { getSeoProps, siteConfig } from '@/config/seo';

export function generateMetadata(): Metadata {
  const seoProps = getSeoProps({
    title: 'Forvr Murr | Meet Your Next Obsession',
    description: 'Browse our collection of luxury perfume samples. Discover premium and niche fragrances in convenient 8ml portions.',
    canonical: `${siteConfig.url}/shop`,
    openGraph: {
      title: 'Forvr Murr | Meet Your Next Obsession',
      description: 'Browse our collection of luxury perfume samples. Discover premium and niche fragrances in convenient 8ml portions.',
      url: `${siteConfig.url}/shop`,
      type: 'website',
    },
    twitter: {
      title: "Forvr Murr | Meet Your Next Obsession",
      description: 'Browse our collection of luxury perfume samples. Discover premium and niche fragrances in convenient 8ml portions.',
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: 'luxury perfume samples, niche fragrances, designer perfumes, 8ml samples, fragrance decants',
      },
    ],
  });

  return {
    title: seoProps.title,
    description: seoProps.description,
    openGraph: {
      title: seoProps.openGraph?.title,
      description: seoProps.openGraph?.description,
      url: seoProps.openGraph?.url,
      siteName: seoProps.openGraph?.siteName,
      images: seoProps.openGraph?.images,
      locale: seoProps.openGraph?.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoProps.twitter?.title,
      description: seoProps.twitter?.description,
      site: seoProps.twitter?.site,
      creator: seoProps.twitter?.handle,
      images: seoProps.twitter?.image ? [seoProps.twitter.image] : undefined,
    },
    alternates: {
      canonical: seoProps.canonical,
    },
  };
}
