import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ScentQuizPage() {
  return (
    <>
      <div className="text-center py-16 md:py-24">
        <h1 className="font-serif text-3xl md:text-4xl text-[#a0001e] mb-6">Find Your Signature Scent</h1>
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-10">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Image 
                src="/images/logo-icon.png" 
                alt="ForvrMurr Logo" 
                fill
                className="object-contain"
              />
            </div>
            <h2 className="font-serif text-2xl mb-6">Coming Soon</h2>
            <p className="text-lg mb-8">
              Our interactive scent profile quiz is currently in development. Soon you'll be able to discover your perfect fragrance match 
              through a personalized experience that analyzes your preferences and recommends fragrances tailored to your unique taste.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/shop" className="bg-[#a0001e] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all">
                Browse All Fragrances
              </Link>
              <Link href="/discover/why-decants" className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                Learn About Decants
              </Link>
            </div>
          </div>
          <p className="italic text-sm text-gray-500">
            Be the first to know when our scent quiz launches. Follow us on Instagram <a href="https://instagram.com/forvrmurr" className="text-[#a0001e] hover:underline" target="_blank" rel="noopener noreferrer">@forvrmurr</a>
          </p>
        </div>
      </div>
    </>
  );
}
