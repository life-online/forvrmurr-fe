"use client";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import React, { Suspense } from "react";
import ProfileContent from "./ProfileContent";

const LoadingProfile: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[50vh] bg-[#f7ede1]">
      <p className="text-xl text-gray-700">Loading your profile...</p>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
      <Navbar />
      <Suspense fallback={<LoadingProfile />}>
        <ProfileContent />
      </Suspense>
      <Footer />
    </div>
  );
}
