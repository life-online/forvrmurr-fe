'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(formData);
      router.push('/');
    } catch (err) {
      // Optionally log error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Login" 
      subtitle="Welcome back to ForvrMurr"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent placeholder-zinc-500"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent placeholder-zinc-500"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 accent-[#8b0000] bg-zinc-800 border-zinc-700"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <Link href="/auth/forgot-password" className="text-[#8b0000] hover:underline hover:text-[#cf0000]">
              Forgot your password?
            </Link>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#8b0000] hover:bg-[#6b0000] text-white py-3 px-4 rounded-md transition duration-200 flex justify-center items-center"
          >
            {isSubmitting && (
              <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            )}
            Sign In
          </button>
        </div>
      </form>
      
      <p className="mt-6 text-center text-sm text-zinc-400">
        Or{' '}
        <Link href="/auth/register" className="font-medium text-[#8b0000] hover:text-[#cf0000]">
          create a new account
        </Link>
      </p>
    </AuthLayout>
  );
}
