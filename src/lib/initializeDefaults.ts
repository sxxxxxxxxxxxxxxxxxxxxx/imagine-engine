/**
 * 初始化默认配置
 * 在应用启动时自动填充API密钥
 */

import { ProviderManager } from './apiProviders';

export function initializeDefaultConfig() {
  if (typeof window === 'undefined') return;

  console.log('🔧 检查API配置...');

  // 简化逻辑：直接检查和设置核心配置
  const apiKey = localStorage.getItem('imagine-engine-api-key');
  
  if (!apiKey) {
    // 设置默认API密钥（Pockgo Image）
    localStorage.setItem('imagine-engine-api-key', 'sk-C358zCIUzlUZ7daJl4PEtu6njZz7g7k3luAWRqpS64gi0pjs');
    console.log('✅ 默认API密钥已配置');
  }

  // 设置默认API地址
  const baseUrl = localStorage.getItem('imagine-engine-base-url');
  if (!baseUrl) {
    localStorage.setItem('imagine-engine-base-url', 'https://newapi.pockgo.com/v1/chat/completions');
    console.log('✅ 默认API地址已配置');
  }

  // 设置默认模型
  const model = localStorage.getItem('imagine-engine-model');
  if (!model) {
    localStorage.setItem('imagine-engine-model', 'gemini-2.5-flash-image');
    console.log('✅ 默认模型已配置');
  }

  // 设置AI助手模型
  const assistantModel = localStorage.getItem('ai-assistant-model');
  if (!assistantModel) {
    localStorage.setItem('ai-assistant-model', 'deepseek-ai/DeepSeek-V3.1');
    console.log('✅ AI助手模型已配置');
  }

  // 使用ProviderManager设置（如果可用）
  try {
    ProviderManager.setApiKey('pockgo-image', 'sk-C358zCIUzlUZ7daJl4PEtu6njZz7g7k3luAWRqpS64gi0pjs');
    ProviderManager.setApiKey('modelscope', 'ms-68b498a8-97d5-4fef-9329-15587817422f');
    ProviderManager.setApiKey('google-official', 'AIzaSyDt-c_vKjr4HDYRnttjzdWWjThCF-Qw6cc');
    ProviderManager.setActiveProvider('pockgo-image');
    console.log('✅ ProviderManager配置完成');
  } catch (err) {
    console.warn('⚠️ ProviderManager配置跳过（使用直接localStorage）');
  }

  console.log('🎉 默认配置初始化完成！');
}

// 重置配置（用于测试）
export function resetDefaultConfig() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('imagine-engine-initialized');
  localStorage.removeItem('imagine-engine-api-keys');
  localStorage.removeItem('imagine-engine-active-provider');
  localStorage.removeItem('imagine-engine-model');
  
  console.log('🔄 配置已重置，刷新页面将重新初始化');
}

