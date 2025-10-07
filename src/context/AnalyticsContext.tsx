"use client";

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import shopifyAnalytics, { ProductData, OrderData } from '@/services/shopifyAnalytics';
import shopifyPixelIntegration from '@/services/shopifyPixelIntegration';

interface AnalyticsContextType {
  // Page tracking
  trackPageView: (path: string, title?: string) => Promise<void>;

  // Product tracking
  trackProductView: (product: ProductData) => Promise<void>;
  trackAddToCart: (product: ProductData) => Promise<void>;
  trackRemoveFromCart: (product: ProductData) => Promise<void>;

  // E-commerce tracking
  trackCheckoutStarted: (cartItems: ProductData[], cartTotal: number) => Promise<void>;
  trackPurchase: (order: OrderData) => Promise<void>;

  // User behavior tracking
  trackUserAuth: (action: 'login' | 'register' | 'logout', userId?: string) => Promise<void>;
  trackSearch: (query: string, resultsCount?: number) => Promise<void>;
  trackQuizCompleted: (quizData: Record<string, any>) => Promise<void>;
  trackWishlistAction: (action: 'add' | 'remove', product: ProductData) => Promise<void>;
  trackSubscription: (action: 'subscribe' | 'unsubscribe' | 'modify', data: Record<string, any>) => Promise<void>;
  trackEmail: (action: 'newsletter_signup' | 'email_click' | 'email_open', data?: Record<string, any>) => Promise<void>;

  // Custom events
  trackCustomEvent: (eventName: string, data?: Record<string, any>) => Promise<void>;

  // User management
  setUserId: (userId: string) => void;
  clearUserData: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const pathname = usePathname();

  // Initialize analytics on mount
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        // Initialize Shopify Analytics API
        await shopifyAnalytics.initialize();

        // Initialize Shopify Native Pixel (CRITICAL for native reports)
        await shopifyPixelIntegration.initialize();

        // Initialize Google Analytics if available
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag?.('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
            page_title: document.title,
            page_location: window.location.href,
          });
        }
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
      }
    };

    initializeAnalytics();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const title = document.title;

        // Track with Shopify
        await shopifyAnalytics.trackPageView(pathname, title);

        // Track with Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag?.('event', 'page_view', {
            page_title: title,
            page_location: window.location.href,
            page_path: pathname,
          });
        }
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [pathname]);

  // Analytics methods that send to both platforms
  const trackPageView = async (path: string, title?: string): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackPageView(path, title);

      // Google Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', 'page_view', {
          page_title: title || document.title,
          page_location: window.location.href,
          page_path: path,
        });
      }
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  };

  const trackProductView = async (product: ProductData): Promise<void> => {
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
  };

  const trackAddToCart = async (product: ProductData): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackAddToCart(product);

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
  };

  const trackRemoveFromCart = async (product: ProductData): Promise<void> => {
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
  };

  const trackCheckoutStarted = async (cartItems: ProductData[], cartTotal: number): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackCheckoutStarted(cartItems, cartTotal);

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
  };

  const trackPurchase = async (order: OrderData): Promise<void> => {
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
  };

  const trackUserAuth = async (action: 'login' | 'register' | 'logout', userId?: string): Promise<void> => {
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
  };

  const trackSearch = async (query: string, resultsCount?: number): Promise<void> => {
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
  };

  const trackQuizCompleted = async (quizData: Record<string, any>): Promise<void> => {
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
  };

  const trackWishlistAction = async (action: 'add' | 'remove', product: ProductData): Promise<void> => {
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
  };

  const trackSubscription = async (action: 'subscribe' | 'unsubscribe' | 'modify', data: Record<string, any>): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackSubscription(action, data);

      // Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', `subscription_${action}`, {
          subscription_type: data.type,
          value: data.value,
          currency: 'NGN',
        });
      }
    } catch (error) {
      console.error(`Failed to track subscription ${action}:`, error);
    }
  };

  const trackEmail = async (action: 'newsletter_signup' | 'email_click' | 'email_open', data: Record<string, any> = {}): Promise<void> => {
    try {
      // Shopify tracking
      await shopifyAnalytics.trackEmail(action, data);

      // Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag?.('event', action, {
          email_address: data.email,
          campaign_id: data.campaignId,
        });
      }
    } catch (error) {
      console.error(`Failed to track email ${action}:`, error);
    }
  };

  const trackCustomEvent = async (eventName: string, data: Record<string, any> = {}): Promise<void> => {
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
  };

  const setUserId = (userId: string): void => {
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
  };

  const clearUserData = (): void => {
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
  };

  const value: AnalyticsContextType = {
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackCheckoutStarted,
    trackPurchase,
    trackUserAuth,
    trackSearch,
    trackQuizCompleted,
    trackWishlistAction,
    trackSubscription,
    trackEmail,
    trackCustomEvent,
    setUserId,
    clearUserData,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

// Global type for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}