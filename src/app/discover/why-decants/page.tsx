"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import SubpageHero from "@/components/ui/SubpageHero";

export default function WhyDecantsPage() {
  const mainSectionRef = useRef<HTMLDivElement>(null);

  // Function to scroll to FAQ content with proper positioning
  const scrollToMainSection = () => {
    // Use setTimeout to ensure the scroll happens after the current execution context
    setTimeout(() => {
      if (mainSectionRef.current) {
        const offsetTop = mainSectionRef.current.offsetTop;
        window.scrollTo({
          top: offsetTop, // No offset to ensure FAQ content is at the very top
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-[96%] h-[70vh] md:h-[65vh] overflow-hidden mx-auto my-3 md:my-8 rounded-lg">
      <div className="relative w-full h-full">
        {/* Desktop Image */}
        <Image
          src="/images/discover/why-decants/why-decants-hero.jpg"
          alt="ForvrMurr Founders"
          fill
          priority
          className="object-cover object-[90%_center] hidden md:block"
        />

        {/* Mobile Image */}
        <Image
          src="/images/discover/why-decants/why-decants-hero-mobile.jpg"
          alt="ForvrMurr Founders"
          fill
          priority
          className="object-cover md:hidden"
        />

        {/* Gradient Overlay for text legibility - Desktop */}
        <div className="absolute inset-0 bg-gradient-to-r m-4 from-black/5 to-transparent z-10 hidden md:block rounded-lg"></div>

        {/* Gradient Overlay for text legibility - Mobile */}
        <div className="absolute inset-0 bg-gradient-to-b m-4 from-transparent via-transparent to-black/5 z-10 md:hidden rounded-lg"></div>

        {/* Hero Content - Desktop */}
        <div className="absolute inset-0 z-20 items-center flex">
          <div className="max-w-7xl w-full mx-auto px-12 text-left mt-auto mb-12 md:my-0">
            <div className="space-y-2 md:space-y-6 md:w-1/2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-wide text-[#8B0000]">
                BLIND BUYING PERFUME IS UNSERIOUS
              </h1>
              <p className="text-base md:text-lg font-light text-[#8B0000]">
                Whether it's a signature scent or a fleeting affair, you deserve
                options—without the pressure of a $400 commitment.
              </p>
              <button
                onClick={scrollToMainSection}
                className="mt-6 px-8 py-3 bg-[#a0001e] text-white font-medium rounded hover:bg-[#8b0000] transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Benefits Sections */}
      <div ref={mainSectionRef} id="main" className="py-16 md:py-32">
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-24">
            {/* Intro Text */}
            <div className="text-center">
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto md:pb-12">
                The niche perfume world was built on exclusivity. We break that
                barrier—without watering anything down. Our decants offer a
                luxurious way to sample the best perfumes on the market, without
                the risk of regret. Whether you're exploring scent layering,
                building your wardrobe, or searching for THE ONE—this is the
                smarter, sexier way to shop.
              </p>
            </div>

            {/* Section 1: Full Bottles = High Risk */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-2/5 relative">
                <div className="aspect-[1080/1200] relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/discover/why-decants/sections/discover-1.jpg"
                    alt="Luxury perfume bottles"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-3/5">
                <h2 className="font-serif text-2xl md:text-3xl mb-4">
                  Full Bottles = High Risk
                </h2>
                <p className="text-lg text-gray-700">
                  Most niche perfumes cost $150–$400+. A blind buy can be an
                  expensive mistake. Without experiencing a fragrance on your
                  skin over time, you might end up with a full bottle that
                  doesn't resonate with you or your body chemistry.
                </p>
              </div>
            </div>

            {/* Section 2: Try 3 Scents Instead of One */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
              <div className="md:w-2/5 relative">
                <div className="aspect-[1080/1200] relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/discover/why-decants/sections/discover-2.jpg"
                    alt="Multiple perfume decants"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-3/5">
                <h2 className="font-serif text-2xl md:text-3xl mb-4">
                  Try 3 Scents Instead of One
                </h2>
                <p className="text-lg text-gray-700">
                  For the price of one full bottle, you can try 2–3 different
                  scents in our premium 8ml bottles. This gives you the freedom
                  to experience multiple fragrances and discover what truly
                  speaks to your personal style and preferences.
                </p>
              </div>
            </div>

            {/* Section 3: Find Your Signature */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-2/5 relative">
                <div className="aspect-[1080/1200] relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/discover/why-decants/sections/discover-3.jpg"
                    alt="Person applying perfume"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-3/5">
                <h2 className="font-serif text-2xl md:text-3xl mb-4">
                  Find Your Signature, Without Pressure
                </h2>
                <p className="text-lg text-gray-700">
                  Our decants let you wear each scent properly—not just dab and
                  guess. With 8ml, you have enough fragrance to experience how
                  it evolves throughout the day, how it interacts with your skin
                  over time, and how it makes you feel across different
                  occasions.
                </p>
              </div>
            </div>

            {/* Section 4: Designed to Be Desired */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
              <div className="md:w-2/5 relative">
                <div className="aspect-[1080/1200] relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/discover/why-decants/sections/discover-4.jpg"
                    alt="Forvr Murr luxury packaging"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-3/5">
                <h2 className="font-serif text-2xl md:text-3xl mb-4">
                  Designed to Be Desired
                </h2>
                <p className="text-lg text-gray-700">
                  Most decants arrive in plastic vials. Ours arrive in custom
                  bottles with mood-rich storytelling, packaging, and travel
                  case options. We've elevated the decant experience to match
                  the luxury of the fragrances themselves—because your perfume
                  journey should be beautiful from start to finish.
                </p>
              </div>
            </div>

            {/* Section 5: Perfect for Layering */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-2/5 relative">
                <div className="aspect-[1080/1200] relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/discover/why-decants/sections/discover-5.jpg"
                    alt="Multiple perfume bottles for layering"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-3/5">
                <h2 className="font-serif text-2xl md:text-3xl mb-4">
                  Perfect for Layering
                </h2>
                <p className="text-lg text-gray-700">
                  Mix and match notes to create something completely yours. Our
                  decants make fragrance layering accessible, allowing you to
                  experiment with combinations that create a unique signature
                  scent that's exclusively you.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center pt-8">
              <h2 className="font-serif text-2xl md:text-3xl mb-6">
                Ready to experience luxury fragrance, smarter?
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-[#a0001e] hover:bg-[#8B0000] text-white rounded-lg transition-all duration-300"
                >
                  Shop All Scents
                </Link>
                <Link
                  href="/subscription"
                  className="px-6 py-3 border border-gray-300 hover:bg-gray-100 text-gray-800 rounded-lg transition-all duration-300"
                >
                  Start with a Subscription
                </Link>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
