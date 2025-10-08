"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import QuizWizard from '@/components/quiz/QuizWizard';
import AnimatedLines from '@/components/animations/AnimatedLines';
import { trackQuizStarted, trackQuizCompleted, trackQuizResultsViewed } from '@/utils/analytics';
import { buttonHover, buttonTap } from '@/utils/animations';

export default function ScentQuizPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);

  const handleStartQuiz = async () => {
    setShowQuiz(true);
    setQuizStartTime(Date.now());

    // Track quiz start
    trackQuizStarted('fragrance_preference');

    // Scroll to quiz section after a brief delay to ensure it's rendered
    setTimeout(() => {
      const quizSection = document.getElementById('quiz-section');
      if (quizSection) {
        quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleQuizComplete = async (results: any) => {
    console.log('Quiz completed with results:', results);

    // Calculate completion time
    const completionTime = Date.now() - quizStartTime;

    // Track quiz completion with analytics
    trackQuizCompleted({
      quizType: 'fragrance_preference',
      answers: results.answers,
      recommendationsCount: results.recommendedProducts?.length || 0,
      completionTime: completionTime,
    });

    // Track quiz results viewed if there are recommended products
    if (results.recommendedProducts && results.recommendedProducts.length > 0) {
      trackQuizResultsViewed(results.recommendedProducts.length, results.recommendedProducts);
    }

    setShowQuiz(false);
  };

  return (
    <div className="w-full mb-24">
      {/* Hero Section - Always visible */}
      <section className="relative w-[96%] h-[70vh] md:h-[65vh] overflow-hidden mx-auto my-3 md:my-8 rounded-lg">
        {/* Desktop Image */}
        <Image
          src="/images/discover/quiz/quiz-hero.jpg"
          alt="ForvrMurr Quiz"
          fill
          priority
          className="object-cover object-[90%_center] hidden md:block"
        />

        {/* Mobile Image */}
        <Image
          src="/images/discover/quiz/quiz-hero-mobile.jpg"
          alt="ForvrMurr Quiz"
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
                lines={["PERFUME IS PERSONAL. LET'S GET YOURS RIGHT"]}
                className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-[#8B0000]"
                delay={0.3}
                duration={0.8}
                lineStagger={0.2}
                as="h1"
              />
              <AnimatedLines
                lines={["Let your preferences uncover which mood, vibe, and fragrance tier (Prime or Premium) best suits you"]}
                className="text-base md:text-lg font-light text-[#8B0000]"
                delay={1.1}
                duration={0.6}
                lineStagger={0.15}
                as="p"
              />
              <motion.button
                onClick={handleStartQuiz}
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
                Start Quiz
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Wizard - Shows below banner when started */}
      {showQuiz && (
        <motion.div
          id="quiz-section"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any }}
          className="mt-12"
        >
          <QuizWizard onComplete={handleQuizComplete} />
        </motion.div>
      )}
    </div>
  );
}
