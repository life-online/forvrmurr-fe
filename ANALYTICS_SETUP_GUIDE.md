# ForvrMurr Analytics Setup - Practical Guide

## 🎯 Goal: View Real-Time Analytics Data

Since ForvrMurr is a custom Next.js storefront (not Shopify-hosted), **Shopify's Live View won't work**. Here's what WILL work:

---

## ✅ Step 1: Use Google Analytics 4 Real-Time (Easiest)

### Already Implemented ✓
Your code already sends events to Google Analytics. Just view them!

### How to Access:
1. Go to [Google Analytics](https://analytics.google.com)
2. Select your ForvrMurr property
3. Click **Reports → Realtime**

### What You'll See:
- 👥 Active users right now
- 📄 Pages being viewed
- 🛒 Add to cart events
- 💳 Purchases happening live
- 🔍 Search queries
- 📊 All custom events

### No Additional Setup Needed!

---

## ✅ Step 2: Send Data to Shopify (For Reports)

### What You Need:

#### A. Shopify Admin API Access Token

1. **Go to Shopify Admin**:
   - Your Store → Settings → Apps and sales channels
   - Click "Develop apps"
   - Click "Create an app" or select existing app

2. **Configure API Scopes**:
   - Click "Configure Admin API scopes"
   - Enable these scopes:
     - ✅ `write_customer_events`
     - ✅ `read_customer_events`  
     - ✅ `read_customers`
     - ✅ `read_orders`
     - ✅ `read_products`

3. **Install App & Get Token**:
   - Click "Install app"
   - Reveal and copy the "Admin API access token"
   - It looks like: `shpat_xxxxxxxxxxxxxxxxxxxxx`

#### B. Shopify Custom Pixel ID (Optional)

1. **Go to Shopify Admin**:
   - Settings → Customer events
   - Click "Add custom pixel"
   - Name it "ForvrMurr Analytics"
   - Copy the Pixel ID

### Add to Environment Variables:

```bash
# .env.local

# Your Shopify store domain
NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN=forvrmurr.myshopify.com

# Admin API token (from step A above)
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx

# Pixel ID (from step B above - optional)
NEXT_PUBLIC_SHOPIFY_PIXEL_ID=your_pixel_id_here

# Google Analytics (you already have this)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Restart Your Dev Server:
```bash
npm run dev
```

---

## ✅ Step 3: View Shopify Analytics

### Where to Find Your Data:

1. **Shopify Admin → Analytics → Reports**
2. Click "Create custom report"
3. Select data sources from your tracked events:
   - Product views
   - Add to cart
   - Checkout started
   - Purchases
   - Custom events

### Example Custom Report:
- **Metric**: Count of "product_viewed" events
- **Dimension**: Product name
- **Time range**: Last 7 days
- **Visualization**: Bar chart

---

## 📊 What Gets Tracked (Already Implemented)

### E-commerce Events:
- ✅ Product views
- ✅ Add to cart
- ✅ Remove from cart
- ✅ Checkout started
- ✅ Purchase completed

### User Behavior:
- ✅ Page views
- ✅ Search queries
- ✅ User login/register/logout
- ✅ Quiz completion
- ✅ Wishlist actions

### Where Events Are Sent:
1. **Google Analytics** → Real-time reports
2. **Shopify Events API** → Custom reports (if token configured)
3. **Browser Console** → For debugging

---

## 🔍 Testing Your Setup

### 1. Check Browser Console:
```javascript
// Open DevTools → Console
// You should see:
✅ Shopify Analytics initialized successfully
✅ Shopify Pixel Integration initialized
📊 Tracked event: page_viewed
📊 Tracked event: product_viewed
```

### 2. Test an Event:
1. Visit a product page
2. Check console for: `📊 Tracked event: product_viewed`
3. Add to cart
4. Check console for: `📊 Tracked event: product_added_to_cart`

### 3. Verify in Google Analytics:
1. Go to GA4 → Realtime
2. Perform actions on your site
3. See events appear within seconds

### 4. Verify in Shopify (if configured):
1. Wait 5-10 minutes for data to process
2. Go to Shopify Admin → Analytics
3. Check for custom events in reports

---

## 🚨 Troubleshooting

### Events Not Showing in Console:
- Check that AnalyticsProvider wraps your app
- Verify `src/app/layout.tsx` includes `<AnalyticsProvider>`

### Shopify API Errors:
- Verify `SHOPIFY_ADMIN_ACCESS_TOKEN` is correct
- Check API scopes are enabled
- Ensure shop domain is correct (include `.myshopify.com`)

### Google Analytics Not Working:
- Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- Check GA4 property is created
- Ensure gtag script is loaded (view page source)

---

## 🎯 Quick Start Checklist

- [ ] Get Shopify Admin API token
- [ ] Add environment variables to `.env.local`
- [ ] Restart dev server
- [ ] Test by viewing a product
- [ ] Check browser console for events
- [ ] View real-time data in Google Analytics
- [ ] Create custom report in Shopify Admin

---

## 💡 Pro Tips

### 1. Use Google Analytics for Real-Time:
- Best real-time reporting
- Free and powerful
- Already working in your app

### 2. Use Shopify for Historical Reports:
- Better for long-term analysis
- Integrates with Shopify orders
- Good for business intelligence

### 3. Monitor Console During Development:
- All events are logged
- Easy debugging
- See exactly what's being tracked

### 4. Create Useful Shopify Reports:
- Top viewed products
- Conversion funnel
- Cart abandonment rate
- Search queries with no results

---

## 📈 Next Steps

### Immediate:
1. Set up environment variables
2. Test tracking in browser console
3. View real-time data in GA4

### Short-term:
1. Create custom Shopify reports
2. Set up conversion goals in GA4
3. Monitor key metrics

### Long-term:
1. Consider building custom admin dashboard
2. Add more custom events for specific features
3. Integrate with email marketing (track campaign performance)

---

## ❓ FAQ

### Q: Why can't I see data in Shopify Live View?
**A:** Live View only works for Shopify-hosted storefronts. Your Next.js app is hosted separately, so use Google Analytics Real-Time instead.

### Q: How long until data appears in Shopify?
**A:** 5-10 minutes for Events API, up to 24 hours for some reports.

### Q: Can I track custom events?
**A:** Yes! Use the `useAnalyticsIntegration` hook:
```typescript
const { trackCustomEvent } = useAnalyticsIntegration();
await trackCustomEvent('button_clicked', { button: 'cta' });
```

### Q: Is this GDPR compliant?
**A:** You need to add cookie consent. Consider using a library like `react-cookie-consent` and only initialize analytics after user consent.

---

## 🔗 Useful Links

- [Google Analytics Real-Time Reports](https://analytics.google.com)
- [Shopify Admin API Docs](https://shopify.dev/docs/api/admin-rest)
- [Shopify Customer Events](https://shopify.dev/docs/apps/marketing/customer-events)
- [GA4 E-commerce Tracking](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)

---

**✅ You're all set!** Your analytics are already tracking. Just add the environment variables to send data to Shopify, and use Google Analytics for real-time monitoring.
