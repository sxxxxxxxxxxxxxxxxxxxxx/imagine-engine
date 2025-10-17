/**
 * API请求队列管理器
 * 防止并发请求过多，优化性能和避免API限流
 */

interface QueueItem {
  fn: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

export class RequestQueue {
  private queue: QueueItem[] = [];
  private running = 0;
  private maxConcurrent: number;

  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * 添加请求到队列
   * @param fn 要执行的异步函数
   * @returns Promise
   */
  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  private async process() {
    // 如果已达最大并发数，等待
    if (this.running >= this.maxConcurrent) {
      return;
    }

    // 从队列取出一个请求
    const item = this.queue.shift();
    if (!item) return;

    this.running++;

    try {
      const result = await item.fn();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      this.running--;
      // 处理下一个请求
      this.process();
    }
  }

  /**
   * 获取当前队列状态
   */
  getStatus() {
    return {
      queued: this.queue.length,
      running: this.running,
      maxConcurrent: this.maxConcurrent
    };
  }

  /**
   * 清空队列
   */
  clear() {
    this.queue.forEach(item => {
      item.reject(new Error('Queue cleared'));
    });
    this.queue = [];
  }
}

// 全局单例
export const apiQueue = new RequestQueue(3);

/**
 * 带超时控制的fetch
 * @param url 请求URL
 * @param options fetch选项
 * @param timeout 超时时间（毫秒）
 * @returns Promise
 */
export async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeout = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    
    throw error;
  }
}

/**
 * 简单的请求缓存
 */
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class RequestCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 100;

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 缓存数据或null
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // 检查是否过期
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    console.log('🎯 使用缓存:', key);
    return entry.data;
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param data 缓存数据
   * @param ttl 过期时间（毫秒），默认5分钟
   */
  set(key: string, data: any, ttl = 300000) {
    // 如果缓存已满，删除最旧的
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    
    console.log('💾 设置缓存:', key);
  }

  /**
   * 删除缓存
   */
  delete(key: string) {
    this.cache.delete(key);
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.cache.clear();
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const requestCache = new RequestCache();

