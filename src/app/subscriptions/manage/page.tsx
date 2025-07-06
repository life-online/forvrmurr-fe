import React from 'react';

export default function ManageSubscriptionPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl md:text-4xl text-center mb-12">Manage Your Subscription</h1>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-lg mb-8">
          Easily manage your ForvrMurr subscription, update your preferences, or change your delivery schedule.
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <p className="text-center mb-6">Please log in to access your subscription settings.</p>
          <div className="flex justify-center">
            <button className="bg-[#8b0000] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all">
              Log In
            </button>
          </div>
        </div>
        <p className="italic text-sm text-gray-500 mt-8">
          This page is under development. Full subscription management features will be available soon.
        </p>
      </div>
    </div>
  );
}
