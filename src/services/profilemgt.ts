import { api } from "./api";
import { clientConfig } from "@/config";

// Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface ProductAttributeFetchResponse {
  data: ProductAttribute[];
  limit: number;
  page: number;
  total: number;
}

/**
 * Authentication service for managing user login, registration, and auth state
 */
export const profileMgtService = {
  async requestPasswordReset(email: string): Promise<void> {
    await api.post("/auth/request-password-reset", { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post("/auth/reset-password", { token, newPassword });
  },

  /**
   * Update user profile
   */
  async getProductAttributesMoods(): Promise<ProductAttributeFetchResponse | null> {
    try {
      const response = await api.get<ProductAttributeFetchResponse>(
        "products/moods"
      );

      return response;
    } catch (error) {
      // Token might be invalid
      //   this.clearTokens();
      return null;
    }

    return null;
  },
  async getScentTypesAttributesMoods(): Promise<ProductAttributeFetchResponse | null> {
    try {
      const response = await api.get<ProductAttributeFetchResponse>(
        "products/scent-types"
      );

      return response;
    } catch (error) {
      // Token might be invalid
      //   this.clearTokens();
      return null;
    }

    return null;
  },
  async getProductAttributesFragranceFamily(): Promise<ProductAttributeFetchResponse | null> {
    try {
      const response = await api.get<ProductAttributeFetchResponse>(
        "products/fragrance-families"
      );

      return response;
    } catch (error) {
      // Token might be invalid
      //   this.clearTokens();
      return null;
    }

    return null;
  },
  async getProductAttributesOccasion(): Promise<ProductAttributeFetchResponse | null> {
    try {
      const response = await api.get<ProductAttributeFetchResponse>(
        "products/occasions"
      );

      return response;
    } catch (error) {
      // Token might be invalid
      //   this.clearTokens();
      return null;
    }

    return null;
  },
  async getProductAttributesFragranceNotes(): Promise<ProductAttributeFetchResponse | null> {
    try {
      const response = await api.get<ProductAttributeFetchResponse>(
        "fragrance-notes"
      );

      return response;
    } catch (error) {
      // Token might be invalid
      //   this.clearTokens();
      return null;
    }

    return null;
  },
};

// Add interceptor to automatically include auth token in requests
// This should be implemented in your API service
// It's listed here to make the authentication flow clearer
/*
  api.addRequestInterceptor((config) => {
    if (config.requiresAuth) {
      const token = authService.getAccessToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
    }
    return config;
  });
*/
