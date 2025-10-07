"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiMail, FiUser, FiCalendar, FiPackage, FiHeart, FiCreditCard, FiPhone, FiShoppingCart, FiLogIn, FiLock, FiCheckCircle, FiUsers } from "react-icons/fi";
import Link from "next/link";
import { profileMgtService, UserProfile, UpdateProfileRequest } from "@/services/profilemgt";
import { toastService } from "@/services/toast";

export default function ProfileSummary() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await profileMgtService.getUserProfile();
        if (profile) {
          setUserProfile(profile);
          setProfileForm({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            phoneNumber: profile.phoneNumber || "",
          });
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic phone number validation (international format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'order':
        return <FiPackage size={14} />;
      case 'wishlist':
        return <FiHeart size={14} />;
      case 'subscription':
        return <FiCreditCard size={14} />;
      case 'profile_update':
        return <FiUser size={14} />;
      case 'login':
        return <FiLogIn size={14} />;
      case 'password_change':
        return <FiLock size={14} />;
      case 'email_verification':
        return <FiCheckCircle size={14} />;
      case 'newsletter_subscription':
        return <FiUsers size={14} />;
      case 'cart':
        return <FiShoppingCart size={14} />;
      case 'payment':
        return <FiCreditCard size={14} />;
      default:
        return <FiPackage size={14} />;
    }
  };

  const handleSaveProfile = async () => {
    if (!userProfile) return;

    // Validation
    if (!profileForm.firstName.trim()) {
      toastService.error("First name is required");
      return;
    }

    if (!profileForm.lastName.trim()) {
      toastService.error("Last name is required");
      return;
    }

    if (profileForm.phoneNumber && !validatePhoneNumber(profileForm.phoneNumber)) {
      toastService.error("Please enter a valid phone number in international format (e.g., +1234567890)");
      return;
    }

    setIsUpdating(true);
    try {
      const updateData: UpdateProfileRequest = {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phoneNumber: profileForm.phoneNumber.trim(),
      };

      const updatedProfile = await profileMgtService.updateUserProfile(updateData);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
        setIsEditingProfile(false);
        toastService.success("Profile updated successfully!");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      // Handle specific error cases
      if (error?.status === 400) {
        const errorMessage = error?.data?.message || "Invalid profile data";
        if (errorMessage.toLowerCase().includes("phone")) {
          toastService.error("This phone number is already in use by another account");
        } else {
          toastService.error(errorMessage);
        }
      } else if (error?.status === 401) {
        toastService.error("Session expired. Please log in again.");
      } else {
        toastService.error("Failed to update profile. Please try again.");
      }
    } finally {
      setIsUpdating(false);
    }
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
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-gray-200 pb-4"
      >
        <h1 className="text-2xl font-serif text-black mb-2">Profile Summary</h1>
        <p className="text-gray-600">Manage your account details and view your activity</p>
      </motion.div>

      {/* Profile Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-gradient-to-r from-[#f8f5f2] to-[#f0ebe5] rounded-lg p-6 border border-gray-200"
      >
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
                First Name
              </label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileForm.phoneNumber}
                onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                placeholder="+1234567890"
              />
              <p className="text-xs text-gray-500 mt-1">International format required (e.g., +1234567890)</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={isUpdating}
                className="bg-[#8B0000] text-white px-4 py-2 rounded-md hover:bg-[#a0001e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
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
            {userProfile.phoneNumber && (
              <div className="flex items-center gap-3">
                <FiPhone className="text-[#8B0000]" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium text-black">{userProfile.phoneNumber}</p>
                </div>
              </div>
            )}
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
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Link href="/profile/orders" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="bg-[#f0ebe5] p-2 rounded-lg">
              <FiPackage className="text-[#8B0000]" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{userProfile.totalOrders}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </div>
        </Link>

        <Link href="/profile/wishlist" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="bg-[#f0ebe5] p-2 rounded-lg">
              <FiHeart className="text-[#8B0000]" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{userProfile.wishlistItems}</p>
              <p className="text-sm text-gray-600">Wishlist Items</p>
            </div>
          </div>
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#f0ebe5] p-2 rounded-lg">
              <FiCreditCard className="text-[#8B0000]" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{userProfile.activeSubscriptions}</p>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Delivery Card */}
      {userProfile.nextDelivery && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-gradient-to-r from-[#8B0000] to-[#a0001e] text-white rounded-lg p-6"
        >
          <h3 className="text-lg font-medium mb-2">Your Next Delivery</h3>
          <p className="text-white/90">Expected on {new Date(userProfile.nextDelivery).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <h3 className="text-lg font-medium text-black mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {userProfile.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0">
              <div className={`p-2 rounded-full bg-[#f0ebe5] text-[#8B0000]`}>
                {getActivityIcon(activity.type)}
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
      </motion.div>
    </div>
  );
}