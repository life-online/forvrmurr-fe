import React from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CuratedExperiences from "@/components/ui/CuratedExperiences";

interface ShopLayoutProps {
  children: React.ReactNode;
  showCuratedExperiences?: boolean;
}

export default function ShopLayout({
  children,
  showCuratedExperiences = true,
}: ShopLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
      <Navbar />
      <main className="flex-grow">{children}</main>
      {showCuratedExperiences && <CuratedExperiences showButton />}
      <Footer />
    </div>
  );
}
