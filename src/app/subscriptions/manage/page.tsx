"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiBell, FiCheck } from 'react-icons/fi';
import { toastService } from '@/services/toast';
import { subscriptionService } from '@/services/subscription';

export default function ManageSubscriptionPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    preferredTier: 'prime' as 'prime' | 'premium' | 'undecided'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      toastService.error('Please enter your full name');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      toastService.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await subscriptionService.submitInterest(formData);

      if (response.success) {
        setIsSubmitted(true);
        toastService.success('Thank you! We\'ll notify you when subscriptions launch.');
      } else {
        throw new Error(response.message || 'Failed to submit interest');
      }
    } catch (error) {
      console.error('Error submitting interest:', error);
      toastService.error('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f2] to-white py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-3xl md:text-4xl text-[#8b0000] mb-4">
            Subscriptions Coming Soon
          </h1>
          <p className="text-lg text-gray-600">
            Be the first to know when our curated fragrance subscriptions launch
          </p>
        </motion.div>

        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#8b0000]/10 flex items-center justify-center">
                <FiBell className="w-8 h-8 text-[#8b0000]" />
              </div>
            </div>

            <h2 className="font-serif text-2xl text-center mb-4">Get Notified at Launch</h2>
            <p className="text-center text-gray-600 mb-8">
              Join our waitlist and be among the first to experience monthly fragrance discovery
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>

              <div>
                <label htmlFor="preferredTier" className="block text-sm font-medium text-gray-700 mb-2">
                  Which tier interests you?
                </label>
                <select
                  id="preferredTier"
                  name="preferredTier"
                  value={formData.preferredTier}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent bg-white"
                >
                  <option value="prime">Prime (₦17,500/month) - Designer fragrances</option>
                  <option value="premium">Premium (₦55,000/month) - Luxury niche fragrances</option>
                  <option value="undecided">I'm not sure yet</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8b0000] text-white py-3 rounded-lg font-semibold hover:bg-[#a0001e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Joining Waitlist...
                  </>
                ) : (
                  <>
                    <FiBell className="w-5 h-5" />
                    Join the Waitlist
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white border-l-4 border-[#8b0000] rounded-lg p-8 shadow-lg text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="font-serif text-2xl mb-4">You're on the List!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for your interest! We'll send you an email as soon as subscriptions are available.
              In the meantime, explore our individual fragrance decants.
            </p>
            <Link 
              href="/shop" 
              className="inline-block bg-[#8b0000] text-white px-8 py-3 rounded-lg hover:bg-[#a0001e] transition-colors font-medium"
            >
              Browse Fragrances
            </Link>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            Questions? Contact us at{' '}
            <a href="mailto:hello@forvrmurr.com" className="text-[#8b0000] hover:underline font-medium">
              hello@forvrmurr.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
