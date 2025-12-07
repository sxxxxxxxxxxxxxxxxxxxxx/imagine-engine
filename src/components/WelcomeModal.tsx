/**
 * 首次访问欢迎弹窗
 * 仅在用户首次访问且未登录时显示一次
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Sparkles, Gift } from 'lucide-react';
import Link from 'next/link';

export default function WelcomeModal() {
  const [show, setShow] = useState(false);
  const { isLoggedIn } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    // 已登录用户不显示
    if (isLoggedIn) return;

    const welcomed = localStorage.getItem('welcome_shown');
    
    // 首次访问 + 未登录 → 立即显示欢迎引导
    if (!welcomed) {
      // 延迟500ms显示，确保页面已渲染
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const handleClose = () => {
    localStorage.setItem('welcome_shown', 'true');
    setShow(false);
  };

  const handleStart = () => {
    localStorage.setItem('welcome_shown', 'true');
    setShow(false);
    // 跳转到创作页面会触发注册
    window.location.href = '/create';
  };

  // 已登录或不显示时返回null
  if (!show || isLoggedIn) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card relative w-full max-w-lg mx-4 p-10 animate-slide-up">
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
          aria-label="关闭"
        >
          <X className="w-5 h-5 text-dark-500" />
        </button>

        {/* 图标 */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
            <Gift className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-3">
            {language === 'zh' ? '🎁 欢迎来到 Imagine Engine' : '🎁 Welcome to Imagine Engine'}
          </h2>
          
          <p className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-2">
            {language === 'zh' 
              ? '注册即送 20 张免费 AI 图片' 
              : 'Get 20 Free AI Images on Sign Up'}
          </p>
          <p className="text-sm text-dark-500 mb-1">
            {language === 'zh' 
              ? '无需信用卡 · 立即开始创作' 
              : 'No Credit Card Required · Start Now'}
          </p>
          <p className="text-xs text-primary-600 dark:text-primary-400">
            {language === 'zh' 
              ? '📧 需邮箱验证后激活配额' 
              : '📧 Email verification required'}
          </p>
        </div>

        {/* 特性列表 - 简洁版 */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div>
            <div className="text-3xl mb-2">🎭</div>
            <p className="text-sm font-semibold text-dark-900 dark:text-dark-50">
              {language === 'zh' ? '多图融合' : 'Multi-Fusion'}
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">📐</div>
            <p className="text-sm font-semibold text-dark-900 dark:text-dark-50">
              {language === 'zh' ? '精确比例' : 'Precise Ratio'}
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-sm font-semibold text-dark-900 dark:text-dark-50">
              {language === 'zh' ? 'AI 助手' : 'AI Assistant'}
            </p>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="flex items-center justify-center gap-6 mb-8 text-sm text-dark-600 dark:text-dark-400">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">110+</div>
            <div>{language === 'zh' ? '案例' : 'Examples'}</div>
          </div>
          <div className="w-px h-8 bg-dark-200 dark:bg-dark-800"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">10</div>
            <div>{language === 'zh' ? '免费张数' : 'Free Images'}</div>
          </div>
          <div className="w-px h-8 bg-dark-200 dark:bg-dark-800"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">0</div>
            <div>{language === 'zh' ? '信用卡' : 'Credit Card'}</div>
          </div>
        </div>

        {/* CTA 按钮 */}
        <div className="space-y-3">
          <button
            onClick={handleStart}
            className="w-full btn-primary py-4 text-lg font-semibold"
          >
            {language === 'zh' ? '立即开始创作' : 'Start Creating Now'}
          </button>
          
          <button
            onClick={handleClose}
            className="w-full text-sm text-dark-500 hover:text-dark-700 dark:hover:text-dark-300 transition-colors"
          >
            {language === 'zh' ? '稍后再说' : 'Maybe Later'}
          </button>
        </div>

        {/* 底部提示 */}
        <p className="mt-6 text-xs text-center text-dark-500">
          {language === 'zh' 
            ? '无需信用卡 · 注册后立即可用' 
            : 'No credit card required · Available immediately'}
        </p>
      </div>
    </div>
  );
}

