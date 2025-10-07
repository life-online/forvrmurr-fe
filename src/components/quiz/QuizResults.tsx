"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizResult } from "@/services/quiz";
import { authService, User } from "@/services/auth";
import { useRouter } from "next/navigation";

interface QuizResultsProps {
  result: QuizResult;
  onClose?: () => void;
}

export default function QuizResults({ result, onClose }: QuizResultsProps) {
  const [animationStep, setAnimationStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Animation steps:
  // 0: Initial loading/transition
  // 1: Show scent energy
  // 2: Show recommended tier
  // 3: Show summary
  // 4: Show full results with CTAs

  useEffect(() => {
    // Get current user to check subscription status
    setUser(authService.getUser());

    // Start animation sequence with better pacing
    const timer1 = setTimeout(() => setAnimationStep(1), 2500); // 2.5s analysis
    const timer2 = setTimeout(() => setAnimationStep(2), 6500); // 4s to read scent energy
    const timer3 = setTimeout(() => setAnimationStep(3), 10500); // 4s to read tier
    const timer4 = setTimeout(() => setAnimationStep(4), 14500); // 4s to read summary

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const hasActiveSubscription = user?.activeSubscriptions && user.activeSubscriptions > 0;
  const isRegisteredUser = authService.isAuthenticated() && authService.isRegistered();

  // Determine which tier is recommended based on the verdict
  const isRecommendedTierPremium = result.verdict.recommendedTier.toLowerCase().includes('premium');
  const isRecommendedTierPrime = result.verdict.recommendedTier.toLowerCase().includes('prime');

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100/50 via-purple-50/50 to-blue-100/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        transition={{ duration: 0.6 }}
        className="bg-white/95 backdrop-blur-md rounded-3xl w-full max-w-2xl p-8 text-center overflow-hidden shadow-2xl border border-white/20"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,250,250,0.95) 100%)'
        }}
      >
        <AnimatePresence mode="wait">
          {animationStep === 0 && (
            <motion.div
              key="loading"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textVariants}
              transition={{ duration: 0.8 }}
              className="py-16"
            >
              <div className="relative mb-8">
                {/* Cute floating elements */}
                <div className="absolute -top-4 -left-4 w-4 h-4 bg-pink-300 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0s' }} />
                <div className="absolute -top-2 -right-8 w-3 h-3 bg-purple-300 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }} />
                <div className="absolute -bottom-6 -left-8 w-5 h-5 bg-blue-300 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1s' }} />

                {/* Enhanced spinner with gradient */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full animate-spin mx-auto mb-6" style={{
                    background: 'conic-gradient(from 0deg, #a0001e, #ff6b9d, #c44569, #8b0000, #a0001e)',
                    padding: '4px'
                  }}>
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl animate-pulse">✨</span>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <h2 className="text-2xl md:text-3xl font-serif bg-gradient-to-r from-[#a0001e] to-[#8b0000] bg-clip-text text-transparent mb-4">
                  Analyzing Your Scent Profile...
                </h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                >
                  <p className="text-gray-600 text-lg font-light">
                    ✨ Discovering your signature scent energy ✨
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {animationStep === 1 && (
            <motion.div
              key="scent-energy"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textVariants}
              transition={{ duration: 0.8 }}
              className="py-16"
            >
              <div className="relative mb-8">
                {/* Sparkle effects */}
                <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75" />
                <div className="absolute top-8 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-0 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }} />

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                  className="text-8xl mb-4"
                >
                  ✨
                </motion.div>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl md:text-4xl font-serif bg-gradient-to-r from-[#a0001e] via-[#ff6b9d] to-[#8b0000] bg-clip-text text-transparent mb-6 leading-tight"
              >
                {result.verdict.scentEnergy}
              </motion.h2>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '6rem' }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-[#a0001e] to-[#8b0000] mx-auto rounded-full"
              />
            </motion.div>
          )}

          {animationStep === 2 && (
            <motion.div
              key="tier"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textVariants}
              transition={{ duration: 0.8 }}
              className="py-16"
            >
              <div className="relative mb-8">
                {/* Floating hearts and stars */}
                <div className="absolute -top-2 left-8 text-pink-400 animate-bounce opacity-70">💕</div>
                <div className="absolute top-4 right-12 text-purple-400 animate-bounce opacity-70" style={{ animationDelay: '0.3s' }}>⭐</div>
                <div className="absolute -bottom-4 left-16 text-yellow-400 animate-bounce opacity-70" style={{ animationDelay: '0.6s' }}>🌟</div>

                <motion.div
                  initial={{ scale: 0, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                  className="text-8xl mb-4"
                >
                  💫
                </motion.div>
              </div>
              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl md:text-4xl font-serif bg-gradient-to-r from-purple-600 via-[#a0001e] to-pink-600 bg-clip-text text-transparent mb-6 leading-tight"
              >
                {result.verdict.recommendedTier}
              </motion.h2>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '8rem' }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-1.5 bg-gradient-to-r from-purple-400 via-[#a0001e] to-pink-400 mx-auto rounded-full shadow-lg"
              />
            </motion.div>
          )}

          {animationStep === 3 && (
            <motion.div
              key="summary"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textVariants}
              transition={{ duration: 0.8 }}
              className="py-12"
            >
              <div className="relative mb-8">
                {/* Cute nature elements */}
                <div className="absolute -top-4 left-12 text-pink-300 animate-pulse opacity-80">🌸</div>
                <div className="absolute top-2 right-8 text-green-300 animate-pulse opacity-80" style={{ animationDelay: '0.4s' }}>🍃</div>
                <div className="absolute -bottom-2 left-8 text-yellow-300 animate-pulse opacity-80" style={{ animationDelay: '0.8s' }}>🌺</div>
                <div className="absolute bottom-4 right-16 text-purple-300 animate-pulse opacity-80" style={{ animationDelay: '1.2s' }}>🦋</div>

                <motion.div
                  initial={{ scale: 0, rotate: 360 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                  className="text-8xl mb-6"
                >
                  🌸
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100 shadow-lg max-w-lg mx-auto"
              >
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light italic">
                  "{result.verdict.summary}"
                </p>
              </motion.div>
            </motion.div>
          )}

          {animationStep === 4 && (
            <motion.div
              key="full-results"
              initial="hidden"
              animate="visible"
              variants={textVariants}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Complete Results */}
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-5xl">✨</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-[#a0001e] mb-3">
                  {result.verdict.scentEnergy}
                </h2>
                <h3 className="text-xl md:text-2xl font-serif text-[#8b0000] mb-4">
                  {result.verdict.recommendedTier}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {result.verdict.summary}
                </p>
              </div>

              {/* Conditional Content Based on Registration and Subscription Status */}
              {!isRegisteredUser ? (
                /* Unregistered users - nudge to register */
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💾</span>
                      </div>
                      <h3 className="text-xl font-serif text-blue-800 mb-2">
                        Save Your Results!
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Register to save your scent profile and get personalized recommendations delivered to your inbox.
                      </p>
                      <button
                        onClick={() => router.push('/auth/register')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        Create Account & Save Results
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#f7ede1] rounded-lg p-6">
                    <h3 className="text-lg font-serif text-gray-900 mb-3 text-center">
                      What's Next?
                    </h3>
                    <p className="text-gray-700 text-center">
                      You'll receive an 8ml perfume every month based on your quiz. Your first delivery comes with a free travel case, luxe packaging, and your next signature scent.
                    </p>
                  </div>

                  {/* Subscription CTAs with Spotlighting */}
                  <div className="space-y-4">
                    {/* Prime Button */}
                    <button
                      onClick={() => router.push('/auth/register')}
                      className={`relative w-full py-4 px-6 rounded-lg text-lg font-medium transition-all duration-300 cursor-pointer ${
                        isRecommendedTierPrime
                          ? "bg-gradient-to-r from-[#a0001e] to-[#8b0000] text-white shadow-2xl ring-4 ring-[#a0001e]/30 hover:shadow-3xl"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {isRecommendedTierPrime && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full"
                        >
                          ✨ RECOMMENDED
                        </motion.div>
                      )}
                      Subscribe to Prime – ₦17,500/mo
                      {isRecommendedTierPrime && (
                        <div className="text-sm opacity-90 mt-1">Perfect for your scent profile!</div>
                      )}
                    </button>

                    {/* Premium Button */}
                    <button
                      onClick={() => router.push('/auth/register')}
                      className={`relative w-full py-4 px-6 rounded-lg text-lg font-medium transition-all duration-300 cursor-pointer ${
                        isRecommendedTierPremium
                          ? "bg-gradient-to-r from-[#8b0000] to-[#6b0000] text-white shadow-2xl ring-4 ring-[#8b0000]/30 hover:shadow-3xl"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {isRecommendedTierPremium && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full"
                        >
                          ✨ RECOMMENDED
                        </motion.div>
                      )}
                      Subscribe to Premium – ₦55,000/mo
                      {isRecommendedTierPremium && (
                        <div className="text-sm opacity-90 mt-1">Perfect for your scent profile!</div>
                      )}
                    </button>
                  </div>
                </div>
              ) : hasActiveSubscription ? (
                /* Registered user with active subscription */
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✅</span>
                    </div>
                    <h3 className="text-xl font-serif text-green-800 mb-2">
                      Your Scent Preferences Updated!
                    </h3>
                    <p className="text-green-700">
                      Your next delivery will be curated based on your updated scent profile.
                      We'll make sure your upcoming fragrances match your refined preferences perfectly.
                    </p>
                  </div>
                </div>
              ) : (
                /* Registered user without subscription - show CTAs */
                <div className="space-y-6">
                  <div className="bg-[#f7ede1] rounded-lg p-6">
                    <h3 className="text-lg font-serif text-gray-900 mb-3 text-center">
                      What's Next?
                    </h3>
                    <p className="text-gray-700 text-center">
                      You'll receive an 8ml perfume every month based on your quiz. Your first delivery comes with a free travel case, luxe packaging, and your next signature scent.
                    </p>
                  </div>

                  {/* Subscription CTAs with Spotlighting */}
                  <div className="space-y-4">
                    {/* Prime Button */}
                    <button
                      className={`relative w-full py-4 px-6 rounded-lg text-lg font-medium transition-all duration-300 cursor-pointer ${
                        isRecommendedTierPrime
                          ? "bg-gradient-to-r from-[#a0001e] to-[#8b0000] text-white shadow-2xl ring-4 ring-[#a0001e]/30 hover:shadow-3xl"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {isRecommendedTierPrime && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full"
                        >
                          ✨ RECOMMENDED
                        </motion.div>
                      )}
                      Subscribe to Prime – ₦17,500/mo
                      {isRecommendedTierPrime && (
                        <div className="text-sm opacity-90 mt-1">Perfect for your scent profile!</div>
                      )}
                    </button>

                    {/* Premium Button */}
                    <button
                      className={`relative w-full py-4 px-6 rounded-lg text-lg font-medium transition-all duration-300 cursor-pointer ${
                        isRecommendedTierPremium
                          ? "bg-gradient-to-r from-[#8b0000] to-[#6b0000] text-white shadow-2xl ring-4 ring-[#8b0000]/30 hover:shadow-3xl"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {isRecommendedTierPremium && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full"
                        >
                          ✨ RECOMMENDED
                        </motion.div>
                      )}
                      Subscribe to Premium – ₦55,000/mo
                      {isRecommendedTierPremium && (
                        <div className="text-sm opacity-90 mt-1">Perfect for your scent profile!</div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Close/Continue Button */}
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {hasActiveSubscription ? "Continue Exploring" : "Maybe Later"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}