"use client";

import React from "react";
import Image from "next/image";
import { CartItem } from "@/components/cart/CartOverlay";
import { CartResponseDto } from "@/services/cart";

interface CheckoutSummaryProps {
  cartItems: CartItem[] | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  cart?: CartResponseDto;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  cartItems,
  subtotal,
  shippingCost,
  total,
  cart,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow sticky top-8">
      <h2 className="text-xl font-serif mb-6">Your Order</h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems !== null &&
          cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="h-20 w-20 relative bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.imageUrl || "/images/hero/hero_image.png"}
                  alt={item.name}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.brand}</p>
                <p className="text-sm text-gray-700">{item.name}</p>
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-gray-600">
                    {item.quantity} × ₦{Number(item.price).toLocaleString()}
                  </p>
                  <p className="font-medium">
                    ₦{(Number(item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Delivery Progress Bar */}
      {/* {subtotal < 49000 && (
        <div className="bg-[#faf0e2] p-4 rounded mb-6">
          <p className="text-[#8b0000] font-medium mb-1">
            {subtotal < 49000 ? "Almost there..." : "Congratulations!"}
          </p>
          <p className="text-[#8b0000] text-sm mb-2">
            {subtotal < 49000
              ? `You are ₦${(
                  49000 - subtotal
                ).toLocaleString()} away from free delivery`
              : "You qualify for free delivery!"}
          </p>
          <div className="h-2 bg-[#f8e2c8] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-300"
              style={{ width: `${Math.min(100, (subtotal / 49000) * 100)}%` }}
            />
          </div>
        </div>
      )} */}

      {/* Order Summary */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>
            {shippingCost === 0 ? "Free" : `₦${shippingCost.toLocaleString()}`}
          </span>
        </div>
        {cart &&
          cart.appliedDiscounts
            .filter((item) => item.title != "FM-FREESHIPPING40")
            .map((discount, index) => (
              <div className="flex justify-between text-sm" key={index}>
                <div className="">
                  <span className="text-gray-600">{discount.title}</span>
                  {/* <span className="text-gray-600 text-xs">
                    {discount.description}
                  </span> */}
                </div>
                <span>{`₦${discount.amountDeducted.toLocaleString()}`}</span>
              </div>
            ))}
        {/* <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span>₦0.00</span>
        </div> */}
        <div className="border-t border-gray-200 pt-3 flex justify-between font-medium text-base">
          <span>Total</span>
          <span className="text-[#a0001e]">₦{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Secure payment note */}
      <div className="mt-6 text-center">
        <div className="flex justify-center items-center gap-2 text-sm text-gray-600 mb-2">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Secure payment</span>
        </div>
        <p className="text-xs text-gray-500">
          All data is encrypted. Your card number is never stored on our
          servers.
        </p>
      </div>
    </div>
  );
};

export default CheckoutSummary;
