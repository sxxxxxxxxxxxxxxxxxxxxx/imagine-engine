'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Scissors, Download, Loader2, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabase';

export default function RemoveBgPage() {
  const { isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          image: originalImage
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

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-6xl mx-auto">

        {/* Hero区 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4">
            <Scissors className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? '智能去背景工具' : 'Smart Background Remover'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 mb-6">
            {language === 'zh'
              ? '1秒抠图，效果堪比PS专业设计师'
              : '1-second cutout, professional PS-level results'}
          </p>

          {/* 适用场景 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { icon: '🛍️', text: language === 'zh' ? '电商产品图' : 'E-commerce' },
              { icon: '👤', text: language === 'zh' ? '个人照片' : 'Portrait' },
              { icon: '🎨', text: language === 'zh' ? '设计素材' : 'Design Assets' },
              { icon: '📸', text: language === 'zh' ? '证件照' : 'ID Photos' }
            ].map((item) => (
              <span key={item.text} className="px-4 py-2 bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 rounded-full text-sm font-medium">
                {item.icon} {item.text}
              </span>
            ))}
          </div>

          {/* 配额提示 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="text-sm text-primary-800 dark:text-primary-300">
              {language === 'zh' ? '消耗1张配额' : '1 quota per use'}
              {!isLoggedIn && (language === 'zh' ? ' · 注册送20张免费配额' : ' · Sign up for 20 free')}
            </span>
          </div>
        </div>

        {/* 主要功能区 - 左右对比布局 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* 原图上传区 */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold">1</span>
              {language === 'zh' ? '原始图片' : 'Original'}
            </h3>

            <div className="card p-6">
              {!originalImage ? (
                <label className="block cursor-pointer">
                  <div className="border-4 border-dashed border-dark-300 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-600 rounded-xl p-12 text-center transition-all">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-dark-400" />
                    <p className="text-dark-700 dark:text-dark-300 font-medium mb-2">
                      {language === 'zh' ? '点击或拖拽上传图片' : 'Click or drag to upload'}
                    </p>
                    <p className="text-sm text-dark-500">
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
                className="w-full btn-primary py-4 text-lg font-bold shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {language === 'zh' ? '处理中...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <Scissors className="w-6 h-6" />
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
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-dark-900 dark:text-dark-50 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-sm font-bold">2</span>
              {language === 'zh' ? '去背景后' : 'Result'}
            </h3>

            <div className="card p-6 bg-checkerboard">
              {resultImage ? (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-dark-800 rounded-lg p-4">
                    <img src={resultImage} alt="Result" className="w-full rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => downloadImage(resultImage, 'no-background.png')}
                      className="py-3 btn-primary"
                    >
                      <Download className="w-5 h-5" />
                      {language === 'zh' ? '下载PNG' : 'Download PNG'}
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
                <div className="text-center py-20 text-dark-500">
                  <Scissors className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>{language === 'zh' ? '处理后的结果将在这里显示' : 'Result will appear here'}</p>
                </div>
              )}
            </div>

            {/* 特点说明 */}
            <div className="card p-6 bg-primary-50 dark:bg-primary-950/30">
              <h4 className="font-semibold text-dark-900 dark:text-dark-50 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-primary-500" />
                {language === 'zh' ? '功能特点' : 'Features'}
              </h4>
              <ul className="space-y-2 text-sm text-dark-700 dark:text-dark-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? 'AI精准识别主体' : 'AI-powered subject detection'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '发丝级细节保留' : 'Hair-level detail preservation'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '支持复杂背景' : 'Complex background support'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500">✓</span>
                  <span>{language === 'zh' ? '一键下载PNG透明图' : 'One-click PNG download'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 底部引导CTA */}
        {resultImage && (
          <div className="card p-8 bg-gradient-to-r from-primary-500 to-primary-700 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">
              {language === 'zh' ? '🎉 处理成功！需要批量处理？' : '🎉 Success! Need batch processing?'}
            </h3>
            <p className="mb-6 text-white/90">
              {language === 'zh'
                ? 'Basic版本200张配额随便用，包含全部8+工具，每月仅需￥29！'
                : 'Basic plan: 200 quota with 8+ tools, only ￥29/month!'}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/pricing"
                className="px-8 py-3 bg-white text-primary-600 rounded-lg font-bold hover:bg-dark-50 transition-all shadow-lg"
              >
                {language === 'zh' ? '升级Basic版（节省93%）' : 'Upgrade to Basic (Save 93%)'}
              </Link>
              <Link
                href="/tools"
                className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold transition-all border-2 border-white"
              >
                {language === 'zh' ? '探索更多工具' : 'Explore More Tools'}
              </Link>
            </div>
          </div>
        )}

        {!isLoggedIn && !resultImage && originalImage && (
          <div className="card p-8 bg-dark-50 dark:bg-dark-800 border-2 border-dashed border-primary-300 dark:border-primary-700 text-center">
            <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-3">
              {language === 'zh' ? '🎁 限时福利' : '🎁 Limited Offer'}
            </h3>
            <p className="text-dark-700 dark:text-dark-300 mb-6">
              {language === 'zh'
                ? '注册即送20张免费额度，立即体验去背景功能！'
                : 'Sign up for 20 free images, try background removal now!'}
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 btn-primary font-bold text-lg"
            >
              {language === 'zh' ? '免费注册（送20张）' : 'Sign Up Free (Get 20)'}
            </button>
          </div>
        )}

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

