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

// ==================== WISHLIST TRACKING ====================

// Track add to wishlist
export const trackAddToWishlist = (product: any): void => {
  try {
    // Google Analytics 4
    if (isGaAvailable()) {
      const params = {
        currency: 'NGN',
        value: product.price || product.nairaPrice,
        items: [{
          item_id: product.id || product.productId,
          item_name: product.name,
          item_brand: product.brand?.name || product.brand,
          item_category: product.categories?.[0]?.name || product.category || 'Fragrance',
          price: product.price || product.nairaPrice,
        }]
      };
      window.gtag?.('event', 'add_to_wishlist', params);
      logAnalyticsEvent('add_to_wishlist', params, 'GA4');
    }

    // Shopify Analytics
    shopifyAnalytics.trackWishlistAction('add', {
      productId: product.id || product.productId,
      variantId: product.variantId || product.id,
      sku: product.sku || product.slug,
      name: product.name,
      price: Number(product.price || product.nairaPrice),
      category: product.categories?.[0]?.name || product.category || 'Fragrance',
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify wishlist tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking add to wishlist:', error);
  }
};

// Track remove from wishlist
export const trackRemoveFromWishlist = (product: any): void => {
  try {
    // Google Analytics 4
    if (isGaAvailable()) {
      const params = {
        currency: 'NGN',
        value: product.price || product.nairaPrice,
        items: [{
          item_id: product.id || product.productId,
          item_name: product.name,
          item_brand: product.brand?.name || product.brand,
          item_category: product.categories?.[0]?.name || product.category || 'Fragrance',
          price: product.price || product.nairaPrice,
        }]
      };
      window.gtag?.('event', 'remove_from_wishlist', params);
      logAnalyticsEvent('remove_from_wishlist', params, 'GA4');
    }

    // Shopify Analytics
    shopifyAnalytics.trackWishlistAction('remove', {
      productId: product.id || product.productId,
      variantId: product.variantId || product.id,
      sku: product.sku || product.slug,
      name: product.name,
      price: Number(product.price || product.nairaPrice),
      category: product.categories?.[0]?.name || product.category || 'Fragrance',
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify wishlist tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking remove from wishlist:', error);
  }
};

// Track wishlist viewed
export const trackViewWishlist = (totalValue: number, itemCount: number): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'view_wishlist', {
        currency: 'NGN',
        value: totalValue,
        item_count: itemCount
      });
      logAnalyticsEvent('view_wishlist', { totalValue, itemCount }, 'GA4');
    }

    shopifyAnalytics.trackEvent('wishlist_viewed', {
      total_value: totalValue,
      item_count: itemCount,
      currency: 'NGN'
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify wishlist view tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking wishlist view:', error);
  }
};

// ==================== SEARCH TRACKING ====================

// Track search
export const trackSearchQuery = (searchTerm: string, resultsCount?: number): void => {
  try {
    // Google Analytics 4
    if (isGaAvailable()) {
      const params = {
        search_term: searchTerm,
        results_count: resultsCount
      };
      window.gtag?.('event', 'search', params);
      logAnalyticsEvent('search', params, 'GA4');
    }

    // Shopify Analytics
    shopifyAnalytics.trackSearch(searchTerm, resultsCount).catch(err => {
      if (isDebugMode) console.error('❌ Shopify search tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking search:', error);
  }
};

// ==================== QUIZ TRACKING ====================

// Track quiz started
export const trackQuizStarted = (quizType: string = 'fragrance_finder'): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'quiz_started', {
        quiz_type: quizType
      });
      logAnalyticsEvent('quiz_started', { quizType }, 'GA4');
    }

    shopifyAnalytics.trackEvent('quiz_started', {
      quiz_type: quizType,
      timestamp: new Date().toISOString()
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify quiz started tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking quiz started:', error);
  }
};

// Track quiz completed
export const trackQuizCompleted = (quizData: {
  quizType?: string;
  answers?: any;
  recommendationsCount?: number;
  completionTime?: number;
}): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'quiz_completed', {
        quiz_type: quizData.quizType || 'fragrance_finder',
        recommendations_count: quizData.recommendationsCount,
        engagement_time_msec: quizData.completionTime
      });
      logAnalyticsEvent('quiz_completed', quizData, 'GA4');
    }

    shopifyAnalytics.trackQuizCompleted(quizData).catch(err => {
      if (isDebugMode) console.error('❌ Shopify quiz completed tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking quiz completed:', error);
  }
};

// Track quiz results viewed
export const trackQuizResultsViewed = (resultsCount: number, products: any[]): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'quiz_results_viewed', {
        results_count: resultsCount,
        products_shown: products.length
      });
      logAnalyticsEvent('quiz_results_viewed', { resultsCount }, 'GA4');
    }

    shopifyAnalytics.trackEvent('quiz_results_viewed', {
      results_count: resultsCount,
      products_shown: products.length
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify quiz results tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking quiz results:', error);
  }
};

// ==================== COUPON/DISCOUNT TRACKING ====================

// Track coupon applied
export const trackCouponApplied = (couponCode: string, discountAmount: number, cartTotal: number): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'coupon_applied', {
        coupon_code: couponCode,
        discount_amount: discountAmount,
        cart_total: cartTotal,
        currency: 'NGN'
      });
      logAnalyticsEvent('coupon_applied', { couponCode, discountAmount }, 'GA4');
    }

    shopifyAnalytics.trackEvent('coupon_applied', {
      coupon_code: couponCode,
      discount_amount: discountAmount,
      cart_total: cartTotal,
      currency: 'NGN'
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify coupon tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking coupon applied:', error);
  }
};

// Track coupon removed
export const trackCouponRemoved = (couponCode: string): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'coupon_removed', {
        coupon_code: couponCode
      });
      logAnalyticsEvent('coupon_removed', { couponCode }, 'GA4');
    }

    shopifyAnalytics.trackEvent('coupon_removed', {
      coupon_code: couponCode
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify coupon removed tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking coupon removed:', error);
  }
};

// ==================== USER ACCOUNT TRACKING ====================

// Track user registration
export const trackUserRegistration = (method: string = 'email', userId?: string): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'sign_up', {
        method: method,
        user_id: userId
      });
      logAnalyticsEvent('sign_up', { method }, 'GA4');
    }

    shopifyAnalytics.trackUserAuth('register', userId).catch(err => {
      if (isDebugMode) console.error('❌ Shopify registration tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking registration:', error);
  }
};

// Track user login
export const trackUserLogin = (method: string = 'email', userId?: string): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'login', {
        method: method,
        user_id: userId
      });

      // Set user ID for session tracking
      if (userId) {
        window.gtag?.('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
          user_id: userId
        });
      }

      logAnalyticsEvent('login', { method }, 'GA4');
    }

    shopifyAnalytics.trackUserAuth('login', userId).catch(err => {
      if (isDebugMode) console.error('❌ Shopify login tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking login:', error);
  }
};

// Track user logout
export const trackUserLogout = (): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'logout');
      logAnalyticsEvent('logout', {}, 'GA4');
    }

    shopifyAnalytics.trackUserAuth('logout').catch(err => {
      if (isDebugMode) console.error('❌ Shopify logout tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking logout:', error);
  }
};

// ==================== NEWSLETTER/EMAIL TRACKING ====================

// Track newsletter signup
export const trackNewsletterSignup = (email: string, source?: string): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'newsletter_signup', {
        source: source || 'website'
      });
      logAnalyticsEvent('newsletter_signup', { source }, 'GA4');
    }

    shopifyAnalytics.trackEvent('newsletter_signup', {
      email: email,
      source: source || 'website',
      timestamp: new Date().toISOString()
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify newsletter tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking newsletter signup:', error);
  }
};

// ==================== CHECKOUT FLOW TRACKING ====================

// Track shipping method selected
export const trackShippingMethodSelected = (shippingMethod: string, cost: number): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'add_shipping_info', {
        shipping_tier: shippingMethod,
        value: cost,
        currency: 'NGN'
      });
      logAnalyticsEvent('add_shipping_info', { shippingMethod, cost }, 'GA4');
    }

    shopifyAnalytics.trackEvent('shipping_method_selected', {
      shipping_method: shippingMethod,
      shipping_cost: cost,
      currency: 'NGN'
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify shipping tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking shipping method:', error);
  }
};

// Track payment method selected
export const trackPaymentMethodSelected = (paymentMethod: string): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'add_payment_info', {
        payment_type: paymentMethod
      });
      logAnalyticsEvent('add_payment_info', { paymentMethod }, 'GA4');
    }

    shopifyAnalytics.trackEvent('payment_method_selected', {
      payment_method: paymentMethod
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify payment tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking payment method:', error);
  }
};

// ==================== CONTENT ENGAGEMENT TRACKING ====================

// Track contact form submission
export const trackContactFormSubmit = (subject: string): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'contact_form_submit', {
        subject: subject
      });
      logAnalyticsEvent('contact_form_submit', { subject }, 'GA4');
    }

    shopifyAnalytics.trackEvent('contact_form_submitted', {
      subject: subject,
      timestamp: new Date().toISOString()
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify contact form tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking contact form:', error);
  }
};

// Track FAQ interaction
export const trackFAQInteraction = (question: string, action: 'expand' | 'collapse'): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'faq_interaction', {
        question: question,
        action: action
      });
      logAnalyticsEvent('faq_interaction', { question, action }, 'GA4');
    }

    shopifyAnalytics.trackEvent('faq_interaction', {
      question: question,
      action: action
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify FAQ tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking FAQ interaction:', error);
  }
};

// Track product filter usage
export const trackFilterUsed = (filterType: string, filterValue: string): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'filter_used', {
        filter_type: filterType,
        filter_value: filterValue
      });
      logAnalyticsEvent('filter_used', { filterType, filterValue }, 'GA4');
    }

    shopifyAnalytics.trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify filter tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking filter usage:', error);
  }
};

// Track product sort usage
export const trackSortUsed = (sortType: string): void => {
  try {
    if (isGaAvailable()) {
      window.gtag?.('event', 'sort_used', {
        sort_type: sortType
      });
      logAnalyticsEvent('sort_used', { sortType }, 'GA4');
    }

    shopifyAnalytics.trackEvent('sort_applied', {
      sort_type: sortType
    }).catch(err => {
      if (isDebugMode) console.error('❌ Shopify sort tracking error:', err);
    });
  } catch (error) {
    if (isDebugMode) console.error('❌ Error tracking sort usage:', error);
  }
};

// Fix TypeScript errors for window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
