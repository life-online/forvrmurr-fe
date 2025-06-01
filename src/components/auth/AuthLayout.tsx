"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f5f2] px-4 md:py-20 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="flex justify-center">
            <Image 
              src="/images/logo/logo_black.png" 
              alt="ForvrMurr Logo" 
              width={160} 
              height={60} 
              className="h-auto" 
              priority
            />
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif text-[#8b0000] mb-2">{title}</h2>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
