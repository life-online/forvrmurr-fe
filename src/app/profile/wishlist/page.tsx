'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

export default function WishlistPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect guests to login page
    if (authService.isGuest()) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/profile/wishlist'));
      return;
    }
  }, [router]);

  // Don't render the page content if user is a guest (will redirect)
  if (authService.isGuest()) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl md:text-4xl text-center mb-12">My Wishlist</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg mb-8 text-center">
          Save your favorite fragrances for future consideration.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Wishlist - Empty state initially */}
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#f7ede1] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8b0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl mb-2">Your Wishlist is Empty</h3>
            <p className="text-gray-600 mb-6">
              Add fragrances to your wishlist by clicking the heart icon on product pages.
            </p>
            <Link href="/shop/collection">
              <span className="inline-block bg-[#8b0000] text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all">
                Explore Fragrances
              </span>
            </Link>
          </div>
          
          {/* Sample Wishlist Items (hidden initially - for development/placeholder purposes) */}
          <div className="hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {/* Wishlist item 1 */}
              <div className="border border-gray-100 rounded-lg p-4 flex gap-4">
                <div className="w-20 h-20 bg-gray-50 flex-shrink-0 rounded">
                  <img
                    src="/placeholder-fragrance.jpg"
                    alt="Fragrance"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-500 mb-1">Maison Francis Kurkdjian</p>
                  <h3 className="font-serif text-base mb-1">Baccarat Rouge 540</h3>
                  <p className="font-medium">₦35,000</p>
                  <div className="flex gap-2 mt-2">
                    <button className="text-[#8b0000] text-sm hover:underline">Add to Cart</button>
                    <button className="text-gray-500 text-sm hover:underline">Remove</button>
                  </div>
                </div>
              </div>
              
              {/* Wishlist item 2 */}
              <div className="border border-gray-100 rounded-lg p-4 flex gap-4">
                <div className="w-20 h-20 bg-gray-50 flex-shrink-0 rounded">
                  <img
                    src="/placeholder-fragrance.jpg"
                    alt="Fragrance"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-500 mb-1">Creed</p>
                  <h3 className="font-serif text-base mb-1">Aventus</h3>
                  <p className="font-medium">₦40,000</p>
                  <div className="flex gap-2 mt-2">
                    <button className="text-[#8b0000] text-sm hover:underline">Add to Cart</button>
                    <button className="text-gray-500 text-sm hover:underline">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="italic text-sm text-gray-500 text-center mt-8">
          This page is under development. Full wishlist functionality will be available soon.
        </p>
      </div>
    </div>
  );
}
