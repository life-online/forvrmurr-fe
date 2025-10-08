"use client";
import generalFaq from "@/data/generalFaq.json";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AnimatedLines from "@/components/animations/AnimatedLines";
import AnimatedText from "@/components/animations/AnimatedText";
import AnimatedSection from "@/components/animations/AnimatedSection";
import { buttonHover, buttonTap } from "@/utils/animations";

export default function Faq() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredFaq, setFilteredFaq] = useState(generalFaq);
  
  // Initialize with all categories
  useEffect(() => {
    if (!activeCategory) {
      setFilteredFaq(generalFaq);
    } else {
      setFilteredFaq(generalFaq.filter(category => category.name === activeCategory));
    }
  }, [activeCategory]);
  
  function getTotalQuestions(data: any): number {
    let total = 0;
    for (const category of data) {
      total += category.questions.length;
    }
    return total;
  }
  
  // Create a ref for the FAQ content section
  const faqContentRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to FAQ content with proper positioning
  const scrollToSection = () => {
    // Use setTimeout to ensure the scroll happens after the current execution context
    setTimeout(() => {
      if (faqContentRef.current) {
        const offsetTop = faqContentRef.current.offsetTop;
        window.scrollTo({
          top: offsetTop, // No offset to ensure FAQ content is at the very top
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  
  return (
    <div className="bg-white flex flex-col mb-16">
      {/* Hero Banner */}
      <section className="relative w-[96%] h-[70vh] md:h-[65vh] overflow-hidden mx-auto my-3 md:my-8 rounded-lg">
        <div className="relative w-full h-full">
          {/* Desktop Image */}
          <Image
            src="/images/about/faq/faq-hero.jpg"
            alt="FAQ Hero"
            fill
            priority
            className="object-cover hidden md:block"
          />
          
          {/* Mobile Image */}
          <Image
            src="/images/about/faq/faq-hero-mobile.jpg"
            alt="FAQ Hero"
            fill
            priority
            className="object-cover md:hidden"
          />
          
          {/* Gradient Overlay for text legibility - Desktop */}
          <div className="absolute inset-0 bg-gradient-to-r m-4 from-black/10 to-transparent z-10 hidden md:block rounded-lg"></div>
          
          {/* Gradient Overlay for text legibility - Mobile */}
          <div className="absolute inset-0 bg-gradient-to-b m-4 from-transparent via-transparent to-black/10 z-10 md:hidden rounded-lg"></div>
          
          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-center max-w-2xl mx-auto px-4 mt-auto mb-12 md:my-0">
              <AnimatedLines
                lines={["YOUR QUESTIONS, ANSWERED"]}
                className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-wide text-[#8B0000] mb-4"
                delay={0.3}
                duration={0.8}
                lineStagger={0.2}
                as="h1"
              />
              <AnimatedLines
                lines={["Find answers to common questions about our products, services, and more."]}
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

      {/* Content Section */}
      <div ref={faqContentRef} className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-16 md:py-24 flex flex-col items-center">

        {/* Category Tabs */}
        <AnimatedSection delay={0.1} direction="up">
          <div className="w-full mb-10">
            <motion.div
              className="flex flex-wrap gap-2 md:gap-3 justify-center pb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <button 
                onClick={() => setActiveCategory(null)}
                className={`px-3 md:px-4 py-2 rounded-full border text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${!activeCategory ? "bg-[#faf0e2] border-[#e6c789] text-[#600000]" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}`}
              >
                All
              </button>
              {generalFaq.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-3 md:px-4 py-2 rounded-full border text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${activeCategory === category.name ? "bg-[#faf0e2] border-[#e6c789] text-[#600000]" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        <div className="flex flex-col items-center w-full md:w-[80%] lg:w-[70%]">
          {filteredFaq.map((item, index) => (
            <AnimatedSection key={index} delay={0.05} direction="up">
              <div
                className="flex flex-col items-center w-full mb-10"
                id={`category-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <AnimatedLines
                  lines={[item.name]}
                  className="text-xl md:text-2xl font-serif font-medium text-[#8B0000] mb-6"
                  delay={0.1}
                  duration={0.6}
                  lineStagger={0.15}
                  as="h2"
                />
                <div className="flex flex-col gap-4 w-full">
                  {item.questions.map((faq) => (
                    <motion.div
                      key={faq.id}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as any }}
                      viewport={{ once: true, amount: 0.2 }}
                    >
                      <button
                        className="w-full text-left font-medium text-gray-800 px-6 py-4 focus:outline-none flex justify-between items-center"
                        onClick={() =>
                          setOpenFaq(openFaq === faq.id ? null : faq.id)
                        }
                      >
                        <span className="text-sm md:text-base">{faq.q}</span>
                        <span className="ml-4 text-[#a0001e] text-lg font-light">
                          {openFaq === faq.id ? "−" : "+"}
                        </span>
                      </button>
                      {openFaq === faq.id && (
                        <motion.div
                          className="text-gray-600 bg-gray-50 px-6 py-4 text-sm md:text-base font-light leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}

          {/* No Results Message */}
          {filteredFaq.length === 0 && (
            <AnimatedSection delay={0.1} direction="up">
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No questions found for this category.</p>
                <motion.button 
                  onClick={() => setActiveCategory(null)}
                  className="mt-4 px-6 py-2 bg-[#a0001e] text-white font-medium rounded hover:bg-[#8b0000] transition-colors"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  View All Questions
                </motion.button>
              </div>
            </AnimatedSection>
          )}

          <motion.div
            className="mt-8 pt-8 border-t border-gray-200 text-center w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as any }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="text-base text-gray-700">
              Still need help?{" "}
              <Link href="/about/contact" className="font-medium text-[#8B0000] hover:underline transition-all">
                Contact us here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
