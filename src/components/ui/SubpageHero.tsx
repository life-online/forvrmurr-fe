"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SubpageHeroProps {
  title: string;
  subtitle: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  cta?: {
    text: string;
    href: string;
    onClick?: () => void;
  }[];
}

const SubpageHero: React.FC<SubpageHeroProps> = ({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  cta = []
}) => {
  return (
    <section className="relative bg-[#f8f5f2] overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          {/* Text content */}
          <div className="w-full lg:w-1/2 z-10 order-2 lg:order-1">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 font-medium">
              {title}
            </h1>
            <h2 className="text-lg md:text-xl mb-6 text-gray-700 font-medium">
              {subtitle}
            </h2>
            {description && (
              <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl">
                {description}
              </p>
            )}
            
            {cta.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {cta.map((button, index) => (
                  <Link 
                    href={button.href}
                    key={index}
                    onClick={(e) => {
                      if (button.onClick) {
                        e.preventDefault();
                        button.onClick();
                      }
                    }}
                    className={`inline-block px-6 py-3 rounded-lg transition-all duration-300 ${
                      index === 0
                        ? "bg-[#a0001e] hover:bg-[#8B0000] text-white"
                        : "border border-gray-300 hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    {button.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Image */}
          <div className="w-full lg:w-1/2 relative order-1 lg:order-2">
            <div className="aspect-[4/3] relative w-full max-w-xl mx-auto overflow-hidden rounded-lg shadow-lg">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubpageHero;
