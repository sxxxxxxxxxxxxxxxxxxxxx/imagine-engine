/**
 * 初始化默认配置
 * 在应用启动时自动填充API密钥
 */

import { ProviderManager } from './apiProviders';

export function initializeDefaultConfig() {
  if (typeof window === 'undefined') return;

  // 检查是否已初始化
  const initialized = localStorage.getItem('imagine-engine-initialized');
  if (initialized === 'true') return;

  console.log('🔧 初始化默认API配置...');

  const keys = ProviderManager.getAllApiKeys();

  // 填充核心Provider的API密钥
  if (!keys['pockgo-image']) {
    ProviderManager.setApiKey('pockgo-image', 'sk-C358zCIUzlUZ7daJl4PEtu6njZz7g7k3luAWRqpS64gi0pjs');
    console.log('✅ Pockgo Image API密钥已配置');
  }

  if (!keys['modelscope']) {
    ProviderManager.setApiKey('modelscope', 'ms-68b498a8-97d5-4fef-9329-15587817422f');
    console.log('✅ ModelScope API密钥已配置');
  }

  // 填充可选Provider的API密钥
  if (!keys['google-official']) {
    ProviderManager.setApiKey('google-official', 'AIzaSyDt-c_vKjr4HDYRnttjzdWWjThCF-Qw6cc');
    console.log('✅ Google Gemini API密钥已配置');
  }

  // 设置默认激活Provider
  const activeProvider = ProviderManager.getActiveProvider();
  if (!activeProvider) {
    ProviderManager.setActiveProvider('pockgo-image');
    console.log('✅ 默认Provider设置为 Pockgo Image');
  }

  // 设置默认模型
  const currentModel = localStorage.getItem('imagine-engine-model');
  if (!currentModel) {
    localStorage.setItem('imagine-engine-model', 'gemini-2.5-flash-image');
    console.log('✅ 默认模型设置为 gemini-2.5-flash-image');
  }

  // 标记已初始化
  localStorage.setItem('imagine-engine-initialized', 'true');
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

