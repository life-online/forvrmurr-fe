import { apiRequest } from "./api";

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

export interface SavedAddress extends Address {
  id: string;
  isDefault: boolean;
  label: string; // e.g., "Home", "Work"
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

  // Create order
  createOrder: async (
    checkoutData: CheckoutFormData,
    cartId?: string,
    guestId?: string
  ): Promise<CheckoutResponse> => {
    const options = {
      requiresAuth: !guestId,
      params: guestId ? { guestId } : undefined,
    };

    // Format data for API
    const apiPayload = {
      cartId,
      shippingRateId: checkoutData.shippingRateId,
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

    return apiRequest<CheckoutResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(apiPayload),
      ...options,
    });
  },

  // Initiate payment with Paystack
  initiatePayment: async (
    orderId: string,
    paymentMethod: string = "PAYSTACK"
  ): Promise<PaymentResponse> => {
    return apiRequest<PaymentResponse>("/payments/initialize", {
      method: "POST",
      body: JSON.stringify({
        orderId,
        paymentMethod,
      }),
      requiresAuth: true,
    });
  },
};

export default checkoutService;
