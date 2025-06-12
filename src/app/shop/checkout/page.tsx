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
  ShippingMethod,
  SavedAddress,
} from "@/services/checkout";
import taxService, { TaxConfiguration } from "@/services/tax";
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CheckoutFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: Address;
  billingAddress: Address;
  shippingRateId: string;
  notes: string;
  couponCode: string;
  useSameForBilling: boolean;
}

type FormErrors = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  shippingRateId?: string;
  shippingAddress?: Record<string, string | undefined>;
  billingAddress?: Record<string, string | undefined>;
  [key: string]: any;
};

const CheckoutPage = () => {
  const { cartItems, itemCount, cart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { error, success } = useToast();
  const router = useRouter();

  // Loading and API state
  const [isLoading, setIsLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [totalAmount, setTotal] = useState<number>(0);
  const [taxConfig, setTaxConfig] = useState<TaxConfiguration | undefined>();
  const [taxAmount, setTaxAmount] = useState<number>(0);
  
  // UI control state
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [addingCoupon, setAddingCoupon] = useState(false);
  
  // Coupon related state
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponRes, setCouponRes] = useState<CartResponseDto | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : '',
    email: user?.email || '',
    phoneNumber: '',
    shippingAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Nigeria'
    },
    billingAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Nigeria'
    },
    shippingRateId: '',
    notes: '',
    couponCode: '',
    useSameForBilling: true
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Calculate subtotal
  const subtotal = cartItems !== null
    ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;
    
  // Centralized function to calculate the order total
  const calculateOrderTotal = (options: {
    subtotal: number;
    shippingCost: number;
    taxAmount: number;
    hasFreeShipping?: boolean;
    discountAmount?: number;
  }) => {
    const { subtotal, shippingCost, taxAmount, hasFreeShipping = false, discountAmount = 0 } = options;
    
    // Calculate the final shipping cost (0 if free shipping)
    const finalShippingCost = hasFreeShipping ? 0 : shippingCost;
    
    // Calculate the total amount
    return subtotal + finalShippingCost + taxAmount - discountAmount;
  };
  
  // Update the total amount whenever relevant values change
  const updateTotalAmount = () => {
    const discountAmount = couponRes?.discount || 0;
    const hasFreeShipping = couponRes?.hasFreeShipping || false;
    
    const newTotal = calculateOrderTotal({
      subtotal,
      shippingCost,
      taxAmount,
      hasFreeShipping,
      discountAmount
    });
    
    setTotal(newTotal);
  };
  
  // Fetch tax configuration based on country
  const fetchTaxConfiguration = async (countryCode: string) => {
    try {
      const taxConfigs = await taxService.getTaxConfigurationByCountry(countryCode);
      if (taxConfigs && taxConfigs.length > 0) {
        setTaxConfig(taxConfigs[0]);
        // Calculate tax amount
        if (subtotal) {
          const calculatedTaxAmount = taxService.calculateTaxAmount(subtotal, taxConfigs[0].rate);
          setTaxAmount(calculatedTaxAmount);
          // Update total through the centralized function
          updateTotalAmount();
        }
      } else {
        setTaxConfig(undefined);
        setTaxAmount(0);
        // Update total through the centralized function
        updateTotalAmount();
      }
    } catch (err) {
      console.error("Error fetching tax configuration:", err);
      setTaxConfig(undefined);
      setTaxAmount(0);
      // Update total through the centralized function
      updateTotalAmount();
    }
  };

  // Fetch shipping methods and saved addresses
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Default country code for Nigeria
        const countryCode = "NG";
        
        // Fetch shipping methods
        const methods = await checkoutService.getShippingMethods(countryCode);
        setShippingMethods(methods);
        
        if (methods.length > 0) {
          setFormData((prev) => ({ ...prev, shippingRateId: methods[0].id }));
        }
        
        // Fetch tax configuration for Nigeria (default country)
        await fetchTaxConfiguration(countryCode);
        
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
    if (cart) {
      setCouponRes(cart);
    }
    fetchInitialData();
  }, [isAuthenticated, error]);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (cartItems !== null && cartItems.length < 1) {
      router.push("/shop");
    }
  }, [cartItems]);
  
  // Update shipping cost and total amount when relevant values change
  useEffect(() => {
    const selectedShippingMethod = shippingMethods.find(
      (method) => method.id === formData.shippingRateId
    );

    const newShippingCost = selectedShippingMethod
      ? parseInt(selectedShippingMethod.amount)
      : 0;
      
    const hasFreeShipping = couponRes?.hasFreeShipping || false;
    // Update shipping cost state
    setShippingCost(hasFreeShipping ? 0 : newShippingCost);
    
    // Update total amount
    updateTotalAmount();
    
  }, [formData.shippingRateId, shippingMethods, couponRes, subtotal, taxAmount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "couponCode") {
      setFormData({ ...formData, [name]: value });
      // Clear error when user starts typing
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
  };

  // Validate individual field
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email format";
        return undefined;

      case "fullName":
        if (!value.trim()) return "Full name is required";
        return undefined;

      case "phoneNumber":
        if (!value.trim()) return "Phone number is required";
        try {
          // Use libphonenumber-js for robust validation
          if (!isValidPhoneNumber(value)) {
            return "Invalid phone number format";
          }
          // Additional validation for Nigerian numbers if needed
          const phoneNumber = parsePhoneNumber(value);
          if (phoneNumber.country !== 'NG') {
            // If specific country validation is needed
            // return "Please enter a Nigerian phone number";
          }
        } catch (err) {
          return "Invalid phone number format";
        }
        return undefined;

      case "shippingAddress.addressLine1":
      case "billingAddress.addressLine1":
        if (!value.trim()) return "Address line 1 is required";
        return undefined;

      case "shippingAddress.city":
      case "billingAddress.city":
        if (!value.trim()) return "City is required";
        return undefined;

      case "shippingAddress.state":
      case "billingAddress.state":
        if (!value.trim()) return "State is required";
        return undefined;

      case "shippingAddress.postalCode":
      case "billingAddress.postalCode":
        if (!value.trim()) return "Postal code is required";
        // For Nigerian postal codes, additional validation could be added
        if (value.trim() && !/^\d{6}$/.test(value.trim())) {
          return "Nigerian postal code should be 6 digits";
        }
        return undefined;

      case "shippingAddress.country":
      case "billingAddress.country":
        if (!value.trim()) return "Country is required";
        return undefined;

      case "shippingRateId":
        if (!value.trim()) return "Please select a shipping method";
        return undefined;

      default:
        return undefined;
    }
  };

  // Handle field blur for real-time validation
  const handleFieldBlur = (name: string, value: string) => {
    const error = validateField(name, value);
    setFormErrors((prev: FormErrors) => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle blur event for address field
  const handleAddressFieldBlur = (
    type: 'shipping' | 'billing',
    field: string,
    value: string
  ) => {
    const fullFieldName = `${type}Address.${field}`;
    const error = validateField(fullFieldName, value);
    
    setFormErrors((prev: FormErrors) => {
      // Create a copy of the existing address errors or initialize an empty object
      const addressErrors = { ...((prev[`${type}Address`] as Record<string, string | undefined>) || {}) };
      
      // Update the specific field error
      return {
        ...prev,
        [`${type}Address`]: {
          ...addressErrors,
          [field]: error
        }
      };
    });
  };

  // Handle blur event from input elements
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleFieldBlur(name, value);
  };

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
      setFormData((prev: CheckoutFormData) => ({
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
      setFormData((prev: CheckoutFormData) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddressChange = (
    type: "shipping" | "billing",
    field: string,
    value: string
  ) => {
    // Update form data
    if (type === "shipping") {
      setFormData((prev: CheckoutFormData) => {
        const newShippingAddress = { ...prev.shippingAddress };
        newShippingAddress[field as keyof Address] = value;
        return {
          ...prev,
          shippingAddress: newShippingAddress
        };
      });
      
      // If using same billing address and the country changed, update tax configuration
      if (field === 'country' && formData.useSameForBilling) {
        fetchTaxConfiguration(value);
      }
    } else {
      setFormData((prev: CheckoutFormData) => {
        const newBillingAddress = { ...prev.billingAddress };
        newBillingAddress[field as keyof Address] = value;
        return {
          ...prev,
          billingAddress: newBillingAddress
        };
      });
      
      // If billing country changed, update tax configuration
      if (field === 'country') {
        fetchTaxConfiguration(value);
      }
    }
    
    // Clear error when user makes a change
    const addressErrors = formErrors[`${type}Address`];
    if (addressErrors && (addressErrors as Record<string, string | undefined>)[field]) {
      setFormErrors((prev: FormErrors) => {
        const newErrors = { ...prev };
        const addressErrorKey = `${type}Address`;
        
        if (newErrors[addressErrorKey]) {
          const updatedAddressErrors = { ...(newErrors[addressErrorKey] as Record<string, string | undefined>) };
          updatedAddressErrors[field] = undefined;
          newErrors[addressErrorKey] = updatedAddressErrors;
        }
        
        return newErrors;
      });
    }
  };

  const handleSavedAddressSelect = (
    addressId: string,
    addressType: "shipping" | "billing"
  ) => {
    // Find the selected address from saved addresses
    const selectedAddress = savedAddresses.find((addr: SavedAddress) => addr.id === addressId);
    
    if (!selectedAddress) return;
    
    if (addressType === "shipping") {
      // Update shipping address with saved address details
      setFormData((prev: CheckoutFormData) => ({
        ...prev,
        shippingAddress: {
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2 || '',
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
        }
      }));
    } else {
      // Update billing address with saved address details
      setFormData((prev: CheckoutFormData) => ({
        ...prev,
        billingAddress: {
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2 || '',
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
        }
      }));
    }
  };

  const applyCoupon = async (couponCode: string) => {
    try {
      setIsApplyingCoupon(true);
      const response = await cartService.applycoupon(couponCode);
      setCouponApplied(true);
      setCouponRes(response);
      
      // Update total amount after coupon is applied
      updateTotalAmount();
    } catch (err) {
      console.error("Checkout error:", err);
      error("Failed to apply coupon. Please try again.");
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
      
      // Update total amount after coupon is removed
      updateTotalAmount();
    } catch (err) {
      console.error("Checkout error:", err);
      error("Failed to remove coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate personal information
    const fullNameError = validateField('fullName', formData.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;
    
    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validateField('phoneNumber', formData.phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;
    
    // Validate shipping address
    const shippingErrors: Record<string, string | undefined> = {};
    const shippingAddress = formData.shippingAddress;
    
    if (validateField('shippingAddress.addressLine1', shippingAddress.addressLine1)) {
      shippingErrors.addressLine1 = validateField('shippingAddress.addressLine1', shippingAddress.addressLine1);
    }
    
    if (validateField('shippingAddress.city', shippingAddress.city)) {
      shippingErrors.city = validateField('shippingAddress.city', shippingAddress.city);
    }
    
    if (validateField('shippingAddress.state', shippingAddress.state)) {
      shippingErrors.state = validateField('shippingAddress.state', shippingAddress.state);
    }
    
    if (validateField('shippingAddress.postalCode', shippingAddress.postalCode)) {
      shippingErrors.postalCode = validateField('shippingAddress.postalCode', shippingAddress.postalCode) || '';
    }
    
    if (Object.keys(shippingErrors).length > 0) {
      newErrors.shippingAddress = shippingErrors;
    }
    
    // Validate billing address if different from shipping
    if (!formData.useSameForBilling && formData.billingAddress) {
      const billingErrors: Record<string, string> = {};
      const billingAddress = formData.billingAddress;
      
      if (validateField('billingAddress.addressLine1', billingAddress.addressLine1)) {
        billingErrors.addressLine1 = validateField('billingAddress.addressLine1', billingAddress.addressLine1) || '';
      }
      
      if (validateField('billingAddress.city', billingAddress.city)) {
        billingErrors.city = validateField('billingAddress.city', billingAddress.city) || '';
      }
      
      if (validateField('billingAddress.state', billingAddress.state)) {
        billingErrors.state = validateField('billingAddress.state', billingAddress.state) || '';
      }
      
      if (validateField('billingAddress.postalCode', billingAddress.postalCode)) {
        billingErrors.postalCode = validateField('billingAddress.postalCode', billingAddress.postalCode) || '';
      }
      
      if (Object.keys(billingErrors).length > 0) {
        newErrors.billingAddress = billingErrors;
      }
    }
    
    // Validate shipping method
    const shippingMethodError = validateField('shippingRateId', formData.shippingRateId);
    if (shippingMethodError) newErrors.shippingRateId = shippingMethodError;
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error("Please fill in all required fields correctly.");
      return;
    }

    setIsLoading(true);
    try {
      // Create order with all required fields
      const order = await checkoutService.createOrder({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.useSameForBilling ? formData.shippingAddress : formData.billingAddress,
        shippingRateId: formData.shippingRateId,
        notes: formData.notes,
        useSameForBilling: formData.useSameForBilling,
      });
      
      // Initiate payment
      const paymentResult = await checkoutService.initiatePayment(order.id);
      
      // Redirect to payment page or confirmation
      if (paymentResult.paymentUrl) {
        router.push(paymentResult.paymentUrl);
      } else {
        success("Order placed successfully!");
        router.push(`/shop/orders/${order.id}`);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      error("Failed to process your order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif mb-8 text-center">Checkout</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Checkout form */}
            <div className="lg:w-2/3">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name*
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full p-2 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded`}
                            required
                          />
                          {formErrors.fullName && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address*
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full p-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
                            required
                          />
                          {formErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number*
                          </label>
                          <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="+1 123 456 7890"
                            className={`w-full p-2 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded`}
                            required
                          />
                          {formErrors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Shipping Address</h3>
                      
                      {isAuthenticated && savedAddresses.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Select a saved address
                            </label>
                            <button
                              type="button"
                              className="text-sm text-[#a0001e] hover:underline"
                              onClick={() => setUseSavedAddress(!useSavedAddress)}
                            >
                              {useSavedAddress ? "Enter new address" : "Use saved address"}
                            </button>
                          </div>
                          
                          {useSavedAddress && (
                            <SavedAddressList
                              addresses={savedAddresses}
                              onSelect={(id) => handleSavedAddressSelect(id, "shipping")}
                              selectedAddressId={""}
                            />
                          )}
                        </div>
                      )}
                      
                      {(!isAuthenticated || !useSavedAddress || savedAddresses.length === 0) && (
                        <AddressForm
                          type="shipping"
                          address={formData.shippingAddress}
                          onChange={(field, value) => handleAddressChange("shipping", field, value)}
                          errors={formErrors.shippingAddress}
                          onBlur={(field, value) => handleAddressFieldBlur("shipping", field, value)}
                        />
                      )}
                    </div>
                    
                    {/* Billing Address */}
                    <div>
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="useSameForBilling"
                          name="useSameForBilling"
                          checked={formData.useSameForBilling}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label htmlFor="useSameForBilling" className="text-sm font-medium text-gray-700">
                          Billing address same as shipping
                        </label>
                      </div>
                      
                      {!formData.useSameForBilling && (
                        <div>
                          <h3 className="text-lg font-medium mb-3">Billing Address</h3>
                          
                          {isAuthenticated && savedAddresses.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">
                                  Select a saved address
                                </label>
                                <button
                                  type="button"
                                  className="text-sm text-[#a0001e] hover:underline"
                                  onClick={() => setShowBillingForm(!showBillingForm)}
                                >
                                  {showBillingForm ? "Enter new address" : "Use saved address"}
                                </button>
                              </div>
                              
                              {!showBillingForm && (
                                <SavedAddressList
                                  addresses={savedAddresses}
                                  onSelect={(id) =>
                                    handleSavedAddressSelect(id, "billing")
                                  }
                                  selectedAddressId={""}
                                />
                              )}
                            </div>
                          )}
                          
                          {(showBillingForm || !isAuthenticated || savedAddresses.length === 0) && (
                            <AddressForm
                              type="billing"
                              address={formData.billingAddress}
                              onChange={(field, value) =>
                                handleAddressChange("billing", field, value)
                              }
                              errors={formErrors.billingAddress}
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
                      {formErrors.shippingRateId && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.shippingRateId}</p>
                      )}
                    </div>

                    {/* Order Notes */}
                    <div className="mt-6">
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-1"
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
                    
                    {/* Promo Code */}
                    <div className="bg-white p-5 rounded-xl shadow-md">
                      <div className="flex w-full items-center justify-between">
                        <p className="text">Add a promo code</p>
                        <button
                          type="button"
                          disabled={isLoading}
                          className={`px-3 py-2 bg-[#a0001e] text-white font-serif rounded hover:bg-[#8a0019] transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                          onClick={() => {
                            if (addingCoupon) {
                              removeCoupon();
                              setCouponApplied(false);
                              setAddingCoupon(false);
                            } else {
                              setAddingCoupon(true);
                            }
                          }}
                        >
                          {addingCoupon ? "Cancel" : "Add"}
                        </button>
                      </div>
                      
                      {addingCoupon && !couponApplied ? (
                        <div className="flex flex-col gap-3 mt-3">
                          <label
                            htmlFor="couponCode"
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
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                          <div className="flex w-full">
                            <button
                              type="button"
                              disabled={isApplyingCoupon}
                              className={`px-5 py-2 bg-[#a0001e] text-white font-serif rounded-xl hover:bg-[#8a0019] transition-colors ${isApplyingCoupon ? 'opacity-75 cursor-not-allowed' : ''}`}
                              onClick={() => {
                                if ((formData.couponCode || "").trim() === "") {
                                  error("Please enter a coupon code.");
                                  return;
                                }
                                applyCoupon(formData.couponCode);
                              }}
                            >
                              {isApplyingCoupon ? "Processing..." : "Apply Coupon"}
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
                                className="bg-[#a0001e] text-white px-3 rounded-xl py-1 cursor-pointer mt-2"
                                onClick={() => {
                                  removeCoupon();
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
            <div className="lg:w-1/3 flex flex-col gap-6">
              <CheckoutSummary
                cartItems={cartItems}
                subtotal={subtotal as number}
                shippingCost={shippingCost}
                total={totalAmount}
                cart={couponRes || undefined}
                taxConfig={taxConfig}
                taxAmount={taxAmount}
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
