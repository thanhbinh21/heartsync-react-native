import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cache Manager cho React Native
 * Sử dụng AsyncStorage để persist cache và Memory cache cho performance
 */

// TypeScript interfaces
interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  memoryOnly?: boolean;
}

interface PreloadItem {
  key: string;
  fetchFunction: () => Promise<any>;
  ttl: number;
}

// In-memory cache for fast access
const memoryCache = new Map<string, CacheItem>();

// Cache configuration
const CACHE_CONFIG = {
  // Time to live (TTL) in milliseconds
  TTL: {
    SHORT: 60 * 1000,          // 1 minute
    MEDIUM: 5 * 60 * 1000,     // 5 minutes
    LONG: 30 * 60 * 1000,      // 30 minutes
    HOUR: 60 * 60 * 1000,      // 1 hour
    DAY: 24 * 60 * 60 * 1000,  // 1 day
  },
  // Prefix for AsyncStorage keys
  PREFIX: 'heartsync_cache_',
};

/**
 * Cache item structure
 * @typedef {Object} CacheItem
 * @property {any} data - Cached data
 * @property {number} timestamp - When cached (ms)
 * @property {number} ttl - Time to live (ms)
 */

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @param {Object} options - Options
 * @param {boolean} options.memoryOnly - Only check memory cache
 * @returns {Promise<any|null>}
 */
export const getCache = async (key: string, options: CacheOptions = {}): Promise<any> => {
  try {
    // Check memory cache first (fastest)
    if (memoryCache.has(key)) {
      const item = memoryCache.get(key);
      
      if (item) {
        // Check if expired
        if (Date.now() - item.timestamp < item.ttl) {
          console.log(`✅ Memory cache HIT: ${key}`);
          return item.data;
        } else {
          // Expired, remove from memory
          memoryCache.delete(key);
          console.log(`⏰ Cache EXPIRED: ${key}`);
        }
      }
    }

    // Return null if memory only
    if (options.memoryOnly) {
      console.log(`❌ Memory cache MISS: ${key}`);
      return null;
    }

    // Check AsyncStorage (persistent)
    const storageKey = CACHE_CONFIG.PREFIX + key;
    const itemString = await AsyncStorage.getItem(storageKey);
    
    if (itemString) {
      const item = JSON.parse(itemString);
      
      // Check if expired
      if (Date.now() - item.timestamp < item.ttl) {
        console.log(`✅ Storage cache HIT: ${key}`);
        
        // Restore to memory cache
        memoryCache.set(key, item);
        
        return item.data;
      } else {
        // Expired, remove from storage
        await AsyncStorage.removeItem(storageKey);
        console.log(`⏰ Cache EXPIRED: ${key}`);
      }
    }

    console.log(`❌ Cache MISS: ${key}`);
    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

/**
 * Set data to cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 * @param {Object} options - Options
 * @param {boolean} options.memoryOnly - Only cache in memory
 * @returns {Promise<boolean>}
 */
export const setCache = async (key: string, data: any, ttl: number = CACHE_CONFIG.TTL.MEDIUM, options: CacheOptions = {}): Promise<boolean> => {
  try {
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // Always set in memory cache
    memoryCache.set(key, item);
    console.log(`💾 Memory cached: ${key}`);

    // Also save to AsyncStorage for persistence (unless memoryOnly)
    if (!options.memoryOnly) {
      const storageKey = CACHE_CONFIG.PREFIX + key;
      await AsyncStorage.setItem(storageKey, JSON.stringify(item));
      console.log(`💾 Storage cached: ${key}`);
    }

    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

/**
 * Delete from cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>}
 */
export const deleteCache = async (key: string): Promise<boolean> => {
  try {
    // Remove from memory
    memoryCache.delete(key);

    // Remove from storage
    const storageKey = CACHE_CONFIG.PREFIX + key;
    await AsyncStorage.removeItem(storageKey);
    
    console.log(`🗑️ Cache deleted: ${key}`);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

/**
 * Delete multiple keys by pattern
 * @param {string} pattern - Key pattern (e.g., "user_*")
 * @returns {Promise<number>} - Number of keys deleted
 */
export const deleteCacheByPattern = async (pattern: string): Promise<number> => {
  try {
    let deletedCount = 0;
    const regex = new RegExp(pattern.replace('*', '.*'));

    // Delete from memory
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
        deletedCount++;
      }
    }

    // Delete from storage
    const allKeys = await AsyncStorage.getAllKeys();
    const prefix = CACHE_CONFIG.PREFIX;
    const keysToDelete = allKeys.filter(key => {
      if (key.startsWith(prefix)) {
        const cacheKey = key.substring(prefix.length);
        return regex.test(cacheKey);
      }
      return false;
    });

    if (keysToDelete.length > 0) {
      await AsyncStorage.multiRemove(keysToDelete);
      deletedCount += keysToDelete.length;
    }

    console.log(`🗑️ Deleted ${deletedCount} cache items matching: ${pattern}`);
    return deletedCount;
  } catch (error) {
    console.error('Cache pattern delete error:', error);
    return 0;
  }
};

/**
 * Clear all cache
 * @returns {Promise<boolean>}
 */
export const clearAllCache = async () => {
  try {
    // Clear memory
    memoryCache.clear();

    // Clear storage (only HeartSync cache keys)
    const allKeys = await AsyncStorage.getAllKeys();
    const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_CONFIG.PREFIX));
    
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }

    console.log(`🗑️ All cache cleared (${cacheKeys.length} items)`);
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

/**
 * Get cache statistics
 * @returns {Promise<Object>}
 */
export const getCacheStats = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const cacheKeys = allKeys.filter(key => key.startsWith(CACHE_CONFIG.PREFIX));
    
    return {
      memory: {
        keys: memoryCache.size,
      },
      storage: {
        keys: cacheKeys.length,
      },
      total: memoryCache.size + cacheKeys.length,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { memory: { keys: 0 }, storage: { keys: 0 }, total: 0 };
  }
};

/**
 * Cache with automatic fetch and update
 * @param {string} key - Cache key
 * @param {Function} fetchFunction - Function to fetch data if cache miss
 * @param {number} ttl - Time to live
 * @returns {Promise<any>}
 */
export const cacheOrFetch = async (key: string, fetchFunction: () => Promise<any>, ttl: number = CACHE_CONFIG.TTL.MEDIUM): Promise<any> => {
  // Try to get from cache first
  const cachedData = await getCache(key);
  
  if (cachedData !== null) {
    return cachedData;
  }

  // Cache miss, fetch data
  console.log(`🔄 Fetching fresh data for: ${key}`);
  const freshData = await fetchFunction();
  
  // Cache the fresh data
  await setCache(key, freshData, ttl);
  
  return freshData;
};

/**
 * Preload cache for better UX
 * @param {Array<{key: string, fetchFunction: Function, ttl: number}>} items
 * @returns {Promise<void>}
 */
export const preloadCache = async (items: PreloadItem[]): Promise<void> => {
  console.log(`🚀 Preloading ${items.length} cache items...`);
  
  const promises = items.map(({ key, fetchFunction, ttl }: PreloadItem) =>
    cacheOrFetch(key, fetchFunction, ttl).catch(err => {
      console.error(`Failed to preload ${key}:`, err);
    })
  );

  await Promise.all(promises);
  console.log(`✅ Preload complete`);
};

// Export cache configuration for use in other files
export { CACHE_CONFIG };

// Export default object
export default {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPattern,
  clearAllCache,
  getCacheStats,
  cacheOrFetch,
  preloadCache,
  CACHE_CONFIG,
};
