"use client";

import React, { useState, useEffect } from "react";
import { FiEdit2, FiMail, FiUser, FiCalendar, FiPackage, FiHeart, FiCreditCard } from "react-icons/fi";
import Link from "next/link";

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  totalOrders: number;
  wishlistItems: number;
  activeSubscriptions: number;
  nextDelivery?: string;
  favoriteScent?: string;
  recentActivity: Array<{
    type: string;
    description: string;
    date: string;
  }>;
}

export default function ProfileSummary() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    // Mock user data - replace with actual API call
    const mockUserProfile: UserProfile = {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      joinDate: "2023-06-15",
      totalOrders: 8,
      wishlistItems: 12,
      activeSubscriptions: 1,
      nextDelivery: "2025-08-15",
      favoriteScent: "Tom Ford Black Orchid",
      recentActivity: [
        {
          type: "order",
          description: "Ordered Creed Aventus 8ml",
          date: "2025-08-01"
        },
        {
          type: "wishlist",
          description: "Added Maison Francis Kurkdjian BR540 to wishlist",
          date: "2025-07-28"
        },
        {
          type: "subscription",
          description: "Premium subscription renewed",
          date: "2025-07-15"
        }
      ]
    };

    setUserProfile(mockUserProfile);
    setProfileForm({
      name: mockUserProfile.name,
      email: mockUserProfile.email,
    });
  }, []);

  const handleSaveProfile = () => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        name: profileForm.name,
        email: profileForm.email,
      });
    }
    setIsEditingProfile(false);
  };

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-serif text-black mb-2">Profile Summary</h1>
        <p className="text-gray-600">Manage your account details and view your activity</p>
      </div>

      {/* Profile Information Card */}
      <div className="bg-gradient-to-r from-[#f8f5f2] to-[#f0ebe5] rounded-lg p-6 border">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-medium text-black">Personal Information</h2>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="flex items-center gap-2 text-[#8B0000] hover:text-[#a0001e] transition-colors"
          >
            <FiEdit2 size={16} />
            {isEditingProfile ? "Cancel" : "Edit"}
          </button>
        </div>

        {isEditingProfile ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                className="bg-[#8B0000] text-white px-4 py-2 rounded-md hover:bg-[#a0001e] transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FiUser className="text-[#8B0000]" size={20} />
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-black">{userProfile.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="text-[#8B0000]" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-black">{userProfile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiCalendar className="text-[#8B0000]" size={20} />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-black">
                  {new Date(userProfile.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/profile/orders" className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiPackage className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{userProfile.totalOrders}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </div>
        </Link>

        <Link href="/profile/wishlist" className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <FiHeart className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{userProfile.wishlistItems}</p>
              <p className="text-sm text-gray-600">Wishlist Items</p>
            </div>
          </div>
        </Link>

        <Link href="/profile/subscriptions" className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <FiCreditCard className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{userProfile.activeSubscriptions}</p>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Next Delivery Card */}
      {userProfile.nextDelivery && (
        <div className="bg-gradient-to-r from-[#8B0000] to-[#a0001e] text-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2">Your Next Delivery</h3>
          <p className="text-white/90">Expected on {new Date(userProfile.nextDelivery).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <Link 
            href="/profile/subscriptions"
            className="inline-block mt-3 bg-white text-[#8B0000] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Manage Subscription
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-medium text-black mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {userProfile.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0">
              <div className={`p-2 rounded-full ${
                activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'wishlist' ? 'bg-red-100 text-red-600' :
                'bg-green-100 text-green-600'
              }`}>
                {activity.type === 'order' ? <FiPackage size={14} /> :
                 activity.type === 'wishlist' ? <FiHeart size={14} /> :
                 <FiCreditCard size={14} />}
              </div>
              <div className="flex-grow">
                <p className="text-sm text-black">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Link 
          href="/profile/orders"
          className="inline-block mt-4 text-[#8B0000] hover:text-[#a0001e] text-sm font-medium"
        >
          View All Orders →
        </Link>
      </div>
    </div>
  );
}