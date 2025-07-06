import React from 'react';

export default function PremiumSubscriptionPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl md:text-4xl text-center mb-12">Monthly Premium Subscription</h1>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-lg mb-8">
          Our Premium subscription offers exclusive access to limited edition and luxury niche fragrances. 
          Receive larger decants of the world's most coveted scents delivered in our signature packaging.
        </p>
        <div className="bg-[#f7ede1] p-6 rounded-lg my-8">
          <h2 className="font-serif text-xl mb-4">Premium Benefits</h2>
          <ul className="text-left space-y-2 max-w-md mx-auto">
            <li>• Larger decant sizes than our Prime subscription</li>
            <li>• Early access to new arrivals</li>
            <li>• Complimentary travel case with your first delivery</li>
            <li>• Members-only pricing on full bottles</li>
          </ul>
        </div>
        <p className="italic text-sm text-gray-500">
          This page is under development. Full Premium subscription details will be available soon.
        </p>
      </div>
    </div>
  );
}
