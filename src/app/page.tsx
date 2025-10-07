import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/HeroSection";
import CategorySelection from "@/components/ui/CategorySelection";
import ProductShowcase from "@/components/ui/ProductShowcase";
import Newsletter from "@/components/ui/Newsletter";
import CuratedExperiences from "@/components/ui/CuratedExperiences";
import AnimatedSection from "@/components/animations/AnimatedSection";
import StaggeredChildren from "@/components/animations/StaggeredChildren";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
      <Navbar />

      <main className="flex-grow bg-white">
        <HeroSection />

        <AnimatedSection delay={0.2} direction="up">
          <CategorySelection />
        </AnimatedSection>

        <AnimatedSection delay={0.3} direction="up">
          <ProductShowcase
            title="GET YOUR HANDS ON HIGHLY RATED HITS + FRESH PICKS."
            limit={6}
          />
        </AnimatedSection>

        <AnimatedSection delay={0.2} direction="up">
          <CuratedExperiences />
        </AnimatedSection>

        {/* <AnimatedSection delay={0.2} direction="up">
          <Newsletter />
        </AnimatedSection> */}
      </main>
      <Footer />
    </div>
  );
}
