
"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function OurStory() {
  // Create a ref for the FAQ content section
  const storyContentRef = useRef<HTMLDivElement>(null);

  // Function to scroll to FAQ content with proper positioning
  const scrollToSection = () => {
    // Use setTimeout to ensure the scroll happens after the current execution context
    setTimeout(() => {
      if (storyContentRef.current) {
        const offsetTop = storyContentRef.current.offsetTop;
        window.scrollTo({
          top: offsetTop, // No offset to ensure FAQ content is at the very top
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <div className="bg-white flex flex-col mb-16">
      {/* Hero Section */}
      <section className="relative w-[96%] h-[70vh] md:h-[65vh] overflow-hidden mx-auto my-3 md:my-8 rounded-lg">
        <div className="relative w-full h-full">
          {/* Desktop Image */}
          <Image
            src="/images/about/story/story-hero.jpg"
            alt="Story Hero"
            fill
            priority
            className="object-cover hidden md:block"
          />

          {/* Mobile Image */}
          <Image
            src="/images/about/story/story-hero-mobile.jpg"
            alt="Story Hero"
            fill
            priority
            className="object-cover md:hidden"
          />

          {/* Gradient Overlay for text legibility - Desktop */}
          <div className="absolute inset-0 bg-gradient-to-l m-4 from-black/10 to-transparent z-10 hidden md:block rounded-lg"></div>

          {/* Gradient Overlay for text legibility - Mobile */}
          <div className="absolute inset-0 bg-gradient-to-b m-4 from-transparent via-transparent to-black/10 z-10 md:hidden rounded-lg"></div>

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-center max-w-2xl mx-auto px-4 mt-auto mb-16 md:my-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-wide text-[#8B0000] mb-4">
                THIS STARTED WITH OBSESSION
              </h1> 
              <p className="text-base md:text-lg font-light text-[#8B0000] max-w-2xl mx-auto">
              What fuels our passion is now yours to enjoy freely.
              </p>
              <button
                onClick={scrollToSection}
                className="mt-6 px-8 py-3 bg-[#a0001e] text-white font-medium rounded hover:bg-[#8b0000] transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>
 

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-16 md:py-32" ref={storyContentRef}>
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left Side (Image) */}
          <div className="w-full md:w-1/2">
            <p className="text-lg mb-8 text-gray-800">
              Niche fragrance was always gatekept—until we entered the chat.
              Forvr Murr was born from a shared obsession between two fragrance
              lovers who knew Nigeria (and the world) deserved more than plastic
              decants and blind buy regrets. We exist to bring luxury within
              reach, one 8ml obsession at a time.
            </p>

            <blockquote className="border-l-4 border-[#8b0000] pl-4 italic mb-8">
              <p className="text-lg text-gray-700">
                "Fragrance is intimate. Personal. It should feel like a love
                story, not unnecessary risk."
              </p>
            </blockquote>

            <Link
              href="/shop"
              className="inline-block bg-[#8b0000] hover:bg-[#a0001e] text-white px-8 py-3 rounded-md transition-colors font-medium"
            >
              Explore Our Scents
            </Link>
          </div>
          <div className="w-full md:w-1/2">
            <Image
              src="/images/about/story/our-story-candid.jpg"
              alt="Founders of ForvrMurr"
              width={600}
              height={800}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Right Side (Text) */}
          
        </div>
      </section>
    </div>
  );
}
