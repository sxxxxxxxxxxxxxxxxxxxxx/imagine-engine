'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProviderManager } from '@/lib/apiProviders';
import { Upload, Camera, Check, Sparkles, Loader2, Download } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabase';
import { downloadImage } from '@/lib/downloadUtils';
import { recordToolUsage } from '@/lib/recentTools';
import { toastManager } from '@/components/Toast';

export default function IDPhotoPage() {
  const { isLoggedIn } = useAuth();
  const { language } = useLanguage();
  
  // 记录工具使用
  useEffect(() => {
    recordToolUsage('id-photo', language === 'zh' ? '证件照生成' : 'ID Photo Generator', '/tools/id-photo');
  }, [language]);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('white');
  const [isGenerating, setIsGenerating] = useState(false);
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
      setImage(e.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!image) return;

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!apiConfig || !apiConfig.apiKey) {
      setError(language === 'zh' ? '请先在设置中配置API密钥' : 'Please configure API key in settings');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 获取用户session
      const { data: { session } } = await supabase.auth.getSession();

      // 调用编辑API生成证件照（传递统一的配置）
      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : ''
        },
        body: JSON.stringify({
          tool: 'id_photo',
          image,
          bgColor,
          apiKey: apiConfig.apiKey,
          baseUrl: apiConfig.baseUrl,
          model: apiConfig.model
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || data.error);
      }

      setResult(data.imageUrl);
    } catch (err: any) {
      setError(err.message || '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-4xl mx-auto">

        {/* Hero区 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-2xl mb-6">
            <Camera className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? 'AI证件照生成器' : 'AI ID Photo Generator'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {language === 'zh'
              ? '5秒生成标准证件照，无需摄影棚'
              : 'Generate standard ID photos in 5 seconds, no studio needed'}
          </p>

          {/* 使用场景标签 */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['简历照', '签证照', '考试报名', '工作证件', '身份证照'].map((tag) => (
              <span key={tag} className="px-5 py-2.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-medium border-2 border-transparent hover:border-primary-300 transition-all">
                #{tag}
              </span>
            ))}
          </div>

          {/* 配额消耗提示 */}
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg shadow-primary-500/30 border-2 border-primary-400">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">
              {language === 'zh' ? '每次消耗1张配额｜Free 每月20张｜Basic 每月200张' : 'Uses 1 quota｜Free 20/month｜Basic 200/month'}
            </span>
          </div>
        </div>

        {/* 主要功能区 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* 上传区 */}
          <div className="space-y-6">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                  {language === 'zh' ? '上传照片' : 'Upload Photo'}
                </h3>
              </div>

              <label className="block cursor-pointer">
                <div className={`border-4 border-dashed rounded-xl p-8 text-center transition-all ${image
                    ? 'border-primary-500 bg-primary-100 dark:bg-primary-950/50 ring-2 ring-primary-200 dark:ring-primary-800'
                    : 'border-dark-300 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-600 bg-white dark:bg-dark-900'
                  }`}>
                  {image ? (
                    <img src={image} alt="Upload" className="max-w-full max-h-64 mx-auto rounded-lg" />
                  ) : (
                    <>
                      <Upload className="w-16 h-16 mx-auto mb-4 text-dark-400" />
                      <p className="text-dark-700 dark:text-dark-300 font-medium mb-2">
                        {language === 'zh' ? '点击或拖拽上传照片' : 'Click or drag to upload'}
                      </p>
                      <p className="text-sm text-dark-500">
                        {language === 'zh' ? '支持JPG、PNG格式' : 'Support JPG, PNG'}
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* 参数选择 */}
            {image && (
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                    {language === 'zh' ? '选择背景色' : 'Choose Background'}
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'white', label: '白色', color: 'bg-white border-2 border-dark-300' },
                    { value: 'blue', label: '蓝色', color: 'bg-blue-500' },
                    { value: 'red', label: '红色', color: 'bg-red-500' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setBgColor(option.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        bgColor === option.value
                          ? 'border-primary-500 ring-2 ring-primary-500/50 shadow-lg shadow-primary-500/30'
                          : 'border-dark-200 dark:border-dark-700 hover:border-primary-300'
                      }`}
                    >
                      <div className={`w-full h-12 rounded ${option.color} mb-2 ${
                        bgColor === option.value ? 'ring-2 ring-primary-500' : ''
                      }`}></div>
                      <p className={`text-sm font-medium ${
                        bgColor === option.value
                          ? 'text-primary-700 dark:text-primary-400 font-semibold'
                          : 'text-dark-700 dark:text-dark-300'
                      }`}>{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 生成按钮 */}
            {image && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full btn-primary py-4 text-base font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === 'zh' ? '生成中...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    {language === 'zh' ? '生成证件照（消耗1张配额）' : 'Generate ID Photo (1 quota)'}
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="card p-4 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>

          {/* 结果展示区 */}
          <div className="space-y-6">
            <div className="card p-8">
              <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
                {language === 'zh' ? '生成结果' : 'Result'}
              </h3>

              {result ? (
                <div className="space-y-4">
                  <img src={result} alt="Result" className="w-full rounded-lg border-2 border-primary-500" />
                  <button
                    onClick={async () => {
                      setIsDownloading(true);
                      setError(null);
                      try {
                        await downloadImage(result, `id-photo-${bgColor}-${Date.now()}.png`);
                      } catch (error) {
                        setError(language === 'zh' ? '下载失败，请重试' : 'Download failed, please try again');
                      } finally {
                        setIsDownloading(false);
                      }
                    }}
                    disabled={isDownloading}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {language === 'zh' ? '下载中...' : 'Downloading...'}
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        {language === 'zh' ? '下载证件照' : 'Download Photo'}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-20 bg-dark-50 dark:bg-dark-800 rounded-xl border-2 border-dashed border-dark-300 dark:border-dark-700">
                  <Camera className="w-20 h-20 mx-auto mb-4 text-dark-400 dark:text-dark-500" />
                  <p className="text-dark-500 dark:text-dark-400 font-medium">{language === 'zh' ? '上传照片后，这里将显示生成的证件照' : 'Result will appear here after upload'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="card p-6 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 border-2 border-primary-300 dark:border-primary-700">
          <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-3">
            {language === 'zh' ? '✨ 功能特点' : '✨ Features'}
          </h4>
          <ul className="space-y-2 text-sm text-primary-800 dark:text-primary-200">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>{language === 'zh' ? '自动检测人脸并居中裁剪' : 'Auto face detection & centering'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>{language === 'zh' ? '智能优化光线和肤色' : 'Smart light & skin optimization'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>{language === 'zh' ? '一键更换背景色' : 'One-click background change'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 dark:text-primary-400">✓</span>
              <span>{language === 'zh' ? '符合标准尺寸（1寸/2寸）' : 'Standard sizes supported'}</span>
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

