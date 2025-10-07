"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "./Button";
import AnimatedLines from "@/components/animations/AnimatedLines";
import { heroTitle, heroSubtitle, heroButton, imageReveal } from "@/utils/animations";
import { useSplashComplete } from "@/app/splashScreen";

const HeroSection: React.FC = () => {
  const { isComplete } = useSplashComplete();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Only animate once when splash completes
    if (isComplete && !hasAnimated) {
      setShouldAnimate(true);
      setHasAnimated(true);
    }
  }, [isComplete, hasAnimated]);

  return (
    <section className="relative w-full text-white min-h-[70vh] md:min-h-[80vh] flex items-center justify-center py-12 md:py-0 overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-black/70"
        initial={{ opacity: 0.8, scale: 1.1 }}
        animate={shouldAnimate ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 1.1 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <Image
          src="/images/hero/hero_1.png"
          alt="Luxury perfume collection background"
          fill
          sizes="(max-width: 768px) 100vw, 100vw"
          quality={85}
          className="object-cover object-[38%_10%] md:object-[50%_10%] transition-opacity duration-500"
          priority
          onError={(e) => {
            console.error("Error loading hero image");
            // Try fallback image if primary fails
            const target = e.target as HTMLImageElement;
            target.src = "/images/hero/hero_1.jpg";
          }}
        />
      </motion.div>
      {/* Gradient Overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r m-4 from-black/85 to-transparent z-10 "></div>
      {/* Overlay Content Container */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-12 text-left">
        <div className="space-y-6 md:w-1/2">
          {shouldAnimate && (
            <>
              <AnimatedLines
                lines={["MEET YOUR NEXT OBSESSION"]}
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-[#e6c789]"
                delay={0.3}
                duration={0.8}
                lineStagger={0.2}
                as="h1"
              />

              <AnimatedLines
                lines={["Explore coveted fragrances like Delina, Khamrah & Oud Satin - in 8ml portions."]}
                className="text-lg md:text-xl font-serif font-light text-[#e6c789]"
                delay={1.1}
                duration={0.6}
                lineStagger={0.15}
                as="p"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                whileInView={{
                  y: [0, -3, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3
                  }
                }}
              >
                <AnimatedLines
                  lines={["Smell rich. Explore more. No full bottle pressure."]}
                  className="text-lg md:text-xl font-serif font-medium text-[#e6c789] mb-8"
                  delay={2.0}
                  duration={0.5}
                  lineStagger={0.12}
                  as="p"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, delay: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
              >
                <Link href="/shop">
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    <Button>Shop Now</Button>
                  </motion.div>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
