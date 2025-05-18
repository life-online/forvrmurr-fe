'use client';
import React, { useState } from 'react';
import { featuredProducts } from '../../data/products';
import Image from 'next/image';
import Footer from '../../components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import FilterModal from '@/components/ui/FilterModal';
import Link from 'next/link';

const scentCategories = [
  { label: 'Elegant', value: 'elegant' },
  { label: 'Intimate', value: 'intimate' },
  { label: 'Sophisticated', value: 'sophisticated' },
  { label: 'Warm', value: 'warm' },
  { label: 'Clean', value: 'clean' },
];

const filterTabs = [
  { label: 'Prime', value: 'prime' },
  { label: 'Premium', value: 'premium' },
];

export default function ChooseScentPage() {
  const [activeTab, setActiveTab] = useState('prime');
  const [activeCategory, setActiveCategory] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const filteredProducts = featuredProducts.filter(
    (p) => p.category === activeTab
  );

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

<AnnouncementBar message="New collection revealed monthly!" />
<Navbar />
      {/* Breadcrumb and Title */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-8">
        <div className="text-xs mb-2">
          <span className="mr-2">New Release</span>
          <span className="mr-2">›</span>
          <span>Shop All</span>
        </div>
        <h1 className="text-2xl font-serif font-medium mb-4 text-black">CHOOSE YOUR NEXT SCENT OBSESSION</h1>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto w-full px-4 flex gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'bg-[#faf0e2] border-[#e6c789] text-[#600000]'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scent Category Filters */}
      <div className="max-w-4xl mx-auto w-full px-4 flex gap-4 mb-8">
        {scentCategories.map((cat) => (
          <div key={cat.value} className="flex flex-col items-center flex-1">
            <button
              className={`w-28 md:w-36 aspect-[1.6/1] rounded-xl flex items-center justify-center text-base font-serif mb-2 transition-colors ${
                activeCategory === cat.value
                  ? 'bg-[#faf0e2] text-[#600000]'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveCategory(cat.value)}
            >
              Pic
            </button>
            <span className={`mt-1 text-sm font-serif ${activeCategory === cat.value ? 'text-[#600000] font-semibold' : 'text-gray-700'}`}>{cat.label}</span>
          </div>
        ))}
      </div>

      {/* Product Count and Filter/Sort Controls */}
      <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between mb-6">
        <span className="text-[#a0001e] font-serif">Showing {filteredProducts.length} products</span>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full border border-white/60 bg-transparent"></button>
          <select className="rounded-full border border-white/60 bg-transparent text-[#a0001e] px-4 py-1 text-base font-serif focus:outline-none" onClick={() => setFilterModalOpen(true)}>
            <option>Filter</option>
          </select>
          <select className="rounded-full border border-white/60 bg-transparent text-[#a0001e] px-4 py-1 text-base font-serif focus:outline-none">
            <option>Sort by | Newest</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-16">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/choose-scent/${product.id}`} className="block">
            <div className="relative bg-[#f8f5f2] rounded-xl p-6 flex flex-col items-center min-h-[550px] group overflow-hidden">
              {/* Tags */}
              {product.category === 'prime' && (
                <span className="absolute top-2 left-2 bg-amber-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium flex items-center z-20">
                  <span className="w-2 h-2 bg-red-800 rounded-full mr-1"></span>PRIME
                </span>
              )}
              {product.isBestSeller && (
                <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-sm font-medium z-20">BEST SELLER</span>
              )}
              {/* Product Image */}
              <div className="relative w-24 h-32 my-4 z-10">
                <Image src={product.imageUrl || '/images/hero/hero_image.png'} alt={product.name} fill style={{ objectFit: 'contain' }} />
              </div>
              {/* Product Info */}
              <div className="text-center mt-2 z-10">
                <div className="font-serif text-lg mb-1">{product.brand}</div>
                <div className="text-base text-gray-700 mb-2">{product.name}</div>
                <div className="text-sm font-medium">Our 8ml price: <span className="text-red-800">₦{product.price.toLocaleString()}</span></div>
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center z-30 p-10 rounded-lg">
                <div className="w-full flex flex-col items-center">
                  <h2 className="text-3xl md:text-3xl font-serif font-bold text-white mb-2 text-center drop-shadow">{product.name}</h2>
                  <div className="text-xl md:text-lg text-white mb-4 text-center font-serif tracking-wide">GRAND SOIR EAU DE PARFUM</div>
                  {/* Scent Notes */}
                  {product.scentNotes && (
                    <div className="flex justify-center gap-6 mb-6">
                      {product.scentNotes.map((note, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="relative w-10 h-10 mb-1">
                            <Image src={note.imageUrl || '/images/hero/hero_image.png'} alt={note.name} fill style={{ objectFit: 'contain' }} />
                          </div>
                          <span className={`text-xs ${idx === 0 ? 'text-[#a86a2c]' : 'text-white'}`}>{note.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-white text-lg font-serif font-semibold mb-1 mt-2">Our <span className="font-bold">8ml price: <span className="text-[#b30000]">₦{product.price.toLocaleString()}</span></span></div>
                  <div className="text-white text-base font-serif mb-6">Full Bottle Price <span className="text-[#e6c789]">₦380</span></div>
                  <button className="w-full bg-[#a00000] hover:bg-[#b30000] text-white text-xl font-serif rounded-xl py-2 transition-colors mb-2">Add to cart</button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Lower Hero Section */}
      <div className="w-full bg-gradient-to-r from-[#2d0000] to-[#600000] py-16 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 gap-8">
          <div className="flex-1 text-white">
            <h2 className="text-2xl md:text-3xl font-serif mb-4">OVER 200 CURATED FRAGRANCES. ONE SIGNATURE EXPERIENCE</h2>
            <p className="mb-6 text-base md:text-lg">
              The luxury perfume world was built on exclusivity. We&apos;re here to break that barrier—without watering anything down.<br />
              We stock over 200 of the best designer and niche fragrances in the world. From Parfums de Marly to Lattafa, Amouage to Armaf.<br />
              <br />
              While most decants arrive in plain plastic vials, ours are a luxury experience—with premium packaging, mood-based bundles, and unforgettable scent storytelling.<br />
              Forvr Murr is more than a perfume shop. It&apos;s a curated world of scent, desire, and indulgence.
            </p>
            <button className="bg-[#e6c789] text-[#600000] px-6 py-2 rounded font-medium hover:bg-[#f8f5e2] transition-colors">Subscribe</button>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-80 h-96 rounded-lg overflow-hidden">
              <Image src="/images/hero/hero_image.jpg" alt="ForvrMurr Hero" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FilterModal open={filterModalOpen} onClose={() => setFilterModalOpen(false)} />
    </div>
  );
} 