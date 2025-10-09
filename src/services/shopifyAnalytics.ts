/**
 * Shopify Analytics Service
 * Comprehensive tracking for all user interactions and e-commerce events
 */

interface ShopifyConfig {
  shopDomain: string;
  storefrontAccessToken: string;
  adminAccessToken?: string;
  pixelId?: string;
}

interface CustomerEvent {
  name: string;
  customerId?: string;
  clientId: string;
  timestamp: string;
  data: Record<string, any>;
}

interface ProductData {
  productId: string;
  variantId?: string;
  sku?: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
}

interface OrderData {
  orderId: string;
  orderNumber: string;
  customerId?: string;
  email?: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  currency: string;
  items: ProductData[];
}

class ShopifyAnalyticsService {
  private config: ShopifyConfig;
  private clientId: string;
  private sessionId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      shopDomain: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN || '',
      storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
      adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
      pixelId: process.env.NEXT_PUBLIC_SHOPIFY_PIXEL_ID || '',
    };

    this.clientId = this.generateClientId();
    this.sessionId = this.generateSessionId();
  }

  /**
   * Initialize Shopify analytics
   */
  async initialize(): Promise<void> {
    try {
      if (typeof window === 'undefined') return;

      // Initialize Shopify Web Pixels if pixel ID is available
      if (this.config.pixelId) {
        await this.initializeWebPixels();
      }

      // Track session start
      await this.trackEvent('session_started', {
        session_id: this.sessionId,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        timestamp: new Date().toISOString(),
      });

      this.isInitialized = true;
      console.log('✅ Shopify Analytics initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Shopify Analytics:', error);
    }
  }

  /**
   * Initialize Shopify Analytics stub for headless stores
   * Note: Direct pixel tracking doesn't work with headless stores
   * Events are logged locally and tracked via Google Analytics instead
   */
  private async initializeWebPixels(): Promise<void> {
    // Initialize Shopify analytics stub for compatibility
    const script = document.createElement('script');
    script.innerHTML = `
      window.Shopify = window.Shopify || {};
      window.Shopify.analytics = window.Shopify.analytics || {};
      window.Shopify.analytics.replayQueue = [];
      window.Shopify.analytics.publish = function(eventName, payload) {
        // Queue events for debugging
        if (window.Shopify.analytics.replayQueue) {
          window.Shopify.analytics.replayQueue.push([eventName, payload]);
        }

        // Log to console in development
        if (process.env.NODE_ENV !== 'production') {
          console.log('📊 [Shopify Analytics] Event:', eventName, payload);
        }
      };
    `;
    document.head.appendChild(script);
  }

  /**
   * Track generic events
   */
  async trackEvent(eventName: string, data: Record<string, any> = {}): Promise<void> {
    try {
      const event: CustomerEvent = {
        name: eventName,
        clientId: this.clientId,
        timestamp: new Date().toISOString(),
        data: {
          ...data,
          session_id: this.sessionId,
          page_url: typeof window !== 'undefined' ? window.location.href : '',
          page_title: typeof window !== 'undefined' ? document.title : '',
        },
      };

      // Send to Shopify Analytics
      await this.sendToShopify(event);

      console.log(`📊 Tracked event: ${eventName}`, data);
    } catch (error) {
      console.error(`❌ Failed to track event ${eventName}:`, error);
    }
  }

  /**
   * Track page views
   */
  async trackPageView(path: string, title?: string): Promise<void> {
    await this.trackEvent('page_viewed', {
      path,
      title: title || document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track product views
   */
  async trackProductView(product: ProductData): Promise<void> {
    await this.trackEvent('product_viewed', {
      product_id: product.productId,
      product_variant_id: product.variantId,
      product_name: product.name,
      product_price: product.price,
      product_sku: product.sku,
      product_category: product.category,
      currency: 'NGN',
    });
  }

  /**
   * Track add to cart
   */
  async trackAddToCart(product: ProductData): Promise<void> {
    await this.trackEvent('product_added_to_cart', {
      product_id: product.productId,
      product_variant_id: product.variantId,
      product_name: product.name,
      product_price: product.price,
      quantity: product.quantity || 1,
      product_sku: product.sku,
      currency: 'NGN',
      cart_value: (product.price * (product.quantity || 1)),
    });
  }

  /**
   * Track remove from cart
   */
  async trackRemoveFromCart(product: ProductData): Promise<void> {
    await this.trackEvent('product_removed_from_cart', {
      product_id: product.productId,
      product_variant_id: product.variantId,
      product_name: product.name,
      product_price: product.price,
      quantity: product.quantity || 1,
      currency: 'NGN',
    });
  }

  /**
   * Track checkout started
   */
  async trackCheckoutStarted(cartItems: ProductData[], cartTotal: number): Promise<void> {
    await this.trackEvent('checkout_started', {
      checkout_value: cartTotal,
      currency: 'NGN',
      products: cartItems.map(item => ({
        product_id: item.productId,
        product_variant_id: item.variantId,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity || 1,
        product_sku: item.sku,
      })),
      checkout_step: 1,
    });
  }

  /**
   * Track purchase/order completion
   */
  async trackPurchase(order: OrderData): Promise<void> {
    await this.trackEvent('purchase', {
      order_id: order.orderId,
      order_number: order.orderNumber,
      customer_id: order.customerId,
      customer_email: order.email,
      order_value: order.total,
      order_subtotal: order.subtotal,
      order_tax: order.tax,
      order_shipping: order.shipping,
      currency: order.currency,
      products: order.items.map(item => ({
        product_id: item.productId,
        product_variant_id: item.variantId,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity || 1,
        product_sku: item.sku,
      })),
    });
  }

  /**
   * Track user authentication
   */
  async trackUserAuth(action: 'login' | 'register' | 'logout', userId?: string): Promise<void> {
    await this.trackEvent(`user_${action}`, {
      user_id: userId,
      auth_method: 'email', // or 'social', 'guest', etc.
    });
  }

  /**
   * Track search
   */
  async trackSearch(query: string, resultsCount?: number): Promise<void> {
    await this.trackEvent('search_submitted', {
      search_query: query,
      search_results_count: resultsCount,
    });
  }

  /**
   * Track quiz completion
   */
  async trackQuizCompleted(quizData: Record<string, any>): Promise<void> {
    await this.trackEvent('quiz_completed', {
      quiz_type: 'fragrance_preference',
      quiz_answers: quizData,
      completion_time: new Date().toISOString(),
    });
  }

  /**
   * Track wishlist actions
   */
  async trackWishlistAction(action: 'add' | 'remove', product: ProductData): Promise<void> {
    await this.trackEvent(`product_${action === 'add' ? 'added_to' : 'removed_from'}_wishlist`, {
      product_id: product.productId,
      product_variant_id: product.variantId,
      product_name: product.name,
      product_price: product.price,
      currency: 'NGN',
    });
  }

  /**
   * Track subscription actions
   */
  async trackSubscription(action: 'subscribe' | 'unsubscribe' | 'modify', subscriptionData: Record<string, any>): Promise<void> {
    await this.trackEvent(`subscription_${action}`, {
      subscription_type: subscriptionData.type,
      subscription_frequency: subscriptionData.frequency,
      subscription_value: subscriptionData.value,
      currency: 'NGN',
      ...subscriptionData,
    });
  }

  /**
   * Track email events
   */
  async trackEmail(action: 'newsletter_signup' | 'email_click' | 'email_open', data: Record<string, any> = {}): Promise<void> {
    await this.trackEvent(action, {
      email_address: data.email,
      campaign_id: data.campaignId,
      ...data,
    });
  }

  /**
   * Send event to Shopify Analytics using window.Shopify.analytics.publish
   * This is the standard method for headless stores
   */
  private async sendToShopify(event: CustomerEvent): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Use Shopify analytics publish method
      if (window.Shopify?.analytics?.publish) {
        window.Shopify.analytics.publish(event.name, {
          ...event.data,
          clientId: event.clientId,
          timestamp: event.timestamp,
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to send to Shopify:', error);
      }
    }
  }

  /**
   * Generate unique client ID
   */
  private generateClientId(): string {
    if (typeof window !== 'undefined') {
      let clientId = localStorage.getItem('shopify_client_id');
      if (!clientId) {
        clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('shopify_client_id', clientId);
      }
      return clientId;
    }
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get analytics data from Shopify Admin API
   */
  async getAnalyticsData(dateRange?: { start: string; end: string }): Promise<any> {
    try {
      if (!this.config.adminAccessToken) {
        throw new Error('Admin access token required for analytics data');
      }

      const response = await fetch(`https://${this.config.shopDomain}/admin/api/2024-01/analytics/reports.json`, {
        headers: {
          'X-Shopify-Access-Token': this.config.adminAccessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      return null;
    }
  }

  /**
   * Set customer ID for tracking
   */
  setCustomerId(customerId: string): void {
    this.clientId = customerId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopify_customer_id', customerId);
    }
  }

  /**
   * Clear customer data on logout
   */
  clearCustomerData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shopify_customer_id');
      this.clientId = this.generateClientId();
    }
  }
}

// Global types for Shopify Analytics
declare global {
  interface Window {
    Shopify?: {
      analytics?: {
        publish: (eventName: string, payload: any) => void;
        replayQueue?: Array<[string, any]>;
      };
    };
  }
}

export default new ShopifyAnalyticsService();
export type { ProductData, OrderData, CustomerEvent };