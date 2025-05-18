/**
 * Application configuration
 * 
 * This file reads environment variables and provides a consistent
 * configuration interface for the application. Default values are
 * provided for development, but should be overridden in production.
 */

// Server-side accessible config
export const serverConfig = {
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API endpoints
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  
  // Server settings
  port: parseInt(process.env.NEXT_PORT || '4000', 10),
};

// Client-side accessible config (use NEXT_PUBLIC_ prefix)
export const clientConfig = {
  // Environment 
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  
  // API endpoints
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  
  // Feature flags
  enableMockApi: process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true',
};

// Default config that combines both server and client configs
// Only use this in components that can run in both environments
export const config = {
  ...serverConfig,
  ...clientConfig,
};
