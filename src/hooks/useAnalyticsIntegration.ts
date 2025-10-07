/**
 * Analytics Integration Hook
 * Provides analytics functionality that can be used across components
 */

import { useCallback } from 'react';
import shopifyAnalytics, { ProductData, OrderData } from '@/services/shopifyAnalytics';
import shopifyPixelIntegration from '@/services/shopifyPixelIntegration';

export const useAnalyticsIntegration = () => {
  // Track product view
  const trackProductView = useCallback(async (product: ProductData): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackProductView(product);

      // Google Analytics Enhanced E-commerce
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', 'view_item', {
          currency: 'NGN',
          value: product.price,
          items: [{
            item_id: product.productId,
            item_name: product.name,
            item_category: product.category || 'Fragrance',
            item_variant: product.variantId,
            price: product.price,
            quantity: 1,
          }],
        });
      }
    } catch (error) {
      console.error('Failed to track product view:', error);
    }
  }, []);

  // Track add to cart
  const trackAddToCart = useCallback(async (product: ProductData): Promise<void> => {
    try {
      // Shopify API tracking
      await shopifyAnalytics.trackAddToCart(product);

      // Shopify Native Pixel tracking (for native reports)
      shopifyPixelIntegration.trackAddToCart(
        product.productId,
        product.variantId || product.productId,
        product.quantity || 1,
        product.price
      );

      // Google Analytics Enhanced E-commerce
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', 'add_to_cart', {
          currency: 'NGN',
          value: product.price * (product.quantity || 1),
          items: [{
            item_id: product.productId,
            item_name: product.name,
            item_category: product.category || 'Fragrance',
            item_variant: product.variantId,
            price: product.price,
            quantity: product.quantity || 1,
          }],
        });
      }
    } catch (error) {
      console.error('Failed to track add to cart:', error);
    }
  }, []);

  // Track remove from cart
  const trackRemoveFromCart = useCallback(async (product: ProductData): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackRemoveFromCart(product);

      // Google Analytics Enhanced E-commerce
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', 'remove_from_cart', {
          currency: 'NGN',
          value: product.price * (product.quantity || 1),
          items: [{
            item_id: product.productId,
            item_name: product.name,
            item_category: product.category || 'Fragrance',
            item_variant: product.variantId,
            price: product.price,
            quantity: product.quantity || 1,
          }],
        });
      }
    } catch (error) {
      console.error('Failed to track remove from cart:', error);
    }
  }, []);

  // Track checkout started
  const trackCheckoutStarted = useCallback(async (cartItems: ProductData[], cartTotal: number): Promise<void> => {
    try {
      // Shopify API tracking
      await shopifyAnalytics.trackCheckoutStarted(cartItems, cartTotal);

      // Shopify Native Pixel tracking (CRITICAL for conversion reports)
      shopifyPixelIntegration.trackCheckoutStarted(
        cartTotal,
        cartItems.length,
        cartItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId || item.productId,
          quantity: item.quantity || 1,
          price: item.price,
        }))
      );

      // Google Analytics Enhanced E-commerce
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', 'begin_checkout', {
          currency: 'NGN',
          value: cartTotal,
          items: cartItems.map(item => ({
            item_id: item.productId,
            item_name: item.name,
            item_category: item.category || 'Fragrance',
            item_variant: item.variantId,
            price: item.price,
            quantity: item.quantity || 1,
          })),
        });
      }
    } catch (error) {
      console.error('Failed to track checkout started:', error);
    }
  }, []);

  // Track purchase
  const trackPurchase = useCallback(async (order: OrderData): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackPurchase(order);

      // Google Analytics Enhanced E-commerce
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', 'purchase', {
          transaction_id: order.orderNumber,
          value: order.total,
          currency: order.currency,
          tax: order.tax,
          shipping: order.shipping,
          items: order.items.map(item => ({
            item_id: item.productId,
            item_name: item.name,
            item_category: item.category || 'Fragrance',
            item_variant: item.variantId,
            price: item.price,
            quantity: item.quantity || 1,
          })),
        });
      }
    } catch (error) {
      console.error('Failed to track purchase:', error);
    }
  }, []);

  // Track user authentication
  const trackUserAuth = useCallback(async (action: 'login' | 'register' | 'logout', userId?: string): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackUserAuth(action, userId);

      // Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', action, {
          method: 'email',
          user_id: userId,
        });

        // Set user ID for Google Analytics
        if (userId && action !== 'logout') {
          window.gtag?.('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
            user_id: userId,
          });
        }
      }
    } catch (error) {
      console.error(`Failed to track user ${action}:`, error);
    }
  }, []);

  // Track search
  const trackSearch = useCallback(async (query: string, resultsCount?: number): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackSearch(query, resultsCount);

      // Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', 'search', {
          search_term: query,
          results_count: resultsCount,
        });
      }
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  }, []);

  // Track quiz completion
  const trackQuizCompleted = useCallback(async (quizData: Record<string, any>): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackQuizCompleted(quizData);

      // Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', 'quiz_completed', {
          quiz_type: 'fragrance_preference',
          engagement_time_msec: quizData.completion_time,
        });
      }
    } catch (error) {
      console.error('Failed to track quiz completion:', error);
    }
  }, []);

  // Track wishlist actions
  const trackWishlistAction = useCallback(async (action: 'add' | 'remove', product: ProductData): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackWishlistAction(action, product);

      // Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist', {
          currency: 'NGN',
          value: product.price,
          items: [{
            item_id: product.productId,
            item_name: product.name,
            item_category: product.category || 'Fragrance',
            item_variant: product.variantId,
            price: product.price,
            quantity: 1,
          }],
        });
      }
    } catch (error) {
      console.error(`Failed to track wishlist ${action}:`, error);
    }
  }, []);

  // Track custom events
  const trackCustomEvent = useCallback(async (eventName: string, data: Record<string, any> = {}): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackEvent(eventName, data);

      // Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', eventName, data);
      }
    } catch (error) {
      console.error(`Failed to track custom event ${eventName}:`, error);
    }
  }, []);

  // Set user ID
  const setUserId = useCallback((userId: string): void => {
    try {
      // Set for Shopify
      shopifyAnalytics.setCustomerId(userId);

      // Set for Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
          user_id: userId,
        });
      }
    } catch (error) {
      console.error('Failed to set user ID:', error);
    }
  }, []);

  // Clear user data
  const clearUserData = useCallback((): void => {
    try {
      // Clear Shopify data
      shopifyAnalytics.clearCustomerData();

      // Clear Google Analytics user ID
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
          user_id: null,
        });
      }
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }, []);

  return {
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackCheckoutStarted,
    trackPurchase,
    trackUserAuth,
    trackSearch,
    trackQuizCompleted,
    trackWishlistAction,
    trackCustomEvent,
    setUserId,
    clearUserData,
  };
};

// Global type for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}