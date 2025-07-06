/**
 * ForvrMurr Analytics Utility
 * 
 * This file provides functions for tracking key e-commerce events with Google Analytics 4.
 * https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

// Check if Google Analytics is available and properly configured
const isGaAvailable = (): boolean => {
  const isAvailable = typeof window !== 'undefined' && typeof window.gtag === 'function';
  const hasMeasurementId = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  
  if (!isAvailable && process.env.NODE_ENV !== 'production') {
    console.warn('Google Analytics is not available. Make sure the script is loaded correctly.');
  }
  
  if (!hasMeasurementId && process.env.NODE_ENV !== 'production') {
    console.warn('NEXT_PUBLIC_GA_MEASUREMENT_ID is not defined in your environment variables.');
  }
  
  return isAvailable;
};

// Debug mode for development environments
const isDebugMode = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_GA_DEBUG === 'true';

// Helper to log analytics events in debug mode
const logAnalyticsEvent = (eventName: string, params: any): void => {
  if (isDebugMode) {
    console.log(`📊 Analytics event fired: ${eventName}`, params);
  }
};

// Track product view events
export const trackProductView = (product: any): void => {
  try {
    if (!isGaAvailable() || !product) return;
    
    const params = {
      currency: "NGN",
      value: product.nairaPrice,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_brand: product.brand?.name,
          price: product.nairaPrice,
          quantity: 1
        }
      ]
    };
    
    window.gtag('event', 'view_item', params);
    logAnalyticsEvent('view_item', params);
  } catch (error) {
    if (isDebugMode) console.error('Error tracking product view:', error);
  }
};

// Track add to cart events
export const trackAddToCart = (product: any, quantity: number): void => {
  try {
    if (!isGaAvailable() || !product) return;
    
    const params = {
      currency: "NGN",
      value: product.price * quantity,
      items: [
        {
          item_id: product.productId || product.id,
          item_name: product.name,
          item_brand: product.brand,
          price: product.price,
          quantity
        }
      ]
    };
    
    window.gtag('event', 'add_to_cart', params);
    logAnalyticsEvent('add_to_cart', params);
  } catch (error) {
    if (isDebugMode) console.error('Error tracking add to cart:', error);
  }
};

// Track checkout start
export const trackBeginCheckout = (
  cartItems: any[],
  totalValue: number,
  currency: string = "NGN"
): void => {
  try {
    if (!isGaAvailable()) return;

    const items = cartItems.map(item => ({
      item_id: item.productId || item.id,
      item_name: item.name,
      item_brand: item.brand,
      price: item.price,
      quantity: item.quantity
    }));

    const params = {
      currency,
      value: totalValue,
      items
    };
    
    window.gtag('event', 'begin_checkout', params);
    logAnalyticsEvent('begin_checkout', params);
  } catch (error) {
    if (isDebugMode) console.error('Error tracking checkout start:', error);
  }
};

// Track purchase completion
export const trackPurchase = (
  transactionId: string,
  totalValue: number,
  tax: number,
  shipping: number,
  items: any[],
  currency: string = "NGN"
): void => {
  try {
    if (!isGaAvailable()) return;

    const params = {
      transaction_id: transactionId,
      value: totalValue,
      currency,
      tax: tax,
      shipping: shipping,
      items
    };
    
    window.gtag('event', 'purchase', params);
    logAnalyticsEvent('purchase', params);
  } catch (error) {
    if (isDebugMode) console.error('Error tracking purchase:', error);
  }
};

// Track user sign-up
export const trackSignUp = (method: string): void => {
  try {
    if (!isGaAvailable()) return;
    
    const params = { method };
    window.gtag('event', 'sign_up', params);
    logAnalyticsEvent('sign_up', params);
  } catch (error) {
    if (isDebugMode) console.error('Error tracking sign-up:', error);
  }
};

// Track user login
export const trackLogin = (method: string): void => {
  try {
    if (!isGaAvailable()) return;
    
    const params = { method };
    window.gtag('event', 'login', params);
    logAnalyticsEvent('login', params);
  } catch (error) {
    if (isDebugMode) console.error('Error tracking login:', error);
  }
};

// Track search events
export const trackSearch = (searchTerm: string): void => {
  try {
    if (!isGaAvailable()) return;
    
    const params = { search_term: searchTerm };
    window.gtag('event', 'search', params);
    logAnalyticsEvent('search', params);
  } catch (error) {
    if (isDebugMode) console.error('Error tracking search:', error);
  }
};

// Fix TypeScript errors for window.gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, any>
    ) => void;
  }
}
