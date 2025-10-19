'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProviderManager } from '@/lib/apiProviders';
import { 
  Settings as SettingsIcon, 
  Image as ImageIcon,
  MessageSquare,
  Check,
  ChevronDown,
  Download,
  Upload,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

export default function SettingsPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const [showModels, setShowModels] = useState(false);
  
  // 自定义配置状态
  const [customImageEnabled, setCustomImageEnabled] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customImageKey, setCustomImageKey] = useState('');
  
  const [customChatEnabled, setCustomChatEnabled] = useState(false);
  const [customChatUrl, setCustomChatUrl] = useState('');
  const [customChatKey, setCustomChatKey] = useState('');

  useEffect(() => {
    setMounted(true);
    
    // 加载自定义配置
    const loadCustomConfig = () => {
      setCustomImageEnabled(localStorage.getItem('imagine-engine-custom-image-enabled') === 'true');
      setCustomImageUrl(localStorage.getItem('imagine-engine-custom-image-url') || '');
      setCustomImageKey(localStorage.getItem('imagine-engine-custom-image-key') || '');
      
      setCustomChatEnabled(localStorage.getItem('imagine-engine-custom-chat-enabled') === 'true');
      setCustomChatUrl(localStorage.getItem('imagine-engine-custom-chat-url') || '');
      setCustomChatKey(localStorage.getItem('imagine-engine-custom-chat-key') || '');
    };
    loadCustomConfig();
  }, []);

  // 保存自定义图片生成配置
  const handleSaveCustomImage = () => {
    localStorage.setItem('imagine-engine-custom-image-enabled', 'true');
    localStorage.setItem('imagine-engine-custom-image-url', customImageUrl);
    localStorage.setItem('imagine-engine-custom-image-key', customImageKey);
    setCustomImageEnabled(true);
    alert(language === 'zh' ? '✅ 自定义图片生成配置已保存！' : '✅ Custom image config saved!');
  };

  // 保存自定义聊天配置
  const handleSaveCustomChat = () => {
    localStorage.setItem('imagine-engine-custom-chat-enabled', 'true');
    localStorage.setItem('imagine-engine-custom-chat-url', customChatUrl);
    localStorage.setItem('imagine-engine-custom-chat-key', customChatKey);
    setCustomChatEnabled(true);
    alert(language === 'zh' ? '✅ 自定义AI聊天配置已保存！' : '✅ Custom chat config saved!');
  };

  // 禁用自定义配置
  const handleDisableCustomImage = () => {
    localStorage.setItem('imagine-engine-custom-image-enabled', 'false');
    setCustomImageEnabled(false);
    alert(language === 'zh' ? '已切换回默认服务' : 'Switched back to default service');
  };

  const handleDisableCustomChat = () => {
    localStorage.setItem('imagine-engine-custom-chat-enabled', 'false');
    setCustomChatEnabled(false);
    alert(language === 'zh' ? '已切换回默认服务' : 'Switched back to default service');
  };

  // 重置为默认
  const handleReset = () => {
    if (confirm(language === 'zh' ? '确定要重置所有配置为默认吗？' : 'Reset all configs to default?')) {
      localStorage.removeItem('imagine-engine-custom-image-enabled');
      localStorage.removeItem('imagine-engine-custom-image-url');
      localStorage.removeItem('imagine-engine-custom-image-key');
      localStorage.removeItem('imagine-engine-custom-chat-enabled');
      localStorage.removeItem('imagine-engine-custom-chat-url');
      localStorage.removeItem('imagine-engine-custom-chat-key');
      window.location.reload();
    }
  };

  // 导出配置
  const handleExport = () => {
    const config = {
      customImage: {
        enabled: customImageEnabled,
        url: customImageUrl,
        key: customImageKey ? '***' : ''  // 密钥脱敏
      },
      customChat: {
        enabled: customChatEnabled,
        url: customChatUrl,
        key: customChatKey ? '***' : ''
      }
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imagine-engine-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) return null;

  const imageModels = ['gemini-2.5-flash-image', 'seedream-4.0', 'seedream-4.0-2k', 'seedream-4.0-4k', 'qwen-image'];

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {language === 'zh' ? '设置' : 'Settings'}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {language === 'zh' ? '配置你的 AI 服务' : 'Configure your AI services'}
          </p>
        </div>

        {/* 当前使用的服务 */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-bold text-dark-900 dark:text-dark-50 flex items-center gap-2">
            💡 {language === 'zh' ? '当前使用的服务' : 'Current Services'}
          </h2>
          
          {/* 图片生成服务 */}
          <div className={`card p-5 border-2 ${
            customImageEnabled 
              ? 'border-yellow-200 dark:border-yellow-800' 
              : 'border-green-200 dark:border-green-800'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  customImageEnabled 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                    : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  <ImageIcon className={`w-5 h-5 ${
                    customImageEnabled 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-900 dark:text-dark-50 mb-1">
                    {language === 'zh' ? '图片生成服务' : 'Image Generation Service'}
                  </h3>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    {customImageEnabled ? (
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                        🔧 {language === 'zh' ? '使用自定义配置' : 'Using Custom Config'}
                      </span>
                    ) : (
                      <>
                        Pockgo Image · 
                        <span className="text-green-600 dark:text-green-400 font-medium ml-1">
                          <Check className="w-3 h-3 inline" /> {language === 'zh' ? '已就绪' : 'Ready'}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="pl-13">
              <p className="text-sm text-dark-500 mb-2">
                {language === 'zh' ? '支持模型：' : 'Available models:'} 
                <span className="font-mono text-xs ml-1">{imageModels.length}</span> 个
              </p>
              <button 
                onClick={() => setShowModels(!showModels)}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                {showModels ? (language === 'zh' ? '收起模型列表' : 'Hide models') : (language === 'zh' ? '查看所有模型' : 'View all models')}
                <ChevronDown className={`w-3 h-3 transition-transform ${showModels ? 'rotate-180' : ''}`} />
              </button>
              {showModels && (
                <div className="mt-3 p-3 bg-dark-50 dark:bg-dark-900 rounded-lg">
                  <ul className="text-xs space-y-1 text-dark-600 dark:text-dark-400">
                    {imageModels.map(model => (
                      <li key={model} className="font-mono">• {model}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* AI聊天服务 */}
          <div className={`card p-5 border-2 ${
            customChatEnabled 
              ? 'border-yellow-200 dark:border-yellow-800' 
              : 'border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  customChatEnabled 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                    : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  <MessageSquare className={`w-5 h-5 ${
                    customChatEnabled 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-900 dark:text-dark-50 mb-1">
                    {language === 'zh' ? 'AI聊天服务' : 'AI Chat Service'}
                  </h3>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    {customChatEnabled ? (
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                        🔧 {language === 'zh' ? '使用自定义配置' : 'Using Custom Config'}
                      </span>
                    ) : (
                      <>
                        ModelScope · 
                        <span className="text-blue-600 dark:text-blue-400 font-medium ml-1">
                          <Check className="w-3 h-3 inline" /> {language === 'zh' ? '已就绪' : 'Ready'}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="pl-13">
              <p className="text-sm text-dark-500 mb-2">
                {language === 'zh' ? '当前模型：' : 'Current model:'} 
                <span className="font-mono text-xs ml-1">DeepSeek V3.1</span>
              </p>
              <p className="text-xs text-dark-500">
                {language === 'zh' ? '用于 AI 助手的智能对话和提示词优化' : 'For AI assistant smart chat and prompt optimization'}
              </p>
            </div>
          </div>
        </div>

        {/* 自定义配置（折叠） */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => setShowCustomConfig(!showCustomConfig)}
            className="w-full flex items-center justify-between p-4 card hover:border-primary-400 dark:hover:border-primary-500 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-left">
                <h2 className="text-base font-bold text-dark-900 dark:text-dark-50">
                  {language === 'zh' ? '自定义配置（可选）' : 'Custom Configuration (Optional)'}
                </h2>
                <p className="text-xs text-dark-500">
                  {language === 'zh' ? '高级用户可自定义 API 服务' : 'Advanced users can customize API services'}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-dark-400 transition-transform ${showCustomConfig ? 'rotate-180' : ''}`} />
          </button>

          {showCustomConfig && (
            <div className="space-y-4 animate-fadeIn">
              {/* 自定义图片生成API */}
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold text-dark-900 dark:text-dark-50">
                    {language === 'zh' ? '自定义图片生成 API' : 'Custom Image Generation API'}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="form-label mb-2">
                      {language === 'zh' ? 'API 地址' : 'API Endpoint'}
                    </label>
                    <input
                      type="text"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://your-api.com/v1/images/generations"
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="form-label mb-2">
                      {language === 'zh' ? 'API 密钥' : 'API Key'}
                    </label>
                    <input
                      type="password"
                      value={customImageKey}
                      onChange={(e) => setCustomImageKey(e.target.value)}
                      placeholder="sk-..."
                      className="input text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    {customImageEnabled ? (
                      <button 
                        onClick={handleDisableCustomImage}
                        className="btn-secondary text-sm flex-1"
                      >
                        {language === 'zh' ? '切换回默认服务' : 'Switch to Default'}
                      </button>
                    ) : (
                      <button 
                        onClick={handleSaveCustomImage}
                        disabled={!customImageUrl || !customImageKey}
                        className="btn-primary text-sm flex-1"
                      >
                        {language === 'zh' ? '启用自定义配置' : 'Enable Custom Config'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 自定义AI聊天API */}
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold text-dark-900 dark:text-dark-50">
                    {language === 'zh' ? '自定义 AI 聊天 API' : 'Custom AI Chat API'}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="form-label mb-2">
                      {language === 'zh' ? 'API 地址' : 'API Endpoint'}
                    </label>
                    <input
                      type="text"
                      value={customChatUrl}
                      onChange={(e) => setCustomChatUrl(e.target.value)}
                      placeholder="https://your-api.com/v1/chat/completions"
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="form-label mb-2">
                      {language === 'zh' ? 'API 密钥' : 'API Key'}
                    </label>
                    <input
                      type="password"
                      value={customChatKey}
                      onChange={(e) => setCustomChatKey(e.target.value)}
                      placeholder="sk-..."
                      className="input text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    {customChatEnabled ? (
                      <button 
                        onClick={handleDisableCustomChat}
                        className="btn-secondary text-sm flex-1"
                      >
                        {language === 'zh' ? '切换回默认服务' : 'Switch to Default'}
                      </button>
                    ) : (
                      <button 
                        onClick={handleSaveCustomChat}
                        disabled={!customChatUrl || !customChatKey}
                        className="btn-primary text-sm flex-1"
                      >
                        {language === 'zh' ? '启用自定义配置' : 'Enable Custom Config'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 高级选项 */}
        <div className="card p-5">
          <h2 className="text-base font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? '高级选项' : 'Advanced Options'}
          </h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleExport} className="btn-secondary text-sm">
              <Download className="w-4 h-4" />
              {language === 'zh' ? '导出配置' : 'Export Config'}
            </button>
            <button onClick={handleReset} className="btn-secondary text-sm">
              <RotateCcw className="w-4 h-4" />
              {language === 'zh' ? '重置为默认' : 'Reset to Default'}
            </button>
            <a 
              href="https://github.com/yourusername/imagine-engine" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              {language === 'zh' ? '查看文档' : 'View Docs'}
            </a>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="card p-5 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <h3 className="font-semibold text-dark-900 dark:text-dark-50 mb-3 flex items-center gap-2">
            💡 {language === 'zh' ? '使用说明' : 'Instructions'}
          </h3>
          <div className="space-y-2 text-sm text-dark-700 dark:text-dark-300">
            <p>
              <strong className="text-primary-600 dark:text-primary-400">
                {language === 'zh' ? '默认服务：' : 'Default Services:'}
              </strong>
              {language === 'zh' 
                ? ' 我们已为您配置好所有服务，开箱即用，无需额外设置。'
                : ' We have pre-configured all services for you, ready to use out of the box.'}
            </p>
            <p>
              <strong className="text-primary-600 dark:text-primary-400">
                {language === 'zh' ? '自定义配置：' : 'Custom Config:'}
              </strong>
              {language === 'zh' 
                ? ' 如需使用自己的 API 服务，请展开上方"自定义配置"区域进行设置。'
                : ' If you need to use your own API services, expand the "Custom Configuration" section above.'}
            </p>
            <p>
              <strong className="text-primary-600 dark:text-primary-400">
                {language === 'zh' ? '切换服务：' : 'Switch Services:'}
              </strong>
              {language === 'zh' 
                ? ' 启用自定义配置后，系统将优先使用您的 API。可随时切换回默认服务。'
                : ' After enabling custom config, the system will prioritize your API. You can switch back anytime.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
