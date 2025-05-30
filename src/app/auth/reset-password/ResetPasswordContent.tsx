"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext"; // Assuming toast might be used directly or for more specific messages

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Keep token check here as it's from URL
  const { resetPassword, isLoading } = useAuth();
  const { error } = useToast();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      error(
        "Invalid or missing password reset token. Please request a new link."
      );
      router.push("/auth/forgot-password"); // Redirect to forgot password if token is bad
      return;
    }
    if (newPassword !== confirmPassword) {
      error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      error("Password must be at least 8 characters long.");
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(token, email, newPassword);
      // success("Password reset successfully! Please log in with your new password.");
      router.push("/auth/login");
    } catch (err: any) {
      // Error toast is handled by AuthContext, but can add specific ones if needed
      // error(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    // This case should ideally be handled by redirecting in useEffect or on server-side if possible
    // For now, showing a message if token is missing before form renders
    // This could also be a redirect in a useEffect hook if preferred
    return (
      <div className="text-center p-4">
        <p className="text-red-600">Invalid or missing password reset token.</p>
        <p>
          Please{" "}
          <a href="/auth/forgot-password" className="underline">
            request a new password reset link
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting || isLoading}
        />
      </div>
      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
          placeholder="Enter new password (min. 8 characters)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isSubmitting || isLoading}
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting || isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-[#8b0000] hover:bg-[#6b0000] text-white py-3 px-4 rounded-md transition duration-200 flex justify-center items-center disabled:opacity-70"
      >
        {(isSubmitting || isLoading) && (
          <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
        )}
        {isSubmitting || isLoading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
