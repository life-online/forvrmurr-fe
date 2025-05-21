"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();
  const { error, success } = useToast(); // Added success for potential positive feedback

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      error("Invalid or missing email/token in verification link.");
      router.push("/");
      return;
    }

    const handleVerification = async () => {
      try {
        await verifyEmail(email, token);
        // Success toast is already handled in AuthContext for verifyEmail
        // success("Email verified successfully! You will be redirected."); 
        router.push("/auth/login?verified=true"); // Redirect to login or dashboard
      } catch (err) {
        // Error toast is handled in AuthContext
        // error("Email verification failed. Please try again or contact support.");
        router.push("/"); // Fallback redirect
      }
    };

    handleVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, searchParams, verifyEmail, error, success]); // Added success to dependencies

  // This component can return a loading indicator or null as it handles redirection
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Verifying your email, please wait...</p>
      {/* You could add a spinner here */}
    </div>
  );
}
