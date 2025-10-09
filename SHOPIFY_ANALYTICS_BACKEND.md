# Shopify Analytics Backend Integration Guide

## Overview

Since Shopify's native pixel tracking doesn't work with headless stores, we need a backend endpoint to forward analytics events from our Next.js frontend to Shopify's Admin API.

## Required Backend Endpoint

### Endpoint: `POST /analytics/shopify`

**Purpose**: Receive analytics events from frontend and forward to Shopify Admin API

### Request Format

```json
{
  "event": "page_viewed",
  "payload": {
    "page_url": "https://forvrmurr.com/shop",
    "page_title": "Shop | ForvrMurr",
    "referrer": "https://google.com"
  },
  "client_id": "client_1759909104860_7fculqj6v",
  "session_id": "session_1759994372610_294oek7pv",
  "timestamp": "2025-10-09T07:25:08.383Z"
}
```

### Backend Implementation (Node.js/Express Example)

```javascript
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Shopify credentials from environment
const SHOPIFY_SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN; // yi21n2-vf.myshopify.com
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = '2024-01';

router.post('/analytics/shopify', async (req, res) => {
  try {
    const { event, payload, client_id, session_id, timestamp } = req.body;

    // Map our events to Shopify format
    const shopifyEvent = {
      event_name: event,
      occurred_at: timestamp,
      custom_data: {
        ...payload,
        client_id,
        session_id,
      },
    };

    // Send to Shopify Admin API (Customer Events)
    // Note: This endpoint may not exist - Shopify's Admin API for customer events is limited
    // Alternative: Store events in your database and sync to Shopify periodically

    // Option 1: Try Shopify Admin API (may not work)
    try {
      await axios.post(
        `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/events.json`,
        { event: shopifyEvent },
        {
          headers: {
            'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (shopifyError) {
      console.log('Shopify API not available, storing locally:', shopifyError.message);
    }

    // Option 2: Store in your database for later analysis
    await storeEventInDatabase({
      event_name: event,
      event_data: payload,
      client_id,
      session_id,
      timestamp,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to process Shopify analytics:', error);
    res.status(500).json({ error: 'Failed to process analytics event' });
  }
});

// Store event in your database
async function storeEventInDatabase(eventData) {
  // Implement your database storage here
  // Example with MongoDB:
  // await db.collection('analytics_events').insertOne(eventData);

  // Example with PostgreSQL:
  // await pool.query(
  //   'INSERT INTO analytics_events (event_name, event_data, client_id, session_id, timestamp) VALUES ($1, $2, $3, $4, $5)',
  //   [eventData.event_name, JSON.stringify(eventData.event_data), eventData.client_id, eventData.session_id, eventData.timestamp]
  // );
}

module.exports = router;
```

## Alternative Solution: Store Events Locally

Since Shopify's Admin API has limited support for custom analytics events from headless stores, the recommended approach is:

### 1. Store Events in Your Database

Create a table/collection for analytics events:

```sql
-- PostgreSQL Example
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_data JSONB NOT NULL,
  client_id VARCHAR(255),
  session_id VARCHAR(255),
  user_id VARCHAR(255),
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_event_name ON analytics_events(event_name);
CREATE INDEX idx_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_session_id ON analytics_events(session_id);
```

### 2. Build Analytics Dashboard

Query your stored events to build custom analytics:

```javascript
// Get page views by date
const pageViews = await db.query(`
  SELECT
    DATE(timestamp) as date,
    COUNT(*) as views
  FROM analytics_events
  WHERE event_name = 'page_viewed'
    AND timestamp >= NOW() - INTERVAL '30 days'
  GROUP BY DATE(timestamp)
  ORDER BY date DESC
`);

// Get product view funnel
const funnel = await db.query(`
  SELECT
    event_name,
    COUNT(DISTINCT session_id) as unique_sessions
  FROM analytics_events
  WHERE event_name IN ('product_viewed', 'add_to_cart', 'checkout_started', 'purchase_completed')
  GROUP BY event_name
`);
```

### 3. Sync to Shopify (Optional)

Create a scheduled job to sync aggregated data to Shopify:

```javascript
// Daily sync job
cron.schedule('0 0 * * *', async () => {
  // Get yesterday's events
  const events = await getEventsForYesterday();

  // Aggregate and send to Shopify
  // Note: Shopify may not have endpoints for all event types
  // Focus on order-related events which they definitely track
});
```

## Benefits of This Approach

1. **Full Control**: You own all analytics data
2. **No Data Loss**: Everything is stored, even if Shopify API fails
3. **Custom Analytics**: Build any reports you need
4. **Privacy Compliant**: Data stays in your infrastructure
5. **No 405 Errors**: Not hitting unsupported Shopify endpoints

## Events Being Tracked

The frontend is already sending these events:

- `page_viewed` - Page navigation
- `product_viewed` - Product detail views
- `collection_viewed` - Category/collection browsing
- `search_submitted` - Search queries
- `product_added_to_cart` - Add to cart actions
- `cart_viewed` - Cart opens
- `checkout_started` - Begin checkout
- `payment_info_submitted` - Payment step
- `checkout_completed` - Order completion
- Plus many more...

## Next Steps

1. **Create the `/analytics/shopify` endpoint** in your backend
2. **Set up database table** for storing events
3. **Deploy and test** - Check backend logs for incoming events
4. **Build analytics dashboard** (optional) to visualize the data
5. **Remove 405 errors** - Frontend will successfully POST to your backend

## Testing

After implementing the backend endpoint:

```bash
# Test the endpoint
curl -X POST https://api.forvrmurr.com/analytics/shopify \
  -H "Content-Type: application/json" \
  -d '{
    "event": "test_event",
    "payload": {"test": true},
    "client_id": "test_client",
    "session_id": "test_session",
    "timestamp": "2025-10-09T10:00:00.000Z"
  }'
```

Expected response:
```json
{"success": true}
```

## Environment Variables Required

Add to your backend `.env`:

```bash
SHOPIFY_SHOP_DOMAIN=yi21n2-vf.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=your_shopify_admin_token_here
SHOPIFY_API_VERSION=2024-01
```

**Note**: Get your Shopify Admin Access Token from your Shopify admin dashboard under Settings > Apps and sales channels > Develop apps.

---

**Important**: Shopify's native analytics for headless stores is limited. This solution gives you full analytics data that you can then use however you need, including building custom reports or syncing to other analytics platforms.
