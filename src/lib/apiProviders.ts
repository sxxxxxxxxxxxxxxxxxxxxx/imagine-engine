/**
 * API Provider 配置系统
 * 支持多个AI服务提供商的统一管理
 */

export interface ModelConfig {
  id: string;
  name: string;
  nameZh: string;
  type: 'chat' | 'image' | 'vision';
  maxTokens?: number;
  supportedRatios?: string[];
  description?: string;
  descriptionZh?: string;
  costPer1k?: number;
}

export interface APIProvider {
  id: string;
  name: string;
  nameZh: string;
  baseUrl: string;
  models: ModelConfig[];
  requiresAuth: boolean;
  authType?: 'bearer' | 'header' | 'query';
  transformer?: string[];
  description?: string;
  descriptionZh?: string;
  icon?: string;
}

// 预设 Provider 配置
export const PRESET_PROVIDERS: APIProvider[] = [
  {
    id: 'pockgo-image',
    name: 'Pockgo Image',
    nameZh: 'Pockgo 图像生成',
    baseUrl: 'https://newapi.pockgo.com/v1/chat/completions',
    requiresAuth: true,
    authType: 'bearer',
    description: 'Primary image generation provider',
    descriptionZh: '主要图像生成提供商',
    icon: '🎨',
    models: [
      // SeedREAM 系列
      {
        id: 'seedream-4.0',
        name: 'SeedREAM 4.0',
        nameZh: '即梦 4.0',
        type: 'image',
        description: 'Standard quality image generation',
        descriptionZh: '标准质量图像生成',
        costPer1k: 0.01,
      },
      {
        id: 'seedream-4.0-2k',
        name: 'SeedREAM 4.0 2K',
        nameZh: '即梦 4.0 高清2K',
        type: 'image',
        description: 'High resolution 2K output',
        descriptionZh: '高分辨率 2K 输出',
        costPer1k: 0.02,
      },
      {
        id: 'seedream-4.0-4k',
        name: 'SeedREAM 4.0 4K',
        nameZh: '即梦 4.0 超清4K',
        type: 'image',
        description: 'Ultra high resolution 4K output',
        descriptionZh: '超高分辨率 4K 输出',
        costPer1k: 0.04,
      },
      // Gemini 系列
      {
        id: 'gemini-2.5-flash-image',
        name: 'Gemini 2.5 Flash Image',
        nameZh: 'Gemini 2.5 Flash 图像',
        type: 'image',
        supportedRatios: ['2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9', '1:1'],
        description: 'Multi-ratio support, official release',
        descriptionZh: '多比例支持，正式版',
        costPer1k: 0.015,
      },
      {
        id: 'gemini-3-pro-image-preview',
        name: 'Gemini 3 Pro Image Preview',
        nameZh: 'Gemini 3 Pro 图像预览',
        type: 'image',
        supportedRatios: ['2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9', '1:1'],
        description: 'Gemini 3 Pro preview model, standard quality',
        descriptionZh: 'Gemini 3 Pro 预览版，标准质量',
        costPer1k: 0.02,
      },
      {
        id: 'gemini-3-pro-image-preview-2k',
        name: 'Gemini 3 Pro Image Preview 2K',
        nameZh: 'Gemini 3 Pro 图像预览 2K',
        type: 'image',
        supportedRatios: ['2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9', '1:1'],
        description: 'Gemini 3 Pro preview model, 2K high resolution',
        descriptionZh: 'Gemini 3 Pro 预览版，2K高分辨率',
        costPer1k: 0.03,
      },
      {
        id: 'gemini-3-pro-image-preview-4k',
        name: 'Gemini 3 Pro Image Preview 4K',
        nameZh: 'Gemini 3 Pro 图像预览 4K',
        type: 'image',
        supportedRatios: ['2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9', '1:1'],
        description: 'Gemini 3 Pro preview model, 4K ultra high resolution',
        descriptionZh: 'Gemini 3 Pro 预览版，4K超清分辨率',
        costPer1k: 0.05,
      },
      // Qwen 系列
      {
        id: 'qwen-image',
        name: 'Qwen Image Edit',
        nameZh: '通义千问图像',
        type: 'image',
        description: 'Text-to-image and image-to-image',
        descriptionZh: '支持文生图和图生图',
        costPer1k: 0.012,
      },
      // 文本生成模型（Chat类型）- 用于大纲生成等文本任务
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        nameZh: 'Gemini 2.5 Pro',
        type: 'chat',
        description: 'Most capable model for text generation',
        descriptionZh: '最强大的文本生成模型',
        costPer1k: 0.075,
      },
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        nameZh: 'Gemini 2.5 Flash',
        type: 'chat',
        description: 'Fast and efficient text generation',
        descriptionZh: '快速高效的文本生成',
        costPer1k: 0.015,
      },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    nameZh: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    requiresAuth: true,
    authType: 'bearer',
    description: 'Access to multiple LLM providers',
    descriptionZh: '访问多个大语言模型提供商',
    icon: '🌐',
    models: [
      {
        id: 'deepseek/deepseek-chat-v3.1:free',
        name: 'DeepSeek Chat v3.1 (Free)',
        nameZh: 'DeepSeek 聊天 v3.1（免费）',
        type: 'chat',
        maxTokens: 65536,
        description: 'Free high-quality chat model',
        descriptionZh: '免费高质量聊天模型',
        costPer1k: 0,
      },
      {
        id: 'google/gemini-2.5-pro-preview',
        name: 'Gemini 2.5 Pro Preview',
        nameZh: 'Gemini 2.5 Pro 预览版',
        type: 'chat',
        description: 'Advanced reasoning capabilities',
        descriptionZh: '高级推理能力',
        costPer1k: 0.05,
      },
      {
        id: 'anthropic/claude-sonnet-4',
        name: 'Claude Sonnet 4',
        nameZh: 'Claude Sonnet 4',
        type: 'chat',
        description: 'Latest Claude model',
        descriptionZh: '最新 Claude 模型',
        costPer1k: 0.03,
      },
    ],
  },
  {
    id: 'modelscope',
    name: 'ModelScope',
    nameZh: '魔搭社区',
    baseUrl: 'https://api-inference.modelscope.cn/v1',
    requiresAuth: true,
    authType: 'bearer',
    description: 'AI assistant chat models',
    descriptionZh: 'AI助手聊天模型',
    icon: '🔮',
    models: [
      {
        id: 'Qwen/Qwen2.5-72B-Instruct',
        name: 'Qwen 2.5 72B Instruct',
        nameZh: 'Qwen 2.5 72B 指令模型',
        type: 'chat',
        maxTokens: 128000,
        description: 'Qwen 2.5 72B model, widely supported on ModelScope',
        descriptionZh: 'Qwen 2.5 72B 模型，ModelScope 广泛支持',
        costPer1k: 0,
      },
      {
        id: 'qwen/Qwen2.5-72B-Instruct',
        name: 'Qwen 2.5 72B (lowercase)',
        nameZh: 'Qwen 2.5 72B（小写）',
        type: 'chat',
        maxTokens: 128000,
        description: 'Qwen 2.5 72B model (lowercase variant)',
        descriptionZh: 'Qwen 2.5 72B 模型（小写变体）',
        costPer1k: 0,
      },
      {
        id: 'deepseek-ai/DeepSeek-V3.1',
        name: 'DeepSeek V3.1',
        nameZh: 'DeepSeek V3.1',
        type: 'chat',
        maxTokens: 128000,
        description: 'DeepSeek V3.1 model',
        descriptionZh: 'DeepSeek V3.1 模型',
        costPer1k: 0,
      },
    ],
  },
  {
    id: 'google-official',
    name: 'Google Gemini Official',
    nameZh: 'Google Gemini 官方',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    requiresAuth: true,
    authType: 'query',
    description: 'Official Google Gemini API',
    descriptionZh: '谷歌官方 Gemini API',
    icon: '🔷',
    models: [
      // 聊天模型
      {
        id: 'models/gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        nameZh: 'Gemini 2.5 Pro',
        type: 'chat',
        description: 'Most capable model',
        descriptionZh: '最强大的模型',
        costPer1k: 0.075,
      },
      {
        id: 'models/gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        nameZh: 'Gemini 2.5 Flash',
        type: 'chat',
        description: 'Fast and efficient',
        descriptionZh: '快速高效',
        costPer1k: 0.015,
      },
      // 图像生成模型
      {
        id: 'models/gemini-2.5-flash-image',
        name: 'Gemini 2.5 Flash Image',
        nameZh: 'Gemini 2.5 Flash 图像',
        type: 'image',
        description: 'Fast image generation',
        descriptionZh: '快速图像生成',
        costPer1k: 0.02,
      },
      {
        id: 'models/imagen-3.0-generate-002',
        name: 'Imagen 3.0',
        nameZh: 'Imagen 3.0',
        type: 'image',
        description: 'High-quality image generation',
        descriptionZh: '高质量图像生成',
        costPer1k: 0.04,
      },
      {
        id: 'models/imagen-4.0-fast-generate-001',
        name: 'Imagen 4.0 Fast',
        nameZh: 'Imagen 4.0 快速',
        type: 'image',
        description: 'Fastest Imagen model',
        descriptionZh: '最快的 Imagen 模型',
        costPer1k: 0.03,
      },
      {
        id: 'models/imagen-4.0-ultra-generate-001',
        name: 'Imagen 4.0 Ultra',
        nameZh: 'Imagen 4.0 超清',
        type: 'image',
        description: 'Highest quality image generation',
        descriptionZh: '最高质量图像生成',
        costPer1k: 0.08,
      },
      {
        id: 'models/imagen-4.0-generate-001',
        name: 'Imagen 4.0',
        nameZh: 'Imagen 4.0',
        type: 'image',
        description: 'Balanced quality and speed',
        descriptionZh: '平衡质量和速度',
        costPer1k: 0.05,
      },
    ],
  },
];

// 自定义 Provider 接口
export interface CustomProvider extends APIProvider {
  custom: true;
  createdAt: string;
}

// Provider 管理类
export class ProviderManager {
  private static STORAGE_KEY = 'imagine-engine-providers';
  private static ACTIVE_PROVIDER_KEY = 'imagine-engine-active-provider';
  private static API_KEYS_KEY = 'imagine-engine-api-keys';

  // 从环境变量获取默认API密钥（仅服务端）
  static getDefaultApiKey(providerId: string): string {
    if (typeof window !== 'undefined') return '';
    
    const envKeys: Record<string, string> = {
      'pockgo-image': process.env.POCKGO_API_KEY || '',
      'modelscope': process.env.MODELSCOPE_API_KEY || '',
      'google-official': process.env.GOOGLE_GEMINI_API_KEY || '',
      'openrouter': process.env.OPENROUTER_API_KEY || '',
    };
    
    return envKeys[providerId] || '';
  }

  // 获取所有可用 Provider（预设 + 自定义）
  static getAllProviders(): APIProvider[] {
    const customProviders = this.getCustomProviders();
    return [...PRESET_PROVIDERS, ...customProviders];
  }

  // 获取自定义 Provider
  static getCustomProviders(): CustomProvider[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // 添加自定义 Provider
  static addCustomProvider(provider: Omit<CustomProvider, 'custom' | 'createdAt'>): void {
    const customProviders = this.getCustomProviders();
    const newProvider: CustomProvider = {
      ...provider,
      custom: true,
      createdAt: new Date().toISOString(),
    };
    customProviders.push(newProvider);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customProviders));
  }

  // 删除自定义 Provider
  static deleteCustomProvider(id: string): void {
    const customProviders = this.getCustomProviders().filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customProviders));
  }

  // 获取当前激活的 Provider（图像生成默认pockgo-image）
  static getActiveProvider(): APIProvider | null {
    if (typeof window === 'undefined') return null;
    const activeId = localStorage.getItem(this.ACTIVE_PROVIDER_KEY);
    if (!activeId) return PRESET_PROVIDERS[0]; // 默认第一个（pockgo-image）
    return this.getAllProviders().find(p => p.id === activeId) || PRESET_PROVIDERS[0];
  }

  // 设置激活的 Provider
  static setActiveProvider(id: string): void {
    localStorage.setItem(this.ACTIVE_PROVIDER_KEY, id);
  }

  // 获取 Provider 的 API Key（优先用户配置，其次环境变量）
  static getApiKey(providerId: string): string {
    // 服务端直接返回环境变量
    if (typeof window === 'undefined') return this.getDefaultApiKey(providerId);
    
    // 客户端优先读取用户配置
    const keys = this.getAllApiKeys();
    const userKey = keys[providerId];
    
    // 如果用户有配置，使用用户配置；否则尝试环境变量
    if (userKey) return userKey;
    
    // 环境变量在客户端无法直接访问，但可以通过API route获取
    // 这里暂时返回空，Settings页面会显示环境变量状态
    return '';
  }

  // 设置 Provider 的 API Key
  static setApiKey(providerId: string, apiKey: string): void {
    const keys = this.getAllApiKeys();
    keys[providerId] = apiKey;
    localStorage.setItem(this.API_KEYS_KEY, JSON.stringify(keys));
  }

  // 获取所有 API Keys
  static getAllApiKeys(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(this.API_KEYS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  // 根据ID获取Provider
  static getProviderById(id: string): APIProvider | undefined {
    return this.getAllProviders().find(p => p.id === id);
  }

  // 根据模型ID获取Provider和模型
  static getProviderByModelId(modelId: string): { provider: APIProvider; model: ModelConfig } | null {
    for (const provider of this.getAllProviders()) {
      const model = provider.models.find(m => m.id === modelId);
      if (model) {
        return { provider, model };
      }
    }
    return null;
  }

  // 获取所有图像生成模型
  static getAllImageModels(): Array<{ provider: APIProvider; model: ModelConfig }> {
    const result: Array<{ provider: APIProvider; model: ModelConfig }> = [];
    for (const provider of this.getAllProviders()) {
      for (const model of provider.models) {
        if (model.type === 'image') {
          result.push({ provider, model });
        }
      }
    }
    return result;
  }

  // 获取所有聊天模型
  static getAllChatModels(): Array<{ provider: APIProvider; model: ModelConfig }> {
    const result: Array<{ provider: APIProvider; model: ModelConfig }> = [];
    for (const provider of this.getAllProviders()) {
      for (const model of provider.models) {
        if (model.type === 'chat') {
          result.push({ provider, model });
        }
      }
    }
    return result;
  }

  // 导出配置
  static exportConfig(): string {
    const config = {
      providers: this.getCustomProviders(),
      activeProvider: localStorage.getItem(this.ACTIVE_PROVIDER_KEY),
      apiKeys: this.getAllApiKeys(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(config, null, 2);
  }

  // 导入配置
  static importConfig(jsonString: string): boolean {
    try {
      const config = JSON.parse(jsonString);
      if (config.providers) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config.providers));
      }
      if (config.activeProvider) {
        localStorage.setItem(this.ACTIVE_PROVIDER_KEY, config.activeProvider);
      }
      if (config.apiKeys) {
        localStorage.setItem(this.API_KEYS_KEY, JSON.stringify(config.apiKeys));
      }
      return true;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    }
  }
}

// 导出默认Provider以便向后兼容
export const DEFAULT_PROVIDER = PRESET_PROVIDERS[0]; // pockgo-image
export const DEFAULT_IMAGE_PROVIDER = PRESET_PROVIDERS[0]; // pockgo-image
export const DEFAULT_CHAT_PROVIDER = PRESET_PROVIDERS.find(p => p.id === 'modelscope') || PRESET_PROVIDERS[1]; // modelscope
