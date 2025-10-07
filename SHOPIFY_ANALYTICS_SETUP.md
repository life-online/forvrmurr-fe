# Shopify Analytics Integration - Complete Setup Guide

## 🎯 Overview
This integration provides comprehensive analytics tracking for your ForvrMurr platform, sending data to both **Shopify Analytics** and **Google Analytics** simultaneously.

## 📋 Required API Keys & Setup

### 1. Shopify Partner Dashboard Setup
1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Create a new app or use existing app
3. Get the following credentials:

### 2. Environment Variables
Add these to your `.env.local` file:

```bash
# Shopify Analytics Configuration
NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SHOPIFY_PIXEL_ID=your_pixel_id_here

# Google Analytics (already configured)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. How to Get Each API Key

#### A. Shop Domain
- Your Shopify store URL: `your-shop.myshopify.com`

#### B. Storefront Access Token
1. In Shopify Admin → Apps → Manage private apps
2. Create private app or go to existing app
3. Enable Storefront API access
4. Copy the Storefront access token

#### C. Admin Access Token
1. In Shopify Admin → Apps → Manage private apps
2. Grant the following permissions:
   - **Analytics API**: `read_analytics`
   - **Events API**: `write_customers, read_customers`
   - **Orders API**: `read_orders`
   - **Products API**: `read_products`
3. Copy the Admin API access token

#### D. Pixel ID (Optional but Recommended)
1. In Shopify Admin → Settings → Customer events
2. Add a new pixel or custom pixel
3. Copy the Pixel ID

## 📊 What's Being Tracked

### E-commerce Events
- ✅ **Product Views**: Every product page visit
- ✅ **Add to Cart**: When users add items to cart
- ✅ **Remove from Cart**: When users remove items
- ✅ **Checkout Started**: When checkout process begins
- ✅ **Purchase Complete**: When orders are completed

### User Behavior
- ✅ **Page Views**: All page navigation
- ✅ **User Authentication**: Login, register, logout
- ✅ **Search Queries**: Internal site search
- ✅ **Quiz Completion**: Fragrance quiz results
- ✅ **Wishlist Actions**: Add/remove from wishlist
- ✅ **Newsletter Signups**: Email subscriptions

### Custom Events
- ✅ **Quiz Started**: When users begin the fragrance quiz
- ✅ **Filter Usage**: When users apply shop filters
- ✅ **Content Engagement**: Time spent on pages
- ✅ **Subscription Actions**: Subscribe/unsubscribe/modify

## 🔧 Technical Implementation

### Core Services
1. **`/src/services/shopifyAnalytics.ts`** - Main Shopify API integration
2. **`/src/context/AnalyticsContext.tsx`** - React context for unified tracking
3. **`/src/hooks/useAnalyticsIntegration.ts`** - Analytics hook for components

### Already Integrated Components
- ✅ **AddToCartButton** - Tracks add to cart events
- ✅ **Quiz System** - Tracks quiz start and completion
- ✅ **Page Navigation** - Automatic page view tracking
- ✅ **User Authentication** - Login/register/logout tracking

### Usage in Components
```typescript
import { useAnalyticsIntegration } from '@/hooks/useAnalyticsIntegration';

function MyComponent() {
  const { trackCustomEvent, trackProductView } = useAnalyticsIntegration();

  const handleButtonClick = async () => {
    await trackCustomEvent('button_clicked', {
      button_name: 'cta_button',
      page: 'home',
    });
  };

  return <button onClick={handleButtonClick}>Click Me</button>;
}
```

## 📈 Analytics Dashboard Access

### Shopify Analytics
1. **Admin Dashboard**: Shopify Admin → Analytics → Reports
2. **Live View**: Real-time customer behavior
3. **Custom Reports**: Build reports using tracked events
4. **Customer Journey**: Complete funnel analysis

### Google Analytics
1. **Enhanced E-commerce**: Product performance, conversion funnels
2. **Custom Events**: All tracked interactions
3. **Audience Insights**: User demographics and behavior
4. **Real-time Monitoring**: Live user activity

## 🛠️ Advanced Configuration

### Custom Event Tracking
Add custom events anywhere in your app:

```typescript
const { trackCustomEvent } = useAnalyticsIntegration();

// Track any custom interaction
await trackCustomEvent('video_watched', {
  video_title: 'How to Choose Fragrance',
  duration_seconds: 120,
  completion_rate: 0.85,
});
```

### Product View Tracking
Automatically track product views:

```typescript
const { trackProductView } = useAnalyticsIntegration();

// Track product views
await trackProductView({
  productId: product.id,
  name: product.name,
  price: product.price,
  category: 'Fragrance',
  variantId: product.variants?.[0]?.id,
});
```

## 🔍 Monitoring & Debugging

### Console Logging
- All events are logged to browser console
- Success: `📊 Tracked event: event_name`
- Errors: `❌ Failed to track event event_name:`

### Testing Events
1. Open browser DevTools → Console
2. Perform actions (add to cart, complete quiz, etc.)
3. Verify events appear in console
4. Check Shopify Admin → Analytics for data

### Troubleshooting
- **Events not appearing**: Check API keys in `.env.local`
- **CORS errors**: Verify shop domain and access tokens
- **Missing data**: Ensure components use analytics hooks

## 📱 Mobile & Performance

### Optimizations
- ✅ **Client-side only**: No server-side tracking overhead
- ✅ **Async tracking**: Non-blocking analytics calls
- ✅ **Error handling**: Graceful fallbacks if APIs fail
- ✅ **Caching**: Client ID and session management
- ✅ **Batching**: Efficient API usage

### Privacy Compliance
- ✅ **GDPR Ready**: User consent handling
- ✅ **Data Retention**: Configurable data storage
- ✅ **Anonymization**: PII protection options
- ✅ **Opt-out**: User preference management

## 🚀 Next Steps

1. **Set up API keys** in `.env.local`
2. **Test the integration** with sample events
3. **Verify data flow** in Shopify Admin → Analytics
4. **Monitor performance** and adjust as needed
5. **Add custom events** for specific business needs

## 📞 Support
- Check console logs for debugging
- Verify API permissions in Shopify Admin
- Test with small events first before full deployment
- Monitor both Shopify and Google Analytics dashboards

---

**✅ Integration Complete!** Your ForvrMurr platform now has comprehensive analytics tracking to both Shopify and Google Analytics platforms.