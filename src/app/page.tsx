import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/HeroSection";
import CategorySelection from "@/components/ui/CategorySelection";
import ProductShowcase from "@/components/ui/ProductShowcase";
import Newsletter from "@/components/ui/Newsletter";
import CuratedExperiences from "@/components/ui/CuratedExperiences";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar message="New collection revealed monthly!" />
      <Navbar />

      <main className="flex-grow bg-white">
        <HeroSection />
        <CategorySelection />
        <ProductShowcase
          title="GET YOUR HANDS ON HIGHLY RATED HITS + FRESH PICKS."
          limit={6}
        />
        <CuratedExperiences />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
