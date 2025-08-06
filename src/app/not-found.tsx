"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-lg w-full text-center">
        {/* Space for image */}
        <div className="relative w-full h-64 mb-12 overflow-hidden rounded-xl">
          <Image
            src="/images/404.jpg"
            alt="Page not found"
            fill
            priority
            className="object-cover rounded-xl"
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#8b0000] mb-4">
          Oops!
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4">
          Couldn't Find the Note
        </h2>
        
        <p className="text-gray-600 mb-8">
          Like a fragrance that's yet to be discovered, this page remains elusive. Let us guide you back to our curated collection.
        </p>
        
        <Link 
          href="/"
          className="inline-block bg-[#8b0000] hover:bg-[#a0001e] text-white px-8 py-3 rounded-md transition-colors font-medium"
        >
          Back to Home
        </Link>
      </div>
      
      {/* Background decorative element */}
      <div className="absolute inset-0 z-[-1] opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[500px] h-[500px] rounded-full border-[30px] border-[#8b0000]"></div>
        </div>
      </div>
    </div>
  );
}
