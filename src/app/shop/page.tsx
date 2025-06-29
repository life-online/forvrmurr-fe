// /Users/joshuaivie/Documents/ForvMurr/frontend/src/app/shop/page.tsx
import React, { Suspense } from "react";
import Footer from "../../components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
// Import the new client component
import CuratedExperiences from "@/components/ui/CuratedExperiences";
import ShopContent from "@/components/shop/ShopContent";

// Basic loading component for Suspense fallback
const LoadingShop: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] bg-white text-black">
      <div className="max-w-7xl mx-auto w-full px-4 pt-8">
        <div className="text-xs mb-2">
          <span className="mr-2">New Release</span>
          <span className="mr-2">›</span>
          <span>Shop All</span>
        </div>
        <h1 className="text-2xl font-serif font-medium mb-4 text-black">
          CHOOSE YOUR NEXT SCENT OBSESSION
        </h1>
      </div>
      <div className="text-center py-10">
        <p className="text-xl">Loading your scents...</p>
        <div className="mt-4 w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-700 mx-auto"></div>
      </div>
    </div>
  );
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
      <Navbar />
      <div className="max-w-7xl mx-auto w-full px-4 pt-8 md:mb-24 mb-16">
      <Suspense fallback={<LoadingShop />}>
        <ShopContent />
      </Suspense>
      </div>
      <CuratedExperiences showButton />
      <Footer />
    </div>
  );
}
