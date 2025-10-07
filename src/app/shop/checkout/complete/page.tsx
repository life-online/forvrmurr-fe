"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";

import { paymentsService } from "@/services/payments";
import { useCart } from "@/context/CartContext";
import { authService } from "@/services/auth";

const PaymentCompletePage: React.FC = () => {
  const router = useRouter();
  const { clearCart } = useCart();

  const searchParams = useSearchParams();
  const { success, error } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");
    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference found.");
      error("Payment verification failed: No reference found.");
      return;
    }
    paymentsService
      .verifyPayment(reference)
      .then(async (data) => {
        if (data.status === "successful") {
          setStatus("success");
          clearCart();

          // Refresh user profile after successful payment to get latest details
          try {
            console.log("Payment successful - refreshing user profile...");
            const updatedUser = await authService.refreshUserProfile();
            console.log("User profile refreshed successfully:", updatedUser);
          } catch (error) {
            console.error("Failed to refresh user profile after payment:", error);
            // Don't block the success flow if profile refresh fails
          }

          setMessage(
            "Your payment was successful! Your order is now being processed."
          );
          success(
            "Payment successful! Redirecting to your order details..."
          );
          setTimeout(() => {
            if (data.order?.orderNumber) {
              router.push(`/profile/orders/${data.order.orderNumber}`);
            } else {
              router.push("/profile/orders");
            }
          }, 3000);
        } else {
          setStatus("failed");
          clearCart();
          setMessage(
            "Payment verification failed. Please try again or contact support."
          );
          error("Payment failed or not completed.");
        }
      })
      .catch((e) => {
        setStatus("failed");
        setMessage(
          "Payment verification failed. Please try again or contact support."
        );
        error("Payment verification failed.");
      });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f5f2] px-4">
      {status === "loading" && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#a0001e] mb-6" />
          <h1 className="text-2xl font-serif mb-2">Verifying Payment...</h1>
          <p className="text-gray-600">
            Please wait while we confirm your payment.
          </p>
        </div>
      )}
      {status === "success" && (
        <div className="flex flex-col items-center">
          <div className="rounded-full h-16 w-16 bg-green-100 flex items-center justify-center mb-6">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-serif mb-2">Payment Successful!</h1>
          <p className="text-gray-700 mb-4">{message}</p>
          <p className="text-gray-500 text-sm">
            You will be redirected to your order details shortly.
          </p>
        </div>
      )}
      {status === "failed" && (
        <div className="flex flex-col items-center">
          <div className="rounded-full h-16 w-16 bg-red-100 flex items-center justify-center mb-6">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-serif mb-2">Payment Failed</h1>
          <p className="text-gray-700 mb-4">{message}</p>
          <button
            className="mt-2 px-6 py-2 bg-[#a0001e] text-white rounded hover:bg-[#8a0019]"
            onClick={() => router.push("/shop")}
          >
            Return to Shop
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentCompletePage;
