'use client';

import { useState, useEffect } from 'react';

interface FirstTimeGuideProps {
  onComplete: () => void;
}

export default function FirstTimeGuide({ onComplete }: FirstTimeGuideProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 检查是否首次使用
    const hasCompletedGuide = localStorage.getItem('imagine-engine-guide-completed');
    const hasApiKey = localStorage.getItem('imagine-engine-api-key');
    
    if (!hasCompletedGuide && !hasApiKey) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const steps = [
    {
      title: '🎉 欢迎使用创想引擎 v2.0',
      content: '您即将体验最强大的AI图像创作平台！\n\n让我们花1分钟完成初始配置。',
      action: '开始配置'
    },
    {
      title: '🔑 配置API密钥',
      content: '为了保护您的隐私和安全，我们不再内置API密钥。\n\n您需要使用自己的API密钥来使用AI功能。',
      action: '了解如何获取'
    },
    {
      title: '⚙️ 打开设置',
      content: '点击左侧导航栏的"⚙️ 设置"按钮\n\n选择"Nano Banana (Gemini)"提供商\n输入您的API密钥\n点击"保存设置"',
      action: '前往设置'
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // 最后一步，跳转到设置
      localStorage.setItem('imagine-engine-guide-completed', 'true');
      setIsVisible(false);
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('imagine-engine-guide-completed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const currentStep = steps[step];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.9)' }}
    >
      <div 
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-secondary)' }}
      >
        {/* 进度指示器 */}
        <div className="px-6 pt-6">
          <div className="flex gap-2 mb-4">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-1 rounded-full transition-all ${
                  idx <= step ? 'bg-gradient-primary' : 'bg-gray-300'
                }`}
                style={{ background: idx <= step ? undefined : 'var(--bg-tertiary)' }}
              />
            ))}
          </div>
        </div>

        {/* 内容 */}
        <div className="px-6 py-8 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {currentStep.title}
          </h2>
          <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
            {currentStep.content}
          </p>

          {step === 1 && (
            <div className="mt-6 p-4 rounded-xl text-left" style={{ 
              background: 'rgba(138, 43, 226, 0.1)',
              border: '1px solid rgba(138, 43, 226, 0.2)'
            }}>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                💡 推荐：Nano Banana (Gemini)
              </p>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                1. 访问: https://newapi.aicohere.org<br/>
                2. 注册账号并创建API密钥<br/>
                3. 复制密钥到设置中
              </p>
            </div>
          )}
        </div>

        {/* 按钮 */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 btn-secondary py-3"
          >
            跳过引导
          </button>
          <button
            onClick={handleNext}
            className="flex-1 btn-gradient py-3"
          >
            {currentStep.action}
          </button>
        </div>
      </div>
    </div>
  );
}

