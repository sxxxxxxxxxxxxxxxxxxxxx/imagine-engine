'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProviderManager } from '@/lib/apiProviders';
import { Upload, Scissors, Download, Loader2, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabase';
import { downloadImage } from '@/lib/downloadUtils';

export default function RemoveBgPage() {
  const { isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
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

  const handleRemoveBackground = async () => {
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
          tool: 'remove_bg',
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
      setError(err.message || '处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;
    setIsDownloading(true);
    setError(null);
    try {
      await downloadImage(resultImage, 'no-background.png');
    } catch (error) {
      setError(language === 'zh' ? '下载失败，请重试' : 'Download failed, please try again');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-6xl mx-auto">

        {/* Hero区 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-2xl mb-6">
            <Scissors className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? '智能去背景工具' : 'Smart Background Remover'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {language === 'zh'
              ? '1秒抠图，效果堪比PS专业设计师'
              : '1-second cutout, professional PS-level results'}
          </p>

          {/* 适用场景 */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: '🛍️', text: language === 'zh' ? '电商产品图' : 'E-commerce' },
              { icon: '👤', text: language === 'zh' ? '个人照片' : 'Portrait' },
              { icon: '🎨', text: language === 'zh' ? '设计素材' : 'Design Assets' },
              { icon: '📸', text: language === 'zh' ? '证件照' : 'ID Photos' }
            ].map((item) => (
              <span key={item.text} className="px-5 py-2.5 bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 rounded-lg text-sm font-medium border-2 border-transparent hover:border-primary-300 transition-all">
                {item.icon} {item.text}
              </span>
            ))}
          </div>

          {/* 配额提示 */}
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/30 border-2 border-primary-400">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">
              {language === 'zh' ? '消耗1张配额' : '1 quota per use'}
              {!isLoggedIn && (language === 'zh' ? ' · 注册送20张免费配额' : ' · Sign up for 20 free')}
            </span>
          </div>
        </div>

        {/* 主要功能区 - 左右对比布局 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* 原图上传区 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? '原始图片' : 'Original'}
              </h3>
            </div>

            <div className="card p-6">
              {!originalImage ? (
                <label className="block cursor-pointer">
                  <div className="border-4 border-dashed border-dark-300 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-600 rounded-xl p-16 text-center transition-all">
                    <Upload className="w-20 h-20 mx-auto mb-6 text-dark-400 dark:text-dark-500" />
                    <p className="text-dark-700 dark:text-dark-300 font-semibold mb-2 text-lg">
                      {language === 'zh' ? '点击或拖拽上传图片' : 'Click or drag to upload'}
                    </p>
                    <p className="text-sm text-dark-500 dark:text-dark-400">
                      {language === 'zh' ? '支持JPG、PNG格式，最大10MB' : 'JPG, PNG, max 10MB'}
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
                <div>
                  <img src={originalImage} alt="Original" className="w-full rounded-lg" />
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

            {/* 处理按钮 */}
            {originalImage && !resultImage && (
              <button
                onClick={handleRemoveBackground}
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
                    <Scissors className="w-5 h-5" />
                    {language === 'zh' ? '开始去背景（1张配额）' : 'Remove Background (1 quota)'}
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="card p-4 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-red-600 dark:text-red-400">⚠️</div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300 flex-1">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* 结果展示区 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? '去背景后' : 'Result'}
              </h3>
            </div>

            <div className="card p-6 bg-checkerboard">
              {resultImage ? (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-dark-800 rounded-lg p-4">
                    <img src={resultImage} alt="Result" className="w-full rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="py-3 btn-primary disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {language === 'zh' ? '下载中...' : 'Downloading...'}
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          {language === 'zh' ? '下载PNG' : 'Download PNG'}
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setOriginalImage(null);
                        setResultImage(null);
                      }}
                      className="py-3 btn-outline"
                    >
                      {language === 'zh' ? '再处理一张' : 'Process Another'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-dark-50 dark:bg-dark-800 rounded-xl border-2 border-dashed border-dark-300 dark:border-dark-700">
                  <Scissors className="w-20 h-20 mx-auto mb-4 text-dark-400 dark:text-dark-500" />
                  <p className="text-dark-500 dark:text-dark-400 font-medium">{language === 'zh' ? '处理后的结果将在这里显示' : 'Result will appear here'}</p>
                </div>
              )}
            </div>
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
              <span>{language === 'zh' ? 'AI精准识别主体' : 'AI-powered subject detection'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>{language === 'zh' ? '发丝级细节保留' : 'Hair-level detail preservation'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>{language === 'zh' ? '支持复杂背景' : 'Complex background support'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>{language === 'zh' ? '一键下载PNG透明图' : 'One-click PNG download'}</span>
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

      {/* 棋盘格背景CSS */}
      <style jsx>{`
        .bg-checkerboard {
          background-image: 
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .dark .bg-checkerboard {
          background-image: 
            linear-gradient(45deg, #333 25%, transparent 25%),
            linear-gradient(-45deg, #333 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #333 75%),
            linear-gradient(-45deg, transparent 75%, #333 75%);
        }
      `}</style>
    </div>
  );
}

