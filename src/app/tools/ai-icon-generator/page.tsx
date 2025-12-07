'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProviderManager } from '@/lib/apiProviders';
import { Shapes, Loader2, Download, Sparkles, RefreshCw, CheckCircle2, Zap, Star, Image as ImageIcon, Square, Box, Circle, Minus } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabase';
import { downloadImage } from '@/lib/downloadUtils';
import { toastManager } from '@/components/Toast';
import { recordToolUsage } from '@/lib/recentTools';

type IconStyle = 'flat' | 'gradient' | '3d' | 'outline' | 'filled' | 'minimal';
type IconSize = '16' | '24' | '32' | '48' | '64' | '128';

export default function AIIconGeneratorPage() {
  const { isLoggedIn, user } = useAuth();
  const { language } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [iconStyle, setIconStyle] = useState<IconStyle>('flat');
  const [iconSize, setIconSize] = useState<IconSize>('64');
  const [colorScheme, setColorScheme] = useState('primary');
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConfig, setApiConfig] = useState<{ apiKey: string; baseUrl: string; model: string } | null>(null);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-image');
  const [history, setHistory] = useState<Array<{ prompt: string; imageUrl: string; style: IconStyle; timestamp: number }>>([]);

  const iconStyles = [
    { id: 'flat' as IconStyle, labelZh: '扁平风格', labelEn: 'Flat Style', icon: Square, color: '#3b82f6' },
    { id: 'gradient' as IconStyle, labelZh: '渐变风格', labelEn: 'Gradient Style', icon: Sparkles, color: '#8b5cf6' },
    { id: '3d' as IconStyle, labelZh: '3D风格', labelEn: '3D Style', icon: Box, color: '#f59e0b' },
    { id: 'outline' as IconStyle, labelZh: '线框风格', labelEn: 'Outline Style', icon: Circle, color: '#10b981' },
    { id: 'filled' as IconStyle, labelZh: '填充风格', labelEn: 'Filled Style', icon: Square, color: '#ef4444' },
    { id: 'minimal' as IconStyle, labelZh: '极简风格', labelEn: 'Minimal Style', icon: Minus, color: '#6b7280' },
  ];

  const colorSchemes = [
    { id: 'primary', labelZh: '主色调', labelEn: 'Primary', colors: ['#14b8a6', '#0d9488'] },
    { id: 'blue', labelZh: '蓝色系', labelEn: 'Blue', colors: ['#3b82f6', '#2563eb'] },
    { id: 'purple', labelZh: '紫色系', labelEn: 'Purple', colors: ['#8b5cf6', '#7c3aed'] },
    { id: 'orange', labelZh: '橙色系', labelEn: 'Orange', colors: ['#f59e0b', '#d97706'] },
    { id: 'green', labelZh: '绿色系', labelEn: 'Green', colors: ['#10b981', '#059669'] },
    { id: 'red', labelZh: '红色系', labelEn: 'Red', colors: ['#ef4444', '#dc2626'] },
  ];

  const examplePrompts = [
    { zh: '一个购物车图标', en: 'A shopping cart icon' },
    { zh: '一个设置齿轮图标', en: 'A settings gear icon' },
    { zh: '一个用户头像图标', en: 'A user avatar icon' },
    { zh: '一个搜索放大镜图标', en: 'A search magnifying glass icon' },
    { zh: '一个心形收藏图标', en: 'A heart favorite icon' },
    { zh: '一个通知铃铛图标', en: 'A notification bell icon' },
  ];

  // 获取模型列表
  const pockgoProvider = ProviderManager.getProviderById('pockgo-image');
  const imageModels = pockgoProvider?.models.filter(m => m.type === 'image') || [];
  const geminiModels = imageModels.filter(m => m.id.includes('gemini'));
  const otherModels = imageModels.filter(m => !m.id.includes('gemini'));

  // 默认选择Gemini模型
  useEffect(() => {
    const savedModel = localStorage.getItem('imagine-engine-model');
    if (savedModel && imageModels.some(m => m.id === savedModel)) {
      setSelectedModel(savedModel);
    } else {
      const defaultGemini = geminiModels.find(m => m.id === 'gemini-2.5-flash-image')?.id || geminiModels[0]?.id;
      if (defaultGemini) {
        setSelectedModel(defaultGemini);
      }
    }
  }, []);

  // 从ProviderManager获取API配置
  useEffect(() => {
    const loadConfig = () => {
      const modelId = selectedModel || localStorage.getItem('imagine-engine-model') || 'gemini-2.5-flash-image';
      const providerConfig = ProviderManager.getProviderByModelId(modelId);
      
      if (providerConfig) {
        const apiKey = ProviderManager.getApiKey(providerConfig.provider.id) || '';
        const baseUrl = providerConfig.provider.baseUrl;
        setApiConfig({ apiKey, baseUrl, model: modelId });
      } else {
        const apiKey = localStorage.getItem('imagine-engine-api-key') || '';
        const baseUrl = localStorage.getItem('imagine-engine-base-url') || 'https://newapi.aicohere.org/v1/chat/completions';
        setApiConfig({ apiKey, baseUrl, model: modelId });
      }
    };
    
    loadConfig();
    const interval = setInterval(loadConfig, 1000);
    return () => clearInterval(interval);
  }, [selectedModel]);

  // 生成图标
  const generateIcon = async () => {
    if (!prompt.trim()) {
      toastManager.warning(language === 'zh' ? '请输入图标描述' : 'Please enter icon description');
      return;
    }

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!apiConfig?.apiKey) {
      toastManager.error(language === 'zh' ? '请先配置API密钥' : 'Please configure API key first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const selectedColorScheme = colorSchemes.find(cs => cs.id === colorScheme);
      const styleDescriptions: Record<IconStyle, string> = {
        flat: language === 'zh' ? '扁平化设计，简洁现代' : 'Flat design, clean and modern',
        gradient: language === 'zh' ? '渐变色彩，视觉丰富' : 'Gradient colors, visually rich',
        '3d': language === 'zh' ? '3D立体效果，有深度感' : '3D effect with depth',
        outline: language === 'zh' ? '线框风格，简约优雅' : 'Outline style, simple and elegant',
        filled: language === 'zh' ? '实心填充，饱满有力' : 'Filled style, bold and solid',
        minimal: language === 'zh' ? '极简设计，极简线条' : 'Minimal design, minimal lines',
      };

      const enhancedPrompt = `${prompt}, ${styleDescriptions[iconStyle]}, ${language === 'zh' ? '图标设计' : 'icon design'}, ${selectedColorScheme ? `${language === 'zh' ? '使用' : 'use'} ${selectedColorScheme.colors.join(' and ')} ${language === 'zh' ? '颜色' : 'colors'}` : ''}, ${language === 'zh' ? '透明背景' : 'transparent background'}, ${language === 'zh' ? '正方形画布' : 'square canvas'}, ${iconSize}x${iconSize} ${language === 'zh' ? '像素' : 'pixels'}, ${language === 'zh' ? '高质量' : 'high quality'}, ${language === 'zh' ? '矢量风格' : 'vector style'}`;

      // 获取用户session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error(language === 'zh' ? '请先登录' : 'Please login first');
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          model: apiConfig.model,
          apiKey: apiConfig.apiKey,
          baseUrl: apiConfig.baseUrl,
          aspectRatio: '1:1', // 图标使用1:1比例
        }),
      });

      // 检查响应类型
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('API返回非JSON响应:', text.substring(0, 200));
        throw new Error(language === 'zh' ? '服务器返回了错误响应，请稍后重试' : 'Server returned an error response, please try again later');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.message || 'Generation failed');
      }

      const data = await response.json();
      
      if (data.imageUrl) {
        setResult(data.imageUrl);
        setHistory(prev => [{
          prompt,
          imageUrl: data.imageUrl,
          style: iconStyle,
          timestamp: Date.now(),
        }, ...prev.slice(0, 9)]);
        
        // 记录工具使用
        recordToolUsage(
          'ai-icon-generator',
          language === 'zh' ? 'AI图标生成器' : 'AI Icon Generator',
          '/tools/ai-icon-generator'
        );

        // 配额已在API中扣除，这里不需要再次扣除

        toastManager.success(language === 'zh' ? '图标生成成功！' : 'Icon generated successfully!');
      } else {
        throw new Error('No image URL returned');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || (language === 'zh' ? '生成失败，请重试' : 'Generation failed, please try again'));
      toastManager.error(err.message || (language === 'zh' ? '生成失败' : 'Generation failed'));
    } finally {
      setIsGenerating(false);
    }
  };

  // 下载图标
  const handleDownload = () => {
    if (result) {
      downloadImage(result, `icon-${Date.now()}.png`);
      toastManager.success(language === 'zh' ? '图标已下载' : 'Icon downloaded');
    }
  };

  // 使用示例提示词
  const useExample = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4">
            <Shapes className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-3">
            {language === 'zh' ? 'AI图标生成器' : 'AI Icon Generator'}
          </h1>
          <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            {language === 'zh' 
              ? 'AI生成各种风格图标，扁平、渐变、3D等，一键导出' 
              : 'Generate icons in various styles: flat, gradient, 3D, export instantly'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：参数设置 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 提示词输入 */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                {language === 'zh' ? '图标描述' : 'Icon Description'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={language === 'zh' ? '例如：一个购物车图标' : 'e.g., A shopping cart icon'}
                className="w-full px-4 py-3 border border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 resize-none"
                rows={3}
              />
              
              {/* 示例提示词 */}
              <div className="mt-4">
                <p className="text-xs text-dark-500 dark:text-dark-500 mb-2">
                  {language === 'zh' ? '快速示例：' : 'Quick Examples:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => useExample(language === 'zh' ? example.zh : example.en)}
                      className="px-3 py-1.5 text-xs bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {language === 'zh' ? example.zh : example.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 风格选择 */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                {language === 'zh' ? '图标风格' : 'Icon Style'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {iconStyles.map(style => {
                  const Icon = style.icon;
                  const isSelected = iconStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setIconStyle(style.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500/50'
                          : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: isSelected ? style.color : undefined }} />
                      <p className="text-xs font-medium text-dark-700 dark:text-dark-300">
                        {language === 'zh' ? style.labelZh : style.labelEn}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 尺寸和配色 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                  {language === 'zh' ? '图标尺寸' : 'Icon Size'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['16', '24', '32', '48', '64', '128'] as IconSize[]).map(size => (
                    <button
                      key={size}
                      onClick={() => setIconSize(size)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        iconSize === size
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                  {language === 'zh' ? '配色方案' : 'Color Scheme'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorSchemes.map(scheme => (
                    <button
                      key={scheme.id}
                      onClick={() => setColorScheme(scheme.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        colorScheme === scheme.id
                          ? 'border-primary-500 ring-2 ring-primary-500/50'
                          : 'border-dark-200 dark:border-dark-700'
                      }`}
                      title={language === 'zh' ? scheme.labelZh : scheme.labelEn}
                    >
                      <div className="flex gap-1 justify-center">
                        {scheme.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="text-xs mt-1 text-dark-600 dark:text-dark-400">
                        {language === 'zh' ? scheme.labelZh : scheme.labelEn}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 生成按钮 */}
            <button
              onClick={generateIcon}
              disabled={isGenerating || !prompt.trim()}
              className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                  {language === 'zh' ? '生成中...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2 inline" />
                  {language === 'zh' ? '生成图标（消耗2张）' : 'Generate Icon (2 quota)'}
                </>
              )}
            </button>
          </div>

          {/* 右侧：结果展示 */}
          <div className="space-y-6">
            {/* 生成结果 */}
            {result && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50">
                    {language === 'zh' ? '生成结果' : 'Generated Icon'}
                  </h3>
                  <button
                    onClick={handleDownload}
                    className="btn-outline px-4 py-2 text-sm"
                  >
                    <Download className="w-4 h-4 mr-2 inline" />
                    {language === 'zh' ? '下载' : 'Download'}
                  </button>
                </div>
                <div className="bg-dark-50 dark:bg-dark-900 rounded-lg p-6 flex items-center justify-center">
                  <img
                    src={result}
                    alt="Generated icon"
                    className="max-w-full h-auto rounded"
                  />
                </div>
              </div>
            )}

            {/* 生成历史 */}
            {history.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-4">
                  {language === 'zh' ? '生成历史' : 'Generation History'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {history.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative group cursor-pointer"
                      onClick={() => setResult(item.imageUrl)}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        className="w-full h-auto rounded-lg border-2 border-dark-200 dark:border-dark-700 group-hover:border-primary-500 transition-colors"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 使用提示 */}
            <div className="card p-6 bg-primary-50 dark:bg-primary-900/20">
              <h4 className="font-semibold text-dark-900 dark:text-dark-50 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {language === 'zh' ? '使用技巧' : 'Tips'}
              </h4>
              <ul className="space-y-2 text-sm text-dark-600 dark:text-dark-400">
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{language === 'zh' ? '描述越具体，生成效果越好' : 'More specific descriptions yield better results'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{language === 'zh' ? '不同风格适合不同场景' : 'Different styles suit different scenarios'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{language === 'zh' ? '可多次生成选择最佳效果' : 'Generate multiple times to choose the best'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </div>
  );
}

