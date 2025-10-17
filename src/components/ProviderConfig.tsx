'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { APIProvider, ProviderManager } from '@/lib/apiProviders';
import { testConnection } from '@/lib/apiClient';
import { CheckCircle2, XCircle, Loader2, Key, Globe, Settings } from 'lucide-react';

interface ProviderConfigProps {
  provider: APIProvider;
  isActive: boolean;
  onSelect: () => void;
}

export default function ProviderConfig({ provider, isActive, onSelect }: ProviderConfigProps) {
  const { language, t } = useLanguage();
  const [apiKey, setApiKey] = useState(ProviderManager.getApiKey(provider.id));
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [hasEnvKey, setHasEnvKey] = useState(false);
  const [displayKey, setDisplayKey] = useState('');

  useEffect(() => {
    const key = ProviderManager.getApiKey(provider.id);
    if (key) {
      setHasEnvKey(true);
      setApiKey(key);
      // 脱敏显示：sk-C358***gi0pjs
      if (key.length > 13) {
        setDisplayKey(`${key.slice(0, 7)}***${key.slice(-6)}`);
      } else {
        setDisplayKey('***');
      }
    }
  }, [provider.id]);

  const handleSaveApiKey = () => {
    ProviderManager.setApiKey(provider.id, apiKey);
    alert(language === 'zh' ? `${provider.nameZh} API密钥已保存` : `${provider.name} API key saved`);
  };

  const handleTest = async () => {
    if (!apiKey.trim() && provider.requiresAuth) {
      setTestResult({
        success: false,
        message: language === 'zh' ? '请先输入API密钥' : 'Please enter API key first'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await testConnection(provider.id, apiKey);
    setTestResult(result);
    setTesting(false);
  };

  return (
    <div className={`card p-6 transition-all ${isActive ? 'ring-2 ring-primary-400' : ''}`}>
      {/* Provider Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {provider.icon && <span className="text-2xl">{provider.icon}</span>}
            <div>
              <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? provider.nameZh : provider.name}
              </h3>
              <p className="text-xs text-dark-500">
                {language === 'zh' ? provider.descriptionZh : provider.description}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onSelect}
          className={`px-4 py-2 rounded-button text-sm font-medium transition-colors ${
            isActive
              ? 'bg-primary-500 text-white'
              : 'bg-dark-100 dark:bg-dark-900 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-800'
          }`}
        >
          {isActive 
            ? (language === 'zh' ? '当前选中' : 'Active')
            : (language === 'zh' ? '选择' : 'Select')
          }
        </button>
      </div>

      {/* API配置 */}
      {provider.requiresAuth && (
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              <Key className="w-4 h-4 inline mr-1" />
              {t('api.apiKey')}
            </label>
            
            {/* 环境变量配置提示 */}
            {hasEnvKey && (
              <div className="mb-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-xs border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-300 font-medium flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {language === 'zh' ? '已从环境变量读取密钥' : 'Using key from environment'}
                </p>
                <p className="text-green-600 dark:text-green-400 font-mono">
                  {displayKey}
                </p>
                <p className="text-green-600 dark:text-green-400 mt-2">
                  {language === 'zh' 
                    ? '💡 在下方输入新密钥可覆盖默认配置' 
                    : '💡 Enter a new key below to override default'}
                </p>
              </div>
            )}
            
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={hasEnvKey 
                ? (language === 'zh' ? '输入新密钥覆盖默认配置...' : 'Enter new key to override...')
                : t('api.apiKeyPlaceholder')
              }
              className="input w-full font-mono text-sm"
            />
            <p className="text-xs text-dark-500 mt-1">{t('api.apiKeyHint')}</p>
          </div>

          {/* API地址显示 */}
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              {t('api.baseUrl')}
            </label>
            <input
              type="text"
              value={provider.baseUrl}
              readOnly
              className="input w-full bg-dark-100 dark:bg-dark-900 font-mono text-sm cursor-not-allowed"
            />
          </div>

          {/* 测试连接按钮 */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveApiKey}
              className="btn-secondary flex-1"
            >
              {t('button.save')}
            </button>
            <button
              onClick={handleTest}
              disabled={testing}
              className="btn-primary flex-1"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('api.testing')}
                </>
              ) : (
                <>
                  {t('api.testConnection')}
                </>
              )}
            </button>
          </div>

          {/* 测试结果 */}
          {testResult && (
            <div className={`p-3 rounded-lg flex items-start gap-2 ${
              testResult.success 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {testResult.success ? t('api.testSuccess') : t('api.testFailed')}
                </p>
                <p className="text-xs mt-1 opacity-90">{testResult.message}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 可用模型列表 */}
      <div>
        <h4 className="text-sm font-semibold text-dark-900 dark:text-dark-50 mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          {language === 'zh' ? '可用模型' : 'Available Models'} ({provider.models.length})
        </h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {provider.models.map(model => (
            <div
              key={model.id}
              className="px-3 py-2 bg-dark-50 dark:bg-dark-900 rounded-lg flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-dark-900 dark:text-dark-50">
                  {language === 'zh' ? model.nameZh : model.name}
                </p>
                <p className="text-xs text-dark-500 font-mono mt-0.5">{model.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  model.type === 'image'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : model.type === 'chat'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                }`}>
                  {t(`api.modelType.${model.type}`)}
                </span>
                {model.costPer1k === 0 && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                    {language === 'zh' ? '免费' : 'Free'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

