
"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import AnimatedLines from "@/components/animations/AnimatedLines";
import AnimatedText from "@/components/animations/AnimatedText";
import AnimatedSection from "@/components/animations/AnimatedSection";
import { buttonHover, buttonTap } from "@/utils/animations";

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
              <AnimatedLines
                lines={["THIS STARTED WITH OBSESSION"]}
                className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-wide text-[#8B0000] mb-4"
                delay={0.3}
                duration={0.8}
                lineStagger={0.2}
                as="h1"
              />
              <AnimatedLines
                lines={["What fuels our passion is now yours to enjoy freely."]}
                className="text-base md:text-lg font-light text-[#8B0000] max-w-2xl mx-auto"
                delay={1.0}
                duration={0.6}
                lineStagger={0.15}
                as="p"
              />
              <motion.button
                onClick={scrollToSection}
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
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </section>


      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-16 md:py-32" ref={storyContentRef}>
        <AnimatedSection delay={0.1} direction="up">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Story Copy */}
            <div className="w-full md:w-1/2">
              <AnimatedText
                text="Niche fragrance was always gatekept—until we entered the chat. Forvr Murr was born from a shared obsession between two fragrance lovers who knew Nigeria (and the world) deserved more than plastic decants and blind buy regrets. We exist to bring luxury within reach, one 8ml obsession at a time."
                className="text-lg mb-8 text-gray-800"
                delay={0.2}
                duration={0.6}
              />

              <motion.blockquote
                className="border-l-4 border-[#8b0000] pl-4 italic mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as any }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <p className="text-lg text-gray-700">
                  "Fragrance is intimate. Personal. It should feel like a love
                  story, not unnecessary risk."
                </p>
              </motion.blockquote>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as any }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <Link
                  href="/shop"
                  className="inline-block bg-[#8b0000] hover:bg-[#a0001e] text-white px-8 py-3 rounded-md transition-colors font-medium"
                >
                  Explore Our Scents
                </Link>
              </motion.div>
            </div>

            {/* Story Image */}
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as any }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Image
                src="/images/about/story/our-story-candid.jpg"
                alt="Founders of ForvrMurr"
                width={600}
                height={800}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </motion.div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
