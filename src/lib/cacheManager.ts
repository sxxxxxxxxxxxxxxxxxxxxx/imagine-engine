/**
 * 双层缓存管理器
 * 内存缓存 + localStorage持久化
 * 优化频繁的JSON.parse/stringify操作
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl?: number;
}

class CacheManager {
  private memoryCache = new Map<string, CacheEntry>();
  private maxMemorySize = 50;

  /**
   * 获取缓存数据
   * @param key 缓存键
   * @param fallbackToLS 是否回退到localStorage
   * @returns 缓存数据或null
   */
  get(key: string, fallbackToLS = true): any | null {
    // 先查内存缓存
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key)!;
      
      // 检查是否过期
      if (entry.ttl) {
        const age = Date.now() - entry.timestamp;
        if (age > entry.ttl) {
          // 过期，删除
          this.memoryCache.delete(key);
          if (fallbackToLS && typeof window !== 'undefined') {
            localStorage.removeItem(key);
          }
          return null;
        }
      }
      
      console.log('🎯 内存缓存命中:', key);
      return entry.data;
    }
    
    // 再查localStorage
    if (fallbackToLS && typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          
          // 加载到内存缓存
          this.memoryCache.set(key, {
            data,
            timestamp: Date.now()
          });
          
          console.log('💾 localStorage缓存命中:', key);
          return data;
        } catch (e) {
          console.error('❌ 解析localStorage数据失败:', key, e);
          localStorage.removeItem(key);
        }
      }
    }
    
    return null;
  }

  /**
   * 设置缓存数据
   * @param key 缓存键
   * @param value 缓存值
   * @param options 缓存选项
   */
  set(
    key: string, 
    value: any, 
    options: { 
      ttl?: number;  // 过期时间（毫秒）
      memoryOnly?: boolean;  // 只存内存，不存localStorage
    } = {}
  ) {
    const { ttl, memoryOnly = false } = options;
    
    // 如果内存缓存已满，删除最旧的条目
    if (this.memoryCache.size >= this.maxMemorySize) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
      console.log('🗑️ 内存缓存已满，删除最旧条目:', firstKey);
    }
    
    // 设置内存缓存
    this.memoryCache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl
    });
    
    // 设置localStorage（如果不是memoryOnly）
    if (!memoryOnly && typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log('💾 缓存已保存:', key);
      } catch (e) {
        console.error('❌ localStorage存储失败（可能超出配额）:', key, e);
        
        // 尝试清理旧数据
        this.cleanupOldData();
        
        // 再次尝试
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (retryError) {
          console.error('❌ 清理后仍然无法存储:', key);
        }
      }
    }
  }

  /**
   * 删除缓存
   * @param key 缓存键
   */
  delete(key: string) {
    this.memoryCache.delete(key);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
    
    console.log('🗑️ 缓存已删除:', key);
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.memoryCache.clear();
    
    if (typeof window !== 'undefined') {
      // 只清除项目相关的缓存
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('imagine-engine-') || key.startsWith('ai-assistant-')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    console.log('🗑️ 所有缓存已清空');
  }

  /**
   * 清理旧数据（超过30天的）
   */
  private cleanupOldData() {
    if (typeof window === 'undefined') return;
    
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const keys = Object.keys(localStorage);
    let cleaned = 0;
    
    keys.forEach(key => {
      if (key.startsWith('imagine-engine-') || key.startsWith('ai-assistant-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.timestamp && data.timestamp < thirtyDaysAgo) {
            localStorage.removeItem(key);
            this.memoryCache.delete(key);
            cleaned++;
          }
        } catch (e) {
          // 无法解析的数据，删除
          localStorage.removeItem(key);
          cleaned++;
        }
      }
    });
    
    console.log(`🧹 清理了${cleaned}个旧数据`);
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const memorySize = this.memoryCache.size;
    const memoryKeys = Array.from(this.memoryCache.keys());
    
    let localStorageSize = 0;
    let localStorageKeys: string[] = [];
    
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      localStorageKeys = keys.filter(k => 
        k.startsWith('imagine-engine-') || k.startsWith('ai-assistant-')
      );
      localStorageSize = localStorageKeys.length;
    }
    
    return {
      memory: {
        size: memorySize,
        maxSize: this.maxMemorySize,
        keys: memoryKeys
      },
      localStorage: {
        size: localStorageSize,
        keys: localStorageKeys
      }
    };
  }
}

// 全局单例
export const cache = new CacheManager();

