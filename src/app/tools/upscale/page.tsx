'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProviderManager } from '@/lib/apiProviders';
import { Upload, Maximize2, Download, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabase';
import { downloadImage } from '@/lib/downloadUtils';

export default function UpscalePage() {
  const { isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [scale, setScale] = useState(2); // 默认2倍放大
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConfig, setApiConfig] = useState<{ apiKey: string; baseUrl: string; model: string } | null>(null);

  // 从ProviderManager获取API配置（与生成图片页面一致）
  useEffect(() => {
    const loadConfig = () => {
      const modelId = localStorage.getItem('imagine-engine-model') || 'gemini-2.5-flash-image';
      const providerConfig = ProviderManager.getProviderByModelId(modelId);
      
      if (providerConfig) {
        const apiKey = ProviderManager.getApiKey(providerConfig.provider.id) || '';
        const baseUrl = providerConfig.provider.baseUrl;
        setApiConfig({ apiKey, baseUrl, model: modelId });
      } else {
        // 回退到localStorage（兼容旧配置）
        const apiKey = localStorage.getItem('imagine-engine-api-key') || '';
        const baseUrl = localStorage.getItem('imagine-engine-base-url') || 'https://newapi.aicohere.org/v1/chat/completions';
        setApiConfig({ apiKey, baseUrl, model: modelId });
      }
    };
    
    loadConfig();
    // 监听配置变化
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

  const handleUpscale = async () => {
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
          tool: 'upscale',
          image: originalImage,
          scale,
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
      setError(err.message || '放大失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-5xl mx-auto">
        
        {/* Hero区 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-2xl mb-6">
            <Maximize2 className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? 'AI图片放大工具' : 'AI Image Upscaler'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {language === 'zh' 
              ? '无损放大4倍，保持画质清晰' 
              : 'Upscale 4x without quality loss'}
          </p>
          
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/30 border-2 border-primary-400">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">
              {language === 'zh' ? '消耗2张配额' : '2 quota per use'} · 
              {language === 'zh' ? '免费用户可用' : 'Available for free users'}
            </span>
          </div>
        </div>

        {/* 主要功能区 */}
        <div className="card p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* 上传和参数 */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
                  {language === 'zh' ? '上传图片' : 'Upload Image'}
                </h3>
                
                {!originalImage ? (
                  <label className="block cursor-pointer">
                    <div className="border-4 border-dashed border-dark-300 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-600 rounded-xl p-12 text-center transition-all">
                      <Upload className="w-16 h-16 mx-auto mb-4 text-dark-400" />
                      <p className="text-dark-700 dark:text-dark-300 font-medium mb-2">
                        {language === 'zh' ? '点击上传' : 'Click to upload'}
                      </p>
                      <p className="text-sm text-dark-500">JPG, PNG, max 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div>
                    <img src={originalImage} alt="Original" className="w-full rounded-lg border-2 border-dark-200 dark:border-dark-700" />
                    <button
                      onClick={() => {
                        setOriginalImage(null);
                        setResultImage(null);
                      }}
                      className="w-full mt-4 py-2 btn-outline text-sm"
                    >
                      {language === 'zh' ? '重新上传' : 'Upload New'}
                    </button>
                  </div>
                )}
              </div>

              {/* 放大倍数选择 */}
              {originalImage && (
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
                    {language === 'zh' ? '放大倍数' : 'Scale Factor'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[2, 3, 4].map((factor) => (
                      <button
                        key={factor}
                        onClick={() => setScale(factor)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                                          scale === factor
                                            ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                            : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 bg-white dark:bg-dark-900'
                                        }`}
                      >
                        <p className={`text-2xl font-bold ${
                          scale === factor ? 'text-white' : 'text-dark-900 dark:text-dark-50'
                        }`}>{factor}x</p>
                        <p className={`text-xs mt-1 ${
                          scale === factor ? 'text-white/90' : 'text-dark-500 dark:text-dark-400'
                        }`}>
                          {language === 'zh' ? '放大' : 'Upscale'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 处理按钮 */}
              {originalImage && !resultImage && (
                <button
                  onClick={handleUpscale}
                  disabled={isProcessing}
                  className="w-full btn-primary py-4 text-base font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {language === 'zh' ? '处理中...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      {language === 'zh' ? `放大${scale}倍（2张配额）` : `Upscale ${scale}x (2 quota)`}
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
                {language === 'zh' ? '放大结果' : 'Result'}
              </h3>
              
              {resultImage ? (
                <div className="space-y-4">
                  <img src={resultImage} alt="Upscaled" className="w-full rounded-lg border-2 border-primary-500" />
                  <button
                    onClick={async () => {
                      setIsDownloading(true);
                      setError(null);
                      try {
                        await downloadImage(resultImage, `upscaled-${scale}x-${Date.now()}.png`);
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
                        {language === 'zh' ? '下载高清图' : 'Download HD'}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-20 bg-dark-50 dark:bg-dark-800 rounded-xl border-2 border-dashed border-dark-300 dark:border-dark-700">
                  <Maximize2 className="w-20 h-20 mx-auto mb-4 text-dark-400 dark:text-dark-500" />
                  <p className="text-dark-500 dark:text-dark-400 font-medium">{language === 'zh' ? '放大后的图片将在这里显示' : 'Upscaled image will appear here'}</p>
                </div>
              )}
            </div>
          </div>
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

