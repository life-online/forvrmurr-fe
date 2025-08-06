import { Metadata } from 'next';
import { getProductSeoProps, siteConfig } from '@/config/seo';
import productService from '@/services/product';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Fetch product data
    const product = await productService.getProductBySlug(params.slug);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }
    
    // Generate SEO props for this product
    const seoProps = getProductSeoProps({
      name: product.name,
      description: product.description,
      images: product.imageUrls?.map(img => ({ url: img })),
      brand: { name: product.brand?.name || '' },
      price: Number(product.nairaPrice),
      slug: product.slug,
    });
    
    // Return Next.js Metadata object
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
  } catch (error) {
    console.error('Error generating product metadata:', error);
    
    // Fallback metadata
    return {
      title: `Product | ${siteConfig.name}`,
      description: siteConfig.description,
    };
  }
}
