"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import productService, { Product } from '@/services/product';
import { useToast } from '@/context/ToastContext';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { error: showError } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        const productData = await productService.getProductBySlug(slug);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product details:', err);
        showError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, showError]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <AnnouncementBar message="New collection revealed monthly!" />
        <Navbar />
        <div className="max-w-7xl mx-auto w-full px-4 py-16 flex justify-center">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-300 rounded mb-8"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 h-96 bg-gray-300 rounded"></div>
              <div className="w-full md:w-1/2">
                <div className="h-8 w-40 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 w-full bg-gray-300 rounded mb-8"></div>
                <div className="h-32 w-full bg-gray-300 rounded mb-8"></div>
                <div className="h-12 w-40 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <AnnouncementBar message="New collection revealed monthly!" />
        <Navbar />
        <div className="max-w-7xl mx-auto w-full px-4 py-16 text-center">
          <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
          <p className="mb-8">The product you are looking for does not exist or may have been removed.</p>
          <Link 
            href="/shop" 
            className="bg-[#8b0000] text-white px-6 py-2 rounded-md hover:bg-[#6b0000] transition-colors"
          >
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <AnnouncementBar message="New collection revealed monthly!" />
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-8">
        <div className="text-xs mb-2">
          <Link href="/" className="mr-2 hover:text-[#8b0000]">Home</Link>
          <span className="mr-2">›</span>
          <Link href="/shop" className="mr-2 hover:text-[#8b0000]">Shop</Link>
          <span className="mr-2">›</span>
          <span className="text-[#8b0000]">{product.name}</span>
        </div>
      </div>
      
      {/* Product Detail */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Product Images */}
          <div className="w-full md:w-1/2">
            <div className="bg-[#f8f5f2] rounded-xl p-8 flex justify-center items-center mb-4 h-[500px]">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <div className="relative w-full h-full">
                  <Image 
                    src={product.imageUrls[selectedImage]} 
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="text-gray-500">No image available</div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.imageUrls.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-none w-20 h-20 border-2 rounded-md overflow-hidden ${selectedImage === idx ? 'border-[#8b0000]' : 'border-gray-200'}`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <div className="mb-1 text-lg font-serif text-[#8b0000]">{product.brand.name}</div>
            <h1 className="text-3xl font-serif font-medium mb-4">{product.name}</h1>
            
            {/* Pricing */}
            <div className="mb-6">
              <div className="text-xl font-medium mb-1">
                Our 8ml price: <span className="text-[#8b0000]">₦{parseInt(product.nairaPrice).toLocaleString()}</span>
              </div>
              {product.priceFullBottle && (
                <div className="text-gray-600">
                  Full Bottle Price: ₦{parseInt(product.priceFullBottle).toLocaleString()}
                </div>
              )}
            </div>
            
            {/* Product Type & Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.type && (
                <span className="bg-amber-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                  <span className="w-2 h-2 bg-red-800 rounded-full mr-1"></span>
                  {product.type.toUpperCase()}
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-sm font-medium">
                  BEST SELLER
                </span>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
            
            {/* Scent Notes */}
            {(product.topNotes.length > 0 || product.middleNotes.length > 0 || product.baseNotes.length > 0) && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-2">Scent Notes</h2>
                <div className="grid grid-cols-3 gap-4">
                  {product.topNotes.length > 0 && (
                    <div>
                      <h3 className="font-medium text-[#a86a2c] mb-1">Top Notes</h3>
                      <ul className="text-sm">
                        {product.topNotes.map(note => (
                          <li key={note.id} className="mb-1">{note.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {product.middleNotes.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Middle Notes</h3>
                      <ul className="text-sm">
                        {product.middleNotes.map(note => (
                          <li key={note.id} className="mb-1">{note.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {product.baseNotes.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Base Notes</h3>
                      <ul className="text-sm">
                        {product.baseNotes.map(note => (
                          <li key={note.id} className="mb-1">{note.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Add to Cart Button */}
            <button
              className="w-full bg-[#a00000] hover:bg-[#b30000] text-white text-xl font-serif rounded-xl py-3 transition-colors mb-4"
            >
              Add to Cart
            </button>
            
            {/* Fragrance Story */}
            {product.fragranceStory && (
              <div className="mt-8 p-6 bg-[#f8f5f2] rounded-lg">
                <h2 className="text-lg font-serif font-medium mb-2">Fragrance Story</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.fragranceStory}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
