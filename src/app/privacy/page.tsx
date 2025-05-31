"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";

const PrivacyPage = () => { 
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
      <Navbar />
      <main>
        <PrivacyContent />
      </main>
      <Footer />
    </div>
  )
}

const PrivacyContent = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full text-white min-h-[30vh] flex items-center justify-center py-12 md:py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black/20">
          <Image
            src="/images/hero/hero_1.png"
            alt="Luxury perfume collection background"
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            quality={85}
            className="object-cover object-center transition-opacity duration-500"
            priority
            onError={(e) => {
              console.error("Error loading hero image");
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10"></div>

        {/* Overlay Content Container */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-6 sm:px-8 md:px-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-wide text-[#e6c789] mb-6">
            PRIVACY POLICY
          </h1>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600">Last Updated: May 31, 2025</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">1. Introduction</h2>
          <p>At ForvrMurr, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
          <p>Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site or use our services.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-serif text-gray-800 mt-6 mb-3">Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create an account</li>
            <li>Place an order</li>
            <li>Subscribe to our newsletter</li>
            <li>Participate in surveys or promotions</li>
            <li>Contact our customer service</li>
          </ul>
          <p>This information may include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Mailing address</li>
            <li>Phone number</li>
            <li>Payment information</li>
            <li>Fragrance preferences</li>
          </ul>
          
          <h3 className="text-xl font-serif text-gray-800 mt-6 mb-3">Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect certain information about your device, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>Pages visited</li>
            <li>Time and date of your visit</li>
            <li>Referring website</li>
          </ul>
          
          <h3 className="text-xl font-serif text-gray-800 mt-6 mb-3">Cookies and Similar Technologies</h3>
          <p>We use cookies and similar tracking technologies to collect information about your browsing activities. These technologies help us analyze website traffic, customize content, and improve your experience.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We may use the information we collect for various purposes, including to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Create and manage your account</li>
            <li>Send order confirmations and updates</li>
            <li>Provide customer support</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Personalize your shopping experience</li>
            <li>Improve our website and services</li>
            <li>Analyze usage patterns and trends</li>
            <li>Protect against fraud and unauthorized transactions</li>
            <li>Comply with legal obligations</li>
          </ul>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">4. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Providers:</strong> Third-party vendors who help us operate our business (payment processors, shipping companies, etc.)</li>
            <li><strong>Business Partners:</strong> Trusted partners who help us provide certain services</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          </ul>
          <p>We do not sell your personal information to third parties for marketing purposes.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">5. Your Privacy Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Right to access and review your personal information</li>
            <li>Right to correct inaccurate information</li>
            <li>Right to request deletion of your information</li>
            <li>Right to restrict or object to processing</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent</li>
          </ul>
          <p>To exercise these rights, please contact us using the information provided at the end of this Privacy Policy.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">6. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">7. Data Retention</h2>
          <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
          <p>Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">9. International Data Transfers</h2>
          <p>Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We will take appropriate measures to ensure your information remains protected in accordance with this Privacy Policy.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">10. Updates to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated Privacy Policy on our website with a new effective date.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">11. Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:</p>
          <p>
            <strong>Email:</strong> <a href="mailto:hello@forvrmurr.com" className="text-[#8B0000] hover:underline">hello@forvrmurr.com</a>
          </p>
        </div>
      </section>
    </>
  );
};

export default PrivacyPage;
