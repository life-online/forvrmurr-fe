import React from 'react';
import Link from 'next/link';

export default function OrderHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl md:text-4xl text-center mb-12">Order History</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg mb-8 text-center">
          View and manage your ForvrMurr orders.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Order history listing - Empty state initially */}
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#f7ede1] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8b0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              When you place orders, they will appear here for you to track and review.
            </p>
            <Link href="/shop/collection">
              <span className="inline-block bg-[#8b0000] text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all">
                Start Shopping
              </span>
            </Link>
          </div>
          
          {/* Sample Orders (hidden initially - for development/placeholder purposes) */}
          <div className="hidden">
            <div className="border-b border-gray-200 p-6 flex flex-col md:flex-row gap-4 md:items-center">
              <div className="md:w-2/3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">Delivered</span>
                  <span className="text-sm text-gray-500">Order #FM-2023-0001</span>
                </div>
                <h3 className="font-serif text-lg mb-1">2 Items • ₦24,000</h3>
                <p className="text-gray-600 text-sm">Placed on July 2, 2023</p>
              </div>
              <div className="md:w-1/3 md:text-right">
                <button className="text-[#8b0000] hover:text-opacity-80 font-medium">
                  View Order Details
                </button>
              </div>
            </div>
            
            <div className="border-b border-gray-200 p-6 flex flex-col md:flex-row gap-4 md:items-center">
              <div className="md:w-2/3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Processing</span>
                  <span className="text-sm text-gray-500">Order #FM-2023-0002</span>
                </div>
                <h3 className="font-serif text-lg mb-1">1 Item • ₦18,500</h3>
                <p className="text-gray-600 text-sm">Placed on July 5, 2023</p>
              </div>
              <div className="md:w-1/3 md:text-right">
                <button className="text-[#8b0000] hover:text-opacity-80 font-medium">
                  View Order Details
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <p className="italic text-sm text-gray-500 text-center mt-8">
          This page is under development. Full order history functionality will be available soon.
        </p>
      </div>
    </div>
  );
}
