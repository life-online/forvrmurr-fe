import React from 'react';

export default function ScentQuizPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl md:text-4xl text-center mb-12">Find Your Signature Scent</h1>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-lg mb-8">
          Discover your perfect fragrance match through our interactive scent profile quiz. 
          We'll analyze your preferences and recommend fragrances tailored to your unique taste.
        </p>
        <div className="bg-white border border-[#8b0000] border-opacity-20 rounded-lg p-8 shadow-sm mb-10">
          <h2 className="font-serif text-xl mb-6">Scent Quiz Coming Soon</h2>
          <p className="mb-6">
            Our expert perfumers are crafting a sophisticated algorithm to match you with your perfect scent. 
            Leave your email to be notified when our quiz launches.
          </p>
          <div className="flex flex-col md:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-2 border border-gray-200 rounded-full flex-grow"
            />
            <button className="bg-[#8b0000] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all">
              Notify Me
            </button>
          </div>
        </div>
        <p className="italic text-sm text-gray-500">
          This page is under development. Our personalized scent quiz will be available soon.
        </p>
      </div>
    </div>
  );
}
