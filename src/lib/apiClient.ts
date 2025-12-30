/**
 * 统一API客户端
 * 支持多个Provider的请求格式转换和统一调用
 * 集成：请求队列、超时控制、缓存管理
 */

import { APIProvider, ModelConfig, ProviderManager } from './apiProviders';
import { apiQueue, fetchWithTimeout, requestCache } from './requestQueue';
import { rateLimiter } from './rateLimiter';

export interface ImageGenerationRequest {
  prompt: string;
  model?: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
  numOutputs?: number;
  referenceImage?: string;
  seed?: number;
}

export interface ImageGenerationResponse {
  success: boolean;
  images?: string[];
  error?: string;
  metadata?: {
    model: string;
    provider: string;
    duration?: number;
    cost?: number;
  };
}

export interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ChatResponse {
  success: boolean;
  content?: string;
  error?: string;
  metadata?: {
    model: string;
    provider: string;
    tokensUsed?: number;
  };
}

export class APIClient {
  // 图像生成统一接口
  static async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    // 速率限制检查
    const rateLimit = rateLimiter.check('image-generation');
    if (!rateLimit.allowed) {
      const resetSeconds = Math.ceil(rateLimit.resetIn / 1000);
      return {
        success: false,
        error: rateLimit.message || `请求过于频繁，请${resetSeconds}秒后再试`
      };
    }

    // 使用请求队列管理并发
    return apiQueue.add(async () => {
      try {
        const startTime = Date.now();
        
        // 获取当前配置（默认使用pockgo-image的seedream-4.0）
        const modelId = request.model || (typeof localStorage !== 'undefined' ? localStorage.getItem('imagine-engine-model') : null) || 'seedream-4.0';
        const providerConfig = ProviderManager.getProviderByModelId(modelId);
      
      if (!providerConfig) {
        throw new Error(`Model ${modelId} not found in any provider`);
      }

      const { provider, model } = providerConfig;
      let apiKey = ProviderManager.getApiKey(provider.id);

      // 服务端尝试从环境变量读取
      if (!apiKey && typeof window === 'undefined') {
        apiKey = ProviderManager.getDefaultApiKey(provider.id);
      }

      if (provider.requiresAuth && !apiKey) {
        throw new Error(`API key required for provider ${provider.name}`);
      }

      // 根据Provider类型转换请求格式
      let response: Response;

      if (provider.id === 'pockgo-image') {
        // Pockgo 使用标准 OpenAI 格式
        response = await this.callStandardAPI(provider, model, request, apiKey);
      } else if (provider.id === 'google-official') {
        // Google 官方 API 格式
        response = await this.callGoogleOfficialAPI(provider, model, request, apiKey);
      } else {
        // 其他Provider使用标准 OpenAI 格式
        response = await this.callStandardAPI(provider, model, request, apiKey);
      }

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API request failed: ${error}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      // 解析响应
      const images = this.extractImagesFromResponse(data, provider.id);

        return {
          success: true,
          images,
          metadata: {
            model: model.id,
            provider: provider.id,
            duration,
            cost: this.calculateCost(model, images.length),
          },
        };
      } catch (error: any) {
        console.error('Image generation failed:', error);
        return {
          success: false,
          error: error.message || 'Unknown error occurred',
        };
      }
    });
  }

  // 聊天对话统一接口
  static async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const modelId = request.model || 'deepseek/deepseek-chat-v3.1:free';
      const providerConfig = ProviderManager.getProviderByModelId(modelId);
      
      if (!providerConfig) {
        throw new Error(`Model ${modelId} not found`);
      }

      const { provider, model } = providerConfig;
      const apiKey = ProviderManager.getApiKey(provider.id);

      if (provider.requiresAuth && !apiKey) {
        throw new Error(`API key required for ${provider.name}`);
      }

      // 构建请求
      const url = provider.id === 'google-official'
        ? `${provider.baseUrl}/${model.id}:generateContent?key=${apiKey}`
        : `${provider.baseUrl}/chat/completions`;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (provider.authType === 'bearer' && apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const body = provider.id === 'google-official'
        ? this.buildGoogleChatRequest(request)
        : this.buildStandardChatRequest(request, model.id);

      // 使用带超时控制的fetch（30秒超时）
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      }, 30000);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Chat request failed: ${error}`);
      }

      const data = await response.json();
      const content = this.extractChatContent(data, provider.id);

      return {
        success: true,
        content,
        metadata: {
          model: model.id,
          provider: provider.id,
        },
      };
    } catch (error: any) {
      console.error('Chat failed:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  // === 私有方法：不同Provider的API调用 ===

  private static async callStandardAPI(
    provider: APIProvider,
    model: ModelConfig,
    request: ImageGenerationRequest,
    apiKey: string
  ): Promise<Response> {
    const url = `${provider.baseUrl}/images/generations`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const body = {
      model: model.id,
      prompt: request.prompt,
      n: request.numOutputs || 1,
      size: this.convertAspectRatioToSize(request.aspectRatio || '1:1'),
      ...(request.referenceImage && { image: request.referenceImage }),
      ...(request.seed && { seed: request.seed }),
    };

    // 使用带超时控制的fetch（30秒超时）
    return fetchWithTimeout(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }, 30000);
  }

  private static async callGoogleOfficialAPI(
    provider: APIProvider,
    model: ModelConfig,
    request: ImageGenerationRequest,
    apiKey: string
  ): Promise<Response> {
    const url = `${provider.baseUrl}/${model.id}:generateImages?key=${apiKey}`;
    
    const body = {
      prompt: request.prompt,
      numberOfImages: request.numOutputs || 1,
      ...(request.aspectRatio && { aspectRatio: request.aspectRatio }),
    };

    // 使用带超时控制的fetch（30秒超时）
    return fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }, 30000);
  }

  // === 辅助方法 ===

  private static extractImagesFromResponse(data: any, providerId: string): string[] {
    // Google官方格式
    if (providerId === 'google-official' && data.generatedImages) {
      return data.generatedImages.map((img: any) => img.base64 || img.url);
    }

    // 标准OpenAI格式
    if (data.data) {
      return data.data.map((item: any) => item.url || item.b64_json);
    }

    // 其他格式
    if (data.images) {
      return Array.isArray(data.images) ? data.images : [data.images];
    }

    return [];
  }

  private static extractChatContent(data: any, providerId: string): string {
    // Google格式
    if (providerId === 'google-official' && data.candidates) {
      return data.candidates[0]?.content?.parts[0]?.text || '';
    }

    // 标准OpenAI格式
    if (data.choices) {
      return data.choices[0]?.message?.content || '';
    }

    return '';
  }

  private static buildStandardChatRequest(request: ChatRequest, modelId: string): any {
    return {
      model: modelId,
      messages: request.messages,
      max_tokens: request.maxTokens,
      temperature: request.temperature,
      stream: request.stream || false,
    };
  }

  private static buildGoogleChatRequest(request: ChatRequest): any {
    return {
      contents: request.messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    };
  }

  private static convertAspectRatioToSize(ratio: string): string {
    const sizeMap: Record<string, string> = {
      '1:1': '1024x1024',
      '16:9': '1920x1080',
      '9:16': '1080x1920',
      '4:3': '1024x768',
      '3:4': '768x1024',
      '21:9': '2560x1080',
      '2:3': '1365x2048',
      '3:2': '2048x1365',
      '4:5': '1024x1280',
      '5:4': '1280x1024',
    };
    return sizeMap[ratio] || '1024x1024';
  }

  private static calculateCost(model: ModelConfig, numImages: number): number {
    return (model.costPer1k || 0) * numImages;
  }

  // 测试Provider连接
  static async testConnection(providerId: string, apiKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const provider = ProviderManager.getProviderById(providerId);
      if (!provider) {
        return { success: false, message: 'Provider not found' };
      }

      // 使用第一个聊天模型进行测试
      const chatModel = provider.models.find(m => m.type === 'chat');
      if (!chatModel) {
        return { success: false, message: 'No chat model available for testing' };
      }

      const url = provider.id === 'google-official'
        ? `${provider.baseUrl}/${chatModel.id}:generateContent?key=${apiKey}`
        : `${provider.baseUrl}/chat/completions`;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (provider.authType === 'bearer') {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const testMessage = provider.id === 'google-official'
        ? {
            contents: [
              { role: 'user', parts: [{ text: 'Hello' }] }
            ]
          }
        : {
            model: chatModel.id,
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 10,
          };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(testMessage),
      });

      if (response.ok) {
        return { success: true, message: 'Connection successful' };
      } else {
        const error = await response.text();
        return { success: false, message: `Failed: ${error.substring(0, 100)}` };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Connection failed' };
    }
  }
}

// 导出便捷方法
export const generateImage = (request: ImageGenerationRequest) => APIClient.generateImage(request);
export const chat = (request: ChatRequest) => APIClient.chat(request);
export const testConnection = (providerId: string, apiKey: string) => APIClient.testConnection(providerId, apiKey);

