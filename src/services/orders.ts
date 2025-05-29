/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from "./api";

export type ProductType = "prime" | "premium";

export interface OrderFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}
export interface ProductAttribute {
  id: string;
  name: string;
  iconUrl: string;
}
export interface DescriptionResponse {
  attributes: ProductAttribute[];
}

export interface Note {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  guestId: string;
  isGift: boolean;
  giftMessage: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentReference: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes: string;
  trackingNumber: string;
  trackingUrl: string;
  paidAt: string;
  shippedAt: string;
  deliveredAt: string;
  cancelledAt: string;
  items: [
    {
      id: string;
      productId: string;
      productName: string;
      productSku: string;
      quantity: number;
      price: number;
      subtotal: number;
      productImageUrl: string;
    }
  ];
  shippingAddress: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    streetAddress: string;
    apartment: string;
    city: string;
    state: string;
    postalCode: string;
    country: {
      code: string;
      name: string;
    };
    saveToProfile: boolean;
  };
  billingAddress: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    streetAddress: string;
    apartment: string;
    city: string;
    state: string;
    postalCode: string;
    country: {
      code: string;
      name: string;
    };
    saveToProfile: boolean;
  };
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface Discount {
  id: string;
  title: string;
  summary: string;
  type: string;
  discountCode: string;
  minimumRequirementType: string;
  minimumSubtotalValue: string;
  minimumQuantityValue: string | null;
}

const orderService = {
  /**
   * Get products with optional filters
   */
  async getmyorders(filters: OrderFilterParams = {}): Promise<OrderResponse> {
    // Convert ProductFilterParams to Record<string, string | number | boolean>
    const params: Record<string, string | number | boolean> = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters.status) params.status = filters.status;

    return apiRequest<OrderResponse>("/orders/me", {
      params,
      requiresAuth: true,
    });
  },
};

export default orderService;
