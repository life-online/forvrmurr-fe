import { apiRequest } from "./api";
import { authService } from "./auth";
import posthog from "posthog-js";

export interface Address {
  id?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  amount: string;
  description?: string;
  currencyCode: string;
  active: boolean;
  zoneId: string;
  zone: Record<string, any>;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: Address;
  billingAddress?: Address;
  useSameForBilling: boolean;
  billingAddressId?: string | null;
  shippingAddressId?: string | null;
  shippingRateId: string;
  notes?: string;
  couponCode?: string;
}

export interface CountryOrState {
  code: string;
  name: string;
}

// This interface represents what actually comes from the backend
export interface SavedAddress {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string | CountryOrState;
  postalCode: string;
  country: string | CountryOrState;
  isDefault: boolean;
  type: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutResponse {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: any[];
}

export interface PaymentResponse {
  reference: string;
  accessCode: string;
  paymentUrl: string;
  amount: number;
  currency: string;
  status: string;
}

const checkoutService = {
  // Get shipping methods
  getShippingMethods: async (
    countryCode: string
  ): Promise<ShippingMethod[]> => {
    return apiRequest<ShippingMethod[]>(
      `/checkout/shipping-options?countryCode=${countryCode}`,
      {
        requiresAuth: false,
      }
    );
  },

  // Get saved addresses for the logged-in user
  getSavedAddresses: async (): Promise<SavedAddress[]> => {
    return apiRequest<SavedAddress[]>("/addresses", { requiresAuth: true });
  },
  
  // Set address as default
  setAddressAsDefault: async (addressId: string): Promise<SavedAddress> => {
    return apiRequest<SavedAddress>(`/addresses/${addressId}/set-default`, { 
      method: 'PATCH',
      requiresAuth: true 
    });
  },

  // Create order
  createOrder: async (
    checkoutData: CheckoutFormData,
    taxConfigId?: string,
    cartId?: string
  ): Promise<CheckoutResponse> => {
    // Ensure authentication (creates guest if needed)
    await authService.ensureAuthentication();

    // Format data for API
    const apiPayload = {
      cartId,
      shippingRateId: checkoutData.shippingRateId,
      taxConfigurationId: taxConfigId,
      notes: checkoutData.notes,
      shippingAddress: {
        firstName: checkoutData.fullName.split(" ")[0],
        lastName: checkoutData.fullName.split(" ").slice(1).join(" "),
        email: checkoutData.email,
        phoneNumber: checkoutData.phoneNumber,
        streetAddress: checkoutData.shippingAddress.addressLine1,
        apartment: checkoutData.shippingAddress.addressLine2 || "",
        city: checkoutData.shippingAddress.city,
        state: checkoutData.shippingAddress.state,
        postalCode: checkoutData.shippingAddress.postalCode,
        countryCode:
          checkoutData.shippingAddress.country === "Nigeria"
            ? "NG"
            : checkoutData.shippingAddress.country,
      },
      useShippingAsBilling: checkoutData.useSameForBilling,
    };

    // Add billing address if not using shipping as billing
    if (!checkoutData.useSameForBilling && checkoutData.billingAddress) {
      (apiPayload as any).billingAddress = {
        firstName: checkoutData.fullName.split(" ")[0],
        lastName: checkoutData.fullName.split(" ").slice(1).join(" "),
        email: checkoutData.email,
        phoneNumber: checkoutData.phoneNumber,
        streetAddress: checkoutData.billingAddress.addressLine1,
        apartment: checkoutData.billingAddress.addressLine2 || "",
        city: checkoutData.billingAddress.city,
        state: checkoutData.billingAddress.state,
        postalCode: checkoutData.billingAddress.postalCode,
        countryCode:
          checkoutData.billingAddress.country === "Nigeria"
            ? "NG"
            : checkoutData.billingAddress.country,
      };
    }

    const response = await apiRequest<CheckoutResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(apiPayload),
      requiresAuth: true, // We always have auth now (guest or registered)
    });

    // PostHog: Track order created event
    posthog.capture("order_created", {
      order_id: response.id,
      order_number: response.orderNumber,
      total: response.total,
      item_count: response.items?.length || 0,
      shipping_city: checkoutData.shippingAddress.city,
      shipping_state: checkoutData.shippingAddress.state,
      shipping_country: checkoutData.shippingAddress.country,
    });

    return response;
  },

  // Initiate payment with Paystack
  initiatePayment: async (
    orderId: string,
    paymentMethod: string = "PAYSTACK"
  ): Promise<PaymentResponse> => {
    const response = await apiRequest<PaymentResponse>("/payments/initialize", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        paymentMethod,
      }),
      requiresAuth: true,
    });

    // PostHog: Track payment initiated event
    posthog.capture("payment_initiated", {
      order_id: orderId,
      payment_method: paymentMethod,
      payment_reference: response.reference,
      amount: response.amount,
      currency: response.currency,
    });

    return response;
  },
};

export default checkoutService;
