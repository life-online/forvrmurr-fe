import { api } from './api';
import { clientConfig } from '@/config';

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

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Token storage keys
const ACCESS_TOKEN_KEY = 'forvrmurr_access_token';
const REFRESH_TOKEN_KEY = 'forvrmurr_refresh_token';
const USER_DATA_KEY = 'forvrmurr_user';

/**
 * Authentication service for managing user login, registration, and auth state
 */
export const authService = {
  /**
   * Login a user with email and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    // Convert to compatible type using destructuring and rest to create a new object
    const data = { ...credentials };
    const response = await api.post<{ user: User; tokens: AuthTokens }>('/auth/login', data);
    
    // Store tokens and user data
    this.setTokens(response.tokens);
    this.setUser(response.user);
    
    return response.user;
  },
  
  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<User> {
    // Convert to compatible type using destructuring and rest to create a new object
    const data = { ...userData };
    const response = await api.post<{ user: User; tokens: AuthTokens }>('/auth/register', data);
    
    // Store tokens and user data if auto-login is enabled
    if (response.tokens) {
      this.setTokens(response.tokens);
      this.setUser(response.user);
    }
    
    return response.user;
  },
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      // Notify backend about logout to invalidate tokens
      if (this.isAuthenticated()) {
        await api.post('/auth/logout', {}, { requiresAuth: true });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API success
      this.clearTokens();
      this.clearUser();
    }
  },
  
  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    // Return cached user if available
    const cachedUser = this.getUser();
    if (cachedUser) {
      return cachedUser;
    }
    
    // User not in cache but we have a token - fetch user data
    if (this.getAccessToken()) {
      try {
        const user = await api.get<User>('/auth/me', { requiresAuth: true });
        this.setUser(user);
        return user;
      } catch (error) {
        // Token might be invalid
        this.clearTokens();
        return null;
      }
    }
    
    return null;
  },
  
  /**
   * Check if the user is authenticated (has a valid token)
   */
  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  },
  
  /**
   * Store authentication tokens
   */
  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    
    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  },
  
  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  /**
   * Get the current refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  /**
   * Clear authentication tokens
   */
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  
  /**
   * Store user data
   */
  setUser(user: User): void {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  },
  
  /**
   * Get stored user data
   */
  getUser(): User | null {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  },
  
  /**
   * Clear stored user data
   */
  clearUser(): void {
    localStorage.removeItem(USER_DATA_KEY);
  },
  
  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/request-password-reset', { email });
  },
  
  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, newPassword });
  },
  
  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<User>): Promise<User> {
    const updatedUser = await api.patch<User>('/auth/profile', profileData, { requiresAuth: true });
    this.setUser(updatedUser);
    return updatedUser;
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
