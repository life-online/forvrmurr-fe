import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PremiumSubscriptionPage() {
  return (
    <>
      <div className="text-center py-16 md:py-24">
        <h1 className="font-serif text-3xl md:text-4xl text-[#a0001e] mb-6">Premium Subscription</h1>
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-10">
            
            <h2 className="font-serif text-2xl mb-6">Coming Soon</h2>
            <p className="text-lg mb-8">
              Our Premium subscription offers exclusive access to limited edition and luxury niche fragrances.
              We're currently perfecting this experience for you.
            </p>
            <div className="flex justify-center">
              <Link href="/shop" className="bg-[#a0001e] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all">
                Shop Individual Decants
              </Link>
            </div>
          </div>
          <p className="italic text-sm text-gray-500">
            Be the first to know when our Premium subscription launches. Follow us on Instagram <a href="https://instagram.com/forvrmurr" className="text-[#a0001e] hover:underline" target="_blank" rel="noopener noreferrer">@forvrmurr</a>
          </p>
        </div>
      </div>
    </>
  );
}
