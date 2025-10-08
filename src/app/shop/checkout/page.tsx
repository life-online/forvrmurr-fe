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
import { authService, RegisterData } from "@/services/auth";
import { trackBeginCheckout } from "@/utils/analytics";

interface Address {
  id?: string;
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
  const { cartItems, cart, refreshCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { error, success } = useToast();
  const router = useRouter();

  // Guest checkout state
  const [checkoutOption, setCheckoutOption] = useState<'guest' | 'register' | null>(null);
  const [showLoginSuggestion, setShowLoginSuggestion] = useState(false);

  // Loading and API state
  const [isLoading, setIsLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [totalAmount, setTotal] = useState<number>(0);
  const [taxConfig, setTaxConfig] = useState<TaxConfiguration | undefined>();
  const [taxAmount, setTaxAmount] = useState<number>(0);
  
  // UI control state
  // Use string-based state for both shipping and billing address selection mode
  const [billingAddressMode, setBillingAddressMode] = useState<'new' | 'saved'>('new');
  
  // Helper for readability
  const isUsingSavedBillingAddress = billingAddressMode === 'saved';
  // Use string-based state to avoid any potential object reference issues
  const [addressSelectionMode, setAddressSelectionMode] = useState<'new' | 'saved'>('new');
  
  // Helper for readability
  const isUsingSavedAddress = addressSelectionMode === 'saved';
  
  // Toggle between new and saved address modes safely with additional safeguards
  // Helper to ensure an address property is a string
  const sanitizeAddressProperty = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'object') {
      const obj = value as any; // Cast to any to check for properties
      // Prioritize name, then code, for objects that might represent country/state
      if (typeof obj.name === 'string' && obj.name.trim() !== '') {
        return obj.name;
      }
      if (typeof obj.code === 'string' && obj.code.trim() !== '') {
        return obj.code;
      }
      // Fallback for other objects to prevent React child error
      try {
        // Only stringify if it's not an empty object or has some identifiable content
        if (Object.keys(obj).length > 0) {
          return JSON.stringify(value);
        }
        return ''; // Empty object can be represented as empty string
      } catch (e) {
        // In case JSON.stringify fails (e.g., circular references, though unlikely for simple address data)
        return ''; 
      }
    }
    return String(value); // For numbers, booleans, etc.
  };

  // Helper to ensure all properties of an Address object are strings
  const sanitizeAddressObject = (address: Address): Address => {
    return {
      id: address.id, // Preserve the ID if it exists
      addressLine1: sanitizeAddressProperty(address.addressLine1),
      addressLine2: address.addressLine2 ? sanitizeAddressProperty(address.addressLine2) : '',
      city: sanitizeAddressProperty(address.city),
      state: sanitizeAddressProperty(address.state),
      postalCode: sanitizeAddressProperty(address.postalCode),
      country: sanitizeAddressProperty(address.country),
    };
  };

  const toggleAddressSelectionMode = () => {
    setFormData(prev => {
      const sanitizedShippingAddress = sanitizeAddressObject(prev.shippingAddress);
      const sanitizedBillingAddress = sanitizeAddressObject(prev.billingAddress);

      const newState = {
        ...prev,
        shippingAddress: sanitizedShippingAddress,
        billingAddress: sanitizedBillingAddress,
      };
      return newState;
    });
    // Then toggle the mode for shipping address
    setAddressSelectionMode(prevMode => (prevMode === 'saved' ? 'new' : 'saved'));
  };
  
  // Similar safety function for billing address toggle
  const toggleBillingAddressMode = () => {
    setFormData(prev => ({
      ...prev,
      billingAddress: sanitizeAddressObject(prev.billingAddress),
    }));
    // Then toggle the mode for billing address
    setBillingAddressMode(prevMode => (prevMode === 'saved' ? 'new' : 'saved'));
  };
  // Coupon related state
  const [couponCode, setCouponCode] = useState<string>('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  
  // Form state
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
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
  const subtotal = cartItems?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
    
  // Centralized function to calculate the order total
  const calculateOrderTotal = () => {
    const { subtotal, discountAmount, shippingCost, total } = calculateOrderTotalHelper();
    setTotal(total);
    
    // Update tax whenever subtotal changes and we have tax config
    if (taxConfig && subtotal > 0) {
      const calculatedTaxAmount = taxService.calculateTaxAmount(subtotal, taxConfig.rate);
      setTaxAmount(calculatedTaxAmount);
    }
  };

  const calculateOrderTotalHelper = () => {
    const subtotal = cartItems?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
    const discountAmount = cart?.discount || 0;
    const hasFreeShipping = cart?.hasFreeShipping || false;
    const shippingCost = calculateShippingCost(formData.shippingRateId, hasFreeShipping);
    const total = subtotal - discountAmount + shippingCost + (taxAmount || 0);
    return { subtotal, discountAmount, shippingCost, total };
  };
  
  // Calculate shipping cost based on selected shipping method and free shipping status
  const calculateShippingCost = (shippingRateId: string, hasFreeShipping: boolean): number => {
    if (hasFreeShipping) return 0;
    
    const selectedShippingMethod = shippingMethods.find(
      (method) => method.id === shippingRateId
    );
    
    return selectedShippingMethod ? parseInt(selectedShippingMethod.amount) : 0;
  };
  
  // Update the total amount whenever relevant values change
  const updateTotalAmount = () => {
    const { subtotal, total } = calculateOrderTotalHelper();
    setTotal(total);
    
    // Recalculate tax if tax config is available
    if (taxConfig && subtotal > 0) {
      const calculatedTaxAmount = taxService.calculateTaxAmount(subtotal, taxConfig.rate);
      setTaxAmount(calculatedTaxAmount);
    }
  };
  
  // Recalculate order total whenever cart or shipping changes
  useEffect(() => {
    updateTotalAmount();
  }, [cartItems, formData.shippingRateId, cart, taxConfig]);
  
  // Fetch tax configuration based on country
  const fetchTaxConfiguration = async (countryCode: string) => {
    try {
      const taxConfigs = await taxService.getTaxConfigurationByCountry(countryCode);
      if (taxConfigs && taxConfigs.length > 0) {
        setTaxConfig(taxConfigs[0]);
        // Tax config is now set - updateTotalAmount will handle tax calculation
        // and order total recalculation based on current subtotal
        updateTotalAmount();
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
  // Initial data loading for shipping methods and addresses
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
        
        // Fetch saved addresses if authenticated and registered user
        if (isAuthenticated && authService.isRegistered()) {
          // Pre-populate user information from their account
          if (user) {
            setFormData(prev => ({
              ...prev,
              fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              email: user.email || prev.email,
              phoneNumber: user.phoneNumber || ''
            }));
          }
          
          const addresses = await checkoutService.getSavedAddresses();
          setSavedAddresses(addresses);

          // If there's a default address, pre-fill it
          const defaultAddress = addresses.find((addr) => addr.isDefault);
          if (defaultAddress) {
            // Try to get phone number from default address if available
            if (defaultAddress.phoneNumber) {
              setFormData(prev => ({
                ...prev,
                phoneNumber: defaultAddress.phoneNumber || ''
              }));
            }
            
            // Ensure address selection mode is set to saved addresses
            setAddressSelectionMode('saved');
            
            // Map the address data for form using the same approach as handleSavedAddressSelect
            const addressData = {
              id: defaultAddress.id,
              addressLine1: defaultAddress.streetAddress || (defaultAddress as any).addressLine1 || '',
              addressLine2: (defaultAddress as any).addressLine2 || '',
              city: defaultAddress.city || '',
              state: defaultAddress.state || '',
              postalCode: defaultAddress.postalCode || '',
              country: defaultAddress.country || '',
            };
            
            // Sanitize the address data and preserve the ID
            const sanitizedAddress = { ...sanitizeAddressObject(addressData as Address), id: defaultAddress.id };
            
            // Set the default address in form data with its ID preserved
            setFormData(prev => ({
              ...prev,
              shippingAddress: sanitizedAddress
            }));
            
            console.log('Default address selected:', defaultAddress.id);
          }
        }
        
        // Set checkout option based on user type
        if (authService.isRegistered()) {
          setCheckoutOption('register');
        } else if (authService.isGuest()) {
          // Guest user - they need to choose
          setCheckoutOption(null);
        }
      } catch (err) {
        console.error("Error fetching checkout data:", err);
        error("Failed to load checkout information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [isAuthenticated, error, user]);
  
  // Separate effect to handle coupon code synchronization with cart
  useEffect(() => {
    if (cart) {
      // Check if cart has an applied coupon
      if (cart.appliedCouponCode) {
        // Update form data with the coupon code from cart
        setFormData(prev => ({
          ...prev,
          couponCode: cart.appliedCouponCode || ''
        }));
        // Set coupon as applied to show the coupon UI
        setCouponApplied(true);
      } else {
        // If no coupon on cart, make sure the UI reflects that
        setCouponApplied(false);
      }
    }
  }, [cart]); // Only run when cart changes

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (cartItems !== null && cartItems.length < 1) {
      router.push("/shop");
    }
  }, [cartItems]);

  // Track begin_checkout event when user lands on checkout page with items
  useEffect(() => {
    if (cartItems && cartItems.length > 0 && !isLoading) {
      // Track checkout started
      trackBeginCheckout(cartItems, subtotal);
    }
  }, [cartItems, subtotal, isLoading]);
  
  // Update shipping cost and total amount when relevant values change
  useEffect(() => {
    const hasFreeShipping = cart?.hasFreeShipping || false;
    const shippingCost = calculateShippingCost(formData.shippingRateId, hasFreeShipping);
    setShippingCost(shippingCost);

    updateTotalAmount();
    
  }, [formData.shippingRateId, shippingMethods, cart, subtotal, taxAmount]);

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
      // If user unchecks 'Same as shipping', default to showing the new billing address form
      if (!isNowSameAsShipping) {
        setBillingAddressMode('new');
      }
      // If isNowSameAsShipping is true, the billing form section is hidden
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
        newShippingAddress[field as keyof Address] = sanitizeAddressProperty(value);
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
        newBillingAddress[field as keyof Address] = sanitizeAddressProperty(value);
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
    const selectedAddress = savedAddresses.find((addr: any) => addr.id === addressId);
    
    if (!selectedAddress) return;
    
    // Map backend address structure to our form's expected Address structure
    // The backend schema has some inconsistencies that we need to handle
    // Some endpoints return streetAddress, others might return addressLine1/2
    // We use the non-null assertion with type assertion to safely handle this
    const newAddressDataRaw = {
      id: selectedAddress.id, // Copy the ID from the saved address
      // Use streetAddress as primary, fall back to addressLine1 if available
      addressLine1: selectedAddress.streetAddress || (selectedAddress as any).addressLine1 || '',
      // addressLine2 might not exist in all address objects
      addressLine2: (selectedAddress as any).addressLine2 || '',
      city: selectedAddress.city || '',
      state: selectedAddress.state || '',
      postalCode: selectedAddress.postalCode || '',
      country: selectedAddress.country || '',
    };

    // Sanitize the raw address data (which might contain objects for state/country)
    // The 'as Address' cast is used because newAddressDataRaw structurally matches Address,
    // and sanitizeAddressObject expects an Address-like object where fields might not yet be strings.
    const newAddressDataSanitized = { ...sanitizeAddressObject(newAddressDataRaw as Address), id: selectedAddress.id };
    
    if (addressType === "shipping") {
      setFormData((prev: CheckoutFormData) => ({
        ...prev,
        shippingAddress: newAddressDataSanitized
      }));
    } else {
      setFormData((prev: CheckoutFormData) => ({
        ...prev,
        billingAddress: newAddressDataSanitized
      }));
    }
  };
  
  // Handle updates to the saved addresses (e.g., when setting a default address)
  const handleAddressesUpdated = (updatedAddresses: SavedAddress[]) => {
    // Update the saved addresses in state
    setSavedAddresses(updatedAddresses);
  };

  const applyCoupon = async (couponCode: string) => {
    try {
      setIsApplyingCoupon(true);
      const response = await cartService.applycoupon(couponCode);
      
      // Refresh cart data to get updated state
      await refreshCart();
      
      // Show success message
      success("Discount code applied");
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
      await cartService.removecoupon();
      setCouponApplied(false);
      
      // Refresh cart data to get updated state
      await refreshCart();
      
      // Show success message
      success("Discount code removed");
    } catch (err: any) {
      error("Failed to remove coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Handle checkout option selection
  const handleCheckoutOptionSelect = (option: 'guest' | 'register') => {
    if (option === 'register') {
      // Redirect to registration page with return URL
      router.push('/auth/register?redirect=' + encodeURIComponent('/shop/checkout'));
    } else {
      setCheckoutOption(option);
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

  // Handle checkout errors with specific messages for email/phone conflicts
  const handleCheckoutError = (err: any) => {
    if (err.status === 409) {
      // Parse error message to determine if it's email or phone conflict
      const errorMessage = err.data?.message || err.message || '';
      
      if (errorMessage.toLowerCase().includes('email')) {
        error("This email address is already registered. Please sign in with your email to continue checkout.");
        // Show login option
        setShowLoginSuggestion(true);
      } else if (errorMessage.toLowerCase().includes('phone')) {
        error("This phone number is already registered. Please sign in with your phone number to continue checkout.");
        // Show login option
        setShowLoginSuggestion(true);
      } else {
        // Generic conflict message
        error("This email or phone number belongs to an existing account. Please sign in to continue checkout.");
        setShowLoginSuggestion(true);
      }
    } else if (err.status === 400) {
      // Handle validation errors
      const errorMessage = err.data?.message || err.message || '';
      if (Array.isArray(errorMessage)) {
        error(errorMessage.join(', '));
      } else {
        error(errorMessage || "Please check your information and try again.");
      }
    } else {
      // Generic error
      error("Failed to process your order. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error("Please fill in all required fields correctly.");
      return;
    }

    setIsLoading(true);
    try {
      // Refresh cart to get the latest data
      await refreshCart();

      // Then initiate checkout
      await cartService.initiateCheckout();

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
      }, taxConfig?.id, cart?.id);
      
      // Initiate payment
      const paymentResult = await checkoutService.initiatePayment(order.id);
      
      // Redirect to payment page
      if (paymentResult.paymentUrl) {
        window.location.href = paymentResult.paymentUrl;
      } else {
        success("Order placed successfully!");
        router.push(`/shop/orders/${order.id}`);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      handleCheckoutError(err);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 mb-14">
          <h1 className="text-3xl font-serif mb-8 text-center">Checkout</h1>
          
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Left side: Checkout form */}
            <div className="lg:w-2/3">
              {/* Checkout Options (only show for guests who haven't chosen yet) */}
              {authService.isGuest() && !checkoutOption && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                  <h2 className="text-xl font-serif mb-4">How would you like to checkout?</h2>
                  
                  <div className="space-y-3">
                    <button 
                      type="button"
                      onClick={() => handleCheckoutOptionSelect('guest')}
                      className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-[#a0001e] hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">Continue as Guest</div>
                      <div className="text-sm text-gray-600 mt-1">Quick checkout without creating an account</div>
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleCheckoutOptionSelect('register')}
                      className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-[#a0001e] hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">Create Account & Checkout</div>
                      <div className="text-sm text-gray-600 mt-1">Save your information for faster future checkouts</div>
                    </button>
                  </div>
                </div>
              )}


              {/* Login Suggestion Modal */}
              {showLoginSuggestion && (
                <div className="bg-white border-l-4 border-[#a0001e] p-6 rounded-xl shadow-md mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-[#a0001e]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Account Already Exists</h3>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>This email or phone number is already registered. Please sign in to continue with your order.</p>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => router.push('/auth/login?redirect=' + encodeURIComponent('/shop/checkout'))}
                          className="bg-[#a0001e] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#8a0019] transition-colors"
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLoginSuggestion(false)}
                          className="bg-white text-gray-700 px-4 py-2 rounded text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          Continue as Guest
                        </button>
                      </div>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          type="button"
                          onClick={() => setShowLoginSuggestion(false)}
                          className="inline-flex rounded-md p-1.5 text-gray-500 hover:text-[#a0001e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a0001e]"
                        >
                          <span className="sr-only">Dismiss</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Checkout Form */}
              {(checkoutOption || authService.isRegistered()) && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="pb-4">
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
                            disabled={!!(user?.firstName && user?.lastName)}
                            className={`w-full p-2 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded ${
                              user?.firstName && user?.lastName ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
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
                            disabled={!!user?.email}
                            className={`w-full p-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded ${
                              user?.email ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
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
                            disabled={!!user?.phoneNumber}
                            placeholder="+1 123 456 7890"
                            className={`w-full p-2 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded ${
                              user?.phoneNumber ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                            required
                          />
                          {formErrors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Shipping Address */}
                    <div className="border-t border-gray-200 pt-6 pb-4">
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
                              onClick={() => {
                                toggleAddressSelectionMode();
                              }}
                            >
                              {addressSelectionMode === 'saved' ? "Enter new address" : "Use saved address"}
                            </button>
                          </div>
                          
                          {addressSelectionMode === 'saved' && (
                            <SavedAddressList
                              addresses={savedAddresses}
                              onSelect={(id) => handleSavedAddressSelect(id, "shipping")}
                              selectedAddressId={formData.shippingAddress?.id}
                              onAddressesUpdated={handleAddressesUpdated}
                            />
                          )}
                        </div>
                      )}
                      
                      {(!isAuthenticated || addressSelectionMode !== 'saved' || savedAddresses.length === 0) && (
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
                    <div className="pb-4">
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
                                  onClick={() => toggleBillingAddressMode()}
                                >
                                  {billingAddressMode === 'saved' ? "Enter new address" : "Use saved address"}
                                </button>
                              </div>
                              
                              {billingAddressMode === 'saved' && (
                                <SavedAddressList
                                  addresses={savedAddresses}
                                  onSelect={(id) =>
                                    handleSavedAddressSelect(id, "billing")
                                  }
                                  selectedAddressId={formData.billingAddress?.id}
                                  onAddressesUpdated={handleAddressesUpdated}
                                />
                              )}
                            </div>
                          )}
                          
                          {(billingAddressMode !== 'saved' || !isAuthenticated || savedAddresses.length === 0) && (
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
                    <div className="border-t border-gray-200 pt-6 pb-4">
                      <h3 className="text-lg font-medium mb-3">
                        Shipping Method
                      </h3>
                      <ShippingMethodsSelector
                        methods={shippingMethods}
                        selectedMethodId={formData.shippingRateId || ''}
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
                    <div className="border-t border-gray-200 pt-6">
                      <p className="text-lg font-medium mb-3">Discount Code</p>
                      
                      {!couponApplied ? (
                        <div>
                          <div className="flex items-center">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                id="couponCode"
                                name="couponCode"
                                placeholder="Enter discount code"
                                value={formData.couponCode}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                disabled={isApplyingCoupon}
                              />
                              {formData.couponCode.trim() && (
                                <div className="absolute right-0 top-0 h-full flex items-center pr-1">
                                  <button
                                    type="button"
                                    disabled={isApplyingCoupon}
                                    className={`px-4 py-[6px] bg-[#a0001e] text-white font-serif rounded hover:bg-[#8a0019] transition-all transform duration-300 ease-in-out origin-right ${isApplyingCoupon ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    onClick={() => {
                                      applyCoupon(formData.couponCode);
                                    }}
                                  >
                                    {isApplyingCoupon ? "Applying..." : "Apply"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Enter a valid discount code to receive special offers</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-md bg-gray-50 border-l-4 border-[#a0001e]">
                          <div>
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <span className="font-medium">{formData.couponCode}</span>
                              <br />
                              <span className="font-normal text-sm">Discount: ₦
                              {(cart?.discount || 0).toLocaleString("en-NG", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}</span>
                              {cart?.hasFreeShipping && (
                                <span className="block font-normal text-sm">Free Shipping</span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="text-[#a0001e] hover:text-[#8a0019] font-medium text-sm"
                            onClick={() => {
                              removeCoupon();
                              setCouponApplied(false);
                              setFormData(prev => ({ ...prev, couponCode: '' }));
                            }}
                          >
                            Remove
                          </button>
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
              )}
            </div>

            {/* Right side: Order summary */}
            <div className="lg:w-1/3 flex flex-col gap-6">
              <CheckoutSummary
                cartItems={cartItems}
                subtotal={subtotal as number}
                shippingCost={shippingCost}
                total={totalAmount}
                cart={cart}
                taxConfig={taxConfig}
                taxAmount={taxAmount}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
