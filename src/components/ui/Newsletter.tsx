"use client";

import Link from "next/link";
import React from "react";
import Button from "./Button";

const Newsletter: React.FC = () => {
  return (
    <section className="w-full bg-[#faf5eb] pt-12 pb-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-xl md:text-2xl  text-[#8B0000] font-serif mb-2">
          YOUR MONTHLY FIXES
        </h2>
        <h3 className="text-2xl md:text-3xl font-serif mb-6">
          Subscribe & Obsess Monthly
        </h3>

        <p className=" font-medium mb-8 max-w-2xl mx-auto">
          Enjoy a new scent obsession every month. Delivered in our 8ml bottle.
          Fits perfectly into your travel case.
        </p>
        <p className=" text-[#8B0000] font-bold mb-8 max-w-2xl mx-auto">
          Get a FREE Forvr Murr Travel Case with your first month when you
          subscribe.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-md md:max-w-lg mx-auto">
          <Link href="/coming-soon" className="w-full">
            <Button className="w-full text-nowrap text-sm">
              Prime Plan: ₦20,000 / month
            </Button>
          </Link>
          <Link href="/coming-soon" className="w-full">
            <Button variant="outline" className="w-full text-nowrap text-sm">
              Premium Plan: ₦60,000 / month
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
