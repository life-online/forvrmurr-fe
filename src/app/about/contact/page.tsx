"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedLines from "@/components/animations/AnimatedLines";
import AnimatedText from "@/components/animations/AnimatedText";
import AnimatedSection from "@/components/animations/AnimatedSection";
import contactService, { ContactFormData } from "@/services/contact";
import { toastService } from "@/services/toast";
import { buttonHover, buttonTap } from "@/utils/animations";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "General",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate fullName
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate subject
    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Message cannot exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await contactService.submitContactForm(formData);
      setIsSubmitted(true);
      toastService.success("Your message has been sent successfully!");
    } catch (error) {
      let errorMessage = "Failed to send your message. Please try again.";

      // Handle specific error types
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Handle specific HTTP error status codes
      if (error && typeof error === "object" && "status" in error) {
        const status = (error as { status: number }).status;

        switch (status) {
          case 400:
            errorMessage =
              "There was a problem with your submission. Please check your information and try again.";
            break;
          case 401:
            errorMessage = "You need to be logged in to send a message.";
            break;
          case 403:
            errorMessage = "You don't have permission to perform this action.";
            break;
          case 404:
            errorMessage =
              "The contact service is currently unavailable. Please try again later.";
            break;
          case 429:
            errorMessage =
              "Too many messages sent. Please wait a moment before trying again.";
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage =
              "Our server is experiencing issues. Please try again later or contact us directly at hello@forvrmurr.com.";
            break;
        }
      }

      // Check for network errors
      if (
        error &&
        typeof error === "object" &&
        error instanceof TypeError &&
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      }

      toastService.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqContentRef = useRef<HTMLDivElement>(null);
  const scrollToSection = () => {
    // Use setTimeout to ensure the scroll happens after the current execution context
    setTimeout(() => {
      if (faqContentRef.current) {
        const offsetTop = faqContentRef.current.offsetTop;
        window.scrollTo({
          top: offsetTop, // No offset to ensure FAQ content is at the very top
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <div className="bg-white flex flex-col mb-16">
      {/* Hero Banner */}

      <section className="relative w-[96%] h-[70vh] md:h-[65vh] overflow-hidden mx-auto my-3 md:my-8 rounded-lg">
        <div className="relative w-full h-full">
          {/* Desktop Image */}
          <Image
            src="/images/about/contact/contact-hero.jpg"
            alt="Contact Hero"
            fill
            priority
            className="object-cover hidden md:block"
          />

          {/* Mobile Image */}
          <Image
            src="/images/about/contact/contact-hero-mobile.jpg"
            alt="Contact Hero"
            fill
            priority
            className="object-cover md:hidden"
          />

          {/* Gradient Overlay for text legibility - Desktop */}
          <div className="absolute inset-0 bg-gradient-to-r m-4 from-transparent to-black/20 z-10 hidden md:block rounded-lg"></div>

          {/* Gradient Overlay for text legibility - Mobile */}
          <div className="absolute inset-0 bg-gradient-to-b m-4 from-transparent to-black/20 z-10 md:hidden rounded-lg"></div>

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-center max-w-2xl mx-auto px-4 mt-auto mb-12 md:my-0">
              <AnimatedLines
                lines={["WE'D LOVE TO HEAR FROM YOU."]}
                className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-wide text-[#8B0000] mb-4"
                delay={0.3}
                duration={0.8}
                lineStagger={0.2}
                as="h1"
              />
              <AnimatedLines
                lines={["Please fill out the form below to get in touch."]}
                className="text-base md:text-lg font-light text-[#8B0000] max-w-2xl mx-auto"
                delay={1.0}
                duration={0.6}
                lineStagger={0.15}
                as="p"
              />
              <motion.button
                className="mt-6 px-8 py-3 bg-[#a0001e] text-white font-medium rounded hover:bg-[#8b0000] transition-colors"
                onClick={scrollToSection}
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.45, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] as any }
                }}
                whileHover={{
                  ...buttonHover,
                  y: -2,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={buttonTap}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      <div
        ref={faqContentRef}
        className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-16 md:py-24"
      >
        {!isSubmitted ? (
          <AnimatedSection delay={0.1} direction="up">
            <div className="flex flex-col md:flex-row gap-10 mb-16">
              <motion.div
                className="w-full md:w-2/3 bg-white rounded-lg p-8 shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <AnimatedLines
                  lines={["Send Us a Message"]}
                  className="font-serif text-xl mb-6"
                  delay={0.2}
                  duration={0.6}
                  lineStagger={0.15}
                  as="h2"
                />
                <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.fullName ? "border-red-500" : "border-gray-200"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-[#8b0000] focus:border-[#8b0000]`}
                    placeholder="Your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-[#8b0000] focus:border-[#8b0000]`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.subject ? "border-red-500" : "border-gray-200"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-[#8b0000] focus:border-[#8b0000] bg-white`}
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    <option value="Order issue">Order issue</option>
                    <option value="Quiz help">Quiz help</option>
                    <option value="Gifting inquiry">Gifting inquiry</option>
                    <option value="General">General</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-2 border ${
                      errors.message ? "border-red-500" : "border-gray-200"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-[#8b0000] focus:border-[#8b0000]`}
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.message.length}/1000 characters
                  </p>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#a0001e] text-white py-3 rounded-md hover:bg-[#8b0000] transition-all font-medium flex items-center justify-center"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
                </form>
              </motion.div>

              <motion.div
                className="w-full md:w-1/3 space-y-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as any }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="bg-[#f8f9fa] p-6 rounded-lg">
                  <h3 className="font-serif text-lg mb-3 text-[#8b0000]">
                    Contact Information
                  </h3>

                  <div className="space-y-4 mt-4">
                  <div className="flex items-start">
                    <span className="text-[#8b0000] mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href="mailto:hello@forvrmurr.com"
                        className="text-[#8b0000] hover:underline"
                      >
                        hello@forvrmurr.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-[#8b0000] mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 11.25A2.25 2.25 0 109.75 9 2.25 2.25 0 0012 11.25zm0 0c4.56 0 8.25-3.69 8.25-8.25S16.56 0 12 0 3.75 3.69 3.75 8.25s3.69 8.25 8.25 8.25z"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="font-medium">Instagram</p>
                      <a
                        href="https://instagram.com/forvrmurr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8b0000] hover:underline"
                      >
                        @forvrmurr
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-[#8b0000] mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="font-medium">Customer Support Hours</p>
                      <p className="text-gray-600">Monday–Friday, 10am–6pm</p>
                    </div>
                  </div>
                </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.1} direction="up">
            <motion.div className="bg-white rounded-lg p-8 shadow-sm border-l-4 border-[#8b0000] max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-[#8b0000]/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#8b0000]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="font-serif text-2xl mb-3">Thank You!</h2>
              <p className="mb-6 text-gray-600">
                Your message has been sent successfully. We'll be in touch with
                you shortly.
              </p>
              <motion.button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    fullName: "",
                    email: "",
                    subject: "General",
                    message: "",
                  });
                }}
                className="px-6 py-2 bg-[#8b0000] text-white rounded-md hover:bg-[#a0001e] transition-all"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Send Another Message
              </motion.button>
            </motion.div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
