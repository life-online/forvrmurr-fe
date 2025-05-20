"use client";

import React, { Suspense } from 'react';
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordContent from './ResetPasswordContent';

// Basic loading component for Suspense fallback
const LoadingResetPasswordForm: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="h-12 bg-gray-300 rounded w-full"></div>
    </div>
  );
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Enter your email and new password to reset your account. Your token will be read from the URL."
    >
      <Suspense fallback={<LoadingResetPasswordForm />}>
        <ResetPasswordContent />
      </Suspense>
    </AuthLayout>
  );
}
