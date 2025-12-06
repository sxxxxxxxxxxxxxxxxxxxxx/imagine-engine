'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Camera, Check, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';

export default function IDPhotoPage() {
  const { isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('white');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    setIsGenerating(true);
    setError(null);

    try {
      // 调用编辑API生成证件照
      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'id_photo',
          image,
          bgColor
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4">
            <Camera className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? 'AI证件照生成器' : 'AI ID Photo Generator'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 mb-6">
            {language === 'zh'
              ? '5秒生成标准证件照，无需摄影棚'
              : 'Generate standard ID photos in 5 seconds, no studio needed'}
          </p>

          {/* 使用场景标签 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['简历照', '签证照', '考试报名', '工作证件', '身份证照'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          {/* 配额消耗提示 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-800 dark:text-yellow-300">
              {language === 'zh' ? '每次消耗1张配额｜Free 每月20张｜Basic 每月200张' : 'Uses 1 quota｜Free 20/month｜Basic 200/month'}
            </span>
          </div>
        </div>

        {/* 主要功能区 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* 上传区 */}
          <div className="space-y-6">
            <div className="card p-8">
              <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
                {language === 'zh' ? '1. 上传照片' : '1. Upload Photo'}
              </h3>

              <label className="block cursor-pointer">
                <div className={`border-4 border-dashed rounded-xl p-8 text-center transition-all ${image
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                    : 'border-dark-300 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-600'
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
                <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
                  {language === 'zh' ? '2. 选择背景色' : '2. Choose Background'}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'white', label: '白色', color: 'bg-white border-2 border-dark-300' },
                    { value: 'blue', label: '蓝色', color: 'bg-blue-500' },
                    { value: 'red', label: '红色', color: 'bg-red-500' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setBgColor(option.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${bgColor === option.value
                          ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800'
                          : 'border-dark-200 dark:border-dark-700 hover:border-primary-300'
                        }`}
                    >
                      <div className={`w-full h-12 rounded ${option.color} mb-2`}></div>
                      <p className="text-sm font-medium text-dark-700 dark:text-dark-300">{option.label}</p>
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
                className="w-full btn-primary py-4 text-lg font-bold shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {language === 'zh' ? '生成中...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6" />
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
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = result;
                      a.download = 'id-photo.png';
                      a.click();
                    }}
                    className="w-full btn-primary py-3"
                  >
                    {language === 'zh' ? '下载证件照' : 'Download Photo'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-dark-500">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>{language === 'zh' ? '上传照片后，这里将显示生成的证件照' : 'Result will appear here after upload'}</p>
                </div>
              )}
            </div>

            {/* 功能说明 */}
            <div className="card p-6 bg-dark-50 dark:bg-dark-800">
              <h4 className="font-semibold text-dark-900 dark:text-dark-50 mb-3">
                {language === 'zh' ? '✨ 功能特点' : '✨ Features'}
              </h4>
              <ul className="space-y-2 text-sm text-dark-700 dark:text-dark-300">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{language === 'zh' ? '自动检测人脸并居中裁剪' : 'Auto face detection & centering'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{language === 'zh' ? '智能优化光线和肤色' : 'Smart light & skin optimization'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{language === 'zh' ? '一键更换背景色' : 'One-click background change'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{language === 'zh' ? '符合标准尺寸（1寸/2寸）' : 'Standard sizes supported'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 底部引导CTA */}
        {!isLoggedIn && (
          <div className="card p-8 bg-gradient-to-r from-primary-500 to-primary-700 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">
              {language === 'zh' ? '获取更多配额' : 'Get More Quota'}
            </h3>
            <p className="mb-6">
              {language === 'zh'
                ? '注册后享受每月20张免费额度，升级Basic获得200张/月，仅需￥19.9！'
                : 'Sign up to enjoy 20 free images per month, upgrade to Basic for 200/month at only ￥19.9!'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-3 bg-white text-primary-600 rounded-lg font-bold hover:bg-dark-50 transition-all"
              >
                {language === 'zh' ? '免费注册（每月20张）' : 'Sign Up Free (20/month)'}
              </button>
              <Link
                href="/pricing"
                className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold transition-all border-2 border-white"
              >
                {language === 'zh' ? '查看定价' : 'View Pricing'}
              </Link>
            </div>
          </div>
        )}

        {result && isLoggedIn && (
          <div className="card p-8 bg-primary-50 dark:bg-primary-950/30 border-2 border-primary-200 dark:border-primary-800 text-center">
            <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-3">
              {language === 'zh' ? '🎉 生成成功！' : '🎉 Success!'}
            </h3>
            <p className="text-dark-700 dark:text-dark-300 mb-6">
              {language === 'zh'
                ? '还需要更多证件照？升级Basic版本获得200张配额，所有工具随便用！'
                : 'Need more? Upgrade to Basic for 200 quota and unlimited tool access!'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setImage(null);
                  setResult(null);
                }}
                className="px-6 py-2 btn-outline"
              >
                {language === 'zh' ? '再生成一张' : 'Generate Another'}
              </button>
              <Link href="/pricing" className="px-6 py-2 btn-primary">
                {language === 'zh' ? '升级Basic版' : 'Upgrade to Basic'}
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
