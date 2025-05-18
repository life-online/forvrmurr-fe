'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { featuredProducts } from '../../../data/products';
import Image from 'next/image';
// Link import removed (not used)
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Footer from '@/components/layout/Footer';

// Mock notes data for demo
const notes = {
  top: [
    { name: 'Magnolia', imageUrl: '/images/scent_notes/magnolia.png' },
    { name: 'Amber', imageUrl: '/images/scent_notes/amber.png' },
    { name: 'Yuzu', imageUrl: '/images/scent_notes/yuzu.png' },
  ],
  middle: [
    { name: 'Magnolia', imageUrl: '/images/scent_notes/magnolia.png' },
    { name: 'Amber', imageUrl: '/images/scent_notes/amber.png' },
    { name: 'Yuzu', imageUrl: '/images/scent_notes/yuzu.png' },
    { name: 'Pomegranate', imageUrl: '/images/scent_notes/pomegranate.png' },
  ],
  base: [
    { name: 'Mahogany', imageUrl: '/images/scent_notes/mahogany.png' },
    { name: 'Magnolia', imageUrl: '/images/scent_notes/magnolia.png' },
  ],
};

const userTags = [
  { label: 'Elegant' },
  { label: 'Intimate' },
  { label: 'Sophisticated' },
  { label: 'Warm' },
  { label: 'Clean' },
];

export default function ScentDetailsPage() {
  const params = useParams();
  const scent = featuredProducts.find((p) => p.id === params.id);
  // Fallback for demo
  const product = scent || featuredProducts[0];

  return (
    <>
      <div className="min-h-screen bg-[#f8f5f2] ">
        <AnnouncementBar message="New collection revealed monthly!" />
        <Navbar />
        {/* Top Section */}
        <div className="w-full" style={{ background: '#F7EDE1' }}>
          <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-8 pt-10 pb-10">
            {/* Product Image and Thumbnails */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative w-64 h-72 mb-6">
                <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'contain' }} />
              </div>
              <div className="flex gap-2 mt-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-12 h-12 bg-[#fff] rounded flex items-center justify-center border border-gray-200">
                    <Image src={product.imageUrl} alt={product.name} width={40} height={40} />
                  </div>
                ))}
              </div>
            </div>
            {/* Product Info */}
            <div className="flex-1 bg-white rounded-xl p-8 flex flex-col justify-between min-h-[400px] shadow text-black my-10">
              <div>
                <span className="bg-amber-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium mb-2 inline-block">PRIME</span>
                <h1 className="text-3xl  font-serif font-bold mb-2">{product.name}</h1>
                <div className="text-lg font-serif mb-2">GRAND SOIR EAU DE PARFUM</div>
                <div className="text-gray-700 mb-4">Mauris cursus mattis molestie a iaculis at erat pellentesque adipiscing. Netus et malesuada fames ac turpis egestas integer eget.</div>
                {/* Quantity and Price Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center border-1 border-[#a0001e] rounded-full  text-[#a0001e] font-serif text-sm py-1 ">
                    <button className="px-2 focus:outline-none">-</button>
                    <span className="mx-2">Number: 1</span>
                    <button className="px-2 focus:outline-none">+</button>
                  </div>
                  <div className="text-3xl text-[#a0001e] font-bold ml-4">₦{product.price.toLocaleString()}</div>
                </div>
                {/* Forvr Murr Pricing Section */}
                <div className="mt-8">
                  <div className="text-lg font-serif mb-4">Forvr Murr Pricing</div>
                  <div className="flex items-center justify-between gap-8">
                    {/* Left: Bottle, Price label, Price */}
                    <div className="flex items-center gap-4">
                      <Image src="/images/products/grand_soir.png" alt="Bottle" width={80} height={100} className="object-contain" />
                      <div>
                        <div className="text-sm font-serif font-bold mb-1">8ml Bottle Price:</div>
                        <div className="text-sm font-serif text-[#a0001e] font-bold">₦{product.price.toLocaleString()}</div>
                      </div>
                    </div>
                    {/* Right: Add to cart button */}
                    <button className="border-2 border-[#a0001e] text-[#a0001e] rounded-2xl px-8 py-2 text-base font-serif font-medium hover:bg-[#a0001e] hover:text-white transition-colors">
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fragrance Story */}
        <div className="max-w-3xl mx-auto text-center mt-16">
          <h2 className="text-3xl font-serif text-[#a0001e] mb-2">FRAGRANCE STORY</h2>
          <div className="text-2xl md:text-3xl font-serif text-black my-8">Mauris cursus mattis molestie a iaculis at erat pellentesqueque adipiscing. Netus et malesuada fames ac turpis egestas integer eget.</div>
          <div className="text-gray-800 my-4">Learn more about the top, middle, and bottom notes in this fragrance.</div>
        </div>

        {/* Notes Section */}
        <div className="max-w-2xl mx-auto mt-8 mb-12">
          <div className="flex flex-col justify-center gap-8">
            {/* Top Notes */}
            <div className="flex-1">
              <div className="text-center text-[#a0001e] font-serif font-semibold mb-10">TOP</div>
              <div className="flex justify-center gap-6 mb-2">
                {notes.top.map((note) => (
                  <div key={note.name} className="flex flex-col items-center">
                    <div className="relative w-12 h-12 mb-1">
                      <Image src={note.imageUrl} alt={note.name} fill style={{ objectFit: 'contain' }} />
                    </div>
                    <span className="text-xs font-serif text-gray-700">{note.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Middle Notes */}
            <div className="flex-1">
              <div className="text-center text-[#a0001e] font-serif font-semibold mb-10">MIDDLE</div>
              <div className="flex justify-center gap-6 mb-2">
                {notes.middle.map((note) => (
                  <div key={note.name} className="flex flex-col items-center">
                    <div className="relative w-12 h-12 mb-1">
                      <Image src={note.imageUrl} alt={note.name} fill style={{ objectFit: 'contain' }} />
                    </div>
                    <span className="text-xs font-serif text-gray-700">{note.name}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Base Notes */}
            <div className="flex-1">
              <div className="text-center text-[#a0001e] font-serif font-semibold mb-10">BASE</div>
              <div className="flex justify-center gap-6 mb-2">
                {notes.base.map((note) => (
                  <div key={note.name} className="flex flex-col items-center">
                    <div className="relative w-12 h-12 mb-1">
                      <Image src={note.imageUrl} alt={note.name} fill style={{ objectFit: 'contain' }} />
                    </div>
                    <span className="text-xs font-serif text-gray-700">{note.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User Description Tags */}
        <div className="max-w-4xl mx-auto mt-8 mb-12">
          <h3 className="text-3xl font-serif text-[#a0001e] text-center mb-10">HERE&apos;S HOW OTHERS DESCRIBED THE SCENT</h3>
          <div className="flex justify-center gap-4 mb-4">
            {userTags.map((tag) => (
              <div key={tag.label} className="flex flex-col items-center">
                <div className="w-28 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-2 font-serif text-lg">Pic</div>
                <span className="text-base font-serif text-gray-700 text-center">{tag.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* People Also Loved */}
        <div className="max-w-7xl text-black mx-auto mt-30 ">
          <h3 className="text-xl  font-serif text-center mb-6 font-semibold">PEOPLE ALSO LOVED</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((prod) => (
              <div key={prod.id} className="relative bg-[#F7EDE1] mb-12 rounded-xl p-6 flex flex-col items-center min-h-[450px] group overflow-hidden border border-gray-200">
                {/* Tags */}
                {prod.category === 'prime' && (
                  <span className="absolute top-2 left-2 bg-amber-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium flex items-center z-20">
                    <span className="w-2 h-2 bg-red-800 rounded-full mr-1"></span>PRIME
                  </span>
                )}
                {prod.isBestSeller && (
                  <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-sm font-medium z-20">BEST SELLER</span>
                )}
                {/* Product Image */}
                <div className="relative w-24 h-32 my-4 z-10">
                  <Image src={prod.imageUrl || '/images/hero/hero_image.png'} alt={prod.name} fill style={{ objectFit: 'contain' }} />
                </div>
                {/* Product Info */}
                <div className="text-center mt-2 z-10">
                  <div className="font-serif text-lg mb-1 font-semibold">{prod.name}</div>
                  <div className="text-sm text-gray-700 mb-2">Our 8ml price: <span className="text-red-800 font-semibold">₦{prod.price.toLocaleString()}</span></div>
                  <div className="text-sm text-gray-700 mb-2">Retail price comparison <span className=" font-semibold">₦{prod.price.toLocaleString()}</span></div>
                </div>
                <div className="flex justify-center gap-2 mt-2">
                  {prod.scentNotes?.map((note, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="relative w-6 h-6 mb-1">
                        <Image src={note.imageUrl || '/images/hero/hero_image.png'} alt={note.name} fill style={{ objectFit: 'contain' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-[#a0001e] hover:bg-[#b30000] text-white  font-serif rounded-xl py-2 transition-colors mb-2 mt-4">Add to cart</button>
                {/* Scent notes icons */}
               
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 