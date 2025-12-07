/**
 * 新手引导组件
 * 首次访问时展示，介绍核心功能
 */

'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function OnboardingTour() {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 检查是否已完成引导
    const completed = localStorage.getItem('onboarding_completed');
    if (!completed) {
      // 延迟 1 秒显示，避免干扰首屏加载
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const steps = language === 'zh' ? [
    {
      title: '🎉 欢迎来到 Imagine Engine！',
      description: '您的专业 AI 图像创作工作台',
      content: (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <Sparkles className="w-16 h-16 text-primary-500 mx-auto mb-3" />
            <p className="text-lg font-semibold text-dark-900 dark:text-dark-50">
              注册即送 <span className="text-primary-600">20 张免费图片</span>
            </p>
          </div>
          <div className="space-y-2 text-dark-600 dark:text-dark-400">
            <p>✨ 支持多种风格和比例</p>
            <p>🎭 多图融合智能创作</p>
            <p>📱 跨平台使用，随时创作</p>
            <p>🤖 AI 智能助手实时帮助</p>
          </div>
        </div>
      ),
    },
    {
      title: '🖼️ AI Studio - 图片生成',
      description: '三步生成您想要的图片',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-dark-900 dark:text-dark-50">输入提示词</p>
              <p className="text-sm text-dark-600 dark:text-dark-400">
                描述您想要的画面，越详细越好
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-dark-900 dark:text-dark-50">选择风格和比例</p>
              <p className="text-sm text-dark-600 dark:text-dark-400">
                写实、动漫、油画等多种风格
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-dark-900 dark:text-dark-50">点击生成</p>
              <p className="text-sm text-dark-600 dark:text-dark-400">
                30秒内获得高质量图片
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '💎 升级解锁更多',
      description: '更多配额，更多可能',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <p className="font-semibold text-dark-900 dark:text-dark-50 mb-1">
              Pro 套餐 - ¥49.9/月
            </p>
            <p className="text-sm text-dark-600 dark:text-dark-400 mb-3">
              600张/月 + 优先队列 + 高级模型
            </p>
            <p className="text-xs text-primary-600 dark:text-primary-400">
              🎯 适合专业创作者和设计师
            </p>
          </div>

          <div className="text-sm text-dark-600 dark:text-dark-400 space-y-2">
            <p>💰 <strong>成本仅 ¥0.04/张</strong>，套餐最低 ¥0.083/张</p>
            <p>📊 企业版最低至 ¥0.067/张</p>
            <p>🎁 按需购买，永不过期</p>
          </div>
        </div>
      ),
    },
  ] : [
    {
      title: '🎉 Welcome to Imagine Engine!',
      description: 'Your Professional AI Image Creation Workspace',
      content: (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <Sparkles className="w-16 h-16 text-primary-500 mx-auto mb-3" />
            <p className="text-lg font-semibold text-dark-900 dark:text-dark-50">
              Get <span className="text-primary-600">20 Free Images</span> on Sign Up
            </p>
          </div>
          <div className="space-y-2 text-dark-600 dark:text-dark-400">
            <p>✨ Multiple styles and aspect ratios</p>
            <p>🎭 Multi-image fusion capability</p>
            <p>📱 Cross-platform, create anytime</p>
            <p>🤖 AI assistant for real-time help</p>
          </div>
        </div>
      ),
    },
    {
      title: '🖼️ AI Studio - Image Generation',
      description: 'Create images in 3 simple steps',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-dark-900 dark:text-dark-50">Enter Prompt</p>
              <p className="text-sm text-dark-600 dark:text-dark-400">
                Describe what you want to create
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-dark-900 dark:text-dark-50">Choose Style & Ratio</p>
              <p className="text-sm text-dark-600 dark:text-dark-400">
                Realistic, anime, oil painting, etc.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-dark-900 dark:text-dark-50">Generate</p>
              <p className="text-sm text-dark-600 dark:text-dark-400">
                Get high-quality images in 30s
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '💎 Upgrade for More',
      description: 'More quota, more possibilities',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <p className="font-semibold text-dark-900 dark:text-dark-50 mb-1">
              Pro Plan - ¥49.9/month
            </p>
            <p className="text-sm text-dark-600 dark:text-dark-400 mb-3">
              600 images/month + Priority Queue + Advanced Models
            </p>
            <p className="text-xs text-primary-600 dark:text-primary-400">
              🎯 Perfect for professional creators
            </p>
          </div>

          <div className="text-sm text-dark-600 dark:text-dark-400 space-y-2">
            <p>💰 <strong>Cost only ¥0.04/image</strong></p>
            <p>📊 Enterprise plan as low as ¥0.067/image</p>
            <p>🎁 On-demand purchases never expire</p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShow(false);
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-lg mx-4 p-8 relative animate-slide-up">
        {/* 跳过按钮 */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-sm text-dark-500 hover:text-dark-700 dark:hover:text-dark-300"
        >
          {language === 'zh' ? '跳过' : 'Skip'}
        </button>

        {/* 进度指示器 */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === step 
                  ? 'w-8 bg-primary-500' 
                  : idx < step
                  ? 'w-2 bg-primary-300'
                  : 'w-2 bg-dark-300 dark:bg-dark-700'
              }`}
            />
          ))}
        </div>

        {/* 内容 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {steps[step].title}
          </h2>
          <p className="text-dark-600 dark:text-dark-400">
            {steps[step].description}
          </p>
        </div>

        <div className="mb-8">
          {steps[step].content}
        </div>

        {/* 按钮 */}
        <div className="flex justify-between gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-outline flex-1"
            >
              {language === 'zh' ? '上一步' : 'Previous'}
            </button>
          )}
          <button
            onClick={handleNext}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {step < steps.length - 1 ? (
              <>
                {language === 'zh' ? '下一步' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                {language === 'zh' ? '开始创作' : 'Start Creating'}
                <Check className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

