interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<unknown>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const apiCache = new SimpleCache();

// Clean up cache periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 60 * 1000); // Every minute
}

// Cache-aware fetch wrapper
export async function cachedFetch<T>(
  url: string,
  options: RequestInit & { cacheTtl?: number } = {}
): Promise<T> {
  const { cacheTtl = 5 * 60 * 1000, ...fetchOptions } = options;
  const cacheKey = `${url}-${JSON.stringify(fetchOptions)}`;

  // Check cache first
  const cachedData = apiCache.get<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Fetch from API
  const response = await fetch(url, fetchOptions);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Cache the response
  apiCache.set(cacheKey, data, cacheTtl);
  
  return data;
}