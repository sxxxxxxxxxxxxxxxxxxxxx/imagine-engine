'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProviderManager } from '@/lib/apiProviders';
import { Upload, Sparkles, Download, Loader2, Check, Zap } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabase';
import { downloadImage } from '@/lib/downloadUtils';

export default function EnhancePage() {
  const { isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConfig, setApiConfig] = useState<{ apiKey: string; baseUrl: string; model: string } | null>(null);

  // 从ProviderManager获取API配置
  useEffect(() => {
    const loadConfig = () => {
      const modelId = localStorage.getItem('imagine-engine-model') || 'gemini-2.5-flash-image';
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
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setResultImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleEnhance = async () => {
    if (!originalImage) return;

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!apiConfig || !apiConfig.apiKey) {
      setError(language === 'zh' ? '请先在设置中配置API密钥' : 'Please configure API key in settings');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          tool: 'enhance',
          image: originalImage,
          apiKey: apiConfig.apiKey,
          baseUrl: apiConfig.baseUrl,
          model: apiConfig.model
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || data.error);
      }

      setResultImage(data.imageUrl);
    } catch (err: any) {
      setError(err.message || (language === 'zh' ? '画质增强失败，请重试' : 'Enhancement failed, please try again'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-6xl mx-auto">
        
        {/* Hero区 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-2xl mb-6">
            <Sparkles className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? 'AI画质增强' : 'AI Quality Enhancement'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {language === 'zh'
              ? '智能优化画质、色彩和清晰度'
              : 'Intelligently enhance quality, colors and sharpness'}
          </p>

          {/* 配额提示 */}
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/30 border-2 border-primary-400">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">
              {language === 'zh' ? '消耗2张配额' : '2 quota per use'}
              {!isLoggedIn && (language === 'zh' ? ' · 注册送20张免费配额' : ' · Sign up for 20 free')}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 上传区 */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-dark-900 dark:text-dark-50 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold">1</span>
                {language === 'zh' ? '上传图片' : 'Upload Image'}
              </h3>

              <div className="card p-6">
                {!originalImage ? (
                  <label className="block">
                    <div className="border-4 border-dashed border-dark-300 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-600 rounded-xl p-16 text-center transition-all cursor-pointer">
                      <Upload className="w-20 h-20 mx-auto mb-6 text-dark-400 dark:text-dark-500" />
                      <p className="text-dark-700 dark:text-dark-300 font-semibold mb-2 text-lg">
                        {language === 'zh' ? '点击或拖拽上传图片' : 'Click or drag to upload'}
                      </p>
                      <p className="text-sm text-dark-500 dark:text-dark-400">
                        {language === 'zh' ? '支持 JPG、PNG 格式' : 'JPG, PNG supported'}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <img src={originalImage} alt="Original" className="w-full rounded-lg" />
                    <button
                      onClick={() => {
                        setOriginalImage(null);
                        setResultImage(null);
                      }}
                      className="w-full py-2 btn-outline text-sm"
                    >
                      {language === 'zh' ? '重新选择' : 'Choose Another'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 处理按钮 */}
            {originalImage && !resultImage && (
              <button
                onClick={handleEnhance}
                disabled={isProcessing}
                className="w-full btn-primary py-4 text-base font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === 'zh' ? '增强中...' : 'Enhancing...'}
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    {language === 'zh' ? '开始增强（2张配额）' : 'Enhance Quality (2 quota)'}
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

          </div>

          {/* 结果展示 */}
          <div>
            <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              {language === 'zh' ? '增强结果' : 'Enhanced Result'}
            </h3>
            
            {resultImage ? (
              <div className="space-y-4">
                <div className="relative">
                  <img src={resultImage} alt="Enhanced" className="w-full rounded-lg border-2 border-primary-500" />
                </div>
                <button
                  onClick={async () => {
                    setIsDownloading(true);
                    setError(null);
                    try {
                      await downloadImage(resultImage, `enhanced-${Date.now()}.png`);
                    } catch (error) {
                      setError(language === 'zh' ? '下载失败，请重试' : 'Download failed, please try again');
                    } finally {
                      setIsDownloading(false);
                    }
                  }}
                  disabled={isDownloading}
                  className="w-full py-3 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {language === 'zh' ? '下载中...' : 'Downloading...'}
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      {language === 'zh' ? '下载增强图' : 'Download Enhanced'}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-20 bg-dark-50 dark:bg-dark-800 rounded-xl border-2 border-dashed border-dark-300 dark:border-dark-700">
                <Sparkles className="w-20 h-20 mx-auto mb-4 text-dark-400 dark:text-dark-500" />
                <p className="text-dark-500 dark:text-dark-400 font-medium">{language === 'zh' ? '增强后的图片将在这里显示' : 'Enhanced image will appear here'}</p>
              </div>
            )}
          </div>
        </div>

        {/* 功能说明 */}
        <div className="card p-6 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 border-2 border-primary-300 dark:border-primary-700">
          <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-3 flex items-center gap-2">
            <Check className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            {language === 'zh' ? '功能特点' : 'Features'}
          </h4>
          <ul className="space-y-2 text-sm text-primary-800 dark:text-primary-200">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>{language === 'zh' ? '提升图片清晰度和锐度' : 'Improve sharpness and clarity'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>{language === 'zh' ? '优化色彩饱和度和对比度' : 'Optimize color saturation and contrast'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>{language === 'zh' ? '减少噪点和压缩伪影' : 'Reduce noise and compression artifacts'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>{language === 'zh' ? '增强阴影和高光细节' : 'Enhance shadow and highlight details'}</span>
            </li>
          </ul>
        </div>


      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </div>
  );
}

