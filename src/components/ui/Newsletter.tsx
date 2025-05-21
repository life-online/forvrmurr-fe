"use client";

import React from 'react';

const Newsletter: React.FC = () => {
  return (
    <section className="w-full bg-[#faf5eb] pt-12 pb-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-serif mb-2">YOURS DON&apos;T END</h2>
        <h3 className="text-xl font-serif mb-6">Subscribe & Obsess Monthly</h3>
        
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
          Get a curated selection of our finest fragrances delivered to your doorstep every month. 
          Discover new scents and rediscover old favorites with our premium subscription service.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-grow px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#8b0000]"
          />
          <button className="bg-[#8b0000] text-white py-3 px-6 rounded transition-all hover:bg-[#6b0000] font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
