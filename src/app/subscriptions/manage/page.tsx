import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ManageSubscriptionPage() {
  return (
    <>
      <div className="text-center py-16 md:py-24">
        <h1 className="font-serif text-3xl md:text-4xl text-[#a0001e] mb-6">Manage Your Subscription</h1>
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-10">
            <h2 className="font-serif text-2xl mb-6">Coming Soon</h2>
            <p className="text-lg mb-8">
              Our subscription management portal is currently under development.
              Soon you'll be able to manage your ForvrMurr subscription, update your preferences, 
              and change your delivery schedule all in one place.
            </p>
            <div className="flex justify-center">
              <Link href="/shop" className="bg-[#a0001e] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all">
                Shop Individual Decants
              </Link>
            </div>
          </div>
          <p className="italic text-sm text-gray-500">
            Need help with your subscription? Contact us at <a href="mailto:hello@forvrmurr.com" className="text-[#a0001e] hover:underline">hello@forvrmurr.com</a>
          </p>
        </div>
      </div>
    </>
  );
}
