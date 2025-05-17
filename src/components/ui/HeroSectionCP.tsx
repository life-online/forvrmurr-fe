"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSectionCPPP: React.FC = () => {
  return (
    <section className="relative w-full bg-[radial-gradient(174.11%_77.44%_at_22.61%_44.86%,_#600000_0%,_#300000_100%)] text-white min-h-[70vh] md:min-h-[80vh] flex items-center py-12 md:py-0">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-stretch h-full w-full">
        <div className="p-6 md:w-2/3 space-y-6 mb-10 md:mb-0 z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-wide text-[#e6c789]">
            MEET YOUR NEXT OBSESSION
          </h1>
          <p className="text-lg md:text-xl font-light max-w-lg text-[#e6c789]">
            Explore coveted fragrance like Delina, Khamrah & Oud Satin - in 8ml
            portions.
          </p>
          <p className="text-lg md:text-xl font-light max-w-lg text-[#e6c789]">
            Smell rich. Explore more. No full bottle pressure.
          </p>
          <Link href="/shop">
            <button className="bg-[#800000] text-white py-3 px-8 rounded transition-all hover:bg-[#000000] hover:cursor-pointer font-medium self-start">
              Shop Now
            </button>
          </Link>
        </div>
        <div className="md:w-1/3 h-full w-full">
          <div className="absolute top-0 right-0 w-full h-full flex justify-end">
            <div className="h-full aspect-[16/9] relative">
              
            <div className="relative w-full h-full">
            <Image
              src="/images/hero_image.png"
              alt="Luxury Perfume"
              fill
              priority
              className="object-contain object-right drop-shadow-xl"
            />
          </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSectionCPPP;
