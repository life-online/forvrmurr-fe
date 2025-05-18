import { clientConfig } from '@/config';

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
export async function apiRequest<T = any>(
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
  if (!headers.has('Content-Type') && !fetchOptions.body) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add auth token if required
  if (requiresAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Make the request
  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
  });

  // Handle errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `API error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
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
  get: <T = any>(endpoint: string, options?: ApiOptions) => 
    apiRequest<T>(endpoint, { method: 'GET', ...options }),
    
  post: <T = any>(endpoint: string, data?: any, options?: ApiOptions) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),
    
  put: <T = any>(endpoint: string, data?: any, options?: ApiOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),
    
  patch: <T = any>(endpoint: string, data?: any, options?: ApiOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),
    
  delete: <T = any>(endpoint: string, options?: ApiOptions) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
};
