"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CuratedExperiences from "@/components/ui/CuratedExperiences";

interface SubscriptionsLayoutProps {
  children: React.ReactNode;
  showCuratedExperiences?: boolean;
}

export default function SubscriptionsLayout({
  children,
  showCuratedExperiences = true,
}: SubscriptionsLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto w-full px-4 pt-8 md:mb-24 mb-16">
          {children}
        </div>
      </main>
      {showCuratedExperiences && <CuratedExperiences showButton />}
      <Footer />
    </div>
  );
}
