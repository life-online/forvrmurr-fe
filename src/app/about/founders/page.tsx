import React from 'react';

export default function FoundersPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl md:text-4xl text-center mb-12">Meet the Founders</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg mb-12 text-center">
          Meet the passionate minds behind ForvrMurr, united by their love for extraordinary fragrances.
        </p>
        
        <div className="space-y-16">
          {/* First Founder */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3">
              <div className="aspect-square bg-[#f7ede1] rounded-lg flex items-center justify-center">
                <span className="text-[#8b0000] font-serif text-lg">Founder Photo</span>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="font-serif text-2xl mb-3">Jane Addison</h2>
              <p className="text-[#8b0000] font-medium mb-4">Co-Founder & Creative Director</p>
              <p className="mb-4">
                With a background in luxury retail and a lifelong passion for niche fragrances, Jane brings her refined 
                aesthetic and deep industry connections to ForvrMurr. Her journey began in the perfume houses of Paris, 
                where she developed her exceptional nose and appreciation for the artistry behind each creation.
              </p>
              <p>
                "I believe fragrance is the most intimate form of self-expression. Our mission at ForvrMurr is to make 
                these moments of luxury accessible to all passionate fragrance enthusiasts."
              </p>
            </div>
          </div>
          
          {/* Second Founder */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="w-full md:w-1/3">
              <div className="aspect-square bg-[#f7ede1] rounded-lg flex items-center justify-center">
                <span className="text-[#8b0000] font-serif text-lg">Founder Photo</span>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="font-serif text-2xl mb-3">Marcus Chen</h2>
              <p className="text-[#8b0000] font-medium mb-4">Co-Founder & Operations Director</p>
              <p className="mb-4">
                Marcus brings a wealth of experience in supply chain management and e-commerce to ForvrMurr. His 
                expertise ensures that our customers receive authentic, carefully handled fragrances in our 
                signature elegant packaging.
              </p>
              <p>
                "We've created more than a business—we've built a community for those who appreciate the art of 
                fragrance. Every detail matters, from our sustainable practices to the presentation of each decant."
              </p>
            </div>
          </div>
        </div>
        
        <p className="italic text-sm text-gray-500 text-center mt-16">
          This page is under development. Full founder biographies and vision statements will be available soon.
        </p>
      </div>
    </div>
  );
}
