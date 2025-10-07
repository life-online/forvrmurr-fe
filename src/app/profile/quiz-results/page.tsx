"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiUser, FiHeart, FiX, FiShoppingBag, FiStar, FiClock } from 'react-icons/fi';
import ProfileLayout from '@/components/profile/ProfileLayout';
import quizService, { QuizResult } from '@/services/quiz';


const genderColors = {
  "Masculine": "bg-gray-50 text-[#8B0000] border border-gray-200",
  "Feminine": "bg-[#f7ede1] text-[#8B0000] border border-[#8B0000]/20",
  "Gender-neutral": "bg-gray-50 text-gray-700 border border-gray-200",
  "I like to switch it up": "bg-[#f7ede1] text-[#8B0000] border border-[#8B0000]/20"
};

export default function QuizResultsPage() {
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        setLoading(true);
        const results = await quizService.getLatestQuizResults();
        setQuizResult(results);
      } catch (error) {
        console.error('Failed to fetch quiz results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, []);

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading your fragrance profile...</p>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  if (!quizResult) {
    return (
      <ProfileLayout>
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg border border-gray-200 p-12 max-w-md mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mx-auto w-20 h-20 rounded-lg bg-gradient-to-br from-[#f7ede1] to-[#f0ebe5] flex items-center justify-center mb-6 border border-gray-200"
            >
              <FiStar size={32} className="text-[#8B0000]" />
            </motion.div>

            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-2xl font-semibold text-black mb-4"
            >
              No Fragrance Profile Found
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-gray-600 mb-8 leading-relaxed"
            >
              Discover your perfect fragrance match! Take our personalized quiz to unlock scents that complement your unique style and preferences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Link href="/discover/quiz">
                <span className="inline-flex items-center gap-2 bg-[#8B0000] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#a0001e] transition-colors duration-200">
                  <FiStar size={16} />
                  Take Fragrance Quiz
                </span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500 mb-4">What you'll discover:</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#8B0000] rounded-full"></div>
                <span>Your scent personality</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#8B0000] rounded-full"></div>
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#8B0000] rounded-full"></div>
                <span>Perfect fragrance matches</span>
              </div>
            </div>
          </motion.div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="space-y-8">
        {/* Header with Quiz Results */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-[#f8f5f2] to-[#f0ebe5] rounded-lg border border-gray-200 p-8"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-3xl md:text-4xl font-semibold text-black mb-4 pt-8"
            >
              {quizResult.verdict.scentEnergy}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-xl text-[#8B0000] font-medium mb-6"
            >
              {quizResult.verdict.recommendedTier}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="bg-white rounded-lg p-6 max-w-2xl mx-auto border border-gray-100"
            >
              <p className="text-gray-700 text-lg leading-relaxed italic">
                "{quizResult.verdict.summary}"
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-4 sm:mb-0">
              <FiClock size={16} />
              <span className="text-sm">
                Completed {new Date(quizResult.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <Link
              href="/discover/quiz"
              className="flex items-center gap-2 bg-[#8B0000] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#a0001e] transition-colors duration-200"
            >
              <FiRefreshCw size={16} />
              Retake Quiz
            </Link>
          </div>
        </motion.div>

        {/* Fragrance Style */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-8"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black mb-2 flex items-center gap-3">
              <FiUser size={20} className="text-[#8B0000]" />
              Fragrance Style
            </h3>
            <p className="text-gray-600">Your preferred fragrance personality</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className={`rounded-lg p-4 h-20 ${genderColors[quizResult.answers.genderPreference as keyof typeof genderColors] || 'bg-gray-50 text-gray-700 border border-gray-200'}`}
            >
              <div className="flex items-center gap-3 h-full">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                  <FiUser size={20} className="text-[#8B0000]" />
                </div>
                <h4 className="font-medium text-black flex-1 text-sm leading-tight">{quizResult.answers.genderPreference}</h4>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scent Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-8"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black mb-2 flex items-center gap-3">
              <FiStar size={20} className="text-[#8B0000]" />
              Scent Preferences
            </h3>
            <p className="text-gray-600">The fragrance types that resonate with you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizResult.answers.scentVibes.map((vibe, index) => (
              <motion.div
                key={vibe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#8B0000]/20 hover:bg-[#f7ede1]/30 transition-all duration-200 h-20"
              >
                <div className="flex items-center gap-3 h-full">
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                    <Image
                      src={`/images${vibe.iconUrl}`}
                      alt={vibe.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-black flex-1 text-sm leading-tight">{vibe.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mood Intentions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-8"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black mb-2 flex items-center gap-3">
              <FiHeart size={20} className="text-[#8B0000]" />
              Mood Intentions
            </h3>
            <p className="text-gray-600">The emotions you want to express</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizResult.answers.moodIntentions.map((mood, index) => (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#8B0000]/20 hover:bg-[#f7ede1]/30 transition-all duration-200 h-20"
              >
                <div className="flex items-center gap-3 h-full">
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                    <Image
                      src={`/images${mood.iconUrl}`}
                      alt={mood.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-black flex-1 text-sm leading-tight">{mood.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fragrance Occasions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-8"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black mb-2 flex items-center gap-3">
              <FiShoppingBag size={20} className="text-[#8B0000]" />
              Fragrance Occasions
            </h3>
            <p className="text-gray-600">When and where you prefer to wear fragrance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizResult.answers.fragranceContexts.map((context, index) => (
              <motion.div
                key={context.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#8B0000]/20 hover:bg-[#f7ede1]/30 transition-all duration-200 h-20"
              >
                <div className="flex items-center gap-3 h-full">
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                    <Image
                      src={`/images${context.iconUrl}`}
                      alt={context.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-black flex-1 text-sm leading-tight">{context.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Notes to Avoid */}
        {quizResult.answers.dislikedNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="bg-white rounded-lg border border-gray-200 p-8"
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-black mb-2 flex items-center gap-3">
                <FiX size={20} className="text-[#8B0000]" />
                Notes to Avoid
              </h3>
              <p className="text-gray-600">Fragrance notes you prefer not to have</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizResult.answers.dislikedNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + index * 0.05, duration: 0.3 }}
                  className="border border-gray-200 rounded-lg p-4 opacity-75 hover:opacity-100 transition-opacity duration-200 h-20"
                >
                  <div className="flex items-center gap-3 h-full">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                      <Image
                        src={`/images${note.iconUrl}`}
                        alt={note.name}
                        fill
                        className="object-cover grayscale"
                      />
                    </div>
                    <p className="font-medium text-gray-700 flex-1 text-sm leading-tight">{note.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Personal Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-8"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black mb-2">
              Personal Preferences
            </h3>
            <p className="text-gray-600">Your approach to fragrance exploration</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.3 }}
              className="border border-gray-200 rounded-lg p-6 hover:border-[#8B0000]/20 hover:bg-[#f7ede1]/30 transition-all duration-200"
            >
              <h4 className="font-medium text-black mb-3 flex items-center gap-2">
                <FiStar className="text-[#8B0000]" size={16} />
                Adventure Level
              </h4>
              <p className="text-gray-700">
                {quizResult.answers.riskLevel}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              className="border border-gray-200 rounded-lg p-6 hover:border-[#8B0000]/20 hover:bg-[#f7ede1]/30 transition-all duration-200"
            >
              <h4 className="font-medium text-black mb-3 flex items-center gap-2">
                <span className="text-[#8B0000]">$</span>
                Budget Range
              </h4>
              <p className="text-gray-700">
                {quizResult.answers.budgetLevel}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="bg-gradient-to-r from-[#8B0000] to-[#a0001e] text-white rounded-lg p-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
            className="mb-6"
          >
            <h3 className="text-2xl font-semibold mb-3">Ready to Explore?</h3>
            <p className="text-white/90 max-w-2xl mx-auto">
              Discover fragrances perfectly matched to your preferences and personality.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/shop"
              className="bg-white text-[#8B0000] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Fragrances
            </Link>
            <Link
              href="/subscriptions"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-[#8B0000] transition-colors duration-200"
            >
              Start Subscription
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </ProfileLayout>
  );
}