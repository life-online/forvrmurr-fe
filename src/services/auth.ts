import { api } from "./api";
import { clientConfig } from "@/config";

// Types
export interface User {
  id: string;
  firstName?: string; // Now optional for guests
  lastName?: string;  // Now optional for guests
  email?: string;     // Now optional for guests
  phoneNumber?: string;
  userType: 'guest' | 'registered'; // Track user type
  role: string;
  isEmailVerified?: boolean;
  isRegistered?: boolean; // Explicit registration tracking
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  emailOrPhone: string; // Can be email or phone number
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: string; // default to 'customer'
}

// Token storage keys
const ACCESS_TOKEN_KEY = "forvrmurr_access_token";
const REFRESH_TOKEN_KEY = "forvrmurr_refresh_token";
const USER_DATA_KEY = "forvrmurr_user";
const GUEST_ID_KEY = "forvrmurr_guest_id";

/**
 * Authentication service for managing user login, registration, and auth state
 */
export const authService = {
  /**
   * Login a user with email/phone and password
   */
  async login(
    credentials: LoginCredentials
  ): Promise<{ access_token: string; user: User }> {
    // Send emailOrPhone field to backend
    const emailOrPhone = credentials.emailOrPhone;
    const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailOrPhone);
      
    const data = {
      email: isEmail ? emailOrPhone : null,
      phoneNumber: !isEmail ? emailOrPhone : null,
      password: credentials.password
    };

    // Include current guest JWT if exists for automatic conversion
    const headers: any = {};
    if (this.isAuthenticated() && this.isGuest()) {
      headers.Authorization = `Bearer ${this.getAccessToken()}`;
    }

    try {
      const response = await api.post<{ access_token: string; user: User }>(
        "/auth/login",
        data,
        { headers }
      );
      
      // Store access token and user data
      this.setTokens({ accessToken: response.access_token });
      this.setUser(response.user);

      // Clear guest ID if it was used (legacy cleanup)
      this.clearGuestId();

      return response;
    } catch (error: any) {
      // Check for specific guest user login error
      if (error?.message === "Guest users cannot log in with password" || 
          (error?.response?.data?.message === "Guest users cannot log in with password")) {
        throw new Error("This appears to be a guest account. Please register to create a permanent account.");
      }
      // Re-throw other errors
      throw error;
    }
  },

  /**
   * Register a new user
   */
  async register(
    userData: RegisterData
  ): Promise<{ access_token: string; user: User }> {
    // Format exactly as the successful curl request
    const payload = {
      email: String(userData.email).trim(),
      password: String(userData.password),
      firstName: String(userData.firstName).trim(),
      lastName: String(userData.lastName).trim(),
      phoneNumber: String(userData.phoneNumber).trim(),
      role: String(userData.role || "customer"),
    };

    console.log("Registration payload:", JSON.stringify(payload)); // For debugging

    console.log("isAuthenticated:", this.isAuthenticated());
    console.log("isGuest:", this.isGuest());

    // Include current guest JWT if exists for automatic conversion
    const headers: any = {};
    if (this.isAuthenticated() && this.isGuest()) {
      headers.Authorization = `Bearer ${this.getAccessToken()}`;
    }

    // Make a direct fetch request to ensure exact format
    const response = await api.post<{ access_token: string; user: User }>(
      "/auth/register",
      payload,
      { headers }
    );

    // Store new registered user tokens
    this.setTokens({ accessToken: response.access_token });
    this.setUser(response.user);

    // Clear guest ID if it was used (legacy cleanup)
    this.clearGuestId();

    return response;
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      // Notify backend about logout to invalidate tokens
      if (this.isAuthenticated()) {
        await api.post("auth/logout", {}, { requiresAuth: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
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
        const user = await api.get<User>("auth/me", { requiresAuth: true });
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

  getGuestId(): string | null {
    return localStorage.getItem(GUEST_ID_KEY);
  },

  clearGuestId(): void {
    localStorage.removeItem(GUEST_ID_KEY);
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
    await api.post("/auth/forgot-password", { emailOrPhone: email });
  },

  async resetPassword(
    token: string,
    email: string,
    newPassword: string
  ): Promise<void> {
    await api.post("/auth/reset-password", { token, email, newPassword });
  },

  async verifyEmail(email: string, token: string): Promise<void> {
    await api.post("/auth/verify-email", { email, token });
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<User>): Promise<User> {
    const updatedUser = await api.patch<User>("/auth/profile", profileData, {
      requiresAuth: true,
    });
    this.setUser(updatedUser);
    return updatedUser;
  },

  /**
   * Create guest user and get JWT token
   */
  async createGuest(): Promise<{ access_token: string; user: User }> {
    const response = await api.post<{ access_token: string; user: User }>(
      "/auth/create-guest"
    );

    // Store guest token and user data
    this.setTokens({ accessToken: response.access_token });
    this.setUser(response.user);

    return response;
  },

  /**
   * Ensure user has authentication token (guest or registered)
   */
  async ensureAuthentication(): Promise<string> {
    let token = this.getAccessToken();

    if (!token) {
      console.log("No token found, creating guest user...");
      const guestResponse = await this.createGuest();
      token = guestResponse.access_token;
    }

    return token;
  },

  /**
   * Check if current user is a guest
   */
  isGuest(): boolean {
    const user = this.getUser();
    return user?.userType === "guest";
  },

  /**
   * Check if current user is registered
   */
  isRegistered(): boolean {
    const user = this.getUser();
    return user?.userType === "registered" || user?.isRegistered === true;
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
