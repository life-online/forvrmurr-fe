"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';

const CategorySelection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getCardWidth = (cardType: 'prime' | 'premium'): string => {
    if (!hoveredCard) return 'md:w-1/2'; // Default equal width
    if (hoveredCard === cardType) return 'md:w-2/3'; // Expanded width for hovered card
    return 'md:w-1/3'; // Shrunken width for non-hovered card
  };

  return (
    <section className="w-full pt-24 md:mb-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12"> 
          <p className="text-sm text-gray-600 mb-2">Start Here</p>
          <h2 className="text-3xl font-serif font-medium">ARE YOU PRIME OR PREMIUM?</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6"> 
          {/* Prime Category */}
          <div 
            className={`bg-[#faf0e2] rounded-lg p-8 relative flex flex-col items-center min-h-[28rem] transition-all duration-300 ease-in-out ${getCardWidth('prime')}`}
            onMouseEnter={() => setHoveredCard('prime')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 className="text-2xl font-serif mb-4 text-center">Prime</h3>
            {/* Image Area */}
            <div className="relative flex-grow w-full flex items-center justify-center my-4 space-x-2 md:space-x-4">
              {/* Left Extra Bottle */}
              <div className={`relative w-20 h-32 md:w-28 md:h-40 transition-all duration-300 ease-in-out ${hoveredCard === 'prime' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                <Image
                  src="/images/category_selection/prime_left.png"
                  alt="Prime Perfume Side"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              {/* Central Bottle */}
              <div className="relative w-32 h-44 md:w-40 md:h-56 transition-all duration-300 ease-in-out">
                <Image
                  src="/images/category_selection/prime_center.png"
                  alt="Prime Perfume"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              {/* Right Extra Bottle */}
              <div className={`relative w-20 h-32 md:w-28 md:h-40 transition-all duration-300 ease-in-out ${hoveredCard === 'prime' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                <Image
                  src="/images/category_selection/prime_right.png"
                  alt="Prime Perfume Side"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            {/* Button Area */}
            <div className="mt-auto w-full text-center pt-4">
              <Link href="/prime">
                <Button> 
                  Explore
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Premium Category */}
          <div 
            className={`bg-[#600000] text-white rounded-lg p-8 relative flex flex-col items-center min-h-[28rem] transition-all duration-300 ease-in-out ${getCardWidth('premium')}`}
            onMouseEnter={() => setHoveredCard('premium')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 className="text-2xl font-serif mb-4 text-center text-[#e6c789]">Premium</h3>
            {/* Image Area */}
            <div className="relative flex-grow w-full flex items-center justify-center my-4 space-x-2 md:space-x-4">
              {/* Left Extra Bottle */}
              <div className={`relative w-20 h-32 md:w-28 md:h-40 transition-all duration-300 ease-in-out ${hoveredCard === 'premium' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                <Image
                  src="/images/category_selection/premium_left.png"
                  alt="Premium Perfume Side"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              {/* Central Bottle */}
              <div className="relative w-32 h-44 md:w-40 md:h-56 transition-all duration-300 ease-in-out">
                <Image
                  src="/images/category_selection/premium_center.png"
                  alt="Premium Perfume"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              {/* Right Extra Bottle */}
              <div className={`relative w-20 h-32 md:w-28 md:h-40 transition-all duration-300 ease-in-out ${hoveredCard === 'premium' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                <Image
                  src="/images/category_selection/premium_right.png"
                  alt="Premium Perfume Side"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            {/* Button Area */}
            <div className="mt-auto w-full text-center pt-4">
              <Link href="/premium">
                <Button> 
                  Explore
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Quiz Section */}
        {/* <div className="mt-12 text-center">
          <p className="text-lg font-serif mb-4">NOT SURE WHERE TO START?</p>
          <Link href="/quiz">
            <Button variant="outline">
              Take Our Scent Quiz
            </Button>
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default CategorySelection;
