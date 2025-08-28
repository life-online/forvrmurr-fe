"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiPackage, 
  FiPause, 
  FiPlay, 
  FiX, 
  FiEdit, 
  FiCreditCard, 
  FiCalendar,
  FiTruck,
  FiSettings,
  FiUser,
  FiHeart,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import ProfileLayout from '@/components/profile/ProfileLayout';

interface Subscription {
  id: string;
  tier: 'Prime' | 'Premium';
  status: 'active' | 'paused' | 'cancelled';
  nextDeliveryDate: string;
  billingDate: string;
  billingAmount: number;
  currentFragrance?: {
    name: string;
    brand: string;
    imageUrl: string;
    tier: string;
  };
  preferences: {
    scentVibes: string[];
    moodIntentions: string[];
    genderPreference: string;
    dislikedNotes: string[];
  };
  billingInfo: {
    cardLast4: string;
    cardType: string;
    expiryDate: string;
  };
  orderHistory: Array<{
    date: string;
    fragrance: string;
    brand: string;
    delivered: boolean;
  }>;
}

const tierBenefits = {
  Prime: {
    price: 15000,
    benefits: [
      'Access to premium designer fragrances',
      '8ml decant size - perfect for trying new scents',
      'Free shipping nationwide',
      'Fragrance quiz-based matching',
      'Cancel or skip anytime'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  Premium: {
    price: 25000,
    benefits: [
      'Everything in Prime',
      'Access to exclusive luxury fragrances',
      'Priority customer support',
      'Early access to new releases',
      'Exclusive member-only scents'
    ],
    color: 'from-purple-500 to-purple-600'
  }
};

export default function SubscriptionsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    // Mock subscription data
    const mockSubscription: Subscription = {
      id: 'sub-123',
      tier: 'Premium',
      status: 'active',
      nextDeliveryDate: '2025-08-15',
      billingDate: '2025-08-10',
      billingAmount: 25000,
      currentFragrance: {
        name: 'Baccarat Rouge 540',
        brand: 'Maison Francis Kurkdjian',
        imageUrl: '/images/hero/hero_image.png',
        tier: 'Premium'
      },
      preferences: {
        scentVibes: ['Fresh + Clean'],
        moodIntentions: ['I am the soft life queen'],
        genderPreference: 'Feminine',
        dislikedNotes: ['Rose', 'Patchouli']
      },
      billingInfo: {
        cardLast4: '4242',
        cardType: 'Visa',
        expiryDate: '12/26'
      },
      orderHistory: [
        {
          date: '2025-07-15',
          fragrance: 'Tom Ford Black Orchid',
          brand: 'Tom Ford',
          delivered: true
        },
        {
          date: '2025-06-15',
          fragrance: 'Creed Aventus',
          brand: 'Creed',
          delivered: true
        },
        {
          date: '2025-05-15',
          fragrance: 'Le Labo Santal 33',
          brand: 'Le Labo',
          delivered: true
        }
      ]
    };

    setTimeout(() => {
      setSubscription(mockSubscription);
      setLoading(false);
    }, 500);
  }, []);

  const handlePauseSubscription = () => {
    if (subscription) {
      setSubscription({
        ...subscription,
        status: 'paused'
      });
    }
  };

  const handleResumeSubscription = () => {
    if (subscription) {
      setSubscription({
        ...subscription,
        status: 'active'
      });
    }
  };

  const handleSkipMonth = () => {
    // Update next delivery date to skip this month
    if (subscription) {
      const currentDate = new Date(subscription.nextDeliveryDate);
      const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      setSubscription({
        ...subscription,
        nextDeliveryDate: nextMonth.toISOString()
      });
    }
    setShowSkipModal(false);
  };

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading your subscription...</p>
        </div>
      </ProfileLayout>
    );
  }

  if (!subscription) {
    return (
      <ProfileLayout>
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#f7ede1] flex items-center justify-center mb-4">
            <FiPackage className="h-8 w-8 text-[#8b0000]" />
          </div>
          <h3 className="font-serif text-xl mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-6">
            Start your fragrance journey with a personalized subscription.
          </p>
          <Link href="/subscriptions">
            <span className="inline-block bg-[#8b0000] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all">
              Start Subscription
            </span>
          </Link>
        </div>
      </ProfileLayout>
    );
  }

  const currentTier = tierBenefits[subscription.tier];
  const otherTier = subscription.tier === 'Prime' ? tierBenefits.Premium : tierBenefits.Prime;

  return (
    <ProfileLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-serif text-black mb-2">My Subscription</h1>
          <p className="text-gray-600">Manage your fragrance subscription and preferences</p>
        </div>

        {/* Section 1: My Upcoming Delivery */}
        <div className={`bg-gradient-to-r ${currentTier.color} text-white rounded-lg p-6`}>
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
            <FiTruck size={24} />
            My Upcoming Delivery
          </h2>
          
          {subscription.currentFragrance && (
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-white/20">
                  <Image
                    src={subscription.currentFragrance.imageUrl}
                    alt={subscription.currentFragrance.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm opacity-90">{subscription.currentFragrance.brand}</p>
                  <h3 className="text-lg font-medium">{subscription.currentFragrance.name}</h3>
                  <p className="text-sm opacity-90">
                    {subscription.tier} Tier • Delivering {new Date(subscription.nextDeliveryDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowSkipModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <FiCalendar size={16} />
              Skip This Month
            </button>
            <button
              onClick={subscription.status === 'active' ? handlePauseSubscription : handleResumeSubscription}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {subscription.status === 'active' ? <FiPause size={16} /> : <FiPlay size={16} />}
              {subscription.status === 'active' ? 'Pause Subscription' : 'Resume Subscription'}
            </button>
          </div>
        </div>

        {/* Section 2: My Preferences */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-medium text-black mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FiHeart size={20} />
              My Preferences
            </span>
            <Link 
              href="/profile/quiz-results"
              className="text-[#8B0000] hover:text-[#a0001e] text-sm font-medium flex items-center gap-1"
            >
              <FiEdit size={16} />
              Update My Quiz Answers
            </Link>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-black mb-2">Scent Vibes</h3>
              <div className="flex flex-wrap gap-2">
                {subscription.preferences.scentVibes.map((vibe, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {vibe}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-black mb-2">Mood Intentions</h3>
              <div className="flex flex-wrap gap-2">
                {subscription.preferences.moodIntentions.map((mood, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {mood}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-black mb-2">Gender Preference</h3>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                {subscription.preferences.genderPreference}
              </span>
            </div>

            <div>
              <h3 className="font-medium text-black mb-2">Notes to Avoid</h3>
              <div className="flex flex-wrap gap-2">
                {subscription.preferences.dislikedNotes.map((note, index) => (
                  <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: My Plan */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-medium text-black mb-4 flex items-center gap-2">
            <FiSettings size={20} />
            My Plan
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Plan */}
            <div className={`bg-gradient-to-r ${currentTier.color} text-white rounded-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{subscription.tier} Plan</h3>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Current</span>
              </div>
              
              <p className="text-2xl font-bold mb-2">₦{currentTier.price.toLocaleString()}/month</p>
              <p className="text-sm opacity-90 mb-4">
                Next billing: {new Date(subscription.billingDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>

              <ul className="space-y-2">
                {currentTier.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm opacity-90 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Plan */}
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-black">
                  {subscription.tier === 'Prime' ? 'Premium' : 'Prime'} Plan
                </h3>
                {subscription.tier === 'Prime' && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Upgrade</span>
                )}
              </div>
              
              <p className="text-2xl font-bold text-black mb-4">₦{otherTier.price.toLocaleString()}/month</p>

              <ul className="space-y-2 mb-6">
                {otherTier.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                {subscription.tier === 'Prime' ? (
                  <>
                    <FiArrowUp size={16} />
                    Upgrade to Premium
                  </>
                ) : (
                  <>
                    <FiArrowDown size={16} />
                    Switch to Prime
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Account Actions */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-medium text-black mb-4 flex items-center gap-2">
            <FiUser size={20} />
            Account Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={subscription.status === 'active' ? handlePauseSubscription : handleResumeSubscription}
              className="flex items-center justify-center gap-2 bg-yellow-100 text-yellow-800 py-3 rounded-md hover:bg-yellow-200 transition-colors"
            >
              {subscription.status === 'active' ? <FiPause size={16} /> : <FiPlay size={16} />}
              {subscription.status === 'active' ? 'Pause Subscription' : 'Resume Subscription'}
            </button>

            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center justify-center gap-2 bg-red-100 text-red-800 py-3 rounded-md hover:bg-red-200 transition-colors"
            >
              <FiX size={16} />
              Cancel Subscription
            </button>

            <Link 
              href="/profile/billing"
              className="flex items-center justify-center gap-2 bg-blue-100 text-blue-800 py-3 rounded-md hover:bg-blue-200 transition-colors"
            >
              <FiCreditCard size={16} />
              Change Billing Info
            </Link>

            <Link 
              href="/profile/orders"
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-3 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FiPackage size={16} />
              View Order History
            </Link>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-medium text-black mb-4">Recent Deliveries</h2>
          <div className="space-y-3">
            {subscription.orderHistory.map((order, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-black">{order.brand} - {order.fragrance}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.delivered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.delivered ? 'Delivered' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skip Month Modal */}
        {showSkipModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-black mb-4">Skip This Month?</h3>
              <p className="text-gray-600 mb-6">
                Your next delivery will be pushed to the following month. You won't be charged for this month.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSkipMonth}
                  className="flex-1 bg-[#8B0000] text-white py-2 rounded-md hover:bg-[#a0001e] transition-colors"
                >
                  Yes, Skip Month
                </button>
                <button
                  onClick={() => setShowSkipModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-black mb-4">Cancel Subscription?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your subscription? You'll lose access to personalized fragrance selections.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Handle cancellation logic here
                    setShowCancelModal(false);
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}