import React from 'react';

export default function FAQsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl md:text-4xl text-center mb-12">Frequently Asked Questions</h1>
      <div className="max-w-3xl mx-auto">
        <p className="text-lg mb-8 text-center">
          Find answers to common questions about our luxury fragrances, decants, and services.
        </p>
        
        <div className="space-y-8 mt-12">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="font-serif text-xl mb-3">What are fragrance decants?</h3>
            <p className="text-gray-700">
              Fragrance decants are smaller portions of original fragrances transferred from their original 
              bottles into smaller containers. At ForvrMurr, we use premium quality glass vials with secure 
              atomizers to ensure the integrity of each fragrance remains intact.
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-6">
            <h3 className="font-serif text-xl mb-3">Are your fragrances authentic?</h3>
            <p className="text-gray-700">
              Absolutely. We source all our fragrances directly from authorized retailers or the brands themselves. 
              We never sell replicas, imitations, or inspired-by versions. Each decant comes with our authenticity guarantee.
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-6">
            <h3 className="font-serif text-xl mb-3">How do your subscriptions work?</h3>
            <p className="text-gray-700">
              Our monthly subscriptions offer curated fragrance experiences delivered to your door. Choose between 
              our Prime or Premium tiers based on your preferences. Each month, you'll receive carefully selected 
              decants based on your scent profile, seasonal themes, or new releases from prestigious houses.
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-6">
            <h3 className="font-serif text-xl mb-3">Can I cancel or pause my subscription?</h3>
            <p className="text-gray-700">
              Yes, you can manage your subscription easily through your account dashboard. You can pause, skip a month, 
              or cancel at any time with no penalties. We believe in flexibility and want you to enjoy your fragrance 
              journey without commitments.
            </p>
          </div>
          
          <div className="border-b border-gray-200 pb-6">
            <h3 className="font-serif text-xl mb-3">How do you ship your fragrances?</h3>
            <p className="text-gray-700">
              We ship all our fragrances in specially designed packaging that protects them from light, temperature changes, 
              and physical damage. Our packaging is discreet, elegant, and environmentally conscious. We offer tracked 
              shipping options to ensure safe delivery.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12 p-6 bg-[#f7ede1] rounded-lg">
          <h3 className="font-serif text-xl mb-3">Can't find what you're looking for?</h3>
          <p className="mb-4">Our fragrance specialists are here to help with any questions you might have.</p>
          <a 
            href="/about/contact" 
            className="inline-block bg-[#8b0000] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all"
          >
            Contact Us
          </a>
        </div>
        
        <p className="italic text-sm text-gray-500 text-center mt-8">
          This page is under development. More detailed FAQs will be available soon.
        </p>
      </div>
    </div>
  );
}
