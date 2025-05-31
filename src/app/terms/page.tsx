"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";

const TermsPage = () => { 
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
      <Navbar />
      <main>
        <TermsContent />
      </main>
      <Footer />
    </div>
  )
}

const TermsContent = () => {
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
            TERMS & CONDITIONS
          </h1>
        </div>
      </section>

      {/* Terms Content */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 md:px-12 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600">Last Updated: May 31, 2025</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">1. Introduction</h2>
          <p>Welcome to ForvrMurr. These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">2. Definitions</h2>
          <p>Throughout these Terms, we may refer to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>"ForvrMurr,"</strong> "we," "us," or "our" refers to ForvrMurr, the company providing luxury fragrance sampling services.</li>
            <li><strong>"Website"</strong> refers to forvrmurr.com and all associated subdomains.</li>
            <li><strong>"Services"</strong> refers to our fragrance sampling, subscription services, and any other offerings provided through our Website.</li>
            <li><strong>"You"</strong> or "your" refers to any individual accessing or using our Website and Services.</li>
          </ul>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">3. Account Registration</h2>
          <p>To access certain features of our Services, you may need to create an account. When creating an account, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Be responsible for all activities occurring under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">4. Products and Sampling</h2>
          <p>ForvrMurr offers luxury fragrance samples and decants. By purchasing our products, you acknowledge:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Our samples are authentic portions of original fragrances</li>
            <li>Minor variations in color, scent, or packaging may occur between samples</li>
            <li>Samples are for personal use only and not for resale</li>
            <li>Product information is provided for reference only</li>
          </ul>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">5. Subscription Services</h2>
          <p>For subscription-based services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Subscriptions will automatically renew unless canceled</li>
            <li>You may cancel your subscription at any time through your account</li>
            <li>Cancellations must be made at least 7 days before the next billing date</li>
            <li>We reserve the right to change subscription terms with notice</li>
          </ul>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">6. Payment and Pricing</h2>
          <p>By making a purchase, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Pay all charges associated with your order</li>
            <li>Provide valid and authorized payment information</li>
            <li>Accept that prices may change without notice</li>
            <li>Acknowledge that promotional offers may have additional terms</li>
          </ul>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">7. Shipping and Delivery</h2>
          <p>ForvrMurr ships products according to our published shipping policy. You acknowledge:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Delivery times are estimates and not guaranteed</li>
            <li>International shipments may be subject to customs and import duties</li>
            <li>Risk of loss transfers to you upon delivery to the carrier</li>
            <li>You are responsible for providing accurate shipping information</li>
          </ul>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">8. Returns and Refunds</h2>
          <p>Our return and refund policy is as follows:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Due to the nature of fragrance products, we cannot accept returns of opened items</li>
            <li>Damaged or incorrect items may be eligible for replacement or refund</li>
            <li>Refund requests must be submitted within 14 days of delivery</li>
            <li>Return shipping costs are the responsibility of the customer</li>
          </ul>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">9. Intellectual Property</h2>
          <p>All content on our Website, including text, images, logos, and trademarks, is the property of ForvrMurr or our licensors and is protected by copyright and other intellectual property laws. You may not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use our content for commercial purposes without permission</li>
            <li>Modify, reproduce, or distribute our content</li>
            <li>Remove any copyright or proprietary notices</li>
          </ul>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, ForvrMurr shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Services.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">11. Indemnification</h2>
          <p>You agree to indemnify and hold harmless ForvrMurr from any claims, damages, liabilities, costs, or expenses arising from your violation of these Terms or your use of our Services.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">12. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">13. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our Website. Your continued use of our Services after any changes constitutes acceptance of the revised Terms.</p>
          
          <h2 className="text-2xl font-serif text-gray-900 mt-8 mb-4">14. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>
            <strong>Email:</strong> <a href="mailto:hello@forvrmurr.com" className="text-[#8B0000] hover:underline">hello@forvrmurr.com</a>
          </p>
        </div>
      </section>
    </>
  );
};

export default TermsPage;
