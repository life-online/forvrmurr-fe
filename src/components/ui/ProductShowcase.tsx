"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';

interface ScentNote {
  name: string;
  imageUrl: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  category: 'prime' | 'premium';
  isBestSeller?: boolean;
  scentNotes?: ScentNote[];
}

interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="w-full group">
      <div className="bg-[#f8f5f2] relative rounded-lg overflow-hidden p-6 transition-all duration-300 group-hover:shadow-xl pt-12">
        {/* No need for opacity transition on these tags as they'll be covered by the overlay */}
        {product.isBestSeller && (
          <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-sm font-medium z-10">
            BEST SELLER
          </div>
        )}
        {product.category === 'prime' && (
          <div className="absolute top-2 left-2 bg-amber-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium z-10 flex items-center">
            <span className="w-2 h-2 bg-red-800 rounded-full mr-1"></span>
            PRIME
          </div>
        )}
        
        {/* Product image */}
        <div className="relative h-48 w-full overflow-hidden mt-10 mb-6">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        {/* Product info (visible when not hovering) */}
        <div className="text-center">
          <h3 className="text-xl font-serif mb-1">{product.brand}</h3>
          <p className="text-sm text-gray-700 mb-2">{product.name}</p>
          <p className="text-sm font-medium">Our 8ml price: <span className="text-red-800">₦{product.price.toLocaleString()}</span></p>
        </div>
        
        {/* Hover overlay with blur effect - covers the entire card including tags */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white z-50 rounded-lg">
          {/* Add category tag to the hover state for continuity */}
          
          
          <div className="pt-8">
            <h4 className="text-lg font-medium text-center text-white">{product.name}</h4>
            {product.scentNotes && product.scentNotes.length > 0 && (
              <div className="mt-4 flex justify-center items-start space-x-3">
                {product.scentNotes.map((note, index) => (
                  <div key={index} className="flex flex-col items-center text-center w-16">
                    <div className="relative w-8 h-8 mb-1">
                      <Image
                        src={note.imageUrl}
                        alt={note.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <p className="text-xs text-gray-300">{note.name}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-200 uppercase">GRAND SOIR EAU DE PARFUM</p>
            </div>
          </div>
          
          <div className="text-center mt-auto">
            <p className="text-white font-medium mb-1">Our 8ml price: <span className="text-[#e6c789]">₦{product.price.toLocaleString()}</span></p>
            <p className="text-sm text-gray-300 mb-3">Full Bottle Price ₦380</p>
            <Button className="w-full py-2">
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ title, subtitle, products }) => {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link href="/new" className="hover:underline">New Release</Link>
              <span>›</span>
              <Link href="/shop-all" className="hover:underline">Shop All</Link>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif">{title}</h2>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-gray-300 text-gray-800 text-sm py-1 px-4 rounded-full hover:bg-gray-100 transition-colors">
              All
            </button>
            <button className="bg-white border border-gray-300 text-gray-800 text-sm py-1 px-4 rounded-full hover:bg-gray-100 transition-colors">
              Prime
            </button>
            <button className="bg-white border border-gray-300 text-gray-800 text-sm py-1 px-4 rounded-full hover:bg-gray-100 transition-colors">
              Premium
            </button>
          </div>
        </div>
        
        {/* Custom horizontal scrolling container */}
        <div className="horizontal-scroll-container relative">
          <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar scroll-container scroll-smooth">
            {/* Add more products for scrolling effect */}
            {[...products, ...products, ...products].map((product, index) => (
              <div key={`${product.id}-${index}`} className="flex-shrink-0 w-80">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
