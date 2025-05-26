import { Discount } from "@/services/product";
import { apiRequest } from "./api";

export interface CartItemDto {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    nairaPrice: number;
    imageUrl?: string;
  };
  price: string;
  subtotal: number;
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
}

const cartService = {
  // Get cart for authenticated user
  getCart: async (): Promise<CartResponseDto> => {
    return apiRequest<CartResponseDto>("/cart", { requiresAuth: true });
  },

  // Get cart for guest user using guestId
  getGuestCart: async (guestId: string): Promise<CartResponseDto> => {
    return apiRequest<CartResponseDto>(`/cart?guestId=${guestId}`, {
      requiresAuth: false,
    });
  },
  applycoupon: async (code: string): Promise<any> => {
    return apiRequest<any>(`/cart/apply-coupon`, {
      method: "POST",
      body: JSON.stringify({ couponCode: code }), // Replace with actual coupon code
      requiresAuth: true,
    });
  },
  removecoupon: async (): Promise<any> => {
    return apiRequest<any>(`/cart/remove-coupon`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },

  // Add item to cart (works for both authenticated and guest)
  addItemToCart: async (
    item: AddItemDto,
    guestId?: string
  ): Promise<CartResponseDto> => {
    // If user is authenticated, use auth token
    if (localStorage.getItem("forvrmurr_access_token")) {
      console.log("Adding item to authenticated cart");
      return apiRequest<CartResponseDto>("/cart/items", {
        method: "POST",
        body: JSON.stringify(item),
        requiresAuth: true,
      });
    }

    // For guest user with existing guestId
    if (guestId) {
      return apiRequest<CartResponseDto>("/cart/items", {
        method: "POST",
        body: JSON.stringify(item),
        requiresAuth: false,
        params: { guestId },
      });
    }

    // For new guest users (backend will generate guestId)
    return apiRequest<CartResponseDto>("/cart/items", {
      method: "POST",
      body: JSON.stringify(item),
      requiresAuth: false,
    });
  },

  // Remove item from cart
  removeItemFromCart: async (
    itemId: string,
    guestId?: string
  ): Promise<CartResponseDto> => {
    // If user is authenticated, use auth token
    if (localStorage.getItem("forvrmurr_access_token")) {
      return apiRequest<CartResponseDto>(`/cart/items/${itemId}`, {
        method: "DELETE",
        requiresAuth: true,
      });
    }

    // For guest user with existing guestId
    if (guestId) {
      return apiRequest<CartResponseDto>(`/cart/items/${itemId}`, {
        method: "DELETE",
        requiresAuth: false,
        params: { guestId },
      });
    }

    // Fallback for guests without guestId (shouldn't happen if flow is correct)
    return apiRequest<CartResponseDto>(`/cart/items/${itemId}`, {
      method: "DELETE",
      requiresAuth: false,
    });
  },

  // Update item quantity in cart
  updateItemQuantity: async (
    itemId: string,
    quantity: number,
    guestId?: string
  ): Promise<CartResponseDto> => {
    // If user is authenticated, use auth token
    if (localStorage.getItem("forvrmurr_access_token")) {
      return apiRequest<CartResponseDto>(`/cart/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
        requiresAuth: true,
      });
    }

    // For guest user with existing guestId
    if (guestId) {
      return apiRequest<CartResponseDto>(`/cart/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
        requiresAuth: false,
        params: { guestId },
      });
    }

    // Fallback for guests without guestId (shouldn't happen if flow is correct)
    return apiRequest<CartResponseDto>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
      requiresAuth: false,
    });
  },

  // Clear cart
  clearCart: async (guestId?: string): Promise<CartResponseDto> => {
    // If user is authenticated, use auth token
    if (localStorage.getItem("forvrmurr_access_token")) {
      return apiRequest<CartResponseDto>("/cart", {
        method: "DELETE",
        requiresAuth: true,
      });
    }

    // For guest user with existing guestId
    if (guestId) {
      return apiRequest<CartResponseDto>("/cart", {
        method: "DELETE",
        requiresAuth: false,
        params: { guestId },
      });
    }

    // Fallback for guests without guestId (shouldn't happen if flow is correct)
    return apiRequest<CartResponseDto>("/cart", {
      method: "DELETE",
      requiresAuth: false,
    });
  },

  // Initiate checkout process (marks cart as checked out)
  initiateCheckout: async (): Promise<CartResponseDto> => {
    return apiRequest<CartResponseDto>("/cart/initiate-checkout", {
      method: "POST",
      requiresAuth: true,
    });
  },
};

export default cartService;
