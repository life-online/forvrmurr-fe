import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from 'next';
import { getSeoProps } from '@/config/seo';

export const metadata: Metadata = {
  ...getSeoProps({
    title: 'About Forvr Murr | Our Story',
    description: 'Learn about Forvr Murr, our founders, and our mission to make luxury fragrances accessible through our 8ml portions.',
    openGraph: {
      title: 'About Forvr Murr | Our Story',
      description: 'Learn about Forvr Murr, our founders, and our mission to make luxury fragrances accessible through our 8ml portions.',
      images: [{ url: '/images/founders-hero.jpg', width: 1200, height: 630, alt: 'Forvr Murr Founders' }],
    },
    twitter: {
      title: 'About Forvr Murr | Our Story',
      description: 'Learn about Forvr Murr, our founders, and our mission to make luxury fragrances accessible through our 8ml portions.',
      image: '/images/founders-hero.jpg',
      card: 'summary_large_image',
    },
  }),
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}