import { apiRequest } from "./api";
import { Product } from "./product";

export interface WishlistItem {
  id: string;
  userId: string;
  product: Product;
  createdAt: string;
}

export interface AddToWishlistRequest {
  productId: string;
}

export interface WishlistFilterParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface WishlistResponse {
  data: WishlistItem[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  summary: {
    itemsInWishlist: number;
    totalValue: string;
    availableItems: number;
  };
}

const wishlistService = {
  /**
   * Add product to wishlist
   */
  async addToWishlist(productId: string): Promise<WishlistItem> {
    return apiRequest<WishlistItem>("/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
      requiresAuth: true,
    });
  },

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(productId: string): Promise<void> {
    return apiRequest<void>(`/wishlist/${productId}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },

  /**
   * Get user's wishlist with pagination and search
   */
  async getWishlist(filters: WishlistFilterParams = {}): Promise<WishlistResponse> {
    const params: Record<string, string | number | boolean> = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.search) params.search = filters.search;

    return apiRequest<WishlistResponse>("/wishlist", {
      params,
      requiresAuth: true,
    });
  },

  /**
   * Check if product is in wishlist
   */
  async isInWishlist(productId: string): Promise<boolean> {
    try {
      return apiRequest<boolean>(`/wishlist/${productId}/check`, {
        requiresAuth: true,
      });
    } catch {
      return false;
    }
  },
};

export default wishlistService;