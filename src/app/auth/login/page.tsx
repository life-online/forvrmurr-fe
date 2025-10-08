'use client'

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import AuthLayout from "@/components/auth/AuthLayout";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { trackUserLogin } from "@/utils/analytics";

interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

interface FormErrors {
  emailOrPhone?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrPhone: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  // Validate individual field
  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'emailOrPhone':
        if (!value.trim()) return "Email or phone number is required";
        
        // Check if it's an email
        const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
        // Check if it's a phone number (basic validation for international numbers)
        const isPhone = /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''));
        
        if (!isEmail && !isPhone) {
          return "Please enter a valid email address or phone number";
        }
        return null;
      
      case 'password':
        return !value ? "Password is required" : null;
      
      default:
        return null;
    }
  };

  // Handle field blur for real-time validation
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
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate emailOrPhone and password
    const emailOrPhoneError = validateField('emailOrPhone', formData.emailOrPhone);
    const passwordError = validateField('password', formData.password);
    
    if (emailOrPhoneError) newErrors.emailOrPhone = emailOrPhoneError;
    if (passwordError) newErrors.password = passwordError;

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
      const result = await login(formData);

      // Track successful login
      trackUserLogin('email', result?.user?.id || result?.userId);

      // Check for redirect URL and redirect back to checkout if present
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(decodeURIComponent(redirectUrl));
      } else {
        router.push('/');
      }
    } catch (err: any) {
      // Check for guest user login error
      if (err?.message?.includes("guest account")) {
        setErrors(prev => ({
          ...prev,
          general: "This appears to be a guest account. Please register to create a permanent account."
        }));
        error("This appears to be a guest account. Please register to create a permanent account.");
      } else {
        // Set a general error message for other errors
        setErrors(prev => ({
          ...prev,
          general: err?.message || "Login failed. Please check your credentials."
        }));
        error("Login failed. Please check your credentials.");
      }
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
        {errors.general && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            <p>{errors.general}</p>
            {errors.general.includes("guest account") && (
              <p className="mt-2">
                <Link 
                  href={`/auth/register${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : ''}`}
                  className="font-medium text-[#8b0000] hover:text-[#cf0000] underline"
                >
                  Register now
                </Link> to create your account.
              </p>
            )}
          </div>
        )}
        <div>
          <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1">
            Email or Phone Number
          </label>
          <input
            id="emailOrPhone"
            name="emailOrPhone"
            type="text"
            required
            className={`w-full px-4 py-3 border ${errors.emailOrPhone ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent`}
            placeholder="your@email.com or +1234567890"
            value={formData.emailOrPhone}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.emailOrPhone && (
            <p className="mt-1 text-xs text-red-500">{errors.emailOrPhone}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className={`w-full px-4 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b0000] focus:border-transparent pr-10`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 accent-[#8b0000]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
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
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Or{' '}
        <Link 
          href={`/auth/register${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : ''}`}
          className="font-medium text-[#8b0000] hover:text-[#cf0000]"
        >
          create a new account
        </Link>
      </p>
    </AuthLayout>
  );
}
