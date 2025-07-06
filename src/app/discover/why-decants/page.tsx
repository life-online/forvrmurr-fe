import React from 'react';

export default function WhyDecantsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl md:text-4xl text-center mb-12">Why Choose Decants</h1>
      <div className="max-w-3xl mx-auto">
        <p className="text-lg mb-8 text-center">
          Discover the benefits of fragrance decants and why they're the perfect way to experience luxury scents.
        </p>
        
        <div className="space-y-12 mt-12">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex justify-center items-start">
              <div className="w-16 h-16 rounded-full bg-[#f7ede1] flex items-center justify-center">
                <span className="font-serif text-xl">1</span>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="font-serif text-xl mb-3">Experience More Variety</h2>
              <p>
                Instead of investing in a single full-size bottle, decants allow you to experience a diverse range of premium fragrances. 
                Explore multiple scents from prestigious houses for the same cost as one full bottle.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex justify-center items-start">
              <div className="w-16 h-16 rounded-full bg-[#f7ede1] flex items-center justify-center">
                <span className="font-serif text-xl">2</span>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="font-serif text-xl mb-3">Try Before You Commit</h2>
              <p>
                Fragrances develop differently on each person's skin. Decants give you the opportunity to wear a scent 
                multiple times before deciding if it's worth investing in a full bottle.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex justify-center items-start">
              <div className="w-16 h-16 rounded-full bg-[#f7ede1] flex items-center justify-center">
                <span className="font-serif text-xl">3</span>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="font-serif text-xl mb-3">Access Rare & Exclusive Scents</h2>
              <p>
                Many luxury fragrances are limited edition, exclusive to certain regions, or simply too expensive 
                to purchase in full size. Our decants make these rare treasures accessible to all fragrance enthusiasts.
              </p>
            </div>
          </div>
        </div>
        
        <p className="italic text-sm text-gray-500 text-center mt-12">
          This page is under development. More information about our premium decants will be available soon.
        </p>
      </div>
    </div>
  );
}
