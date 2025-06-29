/**
 * ForvrMurr Analytics Utility
 * 
 * This file provides functions for tracking key e-commerce events with Google Analytics 4.
 * https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

// Check if Google Analytics is available
const isGaAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Track product view events
export const trackProductView = (product: any): void => {
  if (!isGaAvailable() || !product) return;
  
  window.gtag('event', 'view_item', {
    currency: 'NGN',
    value: Number(product.nairaPrice) || 0,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_brand: product.brand?.name || '',
      item_category: product.categories?.[0]?.name || '',
      price: Number(product.nairaPrice) || 0,
      quantity: 1
    }]
  });
};

// Track add to cart events
export const trackAddToCart = (product: any, quantity: number = 1): void => {
  if (!isGaAvailable() || !product) return;
  
  window.gtag('event', 'add_to_cart', {
    currency: 'NGN',
    value: Number(product.nairaPrice) * quantity || 0,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_brand: product.brand?.name || '',
      item_category: product.categories?.[0]?.name || '',
      price: Number(product.nairaPrice) || 0,
      quantity: quantity
    }]
  });
};

// Track begin checkout event
export const trackBeginCheckout = (cart: any[]): void => {
  if (!isGaAvailable() || !cart || cart.length === 0) return;
  
  const items = cart.map(item => ({
    item_id: item.id,
    item_name: item.name,
    item_brand: item.brand || '',
    price: Number(item.price) || 0,
    quantity: item.quantity || 1
  }));
  
  const value = cart.reduce((total, item) => 
    total + (Number(item.price) * (item.quantity || 1)), 0);
  
  window.gtag('event', 'begin_checkout', {
    currency: 'NGN',
    value,
    items
  });
};

// Track purchase events
export const trackPurchase = (
  transactionId: string, 
  cart: any[], 
  shipping: number = 0, 
  tax: number = 0
): void => {
  if (!isGaAvailable() || !cart || cart.length === 0) return;
  
  const items = cart.map(item => ({
    item_id: item.id,
    item_name: item.name,
    item_brand: item.brand || '',
    price: Number(item.price) || 0,
    quantity: item.quantity || 1
  }));
  
  const value = cart.reduce((total, item) => 
    total + (Number(item.price) * (item.quantity || 1)), 0);
  
  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'NGN',
    tax: tax,
    shipping: shipping,
    items
  });
};

// Track user sign-up
export const trackSignUp = (method: string): void => {
  if (!isGaAvailable()) return;
  
  window.gtag('event', 'sign_up', {
    method
  });
};

// Track user login
export const trackLogin = (method: string): void => {
  if (!isGaAvailable()) return;
  
  window.gtag('event', 'login', {
    method
  });
};

// Track search events
export const trackSearch = (searchTerm: string): void => {
  if (!isGaAvailable() || !searchTerm) return;
  
  window.gtag('event', 'search', {
    search_term: searchTerm
  });
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
