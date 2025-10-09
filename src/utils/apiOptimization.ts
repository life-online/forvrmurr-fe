/**
 * API Optimization Utilities
 * Provides request deduplication, batching, and caching for better performance
 */

// Request deduplication - prevents duplicate simultaneous requests
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Deduplicates API requests with the same key
 * If a request is already in flight, returns the existing promise
 */
export function dedupeRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  // Check if this request is already in flight
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  // Execute the request and store the promise
  const promise = requestFn()
    .finally(() => {
      // Remove from pending once complete
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, promise);
  return promise;
}

// Simple in-memory cache with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL = 60000; // 1 minute

/**
 * Cache API responses with Time-To-Live
 */
export function cacheRequest<T>(
  key: string,
  requestFn: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  // Return cached data if still valid
  if (cached && (now - cached.timestamp) < ttl) {
    return Promise.resolve(cached.data);
  }

  // Fetch fresh data and cache it
  return requestFn().then((data) => {
    cache.set(key, { data, timestamp: now });
    return data;
  });
}

/**
 * Combine deduplication and caching
 */
export function optimizedRequest<T>(
  key: string,
  requestFn: () => Promise<T>,
  options: { cache?: boolean; ttl?: number } = {}
): Promise<T> {
  const { cache: useCache = true, ttl = DEFAULT_TTL } = options;

  if (useCache) {
    return dedupeRequest(key, () => cacheRequest(key, requestFn, ttl));
  }

  return dedupeRequest(key, requestFn);
}

/**
 * Clear cache for a specific key or all keys
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Batch multiple requests together with a delay
 * Collects requests over a short time window and executes them together
 */
class RequestBatcher<T> {
  private queue: Array<{
    resolve: (value: T) => void;
    reject: (error: any) => void;
    params: any;
  }> = [];
  private timeout: NodeJS.Timeout | null = null;
  private batchDelay: number;
  private batchFn: (items: any[]) => Promise<T[]>;

  constructor(batchFn: (items: any[]) => Promise<T[]>, delay: number = 50) {
    this.batchFn = batchFn;
    this.batchDelay = delay;
  }

  add(params: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, params });

      // Clear existing timeout
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      // Set new timeout to process batch
      this.timeout = setTimeout(() => {
        this.processBatch();
      }, this.batchDelay);
    });
  }

  private async processBatch(): Promise<void> {
    const currentQueue = [...this.queue];
    this.queue = [];
    this.timeout = null;

    if (currentQueue.length === 0) return;

    try {
      const params = currentQueue.map((item) => item.params);
      const results = await this.batchFn(params);

      // Resolve each promise with its corresponding result
      currentQueue.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      // Reject all promises in the batch
      currentQueue.forEach((item) => {
        item.reject(error);
      });
    }
  }
}

/**
 * Create a batched request function
 * Usage:
 * const batchedProductFetch = createBatcher(
 *   (productIds) => api.post('/products/batch', { ids: productIds })
 * );
 * const product = await batchedProductFetch.add(productId);
 */
export function createBatcher<T>(
  batchFn: (items: any[]) => Promise<T[]>,
  delay: number = 50
): RequestBatcher<T> {
  return new RequestBatcher(batchFn, delay);
}

/**
 * Debounce function for search/filter operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Throttle function to limit execution frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
