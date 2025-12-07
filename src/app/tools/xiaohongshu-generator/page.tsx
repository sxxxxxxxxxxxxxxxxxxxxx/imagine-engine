'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProviderManager } from '@/lib/apiProviders';
import { 
  FileText, 
  Loader2, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  Upload,
  Image as ImageIcon,
  Sparkles,
  Edit3,
  Play
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabase';
import { downloadImage } from '@/lib/downloadUtils';
import { toastManager } from '@/components/Toast';
import { recordToolUsage } from '@/lib/recentTools';

type Page = {
  index: number;
  type: 'cover' | 'content' | 'summary';
  content: string;
};

type ImageState = {
  index: number;
  url?: string;
  status: 'waiting' | 'generating' | 'done' | 'error';
  error?: string;
};

export default function XiaohongshuGeneratorPage() {
  const { isLoggedIn, user } = useAuth();
  const { language } = useLanguage();
  const [topic, setTopic] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [outline, setOutline] = useState<string>('');
  const [pages, setPages] = useState<Page[]>([]);
  const [editingPageIndex, setEditingPageIndex] = useState<number | null>(null);
  const [images, setImages] = useState<ImageState[]>([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string>('');
  const [apiConfig, setApiConfig] = useState<{ apiKey: string; baseUrl: string; model: string } | null>(null);
  const [selectedTextModel, setSelectedTextModel] = useState('gemini-2.5-pro'); // 文本生成模型（大纲生成）
  const [selectedImageModel, setSelectedImageModel] = useState('gemini-3-pro-image-preview'); // 图片生成模型
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [quotaInfo, setQuotaInfo] = useState<{ remaining: number; total: number } | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // 获取模型列表（只从pockgo-image provider获取）
  const pockgoProvider = ProviderManager.getProviderById('pockgo-image');
  const imageModels = pockgoProvider?.models.filter(m => m.type === 'image') || [];
  // 文本生成模型：只显示 gemini-2.5-pro 和 gemini-2.5-flash
  const chatModels = pockgoProvider?.models.filter(m => 
    m.type === 'chat' && (m.id === 'gemini-2.5-pro' || m.id === 'gemini-2.5-flash')
  ) || [];

  // 确保默认模型在模型列表中存在
  useEffect(() => {
    if (chatModels.length > 0 && !chatModels.find(m => m.id === selectedTextModel)) {
      setSelectedTextModel(chatModels[0].id);
    }
  }, [chatModels, selectedTextModel]);

  useEffect(() => {
    if (imageModels.length > 0 && !imageModels.find(m => m.id === selectedImageModel)) {
      setSelectedImageModel(imageModels[0].id);
    }
  }, [imageModels, selectedImageModel]);

  // 加载配额信息
  useEffect(() => {
    const loadQuota = async () => {
      if (!isLoggedIn) return;
      
      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) return;

        const response = await fetch('/api/quota/check', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setQuotaInfo({ remaining: data.remaining, total: data.total });
        }
      } catch (error) {
        console.error('加载配额信息失败:', error);
      }
    };

    loadQuota();
    const interval = setInterval(loadQuota, 5000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // 从ProviderManager获取API配置
  useEffect(() => {
    const loadConfig = () => {
      const modelId = selectedImageModel;
      const providerConfig = ProviderManager.getProviderByModelId(modelId);
      
      if (providerConfig) {
        const apiKey = ProviderManager.getApiKey(providerConfig.provider.id) || '';
        const baseUrl = providerConfig.provider.baseUrl;
        setApiConfig({ apiKey, baseUrl, model: modelId });
      } else {
        // 如果找不到模型配置，使用pockgo-image provider的配置
        const pockgoProvider = ProviderManager.getProviderById('pockgo-image');
        if (pockgoProvider) {
          const apiKey = ProviderManager.getApiKey('pockgo-image') || '';
          const baseUrl = pockgoProvider.baseUrl;
          setApiConfig({ apiKey, baseUrl, model: modelId });
        } else {
          const apiKey = localStorage.getItem('imagine-engine-api-key') || '';
          const baseUrl = localStorage.getItem('imagine-engine-base-url') || 'https://newapi.pockgo.com/v1/chat/completions';
          setApiConfig({ apiKey, baseUrl, model: modelId });
        }
      }
    };
    
    loadConfig();
    const interval = setInterval(loadConfig, 1000);
    return () => clearInterval(interval);
  }, [selectedImageModel]);

  // 清理EventSource
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setReferenceImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 移除参考图片
  const removeReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  // 生成大纲
  const generateOutline = async () => {
    if (!topic.trim()) {
      toastManager.warning(language === 'zh' ? '请输入主题内容' : 'Please enter topic');
      return;
    }

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setIsGeneratingOutline(true);
    setError(null);

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        throw new Error('请先登录');
      }

      // 获取API配置（和图片生成使用相同的配置）
      if (!apiConfig?.apiKey) {
        toastManager.error(language === 'zh' ? '请先配置API密钥' : 'Please configure API key first');
        setIsGeneratingOutline(false);
        return;
      }

      const response = await fetch('/api/xiaohongshu/outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: topic.trim(),
          images: referenceImages,
          apiKey: apiConfig.apiKey,
          baseUrl: 'https://newapi.aicohere.org/v1/chat/completions', // 文本生成API地址
          model: selectedTextModel, // 使用用户选择的文本模型
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '大纲生成失败');
      }

      // 更新配额信息
      if (data.quota_remaining !== undefined) {
        setQuotaInfo(prev => prev ? { ...prev, remaining: data.quota_remaining } : null);
      }

      setOutline(data.outline);
      setPages(data.pages);
      setImages(data.pages.map((p: Page) => ({
        index: p.index,
        status: 'waiting' as const,
      })));
      setTaskId(`task_${Date.now()}`);
      
      toastManager.success(language === 'zh' ? '大纲生成成功（已消耗1张配额）' : 'Outline generated successfully (1 quota consumed)');
      recordToolUsage(
        'xiaohongshu-generator',
        language === 'zh' ? '小红书图文生成器' : 'Xiaohongshu Content Generator',
        '/tools/xiaohongshu-generator'
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '大纲生成失败';
      setError(errorMsg);
      toastManager.error(errorMsg);
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // 编辑页面内容
  const updatePageContent = (index: number, content: string) => {
    setPages(prev => prev.map(p => 
      p.index === index ? { ...p, content } : p
    ));
    setEditingPageIndex(null);
  };

  // 批量生成图片
  const generateImages = async () => {
    if (pages.length === 0) {
      toastManager.warning(language === 'zh' ? '请先生成大纲' : 'Please generate outline first');
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

    setIsGeneratingImages(true);
    setError(null);
    setProgress({ current: 0, total: pages.length });

    // 初始化图片状态
    setImages(pages.map(p => ({
      index: p.index,
      status: 'waiting' as const,
    })));

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        throw new Error('请先登录');
      }

      const response = await fetch('/api/xiaohongshu/generate-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pages,
          taskId,
          fullOutline: outline,
          userTopic: topic,
          userImages: referenceImages,
          apiKey: apiConfig.apiKey,
          baseUrl: apiConfig.baseUrl,
          model: selectedImageModel, // 使用用户选择的图片模型
        }),
      });

      if (!response.ok) {
        throw new Error('批量生成请求失败');
      }

      // 使用EventSource处理SSE流
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            const eventType = line.substring(7);
            continue;
          }
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.substring(6));
            
            if (data.index !== undefined) {
              setImages(prev => prev.map(img => 
                img.index === data.index
                  ? { ...img, url: data.imageUrl, status: data.status || 'done' }
                  : img
              ));
              
              if (data.status === 'done') {
                setProgress(prev => ({ ...prev, current: prev.current + 1 }));
                // 更新配额信息（每生成一张图片消耗1张配额）
                setQuotaInfo(prev => prev ? { ...prev, remaining: Math.max(0, prev.remaining - 1) } : null);
              }
            } else if (data.total) {
              setProgress({ current: 0, total: data.total });
            } else if (data.error) {
              setError(data.error);
            }
          }
        }
      }

      toastManager.success(language === 'zh' ? '图片生成完成' : 'Images generated successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '批量生成失败';
      setError(errorMsg);
      toastManager.error(errorMsg);
    } finally {
      setIsGeneratingImages(false);
    }
  };

  // 重新生成单张图片
  const regenerateImage = async (index: number) => {
    const page = pages.find(p => p.index === index);
    if (!page) return;

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!apiConfig?.apiKey) {
      toastManager.error(language === 'zh' ? '请先配置API密钥' : 'Please configure API key first');
      return;
    }

    setImages(prev => prev.map(img => 
      img.index === index ? { ...img, status: 'generating' } : img
    ));

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) {
        throw new Error('请先登录');
      }

      const response = await fetch('/api/xiaohongshu/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          page,
          taskId,
          fullOutline: outline,
          userTopic: topic,
          userImages: referenceImages,
          useReference: true,
          apiKey: apiConfig.apiKey,
          baseUrl: apiConfig.baseUrl,
          model: selectedImageModel, // 使用用户选择的图片模型
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '重新生成失败');
      }

      setImages(prev => prev.map(img => 
        img.index === index 
          ? { ...img, url: data.imageUrl, status: 'done' }
          : img
      ));

      // 更新配额信息（重新生成消耗1张配额）
      if (data.quota_remaining !== undefined) {
        setQuotaInfo(prev => prev ? { ...prev, remaining: data.quota_remaining } : null);
      } else {
        setQuotaInfo(prev => prev ? { ...prev, remaining: Math.max(0, prev.remaining - 1) } : null);
      }

      toastManager.success(language === 'zh' ? '图片重新生成成功（已消耗1张配额）' : 'Image regenerated successfully (1 quota consumed)');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '重新生成失败';
      setImages(prev => prev.map(img => 
        img.index === index 
          ? { ...img, status: 'error', error: errorMsg }
          : img
      ));
      toastManager.error(errorMsg);
    }
  };

  // 下载所有图片
  const downloadAll = async () => {
    const doneImages = images.filter(img => img.status === 'done' && img.url);
    if (doneImages.length === 0) {
      toastManager.warning(language === 'zh' ? '没有可下载的图片' : 'No images to download');
      return;
    }

    for (const img of doneImages) {
      if (img.url) {
        await downloadImage(img.url, `xiaohongshu-page-${img.index + 1}.png`);
        await new Promise(resolve => setTimeout(resolve, 300)); // 避免并发下载过快
      }
    }

    toastManager.success(language === 'zh' ? '所有图片下载完成' : 'All images downloaded');
  };

  const progressPercent = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
  const hasFailedImages = images.some(img => img.status === 'error');
  const allDone = images.length > 0 && images.every(img => img.status === 'done');

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-2xl mb-6">
            <FileText className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? '小红书图文生成器' : 'Xiaohongshu Content Generator'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            {language === 'zh' 
              ? '输入一句话，AI自动生成完整的小红书图文内容' 
              : 'One sentence, complete Xiaohongshu content'}
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="card p-4 mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* 配额信息显示 */}
        {quotaInfo && isLoggedIn && (
          <div className="card p-4 mb-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
                {language === 'zh' ? '剩余配额' : 'Remaining Quota'}
              </span>
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {quotaInfo.remaining} / {quotaInfo.total}
              </span>
            </div>
            <div className="mt-2 w-full bg-dark-200 dark:bg-dark-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${(quotaInfo.remaining / quotaInfo.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* 第一步：输入主题和上传参考图片 */}
        <div className="card p-6 mb-6">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? '1. 输入主题' : '1. Enter Topic'}
          </h2>
          
          {/* 模型选择器 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* 文本生成模型选择（大纲生成） */}
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                {language === 'zh' ? '文本生成模型（大纲生成）' : 'Text Model (Outline Generation)'}
              </label>
              <select
                value={selectedTextModel}
                onChange={(e) => setSelectedTextModel(e.target.value)}
                className="w-full p-3 border-2 border-dark-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 focus:border-primary-500 focus:outline-none"
              >
                {chatModels.length === 0 ? (
                  <option value="">{language === 'zh' ? '加载中...' : 'Loading...'}</option>
                ) : (
                  chatModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {language === 'zh' ? model.nameZh : model.name}
                    </option>
                  ))
                )}
              </select>
              <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                {language === 'zh' ? '消耗1张配额' : 'Consumes 1 quota'}
              </p>
            </div>

            {/* 图片生成模型选择 */}
            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                {language === 'zh' ? '图片生成模型' : 'Image Generation Model'}
              </label>
              <select
                value={selectedImageModel}
                onChange={(e) => setSelectedImageModel(e.target.value)}
                className="w-full p-3 border-2 border-dark-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 focus:border-primary-500 focus:outline-none"
              >
                {imageModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {language === 'zh' ? model.nameZh : model.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                {language === 'zh' ? `每张图片消耗1张配额` : '1 quota per image'}
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={language === 'zh' ? '例如：如何在家做拿铁咖啡' : 'e.g., How to make latte at home'}
              className="w-full p-4 border-2 border-dark-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 focus:border-primary-500 focus:outline-none min-h-[120px]"
            />
          </div>

          {/* 参考图片上传 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              {language === 'zh' ? '参考图片（可选）' : 'Reference Images (Optional)'}
            </label>
            <div className="flex gap-4 flex-wrap">
              {referenceImages.map((img, index) => (
                <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dark-300 dark:border-dark-700">
                  <img src={img} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeReferenceImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="w-32 h-32 border-2 border-dashed border-dark-300 dark:border-dark-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                <Upload className="w-8 h-8 text-dark-400 dark:text-dark-500" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            onClick={generateOutline}
            disabled={isGeneratingOutline || !topic.trim()}
            className="w-full py-3 btn-primary flex items-center justify-center gap-2"
          >
            {isGeneratingOutline ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {language === 'zh' ? '生成中...' : 'Generating...'}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {language === 'zh' ? '生成大纲' : 'Generate Outline'}
              </>
            )}
          </button>
        </div>

        {/* 第二步：编辑大纲 */}
        {pages.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-4">
              {language === 'zh' ? '2. 编辑大纲' : '2. Edit Outline'}
            </h2>
            
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.index} className="border-2 border-dark-200 dark:border-dark-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium rounded-full">
                        {language === 'zh' 
                          ? page.type === 'cover' ? '封面' : page.type === 'summary' ? '总结' : '内容'
                          : page.type}
                      </span>
                      <span className="text-sm text-dark-500 dark:text-dark-400">
                        {language === 'zh' ? `第 ${page.index + 1} 页` : `Page ${page.index + 1}`}
                      </span>
                    </div>
                    {editingPageIndex !== page.index && (
                      <button
                        onClick={() => setEditingPageIndex(page.index)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {editingPageIndex === page.index ? (
                    <div>
                      <textarea
                        value={page.content}
                        onChange={(e) => setPages(prev => prev.map(p => 
                          p.index === page.index ? { ...p, content: e.target.value } : p
                        ))}
                        className="w-full p-3 border-2 border-dark-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-dark-900 dark:text-dark-50 focus:border-primary-500 focus:outline-none min-h-[150px]"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => updatePageContent(page.index, page.content)}
                          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                          {language === 'zh' ? '保存' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingPageIndex(null)}
                          className="px-4 py-2 bg-dark-200 dark:bg-dark-800 text-dark-700 dark:text-dark-300 rounded-lg hover:bg-dark-300 dark:hover:bg-dark-700"
                        >
                          {language === 'zh' ? '取消' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-dark-700 dark:text-dark-300 whitespace-pre-wrap">
                      {page.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={generateImages}
              disabled={isGeneratingImages || !apiConfig?.apiKey}
              className="w-full py-3 btn-primary flex items-center justify-center gap-2 mt-6"
            >
              {isGeneratingImages ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {language === 'zh' ? '生成中...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {language === 'zh' ? `生成所有图片（${pages.length}张）` : `Generate All Images (${pages.length})`}
                </>
              )}
            </button>
          </div>
        )}

        {/* 第三步：生成结果 */}
        {images.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? '3. 生成结果' : '3. Generated Results'}
              </h2>
              {allDone && (
                <button
                  onClick={downloadAll}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {language === 'zh' ? '下载全部' : 'Download All'}
                </button>
              )}
            </div>

            {/* 进度条 */}
            {isGeneratingImages && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-dark-600 dark:text-dark-400">
                    {language === 'zh' ? '生成进度' : 'Progress'}
                  </span>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {progress.current} / {progress.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-dark-200 dark:bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* 图片网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.index} className="relative aspect-[9/16] rounded-lg overflow-hidden border-2 border-dark-200 dark:border-dark-800">
                  {img.status === 'done' && img.url ? (
                    <>
                      <img src={img.url} alt={`Page ${img.index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <button
                          onClick={() => regenerateImage(img.index)}
                          className="px-4 py-2 bg-white text-dark-900 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          {language === 'zh' ? '重新生成' : 'Regenerate'}
                        </button>
                      </div>
                    </>
                  ) : img.status === 'generating' ? (
                    <div className="w-full h-full flex items-center justify-center bg-dark-100 dark:bg-dark-900">
                      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    </div>
                  ) : img.status === 'error' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20">
                      <X className="w-8 h-8 text-red-500 mb-2" />
                      <p className="text-xs text-red-600 dark:text-red-400 text-center px-2">
                        {img.error || (language === 'zh' ? '生成失败' : 'Failed')}
                      </p>
                      <button
                        onClick={() => regenerateImage(img.index)}
                        className="mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        {language === 'zh' ? '重试' : 'Retry'}
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-dark-100 dark:bg-dark-900">
                      <span className="text-dark-400 dark:text-dark-500 text-sm">
                        {language === 'zh' ? '等待中' : 'Waiting'}
                      </span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                    {language === 'zh' ? `第 ${img.index + 1} 页` : `Page ${img.index + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </div>
  );
}

