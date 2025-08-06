"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import { useToast } from "@/context/ToastContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  acceptTerms: boolean;
  role?: string; // default to 'customer'
}

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    acceptTerms: false,
    role: "customer",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setDisplayMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  // Individual field validation functions
  const validateField = (name: string, value: string | boolean): string | null => {
    switch (name) {
      case 'firstName':
        return !value ? "First name is required" : null;
      
      case 'lastName':
        return !value ? "Last name is required" : null;
      
      case 'email':
        if (!value) return "Email is required";
        return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value as string) 
          ? "Please enter a valid email address" 
          : null;
      
      case 'password':
        if (!value) return "Password is required";
        if ((value as string).length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])/.test(value as string)) return "Password must contain at least one lowercase letter";
        if (!/(?=.*[A-Z])/.test(value as string)) return "Password must contain at least one uppercase letter";
        if (!/((?=.*\d)|(?=.*\W+))(?![.\n])/.test(value as string)) {
          return "Password must contain at least one number or special character";
        }
        return null;
      
      case 'confirmPassword':
        if (!value) return "Please confirm your password";
        return value !== formData.password ? "Passwords do not match" : null;
      
      case 'phoneNumber':
        // If empty, it's optional so return null (no error)
        if (!value || !(value as string).trim()) return null;
        
        try {
          // Try to parse the phone number
          const phoneNumber = parsePhoneNumberFromString(value as string);
          
          // Check if the phone number is valid
          if (!phoneNumber || !phoneNumber.isValid()) {
            return "Please enter a valid international phone number with country code (e.g., +12125552368)";
          }
          return null;
        } catch (error) {
          return "Please enter a valid international phone number with country code (e.g., +12125552368)";
        }
      
      case 'acceptTerms':
        return !value ? "You must accept the terms and conditions" : null;
      
      default:
        return null;
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle field blur for real-time validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    
    const error = validateField(name, fieldValue);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const fieldNames: (keyof RegisterFormData)[] = [
      'firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phoneNumber', 'acceptTerms'
    ];

    // Validate all fields using our validateField function
    fieldNames.forEach(fieldName => {
      const fieldValue = formData[fieldName];
      // Make sure we're passing a valid value type to validateField
      const error = validateField(fieldName, fieldValue || ''); // Convert undefined to empty string
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform validation
    if (!validateForm()) {
      return;
    }

    // Create registration payload with the specific format required by the API
    const registrationData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      // Always include phoneNumber as required by RegisterData interface
      phoneNumber: formData.phoneNumber.trim() || "+", // Empty international format if not provided
    };

    try {
      setIsSubmitting(true);
      await register(registrationData);
      success(
        "Account created successfully! Please check your email to verify your account."
      );

      const redirectUrl = searchParams.get("redirect");
      if (redirectUrl) {
        router.push(decodeURIComponent(redirectUrl));
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Registration component error:", err);
      setErrors(prev => ({
        ...prev,
        general: err?.message || "Registration failed. Please try again."
      }));
      error("Registration failed. Please check your information and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the ForvrMurr community and discover your signature scent"
    >
      {/* Display message from query param */}
      {displayMessage && (
        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6"
          role="alert"
        >
          <p className="font-bold">Heads up!</p>
          <p>{displayMessage}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent`}
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent`}
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Phone Number Field */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            className={`w-full px-4 py-3 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent`}
            placeholder="+12125552368 (optional, international format)"
            value={formData.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
          )}
        </div>

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
            Password
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
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
          <p className="mt-6 text-center text-sm text-gray-600">
            Password must be at least 8 characters, include 1 uppercase letter,
            1 lowercase letter, and 1 number or special character
          </p>
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
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              className={`h-4 w-4 accent-[#8b0000] ${errors.acceptTerms ? "border-red-500" : "border-gray-300"}`}
              checked={formData.acceptTerms}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="acceptTerms" className="text-gray-700">
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-[#8b0000] hover:text-[#cf0000] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-[#8b0000] hover:text-[#cf0000] hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
            {errors.acceptTerms && (
              <p className="mt-1 text-xs text-red-500">{errors.acceptTerms}</p>
            )}
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
            Create Account
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href={`/auth/login${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : ''}`}
            className="text-[#8b0000] hover:text-[#cf0000] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
