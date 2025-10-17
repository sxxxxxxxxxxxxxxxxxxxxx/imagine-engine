'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRESET_PROVIDERS, ProviderManager } from '@/lib/apiProviders';
import ProviderConfig from '@/components/ProviderConfig';
import { 
  Settings as SettingsIcon, 
  Key, 
  Palette, 
  User,
  Download,
  Upload,
  Plus,
  Sparkles
} from 'lucide-react';

export default function SettingsPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'model' | 'account' | 'preferences'>('model');
  const [activeProvider, setActiveProvider] = useState('aicohere');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentProvider = ProviderManager.getActiveProvider();
    if (currentProvider) {
      setActiveProvider(currentProvider.id);
    }
  }, []);

  const handleSelectProvider = (providerId: string) => {
    setActiveProvider(providerId);
    ProviderManager.setActiveProvider(providerId);
  };

  const handleExportConfig = () => {
    const config = ProviderManager.exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imagine-engine-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const success = ProviderManager.importConfig(content);
          if (success) {
            alert(language === 'zh' ? '配置导入成功！' : 'Config imported successfully!');
            window.location.reload();
          } else {
            alert(language === 'zh' ? '配置导入失败' : 'Config import failed');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const tabs = [
    { id: 'model' as const, icon: SettingsIcon, label: t('settings.model') },
    { id: 'account' as const, icon: User, label: t('settings.account') },
    { id: 'preferences' as const, icon: Palette, label: t('settings.preferences') },
  ];

  if (!mounted) return null;

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {t('settings.title')}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {t('settings.subtitle')}
          </p>
        </div>

        {/* 标签页 */}
        <div className="flex gap-2 mb-6 border-b border-dark-200 dark:border-dark-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-dark-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 模型配置 Tab */}
        {activeTab === 'model' && (
          <div className="space-y-6">
            {/* 操作栏 */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-dark-900 dark:text-dark-50 mb-1">
                  {t('api.providerList')}
                </h2>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  {language === 'zh' 
                    ? `当前共 ${PRESET_PROVIDERS.length} 个提供商，${ProviderManager.getAllImageModels().length} 个图像模型` 
                    : `${PRESET_PROVIDERS.length} providers, ${ProviderManager.getAllImageModels().length} image models`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleImportConfig}
                  className="btn-secondary"
                >
                  <Upload className="w-4 h-4" />
                  {t('api.importConfig')}
                </button>
                <button
                  onClick={handleExportConfig}
                  className="btn-secondary"
                >
                  <Download className="w-4 h-4" />
                  {t('api.exportConfig')}
                </button>
              </div>
            </div>

            {/* Provider列表 */}
            <div className="grid gap-6">
              {PRESET_PROVIDERS.map(provider => (
                <ProviderConfig
                  key={provider.id}
                  provider={provider}
                  isActive={activeProvider === provider.id}
                  onSelect={() => handleSelectProvider(provider.id)}
                />
              ))}
            </div>

            {/* 使用提示 */}
            <div className="card p-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-dark-900 dark:text-dark-50 mb-2">
                    {language === 'zh' ? '使用提示' : 'Usage Tips'}
                  </h3>
                  <ul className="text-sm text-dark-700 dark:text-dark-300 space-y-1">
                    <li>• {language === 'zh' ? 'AI Cohere 是推荐的默认提供商，包含最新模型' : 'AI Cohere is the recommended default provider with latest models'}</li>
                    <li>• {language === 'zh' ? 'ModelScope 部分模型无需 API 密钥即可免费使用' : 'Some ModelScope models are free without API key'}</li>
                    <li>• {language === 'zh' ? 'OpenRouter 的 DeepSeek 模型完全免费' : 'OpenRouter\'s DeepSeek model is completely free'}</li>
                    <li>• {language === 'zh' ? 'Google 官方需要在 Google AI Studio 获取 API 密钥' : 'Google Official requires API key from Google AI Studio'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 账户管理 Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="card p-6 text-center">
              <User className="w-16 h-16 mx-auto text-dark-400 mb-4" />
              <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2">
                {language === 'zh' ? '账户功能即将推出' : 'Account Features Coming Soon'}
              </h3>
              <p className="text-dark-600 dark:text-dark-400">
                {language === 'zh' 
                  ? '用户系统正在开发中，敬请期待' 
                  : 'User system is under development, stay tuned'}
              </p>
            </div>
          </div>
        )}

        {/* 偏好设置 Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
                {language === 'zh' ? '界面设置' : 'Interface Settings'}
              </h3>
              <p className="text-dark-600 dark:text-dark-400">
                {language === 'zh' 
                  ? '主题和语言设置可通过顶部导航栏切换' 
                  : 'Theme and language can be switched via top navigation bar'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

