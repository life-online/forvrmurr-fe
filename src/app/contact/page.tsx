"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import LoadingProfile from "@/app/profile/page";
import ProfileContent from "@/app/profile/page";

const ContactPage = () => { 
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBar message="The wait is over. Shop Prime & Premium perfumes—now in 8ml!" />
      <Navbar />
      <Suspense fallback={<LoadingProfile />}>
        <ContactPageContent />
      </Suspense>
      <Footer />
    </div>
  )
}

const ContactPageContent = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    // For now, just show the thank you message
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full text-white min-h-[40vh] flex items-center justify-center py-12 md:py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black/20">
          <Image
            src="/images/hero/hero_1.png" // This is a placeholder - replace with your actual image
            alt="Contact Us - Luxury perfume collection"
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            quality={85}
            className="object-cover object-center transition-opacity duration-500"
            priority
            onError={(e) => {
              console.error("Error loading hero image");
              // Fallback to a color if image fails
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
            WE'D LOVE TO HEAR FROM YOU
          </h1>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-16">
        {!isSubmitted ? (
          <div className="flex flex-col md:flex-row gap-12">
            {/* Form Container */}
            <div className="w-full md:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6c789] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6c789] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6c789] focus:border-transparent"
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="Order issue">Order issue</option>
                    <option value="Quiz help">Quiz help</option>
                    <option value="Gifting inquiry">Gifting inquiry</option>
                    <option value="General">General</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6c789] focus:border-transparent"
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="inline-block px-8 py-3 bg-[#e6c789] text-black font-semibold rounded-lg hover:bg-opacity-80 transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
            
            {/* Contact Information Sidebar */}
            <div className="w-full md:w-1/3 bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-serif font-medium mb-6 text-gray-900">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-xl mr-3">📧</span>
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <a href="mailto:hello@forvrmurr.com" className="text-[#8B0000] hover:underline">
                      hello@forvrmurr.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-xl mr-3">📱</span>
                  <div>
                    <p className="font-medium text-gray-700">Instagram</p>
                    <a href="https://instagram.com/forvrmurr" target="_blank" rel="noopener noreferrer" className="text-[#8B0000] hover:underline">
                      @forvrmurr
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-xl mr-3">🕐</span>
                  <div>
                    <p className="font-medium text-gray-700">Customer Support Hours</p>
                    <p className="text-gray-600">Monday–Friday, 10am–6pm</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  We aim to respond to all inquiries within 24-48 hours during business days.
                </p>
                <p className="text-sm text-gray-600">
                  For urgent matters regarding your order, please include your order number in the message.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Thank You Message After Submission */
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif font-medium mb-4 text-gray-900">Thanks for reaching out</h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-8">
              We'll get back to you within 24–48 hours. In the meantime, explore our latest obsessions or take the scent quiz to find your next signature.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" legacyBehavior>
                <a className="px-8 py-3 bg-[#e6c789] text-black font-semibold rounded-lg hover:bg-opacity-80 transition-colors duration-300">
                  Browse All Scents
                </a>
              </Link>
              <Link href="/quiz" legacyBehavior>
                <a className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-300">
                  Take the Quiz
                </a>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ContactPage;
