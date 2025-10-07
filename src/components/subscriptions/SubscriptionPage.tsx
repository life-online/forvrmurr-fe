"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaGift } from 'react-icons/fa';

interface SubscriptionPageProps {
  type: 'prime' | 'premium';
}

export default function SubscriptionPage({ type }: SubscriptionPageProps) {
  // Define styling and content based on subscription type
  const isPrime = type === 'prime';
  
  const styles = {
    primary: isPrime ? '#8b0000' : '#000000', // Burgundy for Prime, Black for Premium
    secondary: isPrime ? '#f8f9fa' : '#f0f0f0', // Light gray variations
    accent: isPrime ? '#d4af37' : '#c0c0c0', // Gold for Prime, Silver for Premium
  };
  
  const content = {
    price: isPrime ? '₦17,500' : '₦55,000',
    title: isPrime ? 'PRIME' : 'PREMIUM',
    description: isPrime 
      ? 'Accessible niche and designer fragrances like Montale and Lattafa—perfect for daily luxury and easy layering.'
      : 'Ultra-luxury and rare niche scents like Parfums de Marly and Initio for the fragrance connoisseur.',
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full">
        <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
          <Image 
            src="/images/subscriptions/hero.png" 
            alt={`${content.title} Subscription`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 text-center"
            >
              YOUR NEXT OBSESSION, <br />DELIVERED MONTHLY
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center max-w-2xl mb-8 text-lg"
            >
              Every month, we send a fragrant reminder that you deserve softness, depth, and discovery. 
              Choose your pace—Prime or Premium—and let your next scent obsession find you.
              <br /><br />
              Your first delivery includes a free travel case, because luxury should arrive dressed for the part.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                href="/subscriptions/manage" 
                className={`px-8 py-3 rounded-md font-semibold shadow-lg ${isPrime ? 'bg-[#8b0000] text-white border-2 border-[#8b0000]' : 'bg-white text-black border-2 border-white'} transition-all hover:scale-105`}
              >
                Subscribe to Prime – ₦17,500/mo
              </Link>
              <Link 
                href="/subscriptions/manage" 
                className={`px-8 py-3 rounded-md font-semibold shadow-lg ${!isPrime ? 'bg-black text-white border-2 border-black' : 'bg-white text-black border-2 border-white'} transition-all hover:scale-105`}
              >
                Subscribe to Premium – ₦55,000/mo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Prime vs Premium Comparison Section */}
      <section className="py-16 bg-white max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="font-serif text-3xl text-center mb-8"
          >
            Compare Plans
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Prime Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className={`border rounded-lg p-8 ${isPrime ? 'border-[#8b0000] shadow-lg' : 'border-gray-200'}`}
            >
              <h3 className="font-serif text-2xl mb-2">Prime</h3>
              <p className="text-2xl font-bold mb-4">₦17,500<span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-[#8b0000] mr-2">✓</span>
                  <span>8ml of accessible niche and designer fragrances</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8b0000] mr-2">✓</span>
                  <span>Brands like Montale and Lattafa</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8b0000] mr-2">✓</span>
                  <span>Perfect for daily luxury and easy layering</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8b0000] mr-2">✓</span>
                  <span>Free travel case with first delivery</span>
                </li>
              </ul>
              <Link 
                href="/subscriptions/manage" 
                className={`block text-center px-6 py-3 rounded-md font-medium ${isPrime ? 'bg-[#8b0000] text-white' : 'bg-gray-100 text-gray-800'} transition-all hover:opacity-90 w-full`}
              >
                {isPrime ? 'Current Selection' : 'Choose Prime'}
              </Link>
            </motion.div>
            
            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              className={`border rounded-lg p-8 ${!isPrime ? 'border-black shadow-lg' : 'border-gray-200'}`}
            >
              <h3 className="font-serif text-2xl mb-2">Premium</h3>
              <p className="text-2xl font-bold mb-4">₦55,000<span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-black mr-2">✓</span>
                  <span>8ml of ultra-luxury and rare niche scents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">✓</span>
                  <span>Brands like Parfums de Marly and Initio</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">✓</span>
                  <span>For the fragrance connoisseur</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">✓</span>
                  <span>Free travel case with first delivery</span>
                </li>
              </ul>
              <Link 
                href="/subscriptions/manage" 
                className={`block text-center px-6 py-3 rounded-md font-medium ${!isPrime ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'} transition-all hover:opacity-90 w-full`}
              >
                {!isPrime ? 'Current Selection' : 'Choose Premium'}
              </Link>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mt-10"
          >
            <p className="text-lg mb-4">Not sure which subscription fits your fragrance style? Let your mood guide you.</p>
            <Link 
              href="/discover/quiz" 
              className="inline-block px-8 py-3 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200 transition-all"
            >
              Take the Scent Quiz
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="font-serif text-3xl text-center mb-12"
          >
            How It Works
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl ${isPrime ? 'bg-[#8b0000]' : 'bg-black'}`}>
                  <FaHeart />
                </div>
              </div>
              <h3 className="font-serif text-xl mb-2">Tell Us What You Love</h3>
              <p>Take our scent quiz and share your preferences.</p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl ${isPrime ? 'bg-[#8b0000]' : 'bg-black'}`}>
                  <FaStar />
                </div>
              </div>
              <h3 className="font-serif text-xl mb-2">We Curate, You Discover</h3>
              <p>Based on your vibe, we select a scent each month just for you.</p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl ${isPrime ? 'bg-[#8b0000]' : 'bg-black'}`}>
                  <FaGift />
                </div>
              </div>
              <h3 className="font-serif text-xl mb-2">Delivered with Love</h3>
              <p>Your 8ml fragrance arrives in luxe packaging—ready to spritz, layer, and obsess over.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scent Quiz Prompt */}
      <section className="py-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <h2 className="font-serif text-3xl mb-4">Not Sure Where to Start?</h2>
          <p className="text-lg mb-6">Our scent quiz helps match you with your perfect Forvr Murr fragrance tier and monthly picks.</p>
          <Link 
            href="/discover/quiz" 
            className={`inline-block px-8 py-3 rounded-md font-medium text-white ${isPrime ? 'bg-[#8b0000]' : 'bg-black'} transition-all hover:opacity-90`}
          >
            Take the Quiz
          </Link>
        </motion.div>
      </section>

      {/* Subscription FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            className="font-serif text-3xl text-center mb-12"
          >
            Subscription FAQs
          </motion.h2>
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="font-serif text-xl mb-2">Can I choose the scent I receive each month?</h3>
              <p>While your monthly scent is curated based on your quiz results, we're building something even better—your wishlist. Add scents you love to your wishlist and we'll prioritize them in your upcoming deliveries. Coming soon to your subscription dashboard!</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="font-serif text-xl mb-2">What's the difference between Prime and Premium?</h3>
              <p>Prime offers accessible niche and designer fragrances like Montale and Lattafa —perfect for daily luxury and easy layering.<br />
              Premium features ultra-luxury and rare niche scents like Parfums de Marly and Initio.<br />
              Both come in 8ml bottles and include a free travel case with your first month.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="font-serif text-xl mb-2">Can I skip a month or cancel my subscription?</h3>
              <p>Absolutely. You can manage your subscription anytime—skip a month, pause, or cancel directly from your account.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="font-serif text-xl mb-2">When will I receive my first delivery?</h3>
              <p>We believe fragrance should feel like a reward. All subscription orders placed before the 25th will ship out at the end of the month—a luxurious ritual to close your month with joy. Your tracking info will be shared ahead of dispatch.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="font-serif text-xl mb-2">Can I gift a subscription?</h3>
              <p>Yes! You can now gift a Forvr Murr subscription by pre-paying for 1, 3, or 6 months upfront. It's the perfect way to surprise someone with a monthly scent experience—beautifully packaged and entirely unforgettable.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
