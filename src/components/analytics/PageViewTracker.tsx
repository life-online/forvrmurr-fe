"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import shopifyAnalytics from '@/services/shopifyAnalytics';

/**
 * PageViewTracker Component
 *
 * Tracks page views to Shopify Analytics on every route change.
 * Google Analytics already handles page views automatically via @next/third-parties/google
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view to Shopify
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    const pageTitle = document.title || pathname;

    // Send to Shopify Analytics
    shopifyAnalytics.trackEvent('page_viewed', {
      url,
      title: pageTitle,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
    }).catch(err => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to track page view to Shopify:', err);
      }
    });

    // Log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📊 [Shopify] Page view: ${pageTitle} (${url})`);
    }
  }, [pathname, searchParams]);

  return null; // This component renders nothing
}
