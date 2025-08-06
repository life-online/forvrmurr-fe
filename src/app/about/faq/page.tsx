"use client";
import generalFaq from "@/data/generalFaq.json";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-wide text-[#8B0000] mb-4">
                YOUR QUESTIONS, ANSWERED
              </h1>
              <p className="text-base md:text-lg font-light text-[#8B0000] max-w-2xl mx-auto">
                Find answers to common questions about our products, services, and more.
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

      {/* Content Section */}
      <div ref={faqContentRef} className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-16 md:py-24 flex flex-col items-center">
        
        {/* Category Tabs */}
        <div className="w-full mb-10">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center pb-2">
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
          </div>
        </div>
        
    
        <div className="flex flex-col items-center w-full md:w-[80%] lg:w-[70%]">
          {filteredFaq.map((item, index) => (
            <div
              className="flex flex-col items-center w-full mb-10"
              key={index}
              id={`category-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <h2 className="text-xl md:text-2xl font-serif font-medium text-[#8B0000] mb-6">{item.name}</h2>
              <div className="flex flex-col gap-4 w-full">
                {item.questions.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
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
                      <div className="text-gray-600 bg-gray-50 px-6 py-4 text-sm md:text-base font-light leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* No Results Message */}
          {filteredFaq.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No questions found for this category.</p>
              <button 
                onClick={() => setActiveCategory(null)}
                className="mt-4 px-6 py-2 bg-[#a0001e] text-white font-medium rounded hover:bg-[#8b0000] transition-colors"
              >
                View All Questions
              </button>
            </div>
          )}
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center w-full">
            <p className="text-base text-gray-700">
              Still need help?{" "}
              <Link href="/about/contact" className="font-medium text-[#8B0000] hover:underline transition-all">
                Contact us here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
