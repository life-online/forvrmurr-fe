"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedLines from "@/components/animations/AnimatedLines";
import { buttonHover, buttonTap } from "@/utils/animations";
import giftingService from "@/services/gifting";
import { useToast } from "@/context/ToastContext";

interface GiftingFormData {
  fullName: string;
  email: string;
  phone: string;
  occasion: string;
  deliveryDate: string;
  quantity: string;
  budgetRange: string;
  fragranceTier: {
    prime: boolean;
    premium: boolean;
    mixOfBoth: boolean;
  };
  notes: string;
}

export default function GiftingPage() {
  const [formData, setFormData] = useState<GiftingFormData>({
    fullName: "",
    email: "",
    phone: "",
    occasion: "",
    deliveryDate: "",
    quantity: "",
    budgetRange: "",
    fragranceTier: {
      prime: false,
      premium: false,
      mixOfBoth: false,
    },
    notes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { success, error: showError } = useToast();

  const featuredBundlesRef = useRef<HTMLDivElement>(null);

  const scrollToFeaturedBundles = () => {
    featuredBundlesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      fragranceTier: {
        ...prev.fragranceTier,
        [name]: checked,
      },
    }));
  };

  // Format today's date as YYYY-MM-DD for the min attribute
  const today = new Date().toISOString().split('T')[0];

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

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    // Validate occasion
    if (!formData.occasion) {
      newErrors.occasion = "Please select an occasion";
    }
    
    // Validate delivery date is not in the past
    if (formData.deliveryDate) {
      const selectedDate = new Date(formData.deliveryDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
      
      if (selectedDate < currentDate) {
        newErrors.deliveryDate = "Delivery date cannot be in the past";
      }
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

    // Prepare the preferred fragrance tiers array
    const preferredFragranceTiers: string[] = [];
    if (formData.fragranceTier.prime) preferredFragranceTiers.push("Prime");
    if (formData.fragranceTier.premium) preferredFragranceTiers.push("Premium");
    if (formData.fragranceTier.mixOfBoth) preferredFragranceTiers.push("Mix of Both");

    try {
      // Format the data according to the API requirements
      const requestData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        occasion: formData.occasion,
        preferredDeliveryDate: formData.deliveryDate || undefined,
        quantityNeeded: formData.quantity ? parseInt(formData.quantity, 10) : undefined,
        budgetRangePerPiece: formData.budgetRange || undefined,
        preferredFragranceTiers: preferredFragranceTiers.length > 0 ? preferredFragranceTiers : undefined,
        notes: formData.notes || undefined
      };

      // Submit the form data to the API
      await giftingService.submitGiftRequest(requestData);
      
      // Show success message
      success("Your gifting inquiry has been submitted successfully!");
      
      // Reset form and show thank you message
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting gift request:", err);
      
      // Show error message
      if (err instanceof Error) {
        showError(`Failed to submit your request: ${err.message}`);
      } else {
        showError("Failed to submit your request. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      occasion: "",
      deliveryDate: "",
      quantity: "",
      budgetRange: "",
      fragranceTier: {
        prime: false,
        premium: false,
        mixOfBoth: false,
      },
      notes: "",
    });
    setIsSubmitted(false);
    setErrors({});
  };

  // Create a ref for the FAQ content section
  const giftingContentRef = useRef<HTMLDivElement>(null);

  // Function to scroll to FAQ content with proper positioning
  const scrollToSection = () => {
    // Use setTimeout to ensure the scroll happens after the current execution context
    setTimeout(() => {
      if (giftingContentRef.current) {
        const offsetTop = giftingContentRef.current.offsetTop;
        window.scrollTo({
          top: offsetTop, // No offset to ensure FAQ content is at the very top
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <>
      {/* Hero Section*/}
      <section className="relative w-[96%] h-[70vh] md:h-[65vh] overflow-hidden mx-auto my-3 md:my-8 rounded-lg">
        {/* Desktop Image */}
        <Image
          src="/images/shop/gifting/gifting-hero.jpg"
          alt="ForvrMurr Founders"
          fill
          priority
          className="object-cover object-[90%_center] hidden md:block"
        />

        {/* Mobile Image */}
        <Image
          src="/images/shop/gifting/gifting-hero-mobile.jpg"
          alt="ForvrMurr Founders"
          fill
          priority
          className="object-cover md:hidden"
        />

        {/* Gradient Overlay for text legibility - Desktop */}
        <div className="absolute inset-0 bg-gradient-to-r m-4 from-black/10 to-transparent z-10 hidden md:block rounded-lg"></div>

        {/* Gradient Overlay for text legibility - Mobile */}
        <div className="absolute inset-0 bg-gradient-to-b m-4 from-transparent via-transparent to-black/10 z-10 md:hidden rounded-lg"></div>

        {/* Hero Content - Desktop */}
        <div className="absolute inset-0 z-20 items-center flex">
          <div className="max-w-7xl w-full mx-auto px-12 text-left mt-auto mb-12 md:my-0">
            <div className="space-y-2 md:space-y-6 md:w-1/2">
              <AnimatedLines
                lines={["The Ultimate Luxury Gift."]}
                className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-wide text-[#8B0000]"
                delay={0.3}
                duration={0.8}
                lineStagger={0.2}
                as="h1"
              />
              <AnimatedLines
                lines={["From intimate weddings to grand celebrations and festive hampers—give the gift of unforgettable scents."]}
                className="text-base md:text-lg font-light text-[#8B0000]"
                delay={1.1}
                duration={0.6}
                lineStagger={0.15}
                as="p"
              />
              <motion.button
                onClick={scrollToSection}
                className="mt-6 px-8 py-3 bg-[#a0001e] text-white font-medium rounded hover:bg-[#8b0000] transition-colors"
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
                Learn More
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose ForvrMurr for Gifting */}
      <section className="py-16 md:py-24 bg-[#f8f8f8]" ref={giftingContentRef}>
        <div className="container max-w-7xl mx-auto px-4">
          <AnimatedLines
            lines={["Why Choose ForvrMurr for Gifting?"]}
            className="font-serif text-3xl md:text-4xl text-center mb-16"
            delay={0.2}
            duration={0.7}
            lineStagger={0.15}
            as="h2"
          />

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Column 1 */}
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as any }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#a0001e] bg-opacity-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#a0001e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-4">Affordable Luxury</h3>
              <p className="text-gray-700">
                Options for every budget. Our Prime and Premium collections
                ensure luxury is accessible.
              </p>
            </motion.div>

            {/* Column 2 */}
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as any }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#a0001e] bg-opacity-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#a0001e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-4">
                Memorable & Meaningful
              </h3>
              <p className="text-gray-700">
                Give scents they'll cherish, remember, and enjoy. Personalized
                fragrance choices for any vibe or occasion.
              </p>
            </motion.div>

            {/* Column 3 */}
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as any }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#a0001e] bg-opacity-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#a0001e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-4">
                Beautiful Presentation
              </h3>
              <p className="text-gray-700">
                Each decant is elegantly packaged, making it instantly
                gift-ready for weddings, events, or Christmas hampers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Gift Bundles */}
      <section ref={featuredBundlesRef} className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          <AnimatedLines
            lines={["Gifting Occasions"]}
            className="font-serif text-3xl md:text-4xl text-center mb-16"
            delay={0.2}
            duration={0.7}
            lineStagger={0.15}
            as="h2"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {/* Wedding */}
            <motion.div
              className="rounded-lg overflow-hidden shadow-md bg-white"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] as any }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative h-64">
                <Image
                  src="/images/shop/gifting/wedding-gifting.png"
                  alt="Wedding gifts"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl mb-4">Weddings</h3>
                <p className="text-gray-700 mb-6">
                  A memorable keepsake for your guests. Curate scents that match
                  your wedding's elegance.
                </p>
              </div>
            </motion.div>

            {/* Festive Hampers */}
            <motion.div
              className="rounded-lg overflow-hidden shadow-md bg-white"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as any }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative h-64">
                <Image
                  src="/images/shop/gifting/festive-gifting.png"
                  alt="Festive hampers"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl mb-4">Festive Hampers</h3>
                <p className="text-gray-700 mb-6">
                  Make your Christmas hampers stand out with luxurious fragrance
                  additions—perfectly sized, irresistibly packaged.
                </p>
              </div>
            </motion.div>

            {/* Corporate Events */}
            <motion.div
              className="rounded-lg overflow-hidden shadow-md bg-white"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as any }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative h-64">
                <Image
                  src="/images/shop/gifting/corporate-gifting.png"
                  alt="Corporate gifts"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl mb-4">Corporate Events</h3>
                <p className="text-gray-700 mb-6">
                  Show appreciation with sophisticated, stylish scents. Tailored
                  selections available.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <motion.a
              href="#customization-form"
              className="px-8 py-3 bg-[#a0001e] text-white font-medium rounded inline-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as any }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{
                ...buttonHover,
                y: -2,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={buttonTap}
            >
              Customize Your Order
            </motion.a>
          </div>
        </div>
      </section>

      {/* Gifting Customization Form */}
      <section id="customization-form" className="py-16 md:py-24 bg-[#f8f8f8]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedLines
              lines={["Let's Personalize Your Order"]}
              className="font-serif text-3xl md:text-4xl text-center mb-8"
              delay={0.2}
              duration={0.7}
              lineStagger={0.15}
              as="h2"
            />

            <motion.form
              onSubmit={handleSubmit}
              className="bg-white p-6 md:p-10 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="fullName"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#a0001e]`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#a0001e]`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="phone">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#a0001e]`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Gifting Occasion */}
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="occasion"
                  >
                    Gifting Occasion *
                  </label>
                  <select
                    id="occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.occasion ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#a0001e]`}
                  >
                    <option value="">Select an occasion</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Christmas">Christmas</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.occasion && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.occasion}
                    </p>
                  )}
                </div>

                {/* Preferred Delivery Date */}
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="deliveryDate"
                  >
                    Preferred Delivery Date
                  </label>
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    min={today}
                    className={`w-full px-4 py-2 border ${
                      errors.deliveryDate ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#a0001e]`}
                  />
                  {errors.deliveryDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.deliveryDate}
                    </p>
                  )}
                </div>

                {/* Quantity Needed */}
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="quantity"
                  >
                    Quantity Needed
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. number of guests or units"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a0001e]"
                  />
                </div>

                {/* Budget Range */}
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="budgetRange"
                  >
                    Budget Range per piece
                  </label>
                  <select
                    id="budgetRange"
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a0001e]"
                  >
                    <option value="">Select a budget range</option>
                    <option value="₦15,000 – ₦25,000">₦15,000 – ₦25,000</option>
                    <option value="₦26,000 – ₦40,000">₦26,000 – ₦40,000</option>
                    <option value="₦41,000 – ₦60,000">₦41,000 – ₦60,000</option>
                    <option value="₦61,000 – ₦100,000">
                      ₦61,000 – ₦100,000
                    </option>
                    <option value="₦101,000 – ₦150,000">
                      ₦101,000 – ₦150,000
                    </option>
                    <option value="₦151,000 – ₦200,000">
                      ₦151,000 – ₦200,000
                    </option>
                  </select>
                </div>

                {/* Preferred Fragrance Tier */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">
                    Preferred Fragrance Tier
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="prime"
                        checked={formData.fragranceTier.prime}
                        onChange={handleCheckboxChange}
                        className="form-checkbox text-[#a0001e] h-5 w-5"
                      />
                      <span className="ml-2">Prime</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="premium"
                        checked={formData.fragranceTier.premium}
                        onChange={handleCheckboxChange}
                        className="form-checkbox text-[#a0001e] h-5 w-5"
                      />
                      <span className="ml-2">Premium</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="mixOfBoth"
                        checked={formData.fragranceTier.mixOfBoth}
                        onChange={handleCheckboxChange}
                        className="form-checkbox text-[#a0001e] h-5 w-5"
                      />
                      <span className="ml-2">Mix of Both</span>
                    </label>
                  </div>
                </div>

                {/* Personal Notes */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2" htmlFor="notes">
                    Add Personal Notes or Customization Requests
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a0001e]"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 text-center">
                {isSubmitted ? (
                  <div className="text-center">
                    <div className="mb-6">
                      <svg
                        className="mx-auto h-16 w-16 text-[#a0001e]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-serif mb-4">Thank You!</h3>
                    <p className="text-gray-700 mb-6">
                      Your gifting inquiry has been received. Our concierge team will be in touch within 24-72 hours to discuss your requirements.
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-[#a0001e] text-white font-medium rounded hover:bg-[#8b0000] transition-colors ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </button>
                )}
                <p className="text-gray-600 text-sm mt-4">
                  Our concierge team will respond within 24-72 hours to help
                  finalize your gifting experience.
                </p>
              </div>
            </motion.form>
          </div>
        </div>
      </section>
    </>
  );
}
