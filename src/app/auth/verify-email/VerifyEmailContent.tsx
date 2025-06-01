"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();
  const { error } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const hasAttemptedVerification = useRef(false);

  useEffect(() => {
    // Only attempt verification once
    if (hasAttemptedVerification.current || isVerifying) {
      return;
    }

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      error("Invalid or missing email/token in verification link.");
      router.push("/");
      return;
    }

    const handleVerification = async () => {
      try {
        setIsVerifying(true);
        hasAttemptedVerification.current = true;
        
        await verifyEmail(email, token);
        // Success toast is already handled in AuthContext for verifyEmail
        router.push("/auth/login?verified=true"); // Redirect to login or dashboard
      } catch (err) {
        // Error toast is handled in AuthContext
        router.push("/"); // Fallback redirect
      } finally {
        setIsVerifying(false);
      }
    };

    handleVerification();
    // We only need router and searchParams in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, searchParams]);

  // This component can return a loading indicator or null as it handles redirection
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Verifying your email, please wait...</p>
      {isVerifying && (
        <div className="mt-4 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-[#8b0000]"></div>
        </div>
      )}
    </div>
  );
}
