'use client';

import { useState, useEffect } from 'react';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import { MODEL_PROVIDERS } from '@/components/SettingsModal';
import Link from 'next/link';

export default function SettingsPage() {
  const [selectedProvider, setSelectedProvider] = useState('nano-banana');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-image-preview');
  const [apiKey, setApiKey] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [customModelId, setCustomModelId] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 加载保存的设置
  useEffect(() => {
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
  }, []);

  const currentProvider = MODEL_PROVIDERS.find(p => p.id === selectedProvider);

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert('请输入API Key');
      return;
    }

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

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    
    alert('设置已保存！页面将刷新使设置生效');
    setTimeout(() => window.location.reload(), 1000);
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

  return (
    <WorkspaceLayout>
      <div className="min-h-screen p-6 max-w-[1800px] mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>⚙️ 设置</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                配置API密钥和模型，支持多个主流生图平台
              </p>
            </div>
            <Link href="/create" className="btn-secondary px-6 py-3">
              返回创作
            </Link>
          </div>
        </div>

        {/* Nano Banana 推荐卡片 */}
        <div className="glass-card p-6 mb-6 border-2 border-purple-300 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-3xl">🍌</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  推荐使用 Nano Banana AI
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold">
                  顶级
                </span>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                基于 Google Gemini 2.5 Flash 的世界级图像生成模型，支持批量生成、角色一致性、场景融合等专业功能。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-medium">角色一致性</span>
                <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">批量生成</span>
                <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">场景融合</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* 左列 - 选择提供商 */}
          <div className="space-y-4 flex flex-col" style={{ minHeight: '800px' }}>
            <div className="glass-card p-6">
              <label className="block text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                🌐 选择模型提供商
              </label>
              <div className="space-y-3">
                {MODEL_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => {
                      setSelectedProvider(provider.id);
                      if (provider.models.length > 0) {
                        setSelectedModel(provider.models[0].id);
                      }
                    }}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedProvider === provider.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-transparent hover:border-purple-500/30'
                    }`}
                    style={{ background: selectedProvider === provider.id ? undefined : 'var(--bg-tertiary)' }}
                  >
                    <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {provider.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {provider.models.length} 个模型
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 占位 */}
            <div className="flex-1"></div>
          </div>

          {/* 中列 - 选择模型和配置 */}
          <div className="space-y-4 flex flex-col" style={{ minHeight: '800px' }}>
            {/* 选择模型 */}
            <div className="glass-card p-6">
              <label className="block text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
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
            <div className="glass-card p-6">
              <label className="block text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                🔑 API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请输入您的API密钥..."
                className="input-glass w-full font-mono"
              />
              <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                💡 密钥仅保存在浏览器本地，不会上传到服务器
              </p>
            </div>

            {/* 自定义配置 */}
            {selectedProvider === 'custom' && (
              <>
                <div className="glass-card p-6">
                  <label className="block text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
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

                <div className="glass-card p-6">
                  <label className="block text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
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

            {/* 占位 */}
            <div className="flex-1"></div>
          </div>

          {/* 右列 - 当前配置预览 */}
          <div className="flex flex-col" style={{ minHeight: '800px' }}>
            <div className="glass-card p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                📋 当前配置
              </h3>
              
              <div className="space-y-4 flex-1">
                <div className="p-4 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>提供商</span>
                      <p className="font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                        {currentProvider?.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>模型</span>
                      <p className="font-mono text-xs mt-1" style={{ color: 'var(--text-primary)' }}>
                        {selectedModel}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>API地址</span>
                      <p className="font-mono text-xs mt-1 break-all" style={{ color: 'var(--text-primary)' }}>
                        {selectedProvider === 'custom' ? customBaseUrl || '未设置' : currentProvider?.baseUrl}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>格式</span>
                      <p className="font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                        {currentProvider?.format.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>密钥</span>
                      <p className="mt-1" style={{ color: apiKey ? 'var(--accent-purple)' : 'var(--text-secondary)' }}>
                        {apiKey ? '✅ 已设置 (******)' : '❌ 未设置'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ 
                  background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                  border: '1px solid rgba(138, 43, 226, 0.2)'
                }}>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    💡 使用说明
                  </h4>
                  <ul className="text-xs space-y-2" style={{ color: 'var(--text-secondary)' }}>
                    <li>• 选择您喜欢的模型提供商</li>
                    <li>• 输入对应的API密钥</li>
                    <li>• 点击"保存设置"按钮</li>
                    <li>• 页面会自动刷新使设置生效</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl" style={{ 
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    🔒 安全保证
                  </h4>
                  <ul className="text-xs space-y-2" style={{ color: 'var(--text-secondary)' }}>
                    <li>• API密钥仅保存在浏览器本地</li>
                    <li>• 不会上传到任何服务器</li>
                    <li>• localStorage加密存储</li>
                    <li>• 完全由您控制</li>
                  </ul>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3 mt-6">
                {saveSuccess && (
                  <div className="p-3 rounded-lg bg-green-500/20 text-green-600 text-sm text-center">
                    ✅ 设置保存成功！
                  </div>
                )}
                
                <button
                  onClick={handleSave}
                  className="w-full btn-gradient py-4"
                >
                  💾 保存设置
                </button>
                
                <button
                  onClick={handleClear}
                  className="w-full btn-secondary py-3"
                >
                  🗑️ 清除设置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

