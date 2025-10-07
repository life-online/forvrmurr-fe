"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedLines from "@/components/animations/AnimatedLines";
import AnimatedText from "@/components/animations/AnimatedText";
import AnimatedSection from "@/components/animations/AnimatedSection";
import { buttonHover, buttonTap } from "@/utils/animations";

export default function FoundersPage() {
  // Function to scroll to the founders bios section
  const scrollToFounders = () => {
    const foundersSection = document.getElementById("founders-bios");
    if (foundersSection) {
      foundersSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full mb-24">
      {/* Hero Section */}
      <section className="relative w-[96%] h-[70vh] md:h-[65vh] overflow-hidden mx-auto my-3 md:my-8 rounded-lg">
        {/* Desktop Image */}
        <Image
          src="/images/about/founders/founders-hero.jpg"
          alt="ForvrMurr Founders"
          fill
          priority
          className="object-cover object-[90%_center] hidden md:block"
        />

        {/* Mobile Image */}
        <Image
          src="/images/about/founders/founders-hero-mobile.jpg"
          alt="ForvrMurr Founders"
          fill
          priority
          className="object-cover md:hidden"
        />

        {/* Gradient Overlay for text legibility - Desktop */}
        <div className="absolute inset-0 bg-gradient-to-r m-4 from-black/10 to-transparent z-10 hidden md:block rounded-lg"></div>

        {/* Gradient Overlay for text legibility - Mobile */}
        <div className="absolute inset-0 bg-gradient-to-b m-4 from-transparent via-transparent to-black/10 z-10 md:hidden rounded-lg"></div>

        {/* Hero Content - Desktop */}
        <div className="absolute inset-0 z-20 items-center flex">
          <div className="max-w-7xl w-full mx-auto px-12 text-left mt-auto mb-12 md:my-0">
            <div className="space-y-2 md:space-y-6 md:w-1/2">
              <AnimatedLines
                lines={["TWO WOMEN, ONE SHARED OBSESSION"]}
                className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-wide text-[#8B0000]"
                delay={0.3}
                duration={0.8}
                lineStagger={0.2}
                as="h1"
              />
              <AnimatedLines
                lines={["Forvr Murr began with late-night voice notes about scents that made us feel something."]}
                className="text-base md:text-lg font-light text-[#8B0000]"
                delay={1.0}
                duration={0.6}
                lineStagger={0.15}
                as="p"
              />
              <motion.button
                onClick={scrollToFounders}
                className="mt-6 px-8 py-3 bg-[#a0001e] text-white font-medium rounded hover:bg-[#8b0000] transition-colors"
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.45, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }
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
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <AnimatedText
            text="We're two women from Lagos, Nigeria with a shared belief: fragrance should never be inaccessible, boring, or intimidating."
            className="text-lg md:text-xl mb-20 text-center font-light leading-relaxed"
            delay={0.2}
            duration={0.6}
          />

          <div id="founders-bios" className="space-y-32">
            {/* First Founder - Ayodeji */}
            <AnimatedSection delay={0.1} direction="up">
              <div className="flex flex-col md:flex-row gap-8 md:items-start">
                <motion.div
                  className="w-full md:w-1/3"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="relative aspect-[1080/1200] rounded-lg overflow-hidden">
                    <Image
                      src="/images/about/founders/ayodeji.jpg"
                      alt="Ayodeji Awonuga"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
                <motion.div
                  className="w-full md:w-2/3"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <h2 className="font-serif text-2xl md:text-3xl mb-2">
                    Ayodeji Awonuga
                  </h2>
                  <p className="text-[#8b0000] font-medium mb-6">Co-Founder</p>
                  <p className="mb-4 leading-relaxed">
                    Ayodeji is known to her friends (and now the Forvr Murr
                    community) as the Senior Minister of Enjoyment. She plans her
                    outfits and perfume lineup to match every moment of a trip—be
                    it brunch, strolling through the airport, or romantic dinner
                    moves. A fan of warm, spicy, oriental scents, she'll fall for
                    anything with tonka.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    Her dream everyday perfumes? Alexandria II by Xerjoff and
                    Queen of the Night by The Merchant of Venice.
                  </p>
                  <p className="leading-relaxed">
                    When she's not dreaming up strategy or crafting clever
                    marketing plays for Forvr Murr, she's building her businesses,
                    plotting her next luxury escape, or journaling about how God
                    still blows her mind.
                  </p>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Second Founder - Olamide */}
            <AnimatedSection delay={0.1} direction="up">
              <div className="flex flex-col md:flex-row-reverse gap-8 md:items-start">
                <motion.div
                  className="w-full md:w-1/3"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="relative aspect-[1080/1200] rounded-lg overflow-hidden">
                    <Image
                      src="/images/about/founders/olamide.jpg"
                      alt="Olamide Babayale"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
                <motion.div
                  className="w-full md:w-2/3"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <h2 className="font-serif text-2xl md:text-3xl mb-2">
                    Olamide Babayale
                  </h2>
                  <p className="text-[#8b0000] font-medium mb-6">Co-Founder</p>
                  <p className="mb-4 leading-relaxed">
                    Olamide is our motivational speaker and scent matchmaker in
                    chief. She always has a word of encouragement, and when it
                    comes to scent? She just knows. Show her your vibe, your
                    outfit, or your mood—and she'll match you with the perfect
                    fragrance like it's a spiritual gift.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    She's also the brand's strict investment head. She enjoys
                    growing money and talking about growing money—often at the
                    same time as spraying her wrist.
                  </p>
                  <p className="leading-relaxed">
                    One day she's smelling like the wealthiest woman in the room
                    in Strangelove NYC's Fall Into Stars. Another day? It's full
                    gourmand with Lattafa's Angham. And yes, she pulls both off
                    effortlessly.
                  </p>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
