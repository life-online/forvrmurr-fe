"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiMapPin,
  FiCopy,
  FiCreditCard,
} from "react-icons/fi";
import ProfileLayout from "@/components/profile/ProfileLayout";
import orderService, { Order, OrderStatus } from "@/services/orders";
import cartService from "@/services/cart";
import { toastService } from "@/services/toast";
import { useCart } from "@/context/CartContext";

const statusConfig: Record<
  OrderStatus,
  { color: string; icon: any; label: string }
> = {
  pending: {
    color: "bg-[#f0ebe5] text-[#8B0000]",
    icon: FiClock,
    label: "Pending",
  },
  payment_processing: {
    color: "bg-[#f0ebe5] text-[#8B0000]",
    icon: FiClock,
    label: "Processing Payment",
  },
  paid: { color: "bg-green-100 text-green-800", icon: FiCheck, label: "Paid" },
  processing: {
    color: "bg-[#f0ebe5] text-[#8B0000]",
    icon: FiPackage,
    label: "Processing",
  },
  shipped: {
    color: "bg-[#f0ebe5] text-[#8B0000]",
    icon: FiTruck,
    label: "Shipped",
  },
  delivered: {
    color: "bg-green-100 text-green-800",
    icon: FiCheck,
    label: "Delivered",
  },
  cancelled: {
    color: "bg-gray-100 text-gray-600",
    icon: FiClock,
    label: "Cancelled",
  },
  refunded: {
    color: "bg-gray-100 text-gray-600",
    icon: FiClock,
    label: "Refunded",
  },
  sync_failed: {
    color: "bg-gray-100 text-gray-600",
    icon: FiClock,
    label: "Sync Failed",
  },
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { refreshCart } = useCart();
  const orderNumber = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [payNowLoading, setPayNowLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await orderService.getOrderByNumber(orderNumber);
        setOrder(orderData);
      } catch (err: any) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order details");
        toastService.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const getStatusIcon = (status: OrderStatus) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;
    return <IconComponent size={16} />;
  };

  const getTrackingSteps = (status: OrderStatus) => {
    const steps = [
      {
        key: "pending",
        label: "Order Placed",
        completed: [
          "pending",
          "payment_processing",
          "paid",
          "processing",
          "shipped",
          "delivered",
        ].includes(status),
      },
      {
        key: "paid",
        label: "Payment Confirmed",
        completed: ["paid", "processing", "shipped", "delivered"].includes(
          status
        ),
      },
      {
        key: "processing",
        label: "Processing",
        completed: ["processing", "shipped", "delivered"].includes(status),
      },
      {
        key: "shipped",
        label: "Shipped",
        completed: ["shipped", "delivered"].includes(status),
      },
      {
        key: "delivered",
        label: "Delivered",
        completed: status === "delivered",
      },
    ];

    return steps;
  };

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </ProfileLayout>
    );
  }

  if (error || !order) {
    return (
      <ProfileLayout>
        <div className="text-center py-12">
          <h3 className="font-serif text-xl mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link
            href="/profile/orders"
            className="inline-block bg-[#8b0000] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all"
          >
            Back to Orders
          </Link>
        </div>
      </ProfileLayout>
    );
  }

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount);
    return `₦${numAmount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateExpectedDelivery = (
    orderDate: string,
    shippingMethod?: any
  ) => {
    const orderDateTime = new Date(orderDate);
    let deliveryDays = 5; // Default 5 days

    if (shippingMethod?.name) {
      const name = shippingMethod.name.toLowerCase();
      if (name.includes("2-4")) {
        deliveryDays = 4;
      } else if (name.includes("3-5")) {
        deliveryDays = 5;
      } else if (name.includes("1-2")) {
        deliveryDays = 2;
      } else if (name.includes("same day") || name.includes("express")) {
        deliveryDays = 1;
      }
    }

    const expectedDate = new Date(orderDateTime);
    expectedDate.setDate(expectedDate.getDate() + deliveryDays);

    return expectedDate;
  };

  const trackingSteps = getTrackingSteps(order.status);
  const expectedDeliveryDate = calculateExpectedDelivery(
    order.createdAt,
    order.shippingMethod
  );
  const generateInitials = (firstName?: string, lastName?: string): string => {
    let initials = "";
    if (firstName) {
      initials = initials + firstName[0].toUpperCase();
    }
    if (lastName) {
      initials = initials + lastName[0].toUpperCase();
    }
    return initials;
  };

  const copyPaymentReference = () => {
    if (order?.paymentReference) {
      navigator.clipboard.writeText(order.paymentReference);
      setCopied(true);
      toastService.success("Payment reference copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReorder = async () => {
    if (!order) return;

    try {
      setReorderLoading(true);
      toastService.info("Processing your reorder...");

      const response = await orderService.reorderOrder(order.id);

      if (response.success) {
        toastService.success(
          response.message || "Items added to cart successfully!"
        );

        // Refresh cart to get updated items
        await refreshCart();

        // Initiate checkout process
        await cartService.initiateCheckout();

        toastService.success("Proceeding to checkout!");
        router.push("/shop/checkout");
      } else {
        toastService.error(response.message || "Failed to reorder items");
      }
    } catch (error: any) {
      console.error("Reorder failed:", error);

      if (error.message?.includes("out of stock")) {
        toastService.error("Some items are currently out of stock");
      } else if (error.message?.includes("authentication")) {
        toastService.error("Please log in to reorder items");
      } else {
        toastService.error("Failed to reorder items. Please try again.");
      }
    } finally {
      setReorderLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setCancelLoading(true);
      toastService.info("Cancelling your order...");

      await orderService.cancelOrder(order.id);

      toastService.success("Order cancelled successfully");

      // Refresh order data to show updated status
      const updatedOrder = await orderService.getOrderByNumber(orderNumber);
      setOrder(updatedOrder);

      setShowCancelModal(false);
    } catch (error: any) {
      console.error("Cancel order failed:", error);

      // Show specific error message from API if available
      const errorMessage = error.response?.data?.message || error.message || "Failed to cancel order. Please try again.";
      toastService.error(errorMessage);

      setShowCancelModal(false);
    } finally {
      setCancelLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!order) return;

    try {
      setPayNowLoading(true);
      toastService.info("Processing your payment...");

      // Step 1: Clear existing cart
      await cartService.clearCart();

      // Step 2: Add each order item to cart
      for (const item of order.items) {
        await cartService.addItemToCart({
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      // Step 3: Refresh cart to get updated items
      await refreshCart();

      // Step 4: Initiate checkout process
      await cartService.initiateCheckout();

      toastService.success("Proceeding to checkout!");
      router.push("/shop/checkout");
    } catch (error: any) {
      console.error("Pay now failed:", error);

      // Show specific error message from API if available
      const errorMessage = error.response?.data?.message || error.message || "Failed to process payment. Please try again.";
      toastService.error(errorMessage);
    } finally {
      setPayNowLoading(false);
    }
  };

  return (
    <ProfileLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Button */}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-[#8B0000] text-white px-3 py-4 my-auto rounded-lg hover:bg-[#a0001e] transition-colors h-full"
            >
              <FiArrowLeft size={16} />
            </button>
            <div className="pb-4">
              <h1 className="text-2xl font-serif text-black mb-2">
                Order Details
              </h1>
              <p className="text-gray-600">
                View your order details and manage your order
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === "delivered"
                ? "bg-green-100 text-green-800"
                : order.status === "paid"
                ? "bg-green-100 text-green-800"
                : "bg-[#f0ebe5] text-[#8B0000]"
            }`}
          >
            {order.status === "delivered"
              ? "Delivered"
              : statusConfig[order.status].label}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {order.status === "paid" && (
            <>
              <button
                onClick={handleReorder}
                disabled={reorderLoading}
                className="w-full border-2 border-[#8B0000] text-[#8B0000] py-3 px-6 rounded-lg hover:bg-[#8B0000] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reorderLoading ? "Processing..." : "Reorder Items"}
              </button>
              <Link
                href="/about/contact"
                className="w-full bg-gray-100 text-black py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Contact Support
              </Link>
            </>
          )}
          {order.status === "pending" && (
            <>
              <button
                onClick={handlePayNow}
                disabled={payNowLoading}
                className="cursor-pointer w-full border-2 border-[#8B0000] text-[#8B0000] py-3 px-6 rounded-lg hover:bg-[#8B0000] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {payNowLoading ? "Processing..." : "Pay Now"}
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="cursor-pointer w-full bg-gray-100 text-black py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Cancel Order
              </button>
            </>
          )}
        </div>

        {/* Shipping Progress Section */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Order Number */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FiPackage className="text-[#8B0000]" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold text-black">#{order.orderNumber}</p>
              </div>
            </div>

            {/* Order Date */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FiClock className="text-[#8B0000]" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-black">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Estimated Arrival */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FiTruck className="text-[#8B0000]" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Expected Arrival</p>
                <p className="font-semibold text-black">
                  {formatDate(expectedDeliveryDate.toISOString())}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline and Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-4">
              <h4 className="font-semibold text-black">Delvery Method</h4>
              {order.shippingMethod && (
                <div className="bg-gray-100 p-6 rounded-lg">
                  <p className="font-sm text-gray-600">
                    {order.shippingMethod.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingMethod.description}
                  </p>
                  <p className="text-sm font-medium text-[#8B0000] mt-1">
                    {formatCurrency(order.shippingMethod.amount.toString())}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-black">Shipment From</h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#8B0000] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">FM</span>
                </div>
                <div>
                  <p className="font-medium">ForvrMurr</p>
                  <p className="text-gray-600">Lagos, Nigeria</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-black">Shipment To</h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#8B0000] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {generateInitials(
                      order.shippingAddress.firstName,
                      order.shippingAddress.lastName
                    )}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.state},{" "}
                    {order.shippingAddress.country.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Items Section */}
            <div className="bg-white rounded-lg border border-gray-100 p-8">
              <h3 className="text-lg font-semibold text-black flex items-center gap-2 mb-6">
                Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={
                          item.productImageUrl || "/images/hero/hero_image.png"
                        }
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-black">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        SKU: {item.productSku}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-black">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Addresses Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <FiTruck size={18} />
                  Shipping Address
                </h3>
                <div className="text-sm space-y-2">
                  <p className="font-medium text-black">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.streetAddress}
                  </p>
                  {order.shippingAddress.apartment && (
                    <p className="text-gray-600">
                      {order.shippingAddress.apartment}
                    </p>
                  )}
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.country.name}
                  </p>
                  <p className="font-medium text-black mt-3">
                    {order.shippingAddress.phoneNumber}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.email}</p>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <FiCreditCard size={18} />
                  Billing Address
                </h3>
                <div className="text-sm space-y-2">
                  <p className="font-medium text-black">
                    {order.billingAddress.firstName}{" "}
                    {order.billingAddress.lastName}
                  </p>
                  <p className="text-gray-600">
                    {order.billingAddress.streetAddress}
                  </p>
                  {order.billingAddress.apartment && (
                    <p className="text-gray-600">
                      {order.billingAddress.apartment}
                    </p>
                  )}
                  <p className="text-gray-600">
                    {order.billingAddress.city}, {order.billingAddress.state}{" "}
                    {order.billingAddress.postalCode}
                  </p>
                  <p className="text-gray-600">
                    {order.billingAddress.country.name}
                  </p>
                  <p className="font-medium text-black mt-3">
                    {order.billingAddress.phoneNumber}
                  </p>
                  <p className="text-gray-600">{order.billingAddress.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  Order Summary
                </h3>
              </div>

              <div className="space-y-3 mb-6">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-600">
                      {item.productName} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(
                        (parseFloat(item.price) * item.quantity).toString()
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {formatCurrency(order.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {order.taxTitle} (
                    {(parseFloat(order.taxRate) * 100).toFixed(1)}%)
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(order.taxAmount)}
                  </span>
                </div>
                {parseFloat(order.discount) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-black">Total</span>
                    <span className="text-lg font-bold text-black">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  {formatCurrency(order.total)} ({order.items.length} items)
                </p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-black mb-4">
                Payment Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-medium capitalize ${
                      order.paymentStatus === "successful"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                {order.paymentReference && (
                  <div>
                    <span className="text-gray-600 block mb-1">Reference</span>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="font-mono text-xs flex-1">
                        {order.paymentReference}
                      </span>
                      <button
                        onClick={copyPaymentReference}
                        className={`${
                          copied
                            ? "text-green-600"
                            : "text-[#8B0000] hover:text-[#a0001e]"
                        } transition-colors cursor-pointer`}
                      >
                        {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-[#000000b0] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-serif text-black mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be
              undone. 
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
                className="flex-1 bg-gray-100 text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="flex-1 bg-[#8B0000] text-white py-2 px-4 rounded-lg hover:bg-[#a0001e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelLoading ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfileLayout>
  );
}
