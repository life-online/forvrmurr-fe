"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();
  const { error } = useToast();

  useEffect(() => {
    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";
    if (!email || !token) {
      error("Invalid verification link.");
      router.push("/");
      return;
    }
    verifyEmail(email, token).catch(() => {
      // Error toast handled in context, fallback here
      router.push("/");
    });
    // eslint-disable-next-line
  }, []);

  return null;
}
