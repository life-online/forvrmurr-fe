"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import CuratedExperiences from "@/components/ui/CuratedExperiences";

interface DiscoverLayoutProps {
  children: React.ReactNode;
}

export default function DiscoverLayout({ children }: DiscoverLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <CuratedExperiences showButton />
      <Footer />
    </div>
  );
}
