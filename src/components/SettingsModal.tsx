'use client';

import { useState, useEffect } from 'react';

interface ModelProvider {
  id: string;
  name: string;
  baseUrl: string;
  models: {
    id: string;
    name: string;
    description: string;
  }[];
  format: 'openai' | 'gemini';
}

// 主流生图模型提供商配置
const MODEL_PROVIDERS: ModelProvider[] = [
  {
    id: 'nano-banana',
    name: 'Nano Banana (Gemini)',
    baseUrl: 'https://newapi.aicohere.org/v1/chat/completions',
    format: 'gemini',
    models: [
      {
        id: 'gemini-2.5-flash-image-preview',
        name: 'Gemini 2.5 Flash Image',
        description: '快速生图，支持图像编辑'
      }
    ]
  },
  {
    id: 'aicohere',
    name: 'AI Cohere (Claude)',
    baseUrl: 'https://newapi.aicohere.org/v1/chat/completions',
    format: 'openai',
    models: [
      {
        id: 'claude-3-7-sonnet-20250219',
        name: 'Claude 3.7 Sonnet',
        description: '文本对话模型'
      }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1/images/generations',
    format: 'openai',
    models: [
      {
        id: 'dall-e-3',
        name: 'DALL-E 3',
        description: 'OpenAI官方生图模型'
      },
      {
        id: 'dall-e-2',
        name: 'DALL-E 2',
        description: '经典生图模型'
      }
    ]
  },
  {
    id: 'stability',
    name: 'Stability AI',
    baseUrl: 'https://api.stability.ai/v1/generation',
    format: 'openai',
    models: [
      {
        id: 'stable-diffusion-xl-1024-v1-0',
        name: 'SDXL 1.0',
        description: '高质量生图'
      },
      {
        id: 'stable-diffusion-v1-6',
        name: 'SD 1.6',
        description: '经典Stable Diffusion'
      }
    ]
  },
  {
    id: 'midjourney',
    name: 'Midjourney API',
    baseUrl: 'https://api.midjourneyapi.xyz/v1/imagine',
    format: 'openai',
    models: [
      {
        id: 'midjourney-v6',
        name: 'Midjourney V6',
        description: '最新版本'
      },
      {
        id: 'midjourney-v5',
        name: 'Midjourney V5',
        description: '稳定版本'
      }
    ]
  },
  {
    id: 'flux',
    name: 'FLUX (Fal.ai)',
    baseUrl: 'https://fal.ai/api',
    format: 'openai',
    models: [
      {
        id: 'flux-pro',
        name: 'FLUX Pro',
        description: '专业级质量'
      },
      {
        id: 'flux-dev',
        name: 'FLUX Dev',
        description: '开发者版本'
      },
      {
        id: 'flux-schnell',
        name: 'FLUX Schnell',
        description: '快速生成'
      }
    ]
  },
  {
    id: 'recraft',
    name: 'Recraft V3',
    baseUrl: 'https://api.recraft.ai/v1',
    format: 'openai',
    models: [
      {
        id: 'recraft-v3',
        name: 'Recraft V3',
        description: '矢量图生成'
      }
    ]
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    baseUrl: 'https://api.ideogram.ai/v1',
    format: 'openai',
    models: [
      {
        id: 'ideogram-v2',
        name: 'Ideogram V2',
        description: '文字渲染优秀'
      }
    ]
  },
  {
    id: 'custom',
    name: '自定义API',
    baseUrl: '',
    format: 'openai',
    models: [
      {
        id: 'custom-model',
        name: '自定义模型',
        description: '输入自定义模型ID'
      }
    ]
  }
];

interface SettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isVisible, onClose }: SettingsModalProps) {
  const [selectedProvider, setSelectedProvider] = useState('nano-banana');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-image-preview');
  const [apiKey, setApiKey] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [customModelId, setCustomModelId] = useState('');

  // 加载保存的设置
  useEffect(() => {
    if (isVisible) {
      const savedProvider = localStorage.getItem('imagine-engine-provider');
      const savedModel = localStorage.getItem('imagine-engine-model');
      const savedApiKey = localStorage.getItem('imagine-engine-api-key');
      const savedBaseUrl = localStorage.getItem('imagine-engine-base-url');
      const savedCustomModel = localStorage.getItem('imagine-engine-custom-model');

      if (savedProvider) setSelectedProvider(savedProvider);
      if (savedModel) setSelectedModel(savedModel);
      if (savedApiKey) setApiKey(savedApiKey);
      if (savedBaseUrl) setCustomBaseUrl(savedBaseUrl);
      if (savedCustomModel) setCustomModelId(savedCustomModel);
    }
  }, [isVisible]);

  const currentProvider = MODEL_PROVIDERS.find(p => p.id === selectedProvider);

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert('请输入API Key');
      return;
    }

    // 保存到localStorage
    localStorage.setItem('imagine-engine-provider', selectedProvider);
    localStorage.setItem('imagine-engine-model', selectedModel);
    localStorage.setItem('imagine-engine-api-key', apiKey);
    
    if (selectedProvider === 'custom') {
      if (!customBaseUrl.trim()) {
        alert('请输入自定义API地址');
        return;
      }
      localStorage.setItem('imagine-engine-base-url', customBaseUrl);
      if (customModelId.trim()) {
        localStorage.setItem('imagine-engine-custom-model', customModelId);
      }
    } else {
      localStorage.setItem('imagine-engine-base-url', currentProvider?.baseUrl || '');
    }

    alert('设置已保存！');
    onClose();
    
    // 刷新页面使设置生效
    window.location.reload();
  };

  const handleClear = () => {
    if (confirm('确定要清除所有设置吗？')) {
      localStorage.removeItem('imagine-engine-provider');
      localStorage.removeItem('imagine-engine-model');
      localStorage.removeItem('imagine-engine-api-key');
      localStorage.removeItem('imagine-engine-base-url');
      localStorage.removeItem('imagine-engine-custom-model');
      
      setSelectedProvider('nano-banana');
      setSelectedModel('gemini-2.5-flash-image-preview');
      setApiKey('');
      setCustomBaseUrl('');
      setCustomModelId('');
      
      alert('设置已清除');
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ background: 'rgba(0, 0, 0, 0.75)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col"
        style={{ background: 'var(--bg-secondary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                ⚙️ 自定义模型管理
              </h2>
              <p className="text-base mt-2" style={{ color: 'var(--text-secondary)' }}>
                配置API密钥和模型，支持多个主流生图平台
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-red-500/10 flex items-center justify-center transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* 选择提供商 */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                🌐 选择模型提供商
              </label>
              <div className="grid grid-cols-3 gap-4">
                {MODEL_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => {
                      setSelectedProvider(provider.id);
                      if (provider.models.length > 0) {
                        setSelectedModel(provider.models[0].id);
                      }
                    }}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedProvider === provider.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-transparent hover:border-purple-500/30'
                    }`}
                    style={{ background: selectedProvider === provider.id ? undefined : 'var(--bg-tertiary)' }}
                  >
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {provider.name}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {provider.models.length} 个模型
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 选择模型 */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                🤖 选择模型
              </label>
              <div className="space-y-2">
                {currentProvider?.models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      selectedModel === model.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-transparent hover:border-purple-500/30'
                    }`}
                    style={{ background: selectedModel === model.id ? undefined : 'var(--bg-tertiary)' }}
                  >
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {model.name}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {model.description}
                    </div>
                    <div className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                      {model.id}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                🔑 API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请输入您的API密钥..."
                className="input-glass w-full font-mono"
              />
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                💡 密钥仅保存在浏览器本地，不会上传到服务器
              </p>
            </div>

            {/* 自定义API地址 */}
            {selectedProvider === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    🌐 API地址
                  </label>
                  <input
                    type="text"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="https://api.example.com/v1/chat/completions"
                    className="input-glass w-full font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    🤖 模型ID
                  </label>
                  <input
                    type="text"
                    value={customModelId}
                    onChange={(e) => setCustomModelId(e.target.value)}
                    placeholder="custom-model-name"
                    className="input-glass w-full font-mono text-sm"
                  />
                </div>
              </>
            )}

            {/* 当前配置预览 */}
            <div className="p-4 rounded-xl" style={{ 
              background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
              border: '1px solid rgba(138, 43, 226, 0.2)'
            }}>
              <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                📋 当前配置
              </h4>
              <div className="text-xs space-y-1 font-mono" style={{ color: 'var(--text-secondary)' }}>
                <p>提供商: {currentProvider?.name}</p>
                <p>模型: {selectedModel}</p>
                <p>API地址: {selectedProvider === 'custom' ? customBaseUrl || '未设置' : currentProvider?.baseUrl}</p>
                <p>格式: {currentProvider?.format.toUpperCase()}</p>
                <p>密钥: {apiKey ? '已设置 (******)' : '未设置'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="btn-secondary px-4 py-2"
            >
              🗑️ 清除设置
            </button>
            <button
              onClick={handleSave}
              className="flex-1 btn-gradient py-2"
            >
              💾 保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 获取当前设置
export function getCurrentSettings() {
  const provider = localStorage.getItem('imagine-engine-provider') || 'nano-banana';
  const model = localStorage.getItem('imagine-engine-model') || 'gemini-2.5-flash-image-preview';
  const apiKey = localStorage.getItem('imagine-engine-api-key') || '';
  const baseUrl = localStorage.getItem('imagine-engine-base-url') || 'https://newapi.aicohere.org/v1/chat/completions';
  const customModel = localStorage.getItem('imagine-engine-custom-model') || '';

  return {
    provider,
    model: customModel || model,
    apiKey,
    baseUrl
  };
}

export { MODEL_PROVIDERS };

