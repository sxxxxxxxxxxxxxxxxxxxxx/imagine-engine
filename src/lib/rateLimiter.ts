/**
 * 客户端速率限制器
 * 防止用户过度请求API，保护服务器和改善用户体验
 */

interface RateLimitConfig {
  maxRequests: number;  // 时间窗口内最大请求数
  windowMs: number;     // 时间窗口（毫秒）
  message?: string;     // 限流提示消息
}

class RateLimiter {
  private requests = new Map<string, number[]>();
  private configs = new Map<string, RateLimitConfig>();

  /**
   * 注册速率限制规则
   * @param name 规则名称
   * @param config 限制配置
   */
  register(name: string, config: RateLimitConfig) {
    this.configs.set(name, config);
  }

  /**
   * 检查是否可以发起请求
   * @param name 规则名称
   * @param userId 用户标识（可选，默认使用name）
   * @returns { allowed: boolean, remaining: number, resetIn: number }
   */
  check(name: string, userId?: string): { 
    allowed: boolean; 
    remaining: number; 
    resetIn: number;
    message?: string;
  } {
    const config = this.configs.get(name);
    
    if (!config) {
      console.warn(`⚠️ 未找到速率限制配置: ${name}`);
      return { allowed: true, remaining: -1, resetIn: 0 };
    }

    const key = userId || name;
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];

    // 清除过期请求（超出时间窗口）
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < config.windowMs
    );

    // 计算剩余配额
    const remaining = Math.max(0, config.maxRequests - validRequests.length);
    
    // 计算重置时间（最早的请求何时过期）
    const resetIn = validRequests.length > 0 
      ? config.windowMs - (now - validRequests[0])
      : 0;

    // 判断是否允许
    if (validRequests.length >= config.maxRequests) {
      console.warn(`⚠️ 速率限制: ${name}, 剩余0/${config.maxRequests}, ${Math.ceil(resetIn/1000)}秒后重置`);
      return { 
        allowed: false, 
        remaining: 0, 
        resetIn,
        message: config.message
      };
    }

    // 记录本次请求
    validRequests.push(now);
    this.requests.set(key, validRequests);

    return { 
      allowed: true, 
      remaining: remaining - 1,  // 减1因为刚记录了本次请求
      resetIn 
    };
  }

  /**
   * 清除用户的请求记录
   * @param userId 用户标识
   */
  clear(userId: string) {
    this.requests.delete(userId);
  }

  /**
   * 清除所有请求记录
   */
  clearAll() {
    this.requests.clear();
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const stats: any = {};
    
    this.configs.forEach((config, name) => {
      const requests = this.requests.get(name) || [];
      const now = Date.now();
      const validRequests = requests.filter(
        timestamp => now - timestamp < config.windowMs
      );
      
      stats[name] = {
        current: validRequests.length,
        max: config.maxRequests,
        remaining: config.maxRequests - validRequests.length
      };
    });
    
    return stats;
  }
}

// 全局单例
export const rateLimiter = new RateLimiter();

// 预设速率限制规则
rateLimiter.register('image-generation', {
  maxRequests: 10,
  windowMs: 60000,  // 1分钟
  message: '生成请求过于频繁，请1分钟后再试'
});

rateLimiter.register('ai-chat', {
  maxRequests: 20,
  windowMs: 60000,  // 1分钟
  message: '聊天请求过于频繁，请稍后再试'
});

rateLimiter.register('image-download', {
  maxRequests: 30,
  windowMs: 60000,  // 1分钟
  message: '下载过于频繁，请稍后再试'
});

