"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { trackUserLogout } from "@/utils/analytics";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { success } = useToast();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Track logout before actually logging out
        trackUserLogout();

        await logout();
        success("You have been successfully logged out");
        router.push("/");
      } catch (err) {
        // Error handling is done in the AuthContext
        router.push("/");
      }
    };

    performLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Return null as we're redirecting immediately
  return null;
}
