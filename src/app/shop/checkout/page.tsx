"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AddressForm from "@/components/checkout/AddressForm";
import SavedAddressList from "@/components/checkout/SavedAddressList";
import ShippingMethodsSelector from "@/components/checkout/ShippingMethodsSelector";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import { useCart } from "@/context/CartContext";
import cartService, { CartResponseDto } from "@/services/cart";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import checkoutService, {
  CheckoutFormData,
  ShippingMethod,
  SavedAddress,
  CheckoutResponse,
  PaymentResponse,
} from "@/services/checkout";
import { CartItem } from "@/components/cart/CartOverlay";

const CheckoutPage = () => {
  const { cartItems, itemCount, clearCart, cart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { error, success } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [addingCOupon, setAddingCoupon] = useState(false);
  const [isapplyingCOupon, setIsApplyingCoupon] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [totalAmount, setTotal] = useState<number>(0);
  const [couponRes, setCouponRes] = useState<CartResponseDto>();
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName:
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : "",
    email: user?.email || "",
    phoneNumber: "", // Initialize as empty, user needs to provide it or it comes from saved address
    shippingAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nigeria",
    },
    billingAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nigeria",
    },
    useSameForBilling: true,
    shippingRateId: "",
    notes: "",
    couponCode: "", // Ensure couponCode is always a string
  });

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Fetch shipping methods and saved addresses
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch shipping methods
        // const methods = await checkoutService.getShippingMethods();
        // TODO: Make countryCode dynamic based on selected shipping address country
        const countryCode =
          formData.shippingAddress.country === "Nigeria"
            ? "NG"
            : formData.shippingAddress.country;
        const methods = await checkoutService.getShippingMethods(countryCode); // Pass countryCode
        setShippingMethods(methods);

        if (methods.length > 0) {
          setFormData((prev) => ({ ...prev, shippingRateId: methods[0].id }));
        }

        // Fetch saved addresses if authenticated
        if (isAuthenticated) {
          const addresses = await checkoutService.getSavedAddresses();
          setSavedAddresses(addresses);

          // If there's a default address, pre-fill it
          const defaultAddress = addresses.find((addr) => addr.isDefault);
          if (defaultAddress) {
            setUseSavedAddress(true);
          }
        }
      } catch (err) {
        console.error("Error fetching checkout data:", err);
        error("Failed to load checkout information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    setCouponRes(cart);
    fetchInitialData();
  }, [isAuthenticated, error]);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (itemCount === 0) {
      router.push("/shop");
    }
  }, [itemCount, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (name === "useSameForBilling") {
      const isNowSameAsShipping =
        checked === undefined ? formData.useSameForBilling : checked;
      setFormData((prev) => ({
        ...prev,
        [name]: isNowSameAsShipping,
      }));
      // If user unchecks 'Same as shipping', default to showing the new billing address form.
      // So, showBillingForm (which controls showing the saved list) should be false.
      if (!isNowSameAsShipping) {
        setShowBillingForm(false);
      }
      // If isNowSameAsShipping is true, the billing form section is hidden, so setShowBillingForm's value doesn't affect display then.
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddressChange = (
    addressType: "shippingAddress" | "billingAddress",
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value,
      },
    }));
  };

  const handleSavedAddressSelect = (
    addressId: string,
    addressType: "shipping" | "billing"
  ) => {
    if (addressType === "shipping") {
      setFormData((prev) => ({
        ...prev,
        shippingAddressId: addressId,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        billingAddressId: addressId,
      }));
    }
  };
  const applyCoupon = async (couponCode: string) => {
    try {
      setIsApplyingCoupon(true);
      const response = await cartService.applycoupon(couponCode);
      setCouponApplied(true);
      console.log(response, "coupon response");
      setCouponRes(response);
    } catch (err) {
      console.error("Checkout error:", err);
      error("Failed to process. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };
  const removeCoupon = async () => {
    try {
      setIsApplyingCoupon(true);
      const response = await cartService.removecoupon();
      setCouponApplied(false);

      setCouponRes(response);
    } catch (err) {
      console.error("Checkout error:", err);
      error("Failed to process. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      // 1. Get cartId if user is authenticated
      let cartId: string | undefined;
      if (isAuthenticated) {
        try {
          const cartResponse = await cartService.getCart();
          cartId = cartResponse.id;
        } catch (cartErr) {
          console.error("Error fetching cart ID:", cartErr);
          error("Could not retrieve your cart information. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      // 2. Create order
      const guestId = !isAuthenticated
        ? localStorage.getItem("forvrmurr_guest_id") || undefined
        : undefined;
      const orderResponse = await checkoutService.createOrder(
        formData,
        cartId,
        guestId
      );

      success("Order created! Redirecting to payment...");

      // 3. Initiate payment
      const paymentResponse = await checkoutService.initiatePayment(
        orderResponse.id
      );

      // 4. Clear cart since order is created
      clearCart();

      // 5. Redirect to Paystack payment page
      if (paymentResponse.paymentUrl) {
        window.location.href = paymentResponse.paymentUrl;
      } else {
        // Fallback in case there's no payment URL
        router.push(`/shop/order-confirmation/${orderResponse.id}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      error(
        "Failed to process your order. Please check your information and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const selectedShippingMethod = shippingMethods.find(
      (method) => method.id === formData.shippingRateId
    );

    const shippingCost = selectedShippingMethod
      ? parseInt(selectedShippingMethod.amount)
      : 0; // Use .amount instead of .price

    const totalAmount =
      subtotal +
      (cart?.hasFreeShipping ? 0 : shippingCost) -
      (couponRes?.discount || 0);
    setShippingCost(cart?.hasFreeShipping ? 0 : shippingCost);
    setTotal(totalAmount);
  }, [couponRes, formData, shippingMethods]);

  if (itemCount === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-8 bg-[#f8f5f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-serif text-center">Checkout</h1>
            <div className="text-sm breadcrumbs">
              <ul className="flex items-center space-x-2">
                <li>
                  <a href="/" className="text-gray-500 hover:text-gray-700">
                    Home
                  </a>
                </li>
                <li className="text-gray-500 before:content-['>'] before:mx-2">
                  <a href="/shop" className="text-gray-500 hover:text-gray-700">
                    Shop
                  </a>
                </li>
                <li className="text-gray-900 before:content-['>'] before:mx-2">
                  Checkout
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Checkout form */}
            <div className="flex-grow lg:w-2/3">
              <div className=" pr-8 rounded-lg mb-6">
                <h2 className="text-xl font-serif mb-4">
                  Shipping Information
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full p-2 border bg-white border-gray-300 rounded ${
                            isAuthenticated && user?.email ? "bg-gray-100" : ""
                          }`}
                          required
                          readOnly={isAuthenticated && !!user?.email} // Make readOnly if authenticated and email exists
                        />
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Shipping Address
                      </h3>

                      {/* {isAuthenticated && savedAddresses.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center mb-3">
                            <input
                              type="checkbox"
                              id="useSavedAddress"
                              checked={useSavedAddress}
                              onChange={() =>
                                setUseSavedAddress(!useSavedAddress)
                              }
                              className="h-4 w-4 bg-white border-gray-300 text-[#a0001e] rounded"
                            />
                            <label
                              htmlFor="useSavedAddress"
                              className="ml-2 text-sm text-gray-700"
                            >
                              Use a saved address
                            </label>
                          </div>

                          {useSavedAddress && (
                            <SavedAddressList
                              addresses={savedAddresses}
                              onSelect={(id) =>
                                handleSavedAddressSelect(id, "shipping")
                              }
                              selectedAddressId={formData.shippingAddressId}
                            />
                          )}
                        </div>
                      )} */}

                      {!useSavedAddress && (
                        <AddressForm
                          type="shipping"
                          address={formData.shippingAddress}
                          onChange={(field, value) =>
                            handleAddressChange("shippingAddress", field, value)
                          }
                        />
                      )}

                      {/* Phone Number */}
                      <div className="mt-4">
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number (for delivery)
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded bg-white"
                          required
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Billing Address</h3>
                      </div>

                      {!formData.useSameForBilling && (
                        <div className="mt-4">
                          <h3 className="text-lg font-medium mb-3">
                            Billing Address
                          </h3>

                          {isAuthenticated && savedAddresses.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center mb-3">
                                <input
                                  type="checkbox"
                                  id="useSavedBillingAddress"
                                  className="h-4 w-4 rounded border-gray-300"
                                  checked={showBillingForm}
                                  onChange={() =>
                                    setShowBillingForm(!showBillingForm)
                                  }
                                />
                                <label
                                  htmlFor="useSavedBillingAddress"
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  Use a saved address
                                </label>
                              </div>

                              {showBillingForm && (
                                <SavedAddressList
                                  addresses={savedAddresses}
                                  onSelect={(id) =>
                                    handleSavedAddressSelect(id, "billing")
                                  }
                                  selectedAddressId={formData.billingAddressId}
                                />
                              )}
                            </div>
                          )}

                          {!showBillingForm && (
                            <AddressForm
                              type="billing"
                              address={
                                formData.billingAddress || {
                                  addressLine1: "",
                                  addressLine2: "",
                                  city: "",
                                  state: "",
                                  postalCode: "",
                                  country: "Nigeria",
                                }
                              }
                              onChange={(field, value) =>
                                handleAddressChange(
                                  "billingAddress",
                                  field,
                                  value
                                )
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Shipping Method */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Shipping Method
                      </h3>
                      <ShippingMethodsSelector
                        methods={shippingMethods}
                        selectedMethodId={formData.shippingRateId}
                        onChange={(id) =>
                          setFormData((prev) => ({
                            ...prev,
                            shippingRateId: id,
                          }))
                        }
                      />
                    </div>

                    {/* Order Notes */}
                    <div className="mt-6">
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700  mb-1"
                      >
                        Order Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded bg-white"
                        placeholder="Any special instructions for your order?"
                      />
                    </div>
                    <div className="bg-white  p-5 rounded-xl shadow-md">
                      <div className="flex w-full items-center justify-between">
                        <p className="text">Add a promo code</p>
                        <button
                          type="button"
                          // disabled={isLoading}
                          className={`px-3 py-2 bg-[#a0001e] text-white font-serif rounded hover:bg-[#8a0019] transition-colors`}
                          onClick={() => {
                            if (addingCOupon) {
                              removeCoupon();
                              setCouponApplied(false);
                              setAddingCoupon(false);
                            } else {
                              setAddingCoupon(true);
                            }
                          }}
                        >
                          {addingCOupon ? "cancel" : "Add"}
                        </button>
                      </div>
                      {addingCOupon && !couponApplied ? (
                        <div className="flex flex-col gap-3 ">
                          <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Coupon Code
                          </label>
                          <input
                            type="text"
                            id="couponCode"
                            name="couponCode"
                            placeholder="Enter your coupon code"
                            value={formData.couponCode}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            // required
                          />
                          <div className="flex w-full ">
                            <button
                              type="button"
                              disabled={isapplyingCOupon}
                              className={`px-5 py-2 bg-[#a0001e] text-white font-serif rounded-xl hover:bg-[#8a0019] transition-colors ${
                                isapplyingCOupon
                                  ? "opacity-75 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => {
                                if ((formData.couponCode || "").trim() === "") {
                                  error("Please enter a coupon code.");
                                  return;
                                }
                                applyCoupon(formData.couponCode as string);
                              }}
                            >
                              {isapplyingCOupon
                                ? "Processing..."
                                : "Apply Coupon"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3">
                          {couponApplied && couponRes ? (
                            <div className="text-green-600 flex items-center gap-5">
                              <p>
                                Coupon applied! You saved{" "}
                                {couponRes.discount.toLocaleString("en-NG", {
                                  style: "currency",
                                  currency: "NGN",
                                })}
                                .
                              </p>
                              <button
                                type="button"
                                className=" bg-[#a0001e] text-white px-3 rounded-xl py-1 cursor-pointer mt-2"
                                onClick={() => {
                                  removeCoupon();
                                  // setCouponApplied(false);
                                  // setCouponRes(undefined);
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <p className="text-gray-500">
                              No coupon applied yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-3 bg-[#a0001e] text-white font-serif rounded hover:bg-[#8a0019] transition-colors ${
                          isLoading ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? "Processing..." : "Complete Order"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right side: Order summary */}
            <div className="lg:w-1/3 flex  flex-col gap-6">
              <CheckoutSummary
                cartItems={cartItems}
                subtotal={subtotal}
                shippingCost={shippingCost}
                total={totalAmount}
                cart={couponRes}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
