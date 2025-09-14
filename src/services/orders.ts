/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from "./api";

export type ProductType = "prime" | "premium";

export interface OrderFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  search?: string;
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

// Order Status enum
export type OrderStatus = 'pending' | 'payment_processing' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'sync_failed';

// Payment Status enum
export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  price: string;
  subtotal: number;
  productImageUrl?: string;
}

export interface OrderAddress {
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
    name: string;
    code: string;
  };
  saveToProfile?: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  amount: number;
  currencyCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  guestId: string | null;
  isGift: boolean;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentReference?: string;
  subtotal: string;
  shippingCost: string;
  shippingMethod?: ShippingMethod;
  discount: string;
  total: string;
  taxAmount: string;
  taxRate: string;
  taxTitle: string;
  taxConfigurationIdApplied: string;
  paidAt?: string;
  items: OrderItem[];
  itemCount: number;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedOrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Actual API response structure
export interface ActualOrdersResponse {
  data: Order[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
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
   * Get user orders with optional filters
   */
  async getMyOrders(filters: OrderFilterParams = {}): Promise<any> {
    const params: Record<string, string | number | boolean> = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.status) params.status = filters.status;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters.search) params.search = filters.search;

    return apiRequest<any>("/orders/me", {
      params,
      requiresAuth: true,
    });
  },

  /**
   * Reorder items from a previous order
   */
  async reorderOrder(orderId: string): Promise<any> {
    return apiRequest<any>(`/orders/${orderId}/reorder`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Get order details by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    return apiRequest<Order>(`/orders/number/${orderNumber}`, {
      requiresAuth: true,
    });
  },

  /**
   * Cancel an order by order ID
   */
  async cancelOrder(orderId: string): Promise<any> {
    return apiRequest<any>(`/orders/${orderId}/cancel`, {
      method: "POST",
      requiresAuth: true,
    });
  },

};

export default orderService;
