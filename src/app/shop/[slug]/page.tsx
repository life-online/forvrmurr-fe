'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Footer from '@/components/layout/Footer';
import productService, { Product } from '@/services/product';
import ProductCard from '@/components/ui/ProductCard';
import ProductBadge from '@/components/ui/ProductBadge';
import AddToCartButton from '@/components/cart/AddToCartButton';

// Type assertion function to help with type comparisons
const isPremiumType = (type: any): boolean => {
  if (typeof type === 'string') {
    return type.toUpperCase() === 'PREMIUM';
  }
  return false;
};

// Fallback image paths
const FALLBACK_IMAGE = '/images/hero/hero_image.png';
const FALLBACK_NOTE_IMAGE = '/images/scent_notes/default.png';

// Type augmentation for Note to include imageUrl property
declare module '@/services/product' {
  interface Note {
    imageUrl?: string;
  }
}

// User description tags - these could come from API in the future
const userTags = [
  { label: 'Elegant' },
  { label: 'Intimate' },
  { label: 'Sophisticated' },
  { label: 'Warm' },
  { label: 'Clean' },
];

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Fetch the product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
        
        // After fetching the main product, get related products
        const relatedProductsResponse = await productService.getProducts({
          limit: 4,
          // Optional filters - could be based on same brand or category
        });
        setRelatedProducts(relatedProductsResponse.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Handle quantity changes
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-[#f8f5f2]">
          <AnnouncementBar message="New collection revealed monthly!" />
          <Navbar />
          <div className="w-full py-20 text-center">
            <div className="animate-pulse">
              <div className="h-72 w-64 bg-gray-200 rounded mx-auto mb-8"></div>
              <div className="h-10 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
              <div className="h-4 w-80 bg-gray-200 rounded mx-auto"></div>
            </div>
            <p className="mt-8 text-gray-500">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <>
        <div className="min-h-screen bg-[#f8f5f2]">
          <AnnouncementBar message="New collection revealed monthly!" />
          <Navbar />
          <div className="w-full py-20 text-center">
            <h2 className="text-2xl text-red-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-700 mb-8">{error || "Product not found"}</p>
            <Link href="/shop" className="bg-[#a0001e] text-white px-6 py-2 rounded-lg hover:bg-[#800018] transition-colors">
              Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <AnnouncementBar message="New collection revealed monthly!" />
        <Navbar />
        {/* Top Section */}
        <div className="w-full pt-16 pb-24" style={{ background: '#F7EDE1' }}>
          <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-8 pt-10 pb-10 px-4">
            {/* Product Image and Thumbnails */}
            <div className="flex-1 flex flex-col items-center">
              {/* Main Image with Animation */}
              <div className="relative w-full h-[28rem] md:w-[24rem] md:h-[28rem] mb-6 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative"
                  >
                    <Image 
                      src={product.imageUrls?.[selectedImageIndex] || FALLBACK_IMAGE} 
                      alt={product.name} 
                      fill 
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                      quality={90}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-3 mt-4 justify-center">
                {(product.imageUrls?.length ? product.imageUrls : [FALLBACK_IMAGE]).map((img, i) => (
                  <div 
                    key={i} 
                    className={`w-16 h-16 bg-white rounded flex items-center justify-center border cursor-pointer transition-all
                    ${selectedImageIndex === i ? 'border-[#a0001e] ring-2 ring-[#a0001e]/50 shadow-md' : 'border-gray-200 hover:border-[#a0001e]/30'}`}
                    onClick={() => handleThumbnailClick(i)}
                  >
                    <Image 
                      src={img || FALLBACK_IMAGE} 
                      alt={`${product.name} - view ${i+1}`} 
                      width={50} 
                      height={50} 
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Product Info */}
            <div className="flex-1 bg-white rounded-xl p-8 flex flex-col justify-between min-h-[400px] shadow text-black my-10">
              <div>
                <div className="mb-2 inline-block">
                  {product.type === 'premium' ? (
                    <ProductBadge type="premium" className="relative top-0 left-0" />
                  ) : (
                    <ProductBadge type="prime" className="relative top-0 left-0" />
                  )}
                </div>
                <h1 className="text-3xl  font-serif font-bold mb-2">{product.brand.name}</h1>
                <div className="text-lg font-serif mb-2">{product.name}{" "}{product.concentration}</div>
                <div className="text-gray-700 mb-8 leading-relaxed">{product.description}</div>
                {/* Quantity and Price Row */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-center border border-[#a0001e] rounded-full text-[#a0001e] font-serif text-sm py-1">
                    <button 
                      onClick={decreaseQuantity} 
                      className="px-3 focus:outline-none hover:bg-red-50 rounded-l-full"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="mx-2">Number: {quantity}</span>
                    <button 
                      onClick={increaseQuantity} 
                      className="px-3 focus:outline-none hover:bg-red-50 rounded-r-full"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-3xl text-[#a0001e] font-bold ml-4">₦{(Number(product.nairaPrice) * quantity).toLocaleString()}</div>
                </div>
                {/* Forvr Murr Pricing Section */}
                <div className="mt-8">
                  <div className="text-lg font-serif mb-4">Forvr Murr Pricing</div>
                  <div className="flex items-center justify-between gap-8">
                    {/* Left: Bottle, Price label, Price */}
                    <div className="flex items-center gap-4">
                      <Image src="/images/products/grand_soir.png" alt="Bottle" width={80} height={100} className="object-contain" />
                      <div>
                        <div className="text-sm font-serif font-bold mb-1">8ml Bottle Price:</div>
                        <div className="text-sm font-serif text-[#a0001e] font-bold">
                          ₦{Number(product.nairaPrice).toLocaleString()} × {quantity} = ₦{(Number(product.nairaPrice) * quantity).toLocaleString()}
                        </div>
                        {product.priceFullBottle && (
                          <div className="text-xs text-gray-600 mt-1">
                            Full bottle: ₦{Number(product.priceFullBottle).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Right: Add to cart button */}
                    <AddToCartButton product={product} quantity={quantity} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fragrance Story */}
        <div className="max-w-3xl mx-auto text-center mt-24 px-4">
          <h2 className="text-3xl font-serif text-[#a0001e] mb-2">FRAGRANCE STORY</h2>
          <div className="text-xl md:text-2xl font-serif text-black my-8">
            {product.fragranceStory || product.description}
          </div>
          <div className="text-gray-800 my-4">Learn more about the top, middle, and bottom notes in this fragrance.</div>
        </div>

        {/* Notes Section */}
        <div className="max-w-2xl mx-auto mt-16 pb-8 mb-24 px-4">
          <div className="flex flex-col justify-center gap-8">
            {/* Top Notes */}
            {product.topNotes && product.topNotes.length > 0 && (
              <div className="flex-1">
                <div className="text-center text-[#a0001e] font-serif font-semibold mb-10">TOP</div>
                <div className="flex justify-center gap-6 flex-wrap">
                  {product.topNotes.map((note) => (
                    <div key={note.id} className="flex flex-col items-center">
                      <div className="relative w-12 h-12 mb-1">
                        <Image 
                          src={note.imageUrl || FALLBACK_NOTE_IMAGE} 
                          alt={note.name} 
                          fill 
                          className="object-contain" 
                        />
                      </div>
                      <span className="text-xs font-serif text-gray-700">{note.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Middle Notes */}
            {product.middleNotes && product.middleNotes.length > 0 && (
              <div className="flex-1">
                <div className="text-center text-[#a0001e] font-serif font-semibold mb-10">MIDDLE</div>
                <div className="flex justify-center gap-6 flex-wrap">
                  {product.middleNotes.map((note) => (
                    <div key={note.id} className="flex flex-col items-center">
                      <div className="relative w-12 h-12 mb-1">
                        <Image 
                          src={note.imageUrl || FALLBACK_NOTE_IMAGE} 
                          alt={note.name} 
                          fill 
                          className="object-contain" 
                        />
                      </div>
                      <span className="text-xs font-serif text-gray-700">{note.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Base Notes */}
            {product.baseNotes && product.baseNotes.length > 0 && (
              <div className="flex-1">
                <div className="text-center text-[#a0001e] font-serif font-semibold mb-10">BASE</div>
                <div className="flex justify-center gap-6 flex-wrap">
                  {product.baseNotes.map((note) => (
                    <div key={note.id} className="flex flex-col items-center">
                      <div className="relative w-12 h-12 mb-1">
                        <Image 
                          src={note.imageUrl || FALLBACK_NOTE_IMAGE} 
                          alt={note.name} 
                          fill 
                          className="object-contain" 
                        />
                      </div>
                      <span className="text-xs font-serif text-gray-700">{note.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Description Tags */}
        <div className="max-w-4xl mx-auto mt-16 pt-16mb-24 pb-24">
          <h3 className="text-3xl font-serif text-[#a0001e] text-center mb-10">HERE&apos;S HOW OTHERS DESCRIBED THE SCENT</h3>
          <div className="flex justify-center gap-4 mb-4">
            {userTags.map((tag) => (
              <div key={tag.label} className="flex flex-col items-center">
                <div className="w-28 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-2 font-serif text-lg">Pic</div>
                <span className="text-base font-serif text-gray-700 text-center">{tag.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* People Also Loved */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto mt-16 mb-16 px-4">
            <h3 className="text-xl font-serif text-center mb-6 font-semibold">PEOPLE ALSO LOVED</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((prod, index) => (
                <ProductCard 
                  key={prod.id} 
                  product={prod} 
                  priorityLoading={index < 2} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
} 