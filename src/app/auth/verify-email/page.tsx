"use client";

import React, { Suspense } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import VerifyEmailContent from './VerifyEmailContent';

const VerifyEmailLoadingFallback = () => (
  <div style={{ padding: '20px', textAlign: 'center', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <p>Loading verification...</p>
  </div>
);

export default function VerifyEmailPage() {
  return (
    <AuthLayout 
      title="Email Verification"
      subtitle="We are verifying your email address. Please wait a moment."
    >
      <Suspense fallback={<VerifyEmailLoadingFallback />}>
        <VerifyEmailContent />
      </Suspense>
    </AuthLayout>
  );
}
