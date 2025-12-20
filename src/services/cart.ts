import { Discount } from "@/services/product";
import { apiRequest } from "./api";
import { authService } from "./auth";

export interface CartItemDto {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    brandName: string | null;
    slug: string;
    nairaPrice: number;
    imageUrl?: string;
  };
  price: string;
  subtotal: number;
  variantId?: string;
  variantTitle?: string;
}

export interface CartDiscountDto {
  title: string;
  code: string;
  amountDeducted: number;
}
export interface CartResponseDto {
  id: string;
  userId: string | null;
  guestId: string | null;
  items: CartItemDto[];
  subtotal: number;
  totalItems: number;
  isEmpty: boolean;
  createdAt: string;
  updatedAt: string;

  itemCount: number;
  discount: number;
  total: number;
  appliedCouponCode: string | null;
  hasFreeShipping: boolean;
  appliedDiscounts: CartDiscountDto[];
}

export interface AddItemDto {
  productId: string;
  quantity: number;
  variantId?: string;
}

const cartService = {
  // Simplified - automatic guest authentication handles everything
  getCart: async (): Promise<CartResponseDto> => {
    // Ensure authentication before cart operations
    await authService.ensureAuthentication();
    return apiRequest<CartResponseDto>("/cart", { requiresAuth: true });
  },
  addItemToCart: async (item: AddItemDto): Promise<CartResponseDto> => {
    // Ensure authentication before adding items
    await authService.ensureAuthentication();
    return apiRequest<CartResponseDto>("/cart/items", {
      method: "POST",
      body: JSON.stringify(item),
      requiresAuth: true,
    });
  },

  removeItemFromCart: async (itemId: string): Promise<CartResponseDto> => {
    await authService.ensureAuthentication();
    return apiRequest<CartResponseDto>(`/cart/items/${itemId}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },

  updateItemQuantity: async (itemId: string, quantity: number): Promise<CartResponseDto> => {
    await authService.ensureAuthentication();
    return apiRequest<CartResponseDto>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
      requiresAuth: true,
    });
  },

  clearCart: async (): Promise<CartResponseDto> => {
    await authService.ensureAuthentication();
    return apiRequest<CartResponseDto>("/cart", {
      method: "DELETE",
      requiresAuth: true,
    });
  },

  // Keep existing coupon methods as they are
  applycoupon: async (code: string): Promise<any> => {
    await authService.ensureAuthentication();
    return apiRequest<any>(`/cart/apply-coupon`, {
      method: "POST",
      body: JSON.stringify({ couponCode: code }),
      requiresAuth: true,
    });
  },

  removecoupon: async (): Promise<any> => {
    await authService.ensureAuthentication();
    return apiRequest<any>(`/cart/remove-coupon`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },

  // Initiate checkout process (marks cart as checked out)
  initiateCheckout: async (): Promise<CartResponseDto> => {
    await authService.ensureAuthentication();
    return apiRequest<CartResponseDto>("/cart/initiate-checkout", {
      method: "POST",
      requiresAuth: true,
    });
  },
};

export default cartService;
