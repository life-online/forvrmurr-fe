"use client";

import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ForgotPassword() {
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email);
      setEmail("");
    } catch (err: any) {
      // Toast is handled by context
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email address to receive password reset instructions"
    >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#8b0000] hover:bg-[#6b0000] text-white py-3 px-4 rounded-md transition duration-200 flex justify-center items-center"
            >
              {isSubmitting && (
                <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              )}
              Send Reset Instructions
            </button>
          </form>
    </AuthLayout>
  );
}
