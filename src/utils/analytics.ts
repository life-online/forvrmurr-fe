/**
 * ForvrMurr Analytics Utility
 *
 * This file provides functions for tracking key e-commerce events with:
 * - Google Analytics 4 (GA4)
 * - Shopify Analytics
 *
 * https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

import shopifyAnalytics from '@/services/shopifyAnalytics';

// Check if Google Analytics is available and properly configured
const isGaAvailable = (): boolean => {
  const isAvailable = typeof window !== 'undefined' && typeof window.gtag === 'function';
  const hasMeasurementId = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  if (!isAvailable && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ Google Analytics is not available. Make sure the script is loaded correctly.');
  }

  if (!hasMeasurementId && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️ NEXT_PUBLIC_GA_MEASUREMENT_ID is not defined in your environment variables.');
  }

  return isAvailable;
};

// Debug mode for development environments - always log in development
const isDebugMode = process.env.NODE_ENV !== 'production';

// Helper to log analytics events
const logAnalyticsEvent = (eventName: string, params: any, platform: 'GA4' | 'Shopify' | 'Both' = 'Both'): void => {
  if (isDebugMode) {
    console.log(`📊 [${platform}] Analytics event: ${eventName}`, params);
  }
};

// Track product view events (GA4 + Shopify)
export const trackProductView = (product: any): void => {
  try {
    if (!product) return;

    // Google Analytics 4
    if (isGaAvailable()) {
      const ga4Params = {
        currency: "NGN",
        value: product.nairaPrice,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_brand: product.brand?.name,
            item_category: product.categories?.[0]?.name || 'Fragrance',
            price: product.nairaPrice,
            quantity: 1
          }
        ]
      };
      window.gtag?.('event', 'view_item', ga4Params);
      logAnalyticsEvent('view_item', ga4Params, 'GA4');
    }

    // Shopify Analytics
    shopifyAnalytics.trackProductView({
      productId: product.id,
      variantId: product.id,
      sku: product.slug,
      name: product.name,
      price: Number(product.nairaPrice),
      quantity: 1,
      category: product.categories?.[0]?.name || 'Fragrance',
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify tracking error:', err);
    });

  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking product view:', error);
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
    
    window.gtag?.('event', 'add_to_cart', params);
    logAnalyticsEvent('add_to_cart', params);
  } catch (error) {
    if (isDebugMode) console.error('Error tracking add to cart:', error);
  }
};

// Track checkout start (GA4 + Shopify)
export const trackBeginCheckout = (
  cartItems: any[],
  totalValue: number,
  currency: string = "NGN"
): void => {
  try {
    const items = cartItems.map(item => ({
      item_id: item.productId || item.id,
      item_name: item.name,
      item_brand: item.brand,
      item_category: item.category || 'Fragrance',
      price: item.price,
      quantity: item.quantity
    }));

    // Google Analytics 4
    if (isGaAvailable()) {
      const ga4Params = {
        currency,
        value: totalValue,
        items
      };
      window.gtag?.('event', 'begin_checkout', ga4Params);
      logAnalyticsEvent('begin_checkout', ga4Params, 'GA4');
    }

    // Shopify Analytics
    const shopifyItems = cartItems.map(item => ({
      productId: item.productId || item.id,
      variantId: item.variantId || item.productId || item.id,
      sku: item.sku || item.slug || item.productId || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category || 'Fragrance',
    }));

    shopifyAnalytics.trackCheckoutStarted(shopifyItems, totalValue).catch(err => {
      if (isDebugMode) console.error('❌ Shopify checkout tracking error:', err);
    });

  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking checkout start:', error);
  }
};

// Track purchase completion (GA4 + Shopify)
export const trackPurchase = (
  transactionId: string,
  totalValue: number,
  tax: number,
  shipping: number,
  items: any[],
  currency: string = "NGN",
  email?: string
): void => {
  try {
    // Google Analytics 4
    if (isGaAvailable()) {
      const ga4Params = {
        transaction_id: transactionId,
        value: totalValue,
        currency,
        tax: tax,
        shipping: shipping,
        items: items.map(item => ({
          item_id: item.productId || item.id,
          item_name: item.name,
          item_brand: item.brand,
          item_category: item.category || 'Fragrance',
          price: item.price,
          quantity: item.quantity
        }))
      };
      window.gtag?.('event', 'purchase', ga4Params);
      logAnalyticsEvent('purchase', ga4Params, 'GA4');
    }

    // Shopify Analytics
    const shopifyItems = items.map(item => ({
      productId: item.productId || item.id,
      variantId: item.variantId || item.productId || item.id,
      sku: item.sku || item.slug || '',
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category || 'Fragrance',
    }));

    shopifyAnalytics.trackPurchase({
      orderId: transactionId,
      orderNumber: transactionId,
      email: email,
      total: totalValue,
      subtotal: totalValue - tax - shipping,
      tax: tax,
      shipping: shipping,
      currency: currency,
      items: shopifyItems
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify purchase tracking error:', err);
    });

  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking purchase:', error);
  }
};

// Track user sign-up
export const trackSignUp = (method: string): void => {
  try {
    if (!isGaAvailable()) return;
    
    const params = { method };
    window.gtag?.('event', 'sign_up', params);
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
    window.gtag?.('event', 'login', params);
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
    window.gtag?.('event', 'search', params);
    logAnalyticsEvent('search', params);
  } catch (error) {
    if (isDebugMode) console.error('Error tracking search:', error);
  }
};

// Track view_item_list (product listing pages)
export const trackViewItemList = (products: any[], listName: string = 'Shop'): void => {
  try {
    if (!isGaAvailable() || !products || products.length === 0) return;

    const items = products.map((product, index) => ({
      item_id: product.id,
      item_name: product.name,
      item_brand: product.brand?.name,
      item_category: product.categories?.[0]?.name || 'Fragrance',
      price: product.nairaPrice,
      index: index,
      item_list_name: listName
    }));

    const params = {
      item_list_name: listName,
      items: items.slice(0, 10) // GA4 limit
    };

    window.gtag?.('event', 'view_item_list', params);
    logAnalyticsEvent('view_item_list', params, 'GA4');
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking item list view:', error);
  }
};

// Track select_item (when user clicks on a product)
export const trackSelectItem = (product: any, listName: string = 'Shop', index?: number): void => {
  try {
    if (!isGaAvailable() || !product) return;

    const params = {
      item_list_name: listName,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand?.name,
        item_category: product.categories?.[0]?.name || 'Fragrance',
        price: product.nairaPrice,
        index: index
      }]
    };

    window.gtag?.('event', 'select_item', params);
    logAnalyticsEvent('select_item', params, 'GA4');
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking item selection:', error);
  }
};

// Track view_cart
export const trackViewCart = (cartItems: any[], totalValue: number): void => {
  try {
    if (!isGaAvailable() || !cartItems || cartItems.length === 0) return;

    const params = {
      currency: 'NGN',
      value: totalValue,
      items: cartItems.map(item => ({
        item_id: item.productId || item.id,
        item_name: item.name,
        item_brand: item.brand,
        item_category: item.category || 'Fragrance',
        price: item.price,
        quantity: item.quantity
      }))
    };

    window.gtag?.('event', 'view_cart', params);
    logAnalyticsEvent('view_cart', params, 'GA4');
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking cart view:', error);
  }
};

// Track remove_from_cart
export const trackRemoveFromCart = (product: any, quantity: number): void => {
  try {
    if (!isGaAvailable() || !product) return;

    const params = {
      currency: 'NGN',
      value: product.price * quantity,
      items: [{
        item_id: product.productId || product.id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category || 'Fragrance',
        price: product.price,
        quantity: quantity
      }]
    };

    window.gtag?.('event', 'remove_from_cart', params);
    logAnalyticsEvent('remove_from_cart', params, 'GA4');
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking remove from cart:', error);
  }
};

// Track page view (custom implementation)
export const trackPageView = (url: string, title: string): void => {
  try {
    if (!isGaAvailable()) return;

    window.gtag?.('event', 'page_view', {
      page_path: url,
      page_title: title
    });

    if (isDebugMode) {
      console.log(`📊 [GA4] Page view: ${title} (${url})`);
    }
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking page view:', error);
  }
};

// Fix TypeScript errors for window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
