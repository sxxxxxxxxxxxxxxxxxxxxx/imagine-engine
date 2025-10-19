/**
 * 配额用尽提示模态框
 * 引导用户升级套餐或购买配额包
 */

'use client';

import { X, Zap, Crown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

interface QuotaExhaustedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

export default function QuotaExhaustedModal({ isOpen, onClose, currentPlan = 'free' }: QuotaExhaustedModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="card relative w-full max-w-md mx-4 p-8 animate-slide-up">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 图标 */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {language === 'zh' ? '配额已用完' : 'Quota Exhausted'}
          </h2>
          <p className="text-dark-600 dark:text-dark-400">
            {language === 'zh' 
              ? '您的免费配额已用完，升级解锁更多创作可能！' 
              : 'Your free quota is exhausted. Upgrade to unlock more!'}
          </p>
        </div>

        {/* 推荐套餐 */}
        {currentPlan === 'free' && (
          <div className="mb-6 p-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg border-2 border-primary-300 dark:border-primary-700">
            <div className="flex items-start gap-3 mb-3">
              <Crown className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-dark-900 dark:text-dark-50">
                  {language === 'zh' ? 'Pro 专业版 - 推荐' : 'Pro Plan - Recommended'}
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 my-1">
                  ¥49.9<span className="text-sm text-dark-600 dark:text-dark-400">/月</span>
                </p>
                <ul className="text-sm text-dark-700 dark:text-dark-300 space-y-1">
                  <li>✅ 600 {language === 'zh' ? '张/月' : 'images/month'}</li>
                  <li>✅ {language === 'zh' ? '优先队列' : 'Priority Queue'}</li>
                  <li>✅ {language === 'zh' ? '高级模型' : 'Advanced Models'}</li>
                  <li>✅ API {language === 'zh' ? '访问' : 'Access'}</li>
                </ul>
              </div>
            </div>
            <Link
              href="/pricing"
              className="btn-primary w-full text-center"
              onClick={onClose}
            >
              {language === 'zh' ? '立即升级' : 'Upgrade Now'}
            </Link>
          </div>
        )}

        {/* 其他选项 */}
        <div className="space-y-3">
          {currentPlan !== 'free' && (
            <Link
              href="/pricing"
              className="block w-full btn-primary text-center"
              onClick={onClose}
            >
              {language === 'zh' ? '查看所有套餐' : 'View All Plans'}
            </Link>
          )}
          
          <Link
            href="/pricing#quota-packages"
            className="block w-full btn-outline text-center"
            onClick={onClose}
          >
            {language === 'zh' ? '按需购买配额包' : 'Buy Quota Package'}
          </Link>
        </div>

        {/* 说明文本 */}
        <p className="mt-6 text-xs text-center text-dark-500">
          {language === 'zh' 
            ? '💡 提示：购买的配额包永不过期，可随时使用' 
            : '💡 Tip: Purchased quota packages never expire'}
        </p>
      </div>
    </div>
  );
}

