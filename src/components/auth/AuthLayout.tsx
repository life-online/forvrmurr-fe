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
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image 
              src="/images/logo/logo_black.png" 
              alt="ForvrMurr Logo" 
              width={180} 
              height={60}
              className="mx-auto invert" /* Invert to make black logo show on dark background */
            />
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-zinc-900 p-8 rounded-lg shadow-xl w-full border border-zinc-800">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif text-white mb-2">{title}</h2>
            {subtitle && <p className="text-zinc-400">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
