"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext"; // Assuming toast might be used directly or for more specific messages
import { FiEye, FiEyeOff } from "react-icons/fi";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  token: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  token?: string;
  general?: string;
}

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Keep token check here as it's from URL
  const { resetPassword, isLoading } = useAuth();
  const { error } = useToast();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    token: searchParams.get("token") || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'email':
        if (!value.trim()) return "Email is required";
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return "Please enter a valid email address";
        }
        return null;
      
      case 'token':
        return !value.trim() ? "Reset token is required" : null;
      
      case 'password':
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/((?=.*\d)|(?=.*\W+))(?![.\n])/.test(value)) {
          return "Password must contain at least one number or special character";
        }
        return null;
      
      case 'confirmPassword':
        if (!value) return "Please confirm your password";
        return value !== formData.password ? "Passwords do not match" : null;
      
      default:
        return null;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const fieldNames = ['email', 'token', 'password', 'confirmPassword'];

    fieldNames.forEach(fieldName => {
      const fieldValue = formData[fieldName as keyof FormData];
      const error = validateField(fieldName, fieldValue);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (field: keyof FormErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name as keyof FormErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Reset errors
    setErrors({});

    // Check if token is available
    if (!formData.token) {
      setErrors({ general: "No reset token provided. Please use the link from the email." });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(formData.token, formData.email, formData.password);
      // Success is handled by AuthContext
      router.push("/auth/login?message=" + encodeURIComponent("Password reset successful. Please log in with your new password."));
    } catch (err: any) {
      console.error("Reset password error:", err);
      setErrors({
        general:
          err?.message || "Failed to reset password. Please try again later.",
      });
      error("Failed to reset password. Please try again.");
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
          required
          className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent`}
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent pr-10`}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isSubmitting}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent pr-10`}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
          )}
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            disabled={isSubmitting || isLoading}
          >
            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
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
      <p className="mt-4 text-center text-xs text-gray-600">
        Password must be at least 8 characters, include 1 uppercase letter,
        1 lowercase letter, and 1 number or special character
      </p>
    </form>
  );
}
