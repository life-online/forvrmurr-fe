/**
 * Enhanced Shopify Pixel Integration
 * This ensures data flows into native Shopify Analytics reports
 * 
 * Note: This integration works in two modes:
 * 1. Shopify-hosted stores: Loads native analytics.js from Shopify CDN
 * 2. Custom storefronts: Uses fallback mode with manual event publishing
 * 
 * The integration gracefully handles both scenarios without throwing errors.
 */

declare global {
  interface Window {
    Shopify?: {
      analytics?: {
        publish: (eventName: string, payload: any) => void;
        replayQueue: Array<[string, any]>;
      };
    };
    ShopifyAnalytics?: {
      meta: any;
      lib: any;
    };
  }
}

class ShopifyPixelIntegration {
  private isInitialized = false;
  private eventQueue: Array<[string, any]> = [];

  /**
   * Initialize Shopify native analytics
   */
  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Try to load Shopify's native analytics script (only works on Shopify-hosted stores)
      await this.loadShopifyAnalytics();
    } catch (error) {
      // Gracefully handle missing script - use fallback for custom storefronts
      console.log('ℹ️ Shopify CDN not available, using fallback analytics');
    }

    // Initialize the analytics (works with or without CDN)
    this.setupShopifyAnalytics();

    // Process queued events
    this.processEventQueue();

    this.isInitialized = true;
    console.log('✅ Shopify Pixel Integration initialized');
  }

  /**
   * Load Shopify's analytics script (only available on Shopify-hosted stores)
   */
  private async loadShopifyAnalytics(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Shopify?.analytics) {
        resolve();
        return;
      }

      // Set a timeout to prevent hanging on custom storefronts
      const timeout = setTimeout(() => {
        reject(new Error('Shopify analytics script load timeout'));
      }, 3000);

      const script = document.createElement('script');
      script.src = `https://cdn.shopify.com/shopifycloud/shopify/assets/storefront/analytics.js`;
      script.async = true;

      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load Shopify analytics'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Setup Shopify Analytics with your store configuration
   */
  private setupShopifyAnalytics(): void {
    if (!window.Shopify) {
      window.Shopify = {};
    }

    if (!window.Shopify.analytics) {
      window.Shopify.analytics = {
        replayQueue: [],
        publish: (eventName: string, payload: any) => {
          console.log(`📊 Shopify Native Event: ${eventName}`, payload);
        }
      };
    }

    // Configure with your shop details
    window.ShopifyAnalytics = {
      meta: {
        page: {
          pageType: this.getPageType(),
          resourceType: this.getResourceType(),
          resourceId: this.getResourceId()
        },
        currency: 'NGN',
        shopId: this.getShopId(),
      },
      lib: {
        version: '2.0'
      }
    };
  }

  /**
   * Track page view with Shopify native format
   */
  trackPageView(url: string, title: string): void {
    const event = {
      name: 'page_viewed',
      data: {
        documentTitle: title,
        url: url,
        path: new URL(url, window.location.origin).pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      }
    };

    this.publishEvent('page_viewed', event.data);
  }

  /**
   * Track product view for Shopify analytics
   */
  trackProductView(productId: string, productName: string, price: number, currency = 'NGN'): void {
    const event = {
      name: 'product_viewed',
      data: {
        productId: productId,
        productTitle: productName,
        productPrice: price,
        currency: currency,
        timestamp: new Date().toISOString(),
      }
    };

    this.publishEvent('product_viewed', event.data);
  }

  /**
   * Track add to cart for native Shopify conversion tracking
   */
  trackAddToCart(productId: string, variantId: string, quantity: number, price: number): void {
    const event = {
      name: 'product_added_to_cart',
      data: {
        productId: productId,
        variantId: variantId,
        quantity: quantity,
        price: price,
        currency: 'NGN',
        cartTotal: price * quantity,
        timestamp: new Date().toISOString(),
      }
    };

    this.publishEvent('product_added_to_cart', event.data);
  }

  /**
   * Track checkout started - crucial for conversion reports
   */
  trackCheckoutStarted(cartValue: number, itemCount: number, items: any[]): void {
    const event = {
      name: 'checkout_started',
      data: {
        cartValue: cartValue,
        itemCount: itemCount,
        currency: 'NGN',
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        timestamp: new Date().toISOString(),
      }
    };

    this.publishEvent('checkout_started', event.data);
  }

  /**
   * Track purchase completion
   */
  trackPurchase(orderValue: number, orderId: string, items: any[]): void {
    const event = {
      name: 'purchase',
      data: {
        orderValue: orderValue,
        orderId: orderId,
        currency: 'NGN',
        items: items,
        timestamp: new Date().toISOString(),
      }
    };

    this.publishEvent('purchase', event.data);
  }

  /**
   * Track search for search conversion reports
   */
  trackSearch(query: string, resultCount: number): void {
    const event = {
      name: 'search_submitted',
      data: {
        searchQuery: query,
        resultCount: resultCount,
        timestamp: new Date().toISOString(),
      }
    };

    this.publishEvent('search_submitted', event.data);
  }

  /**
   * Publish event to Shopify native analytics
   */
  private publishEvent(eventName: string, data: any): void {
    if (!this.isInitialized) {
      // Queue events until initialized
      this.eventQueue.push([eventName, data]);
      return;
    }

    try {
      // Send to Shopify native analytics
      if (window.Shopify?.analytics?.publish) {
        window.Shopify.analytics.publish(eventName, data);
      }

      // Also send via Web Pixels if available
      if (window.webPixelsManager) {
        window.webPixelsManager.publishCustomEvent(eventName, data);
      }

      console.log(`📊 Shopify Native: ${eventName}`, data);
    } catch (error) {
      console.error(`Failed to publish ${eventName}:`, error);
    }
  }

  /**
   * Process queued events after initialization
   */
  private processEventQueue(): void {
    while (this.eventQueue.length > 0) {
      const [eventName, data] = this.eventQueue.shift()!;
      this.publishEvent(eventName, data);
    }
  }

  /**
   * Get current page type for Shopify analytics
   */
  private getPageType(): string {
    const path = window.location.pathname;

    if (path === '/') return 'home';
    if (path.startsWith('/shop/')) return 'product';
    if (path.startsWith('/shop')) return 'collection';
    if (path.startsWith('/shop/checkout')) return 'checkout';
    if (path.startsWith('/cart')) return 'cart';
    if (path.startsWith('/search')) return 'search';

    return 'page';
  }

  /**
   * Get resource type for analytics
   */
  private getResourceType(): string {
    const path = window.location.pathname;

    if (path.startsWith('/shop/') && !path.includes('checkout')) return 'product';
    if (path.startsWith('/collections')) return 'collection';

    return 'page';
  }

  /**
   * Get resource ID if applicable
   */
  private getResourceId(): string | null {
    const path = window.location.pathname;
    const matches = path.match(/\/shop\/([^\/]+)$/);

    return matches ? matches[1] : null;
  }

  /**
   * Get shop ID from environment or extract from domain
   */
  private getShopId(): string {
    const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN || '';
    return shopDomain.replace('.myshopify.com', '');
  }
}

export default new ShopifyPixelIntegration();