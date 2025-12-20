# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your ForvMurr Next.js e-commerce application. The integration includes:

- **Client-side initialization** using the modern `instrumentation-client.ts` approach (Next.js 15.3+)
- **Server-side PostHog client** for backend event tracking
- **Reverse proxy configuration** in `next.config.ts` to avoid ad blockers
- **User identification** on login and signup with email and name properties
- **15 custom events** tracking key business activities including authentication, cart operations, wishlist, orders, and lead generation
- **Error tracking** with `posthog.captureException()` for cart, wishlist, and notification failures

## Files Modified

| File | Changes |
|------|---------|
| `.env` | Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables |
| `instrumentation-client.ts` | **New file** - PostHog client-side initialization with error tracking and reverse proxy |
| `next.config.ts` | Added PostHog reverse proxy rewrites and updated CSP headers |
| `src/lib/posthog-server.ts` | **New file** - Server-side PostHog client for Node.js |
| `src/context/AuthContext.tsx` | Added user identification and auth events |
| `src/context/CartContext.tsx` | Added cart tracking events |
| `src/app/shop/[slug]/page.tsx` | Added wishlist events |
| `src/components/ui/NotifyMeModal.tsx` | Added notify-me event |
| `src/services/checkout.ts` | Added order and payment events |
| `src/services/contact.ts` | Added contact form event |
| `src/services/gifting.ts` | Added gift request event |
| `src/app/subscriptions/page.tsx` | Added subscription click events |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully registers a new account | `src/context/AuthContext.tsx` |
| `user_logged_in` | User successfully logs into their account | `src/context/AuthContext.tsx` |
| `user_logged_out` | User logs out of their account | `src/context/AuthContext.tsx` |
| `password_reset_requested` | User requests a password reset email | `src/context/AuthContext.tsx` |
| `product_added_to_cart` | User adds a product to the shopping cart | `src/context/CartContext.tsx` |
| `product_removed_from_cart` | User removes a product from the shopping cart | `src/context/CartContext.tsx` |
| `cart_cleared` | User clears all items from the shopping cart | `src/context/CartContext.tsx` |
| `product_added_to_wishlist` | User adds a product to their wishlist | `src/app/shop/[slug]/page.tsx` |
| `product_removed_from_wishlist` | User removes a product from their wishlist | `src/app/shop/[slug]/page.tsx` |
| `notify_me_submitted` | User requests notification for out-of-stock product | `src/components/ui/NotifyMeModal.tsx` |
| `order_created` | User successfully creates an order during checkout | `src/services/checkout.ts` |
| `payment_initiated` | User initiates payment for an order | `src/services/checkout.ts` |
| `contact_form_submitted` | User submits the contact form | `src/services/contact.ts` |
| `gift_request_submitted` | User submits a corporate/bulk gifting request | `src/services/gifting.ts` |
| `subscription_plan_clicked` | User clicks on a subscription plan button | `src/app/subscriptions/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/268680/dashboard/907190) - Core business metrics dashboard

### Insights
- [User Signups & Logins Trend](https://us.posthog.com/project/268680/insights/ODMkti4O) - Track user registration and login activity over time
- [Cart Activity](https://us.posthog.com/project/268680/insights/Sr0GYpDw) - Track products added to cart, removed from cart, and cart clears
- [Purchase Funnel](https://us.posthog.com/project/268680/insights/Q6q9Cxer) - Conversion funnel from add to cart to order creation to payment
- [Wishlist & Notify Me Activity](https://us.posthog.com/project/268680/insights/URpMdiIe) - Track user interest signals through wishlist and out-of-stock notifications
- [Lead Generation](https://us.posthog.com/project/268680/insights/Duv73MJ9) - Track contact form submissions, gift requests, and subscription interest

## Getting Started

1. Ensure your `.env` file contains the PostHog configuration (already added)
2. Run your development server: `npm run dev`
3. Visit your site and perform some actions to start seeing events in PostHog
4. Check the [Analytics basics dashboard](https://us.posthog.com/project/268680/dashboard/907190) to see your data

## Additional Features Enabled

- **Automatic pageview tracking** - PostHog automatically captures page views
- **Session replay** - Enabled by default with the `defaults: '2025-05-24'` setting
- **Error tracking** - Unhandled exceptions are automatically captured
- **Reverse proxy** - Events are routed through `/ingest` to avoid ad blockers
