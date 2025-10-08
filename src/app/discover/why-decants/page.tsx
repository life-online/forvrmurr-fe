"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SubpageHero from "@/components/ui/SubpageHero";
import AnimatedSection from "@/components/animations/AnimatedSection";
import AnimatedLines from "@/components/animations/AnimatedLines";
import AnimatedText from "@/components/animations/AnimatedText";
import { buttonHover, buttonTap } from "@/utils/animations";

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
                <AnimatedLines
                  lines={["BLIND BUYING PERFUME IS UNSERIOUS"]}
                  className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-[#8B0000]"
                  delay={0.3}
                  duration={0.8}
                  lineStagger={0.2}
                  as="h1"
                />
                <AnimatedLines
                  lines={["Whether it's a signature scent or a fleeting affair, you deserve options—without the pressure of a $400 commitment."]}
                  className="text-base md:text-lg font-light text-[#8B0000]"
                  delay={1.1}
                  duration={0.6}
                  lineStagger={0.15}
                  as="p"
                />
                <motion.button
                  onClick={scrollToMainSection}
                  className="mt-6 px-8 py-3 bg-[#a0001e] text-white font-medium rounded hover:bg-[#8b0000] transition-colors"
                  initial={{ opacity: 0, y: 20, scale: 0.92 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.45, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] as any }
                  }}
                  whileHover={{
                    ...buttonHover,
                    y: -2,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={buttonTap}
                >
                  Learn More
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Sections */}
      <div ref={mainSectionRef} id="main" className="py-16 md:py-32">
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-24">
          {/* Intro Text */}
          <AnimatedSection delay={0.1} direction="up">
            <div className="text-center">
              <AnimatedText
                text="The niche perfume world was built on exclusivity. We break that barrier—without watering anything down. Our decants offer a luxurious way to sample the best perfumes on the market, without the risk of regret. Whether you're exploring scent layering, building your wardrobe, or searching for THE ONE—this is the smarter, sexier way to shop."
                className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto md:pb-12"
                delay={0.15}
              />
            </div>
          </AnimatedSection>

          {/* Section 1: Full Bottles = High Risk */}
          <AnimatedSection delay={0.05} direction="left">
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
          </AnimatedSection>

          {/* Section 2: Try 3 Scents Instead of One */}
          <AnimatedSection delay={0.05} direction="right">
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
          </AnimatedSection>

          {/* Section 3: Find Your Signature */}
          <AnimatedSection delay={0.05} direction="left">
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
          </AnimatedSection>

          {/* Section 4: Designed to Be Desired */}
          <AnimatedSection delay={0.05} direction="right">
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
          </AnimatedSection>

          {/* Section 5: Perfect for Layering */}
          <AnimatedSection delay={0.05} direction="left">
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
          </AnimatedSection>

          {/* Call to Action */}
          <AnimatedSection delay={0.2} direction="up">
            <div className="text-center pt-8">
              <h2 className="font-serif text-2xl md:text-3xl mb-6">
                Ready to experience luxury fragrance, smarter?
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Link
                    href="/shop"
                    className="px-6 py-3 bg-[#a0001e] hover:bg-[#8B0000] text-white rounded-lg transition-all duration-300 inline-block"
                  >
                    Shop All Scents
                  </Link>
                </motion.div>
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Link
                    href="/subscriptions"
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-100 text-gray-800 rounded-lg transition-all duration-300 inline-block"
                  >
                    Start with a Subscription
                  </Link>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}