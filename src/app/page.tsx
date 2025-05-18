import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSectionCP';
import CategorySelection from '@/components/ui/CategorySelection';
import ProductShowcase from '@/components/ui/ProductShowcase';
import Newsletter from '@/components/ui/Newsletter';
import { featuredProducts } from '@/data/products';

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
          products={featuredProducts} 
        />
        <div className="bg-white py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif mb-6">OVER 200 CURATED FRAGRANCES.<br/>ONE SIGNATURE EXPERIENCE.</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              The FindYourNext experience is much more than just the alluring fragrances in our collection - it&apos;s about curating an immersive journey for passionate fragrance lovers and curious novices alike. Each 8ml sample gives you 100+ sprays to fully immerse yourself before committing to a full bottle purchase.
            </p>
            <p className="text-gray-700 max-w-2xl mx-auto">
              We believe in creating an accessible and sustainable approach to exploring luxury fragrances, allowing you to expand your collection without breaking the bank. Quality, authenticity, and exceptional customer service are at the heart of everything we do.
            </p>
          </div>
        </div>
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
}
