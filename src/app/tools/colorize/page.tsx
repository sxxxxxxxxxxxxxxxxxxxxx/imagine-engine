'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProviderManager } from '@/lib/apiProviders';
import { Upload, Image as ImageIcon, Download, Loader2, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabase';
import { downloadImage } from '@/lib/downloadUtils';

export default function ColorizePage() {
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

  const handleColorize = async () => {
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
          tool: 'colorize',
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
      setError(err.message || (language === 'zh' ? '上色失败，请重试' : 'Colorization failed, please try again'));
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
            <ImageIcon className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? 'AI黑白照片上色' : 'AI Photo Colorization'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {language === 'zh'
              ? '为黑白照片添加真实自然的色彩'
              : 'Add realistic, natural colors to black & white photos'}
          </p>

          {/* 配额提示 */}
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-800 dark:text-primary-300">
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
                {language === 'zh' ? '上传黑白照片' : 'Upload B&W Photo'}
              </h3>

              <div className="card p-6">
                {!originalImage ? (
                  <label className="block">
                    <div className="border-4 border-dashed border-dark-300 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-600 rounded-xl p-16 text-center transition-all cursor-pointer">
                      <Upload className="w-20 h-20 mx-auto mb-6 text-dark-400 dark:text-dark-500" />
                      <p className="text-dark-700 dark:text-dark-300 font-semibold mb-2 text-lg">
                        {language === 'zh' ? '点击或拖拽上传黑白照片' : 'Click or drag to upload B&W photo'}
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
                onClick={handleColorize}
                disabled={isProcessing}
                className="w-full btn-primary py-4 text-base font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === 'zh' ? '上色中...' : 'Colorizing...'}
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    {language === 'zh' ? '开始上色（2张配额）' : 'Colorize Photo (2 quota)'}
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* 功能说明 */}
            <div className="card p-6 bg-primary-50 dark:bg-primary-950/30">
              <h4 className="font-semibold text-dark-900 dark:text-dark-50 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-primary-500" />
                {language === 'zh' ? '上色特点' : 'Colorization Features'}
              </h4>
              <ul className="space-y-2 text-sm text-dark-700 dark:text-dark-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? 'AI智能识别物体和场景' : 'AI-powered object and scene recognition'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '真实自然的色彩还原' : 'Realistic and natural color restoration'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '保持原图细节和结构' : 'Preserve original details and structure'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '历史照片专业上色' : 'Professional historical photo colorization'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 结果展示 */}
          <div>
            <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              {language === 'zh' ? '上色结果' : 'Colorized Result'}
            </h3>
            
            {resultImage ? (
              <div className="space-y-4">
                <div className="relative">
                  <img src={resultImage} alt="Colorized" className="w-full rounded-lg border-2 border-primary-500" />
                </div>
                <button
                  onClick={async () => {
                    setIsDownloading(true);
                    setError(null);
                    try {
                      await downloadImage(resultImage, `colorized-${Date.now()}.png`);
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
                      {language === 'zh' ? '下载上色图' : 'Download Colorized'}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-20 bg-dark-50 dark:bg-dark-800 rounded-xl border-2 border-dashed border-dark-300 dark:border-dark-700">
                <ImageIcon className="w-20 h-20 mx-auto mb-4 text-dark-400 dark:text-dark-500" />
                <p className="text-dark-500 dark:text-dark-400 font-medium">{language === 'zh' ? '上色后的图片将在这里显示' : 'Colorized image will appear here'}</p>
              </div>
            )}

            {/* 适用场景 */}
            <div className="card p-6 bg-dark-50 dark:bg-dark-800 mt-6">
              <h4 className="font-semibold text-dark-900 dark:text-dark-50 mb-3">
                {language === 'zh' ? '✨ 适用场景' : '✨ Use Cases'}
              </h4>
              <ul className="space-y-2 text-sm text-dark-700 dark:text-dark-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '修复和上色老照片' : 'Restore and colorize old photos'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '为历史照片添加色彩' : 'Add colors to historical photos'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '黑白艺术照上色' : 'Colorize B&W artistic photos'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '修复褪色照片' : 'Restore faded photos'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 底部引导CTA */}
        {!isLoggedIn && (
          <div className="card p-8 bg-primary-500 text-white text-center mt-12">
            <h3 className="text-2xl font-bold mb-3">
              {language === 'zh' ? '免费体验照片上色' : 'Try Photo Colorization Free'}
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              {language === 'zh' 
                ? '注册即送20张免费额度！升级Basic版本，200张配额每月，包含照片上色、去背景等8+工具！'
                : 'Sign up for 20 free images! Upgrade to Basic: 200 quota/month, includes colorization, remove bg & 8+ tools!'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {language === 'zh' ? '免费注册（送20张）' : 'Sign Up Free (Get 20)'}
              </button>
              <Link href="/pricing" className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors">
                {language === 'zh' ? '查看定价' : 'View Pricing'}
              </Link>
            </div>
          </div>
        )}

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