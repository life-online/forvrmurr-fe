import { clientConfig } from "@/config";

/**
 * API service utilities for making requests to the backend
 */

const API_BASE_URL = clientConfig.apiBaseUrl;

interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  requiresAuth?: boolean;
}

/**
 * Makes a fetch request to the API
 * @param endpoint - API endpoint (without base URL)
 * @param options - Request options
 * @returns Promise with response data
 */
export async function apiRequest<T = Record<string, unknown>>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { params, requiresAuth = false, ...fetchOptions } = options;

  // Build URL with query parameters
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  // Add default headers
  const headers = new Headers(fetchOptions.headers);
  // Always set Content-Type for JSON requests unless specifically overridden
  if (
    !headers.has("Content-Type") &&
    !(fetchOptions.body instanceof FormData)
  ) {
    // Only set Content-Type to application/json if body is not FormData
    headers.set("Content-Type", "application/json");
  }

  // Add auth token if required
  if (requiresAuth) {
    const token = localStorage.getItem("forvrmurr_access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      // If auth is required but no token is found, redirect to login
      console.warn(
        "Authentication required but no token found. Redirecting to login."
      );
      // It's better to use Next.js router for client-side navigation
      // but for simplicity in this example, we'll use window.location.
      // In a real Next.js app, you'd use:
      // import { useRouter } from 'next/navigation';
      // const router = useRouter();
      // router.push('/auth/login');
      localStorage.removeItem("forvrmurr_access_token");
      localStorage.removeItem("forvrmurr_user"); // Assuming you store user info
      window.location.href = "/auth/login"; // Redirect to login page
      throw new Error("Authentication token missing."); // Stop the request
    }
  }

  // Log the request details for debugging
  console.log("API Request:", {
    url: url.toString(),
    method: fetchOptions.method,
    headers: Object.fromEntries(headers.entries()),
    body: fetchOptions.body,
  });

  // Make the request
  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
  });

  // Handle errors
  if (!response.ok) {
    // --- START: 401 Unauthorized Handling ---
    if (response.status === 401) {
      console.warn("API Error: 401 Unauthorized");
      
      // Check if user is a guest before clearing tokens
      const user = JSON.parse(localStorage.getItem("forvrmurr_user") || "{}");
      const isGuest = user?.isGuest === true;
      
      // Only clear tokens if not a guest user
      if (!isGuest) {
        console.log("Clearing tokens for non-guest user");
        localStorage.removeItem("forvrmurr_access_token");
        localStorage.removeItem("forvrmurr_user");
      } else {
        console.log("Preserving guest tokens for registration flow");
      }
      
      // Don't force a redirect - let the component handle it
      // window.location.href = "/auth/login";
      
      // Just throw the error with appropriate message
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || "Unauthorized: Session expired or invalid token."
      );
      // @ts-ignore - Add additional properties to the error
      error.status = response.status;
      // @ts-ignore
      error.data = errorData;
      throw error;
    }
    // --- END: 401 Unauthorized Handling ---

    const errorData = await response.json().catch(() => ({}));
    console.error("API Error Response:", {
      status: response.status,
      url: response.url,
      errorData,
    });
    // Create a more detailed error object
    const error = new Error(
      errorData.message ||
        `API error: ${response.status} ${response.statusText}`
    );
    // @ts-ignore - Add additional properties to the error
    error.status = response.status;
    // @ts-ignore
    error.data = errorData;
    throw error;
  }

  // Parse and return the response
  if (response.status === 204) {
    return {} as T; // No content
  }

  return response.json();
}

/**
 * API utility methods for common operations
 */
export const api = {
  get: <T = Record<string, unknown>>(endpoint: string, options?: ApiOptions) =>
    apiRequest<T>(endpoint, { method: "GET", ...options }),

  post: <T = Record<string, unknown>>(
    endpoint: string,
    data?: Record<string, unknown> | FormData,
    options?: ApiOptions
  ) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body:
        data instanceof FormData
          ? data
          : data
          ? JSON.stringify(data)
          : undefined,
      ...options,
    }),

  put: <T = Record<string, unknown>>(
    endpoint: string,
    data?: Record<string, unknown> | FormData,
    options?: ApiOptions
  ) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body:
        data instanceof FormData
          ? data
          : data
          ? JSON.stringify(data)
          : undefined,
      ...options,
    }),

  patch: <T = Record<string, unknown>>(
    endpoint: string,
    data?: Record<string, unknown> | FormData,
    options?: ApiOptions
  ) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body:
        data instanceof FormData
          ? data
          : data
          ? JSON.stringify(data)
          : undefined,
      ...options,
    }),

  delete: <T = Record<string, unknown>>(
    endpoint: string,
    options?: ApiOptions
  ) => apiRequest<T>(endpoint, { method: "DELETE", ...options }),
};
