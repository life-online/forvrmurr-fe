"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiRefreshCw, FiUser, FiHeart, FiX, FiShoppingBag } from 'react-icons/fi';
import ProfileLayout from '@/components/profile/ProfileLayout';

interface QuizResult {
  id: string;
  userId?: string;
  guestId?: string;
  scentVibes: string[];
  moodIntentions: string[];
  genderPreference: string;
  dislikedNotes: string[];
  fragranceContexts: string[];
  familiarScents: string;
  riskLevel: string;
  budgetLevel: string;
  emailNotificationSent: boolean;
  createdAt: string;
  updatedAt: string;
}

const scentVibeImages: Record<string, string> = {
  "Fresh + Clean": "/images/attributes/scent_types/fresh.jpg",
  "Warm + Cozy": "/images/attributes/scent_types/warm.jpg",
  "Sweet + Gourmand": "/images/attributes/scent_types/sweet.jpg",
  "Bold + Powerful": "/images/attributes/scent_types/strong.jpg",
  "Soft + Powdery": "/images/attributes/scent_types/powdery.jpg",
  "Clean + Minimalist": "/images/attributes/scent_types/clean.jpg"
};

const moodImages: Record<string, string> = {
  "I am the soft life queen": "/images/attributes/moods/soft_serene.jpg",
  "I am mysterious and after dark": "/images/attributes/moods/after_dark.jpg",
  "I am the main character": "/images/attributes/moods/main_character.jpg",
  "I make bold moves": "/images/attributes/moods/bold_moves.jpg",
  "I am clean and addictive": "/images/attributes/moods/clean_addictive.jpg",
  "I warm every room I walk into": "/images/attributes/moods/warm_glow.jpg",
  "I'm ready for vacation": "/images/attributes/moods/vacation.jpg"
};

const occasionImages: Record<string, string> = {
  "Everyday wear": "/images/attributes/occasions/daytime.jpg",
  "Date nights": "/images/attributes/occasions/date_night.jpg",
  "Special occasions": "/images/attributes/occasions/party.jpg",
  "Work/office": "/images/attributes/occasions/office.jpg",
  "Active/workout": "/images/attributes/occasions/workout.jpg",
  "Travel/vacation": "/images/attributes/occasions/vacation.jpg"
};

const noteImages: Record<string, { src: string; fallback?: string }> = {
  "Rose": { src: "/images/notes/rose.png", fallback: "/images/scent_notes/flower.png" },
  "Jasmine": { src: "/images/notes/jasmine.png", fallback: "/images/scent_notes/flower.png" },
  "Vanilla": { src: "/images/notes/vanilla.png", fallback: "/images/scent_notes/default.png" },
  "Musk": { src: "/images/notes/musk.png", fallback: "/images/scent_notes/musk.png" },
  "Sandalwood": { src: "/images/notes/sandalwood.png", fallback: "/images/scent_notes/woody.jpg" },
  "Patchouli": { src: "/images/notes/indonesian_patchouli.png", fallback: "/images/scent_notes/woody.jpg" },
  "Citrus": { src: "/images/notes/lemon.png", fallback: "/images/scent_notes/citrus.png" },
  "Bergamot": { src: "/images/notes/bergamot.png", fallback: "/images/scent_notes/citrus.png" },
  "Orange": { src: "/images/notes/orange.png", fallback: "/images/scent_notes/orange.png" }
};

const genderColors = {
  "Masculine": "bg-blue-100 text-blue-800",
  "Feminine": "bg-pink-100 text-pink-800",
  "Unisex": "bg-purple-100 text-purple-800"
};

export default function QuizResultsPage() {
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock quiz result data based on the sample you provided
    const mockQuizResult: QuizResult = {
      id: "sample-result-123",
      userId: "user-456",
      guestId: null,
      scentVibes: ["Fresh + Clean"],
      moodIntentions: ["I am the soft life queen"],
      genderPreference: "Feminine",
      dislikedNotes: ["Rose"],
      fragranceContexts: ["Everyday wear"],
      familiarScents: "I love light, airy scents that make me feel clean and refreshed throughout the day",
      riskLevel: "Keep it safe. I like classics",
      budgetLevel: "Under $100 – I love beautiful scents that do not break the bank.",
      emailNotificationSent: true,
      createdAt: "2025-08-06T16:20:39.618Z",
      updatedAt: "2025-08-06T16:20:39.618Z"
    };

    setTimeout(() => {
      setQuizResult(mockQuizResult);
      setLoading(false);
    }, 500);
  }, []);

  const getImageForItem = (item: string, category: 'vibe' | 'mood' | 'occasion' | 'note'): string => {
    switch (category) {
      case 'vibe':
        return scentVibeImages[item] || "/images/scent_notes/default.png";
      case 'mood':
        return moodImages[item] || "/images/attributes/moods/main_character.jpg";
      case 'occasion':
        return occasionImages[item] || "/images/attributes/occasions/daytime.jpg";
      case 'note':
        const noteData = noteImages[item];
        return noteData?.src || noteData?.fallback || "/images/scent_notes/default.png";
      default:
        return "/images/scent_notes/default.png";
    }
  };

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading your quiz results...</p>
        </div>
      </ProfileLayout>
    );
  }

  if (!quizResult) {
    return (
      <ProfileLayout>
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#f7ede1] flex items-center justify-center mb-4">
            <FiUser className="h-8 w-8 text-[#8b0000]" />
          </div>
          <h3 className="font-serif text-xl mb-2">No Quiz Results Found</h3>
          <p className="text-gray-600 mb-6">
            Take our fragrance quiz to discover your perfect scent profile.
          </p>
          <Link href="/quiz">
            <span className="inline-block bg-[#8b0000] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all">
              Take Quiz
            </span>
          </Link>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-serif text-black mb-2">Your Fragrance Profile</h1>
            <p className="text-gray-600">
              Completed on {new Date(quizResult.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <Link 
            href="/quiz"
            className="flex items-center gap-2 bg-[#8B0000] text-white px-4 py-2 rounded-md hover:bg-[#a0001e] transition-colors"
          >
            <FiRefreshCw size={16} />
            Retake Quiz
          </Link>
        </div>

        {/* Gender Preference */}
        <div className="bg-gradient-to-r from-[#f8f5f2] to-[#f0ebe5] rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-4 flex items-center gap-2">
            <FiUser size={20} />
            Gender Preference
          </h3>
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${genderColors[quizResult.genderPreference as keyof typeof genderColors] || 'bg-gray-100 text-gray-800'}`}>
            {quizResult.genderPreference}
          </span>
        </div>

        {/* Scent Vibes */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-4">Your Scent Vibes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizResult.scentVibes.map((vibe, index) => (
              <div key={index} className="bg-gradient-to-br from-[#f8f5f2] to-white rounded-lg p-4 border">
                <div className="aspect-square relative rounded-lg overflow-hidden mb-3">
                  <Image
                    src={getImageForItem(vibe, 'vibe')}
                    alt={vibe}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-medium text-black text-center">{vibe}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Intentions */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-4 flex items-center gap-2">
            <FiHeart size={20} />
            Your Mood Intentions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizResult.moodIntentions.map((mood, index) => (
              <div key={index} className="bg-gradient-to-br from-[#8B0000]/5 to-white rounded-lg p-4 border">
                <div className="aspect-square relative rounded-lg overflow-hidden mb-3">
                  <Image
                    src={getImageForItem(mood, 'mood')}
                    alt={mood}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-medium text-black text-center text-sm">{mood}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Fragrance Contexts */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-4 flex items-center gap-2">
            <FiShoppingBag size={20} />
            When You'll Wear It
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizResult.fragranceContexts.map((context, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border">
                <div className="aspect-square relative rounded-lg overflow-hidden mb-3">
                  <Image
                    src={getImageForItem(context, 'occasion')}
                    alt={context}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-medium text-black text-center">{context}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Disliked Notes */}
        {quizResult.dislikedNotes.length > 0 && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium text-black mb-4 flex items-center gap-2">
              <FiX size={20} className="text-red-500" />
              Notes to Avoid
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {quizResult.dislikedNotes.map((note, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <div className="w-12 h-12 relative mx-auto mb-2 opacity-60">
                    <Image
                      src={getImageForItem(note, 'note')}
                      alt={note}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium text-red-700">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Summary */}
        <div className="bg-gradient-to-r from-[#8B0000]/5 to-[#a0001e]/5 rounded-lg p-6">
          <h3 className="text-lg font-medium text-black mb-4">Your Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-black mb-2">Risk Level</h4>
              <p className="text-gray-700 bg-white rounded-lg p-3 border">
                {quizResult.riskLevel}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-black mb-2">Budget Range</h4>
              <p className="text-gray-700 bg-white rounded-lg p-3 border">
                {quizResult.budgetLevel}
              </p>
            </div>
          </div>
          
          {quizResult.familiarScents && (
            <div className="mt-6">
              <h4 className="font-medium text-black mb-2">About Your Scent Preferences</h4>
              <p className="text-gray-700 bg-white rounded-lg p-4 border italic">
                "{quizResult.familiarScents}"
              </p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#8B0000] to-[#a0001e] text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-medium mb-2">Ready to Find Your Perfect Scent?</h3>
          <p className="mb-4 opacity-90">
            Based on your quiz results, we can recommend fragrances that match your unique profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/shop"
              className="bg-white text-[#8B0000] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Shop Recommended Scents
            </Link>
            <Link 
              href="/subscriptions"
              className="border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-[#8B0000] transition-colors"
            >
              Start Subscription
            </Link>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}