'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2, Zap, Shield, Users, Crown } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionPage() {
  const { language } = useLanguage();
  const { subscription, quota } = useAppStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    zh: {
      free: {
        name: '免费版',
        price: { monthly: '¥0', yearly: '¥0' },
        description: '适合尝试和个人使用',
        features: [
          '每天 10 次 AI 生成',
          '每天 5 次图片编辑',
          '基础模型（Gemini 2.5 Flash）',
          '保存 20 张作品',
          '社区模板访问',
          '基础支持'
        ],
        cta: '当前方案',
        current: true
      },
      pro: {
        name: '专业版',
        price: { monthly: '¥68', yearly: '¥680' },
        description: '适合专业创作者和开发者',
        popular: true,
        features: [
          '每月 500 次 AI 生成',
          '每月 200 次图片编辑',
          '所有高级模型（DALL-E 3、SD XL）',
          '无限作品保存',
          '批量生成（1-8 张）',
          '优先队列（更快）',
          '去除水印',
          'API 访问',
          '优先支持'
        ],
        cta: '升级到专业版',
        savings: '年付省 ¥136'
      },
      team: {
        name: '团队版',
        price: { monthly: '¥198', yearly: '¥1980' },
        perUser: '/用户',
        description: '适合团队和企业',
        features: [
          '无限 AI 生成（公平使用）',
          '无限图片编辑',
          '所有模型 + 优先访问新模型',
          '团队协作空间',
          '共享模板和作品库',
          '统一账单管理',
          '自定义品牌',
          'SSO 单点登录',
          '专属技术支持'
        ],
        cta: '联系销售',
        savings: '年付省 ¥396'
      }
    },
    en: {
      free: {
        name: 'Free',
        price: { monthly: '$0', yearly: '$0' },
        description: 'For trying out and personal use',
        features: [
          '10 AI generations/day',
          '5 image edits/day',
          'Basic models (Gemini 2.5 Flash)',
          'Save 20 artworks',
          'Community templates',
          'Basic support'
        ],
        cta: 'Current Plan',
        current: true
      },
      pro: {
        name: 'Pro',
        price: { monthly: '$9.99', yearly: '$99' },
        description: 'For professionals and developers',
        popular: true,
        features: [
          '500 AI generations/month',
          '200 image edits/month',
          'All advanced models (DALL-E 3, SD XL)',
          'Unlimited storage',
          'Batch generation (1-8 images)',
          'Priority queue (faster)',
          'Remove watermarks',
          'API access',
          'Priority support'
        ],
        cta: 'Upgrade to Pro',
        savings: 'Save $20 with yearly'
      },
      team: {
        name: 'Team',
        price: { monthly: '$29.99', yearly: '$299' },
        perUser: '/user',
        description: 'For teams and enterprises',
        features: [
          'Unlimited generations (fair use)',
          'Unlimited edits',
          'All models + early access',
          'Team workspace',
          'Shared templates & artworks',
          'Unified billing',
          'Custom branding',
          'SSO',
          'Dedicated support'
        ],
        cta: 'Contact Sales',
        savings: 'Save $60 with yearly'
      }
    }
  };

  const t = plans[language];

  return (
    <div className="page-container">
      <div className="content-wrapper py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? '选择适合你的方案' : 'Choose Your Plan'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400">
            {language === 'zh' 
              ? '从免费开始，随时升级。所有方案均可随时取消。' 
              : 'Start free, upgrade anytime. Cancel anytime.'}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-dark-100 dark:bg-dark-900 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-50 shadow-sm'
                  : 'text-dark-600 dark:text-dark-400'
              }`}
            >
              {language === 'zh' ? '月付' : 'Monthly'}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-50 shadow-sm'
                  : 'text-dark-600 dark:text-dark-400'
              }`}
            >
              {language === 'zh' ? '年付' : 'Yearly'}
              <span className="ml-2 badge-accent text-xs">
                {language === 'zh' ? '省20%' : 'Save 20%'}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* Free */}
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-dark-600 dark:text-dark-400" />
              <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-50">
                {t.free.name}
              </h3>
            </div>
            <p className="text-dark-600 dark:text-dark-400 mb-4">
              {t.free.description}
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-dark-900 dark:text-dark-50">
                {t.free.price[billingCycle]}
              </span>
            </div>
            <ul className="space-y-3 mb-6">
              {t.free.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-dark-600 dark:text-dark-400">
                  <CheckCircle2 className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
              {t.free.cta}
            </button>
          </div>

          {/* Pro */}
          <div className="card-elevated p-8 border-2 border-primary-400 relative scale-105">
            {t.pro.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="badge-accent px-4 py-1">
                  <Crown className="w-3 h-3 inline mr-1" />
                  {language === 'zh' ? '最受欢迎' : 'Popular'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-50">
                {t.pro.name}
              </h3>
            </div>
            <p className="text-dark-600 dark:text-dark-400 mb-4">
              {t.pro.description}
            </p>
            <div className="mb-2">
              <span className="text-4xl font-bold text-dark-900 dark:text-dark-50">
                {t.pro.price[billingCycle]}
              </span>
              {billingCycle === 'monthly' && (
                <span className="text-dark-500">
                  {language === 'zh' ? '/月' : '/mo'}
                </span>
              )}
            </div>
            {billingCycle === 'yearly' && (
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">
                {t.pro.savings}
              </p>
            )}
            <ul className="space-y-3 mb-6">
              {t.pro.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-dark-600 dark:text-dark-400">
                  <CheckCircle2 className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="btn-primary w-full">
              {t.pro.cta}
            </button>
          </div>

          {/* Team */}
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-dark-600 dark:text-dark-400" />
              <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-50">
                {t.team.name}
              </h3>
            </div>
            <p className="text-dark-600 dark:text-dark-400 mb-4">
              {t.team.description}
            </p>
            <div className="mb-2">
              <span className="text-4xl font-bold text-dark-900 dark:text-dark-50">
                {t.team.price[billingCycle]}
              </span>
              <span className="text-dark-500">{t.team.perUser}</span>
            </div>
            {billingCycle === 'yearly' && (
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">
                {t.team.savings}
              </p>
            )}
            <ul className="space-y-3 mb-6">
              {t.team.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-dark-600 dark:text-dark-400">
                  <CheckCircle2 className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="btn-secondary w-full">
              {t.team.cta}
            </button>
          </div>
        </div>

        {/* Current Usage */}
        {subscription.tier === 'free' && (
          <div className="card p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-4">
              {language === 'zh' ? '今日使用情况' : 'Today\'s Usage'}
            </h3>
            <div className="space-y-4">
              {/* Generate Quota */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-600 dark:text-dark-400">
                    {language === 'zh' ? 'AI 生成' : 'AI Generation'}
                  </span>
                  <span className="font-mono text-dark-900 dark:text-dark-50">
                    {quota.generate.used} / {quota.generate.limit}
                  </span>
                </div>
                <div className="h-2 bg-dark-100 dark:bg-dark-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-400 transition-all duration-300"
                    style={{ width: `${(quota.generate.used / quota.generate.limit) * 100}%` }}
                  />
                </div>
              </div>

              {/* Edit Quota */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-600 dark:text-dark-400">
                    {language === 'zh' ? '图片编辑' : 'Image Editing'}
                  </span>
                  <span className="font-mono text-dark-900 dark:text-dark-50">
                    {quota.edit.used} / {quota.edit.limit}
                  </span>
                </div>
                <div className="h-2 bg-dark-100 dark:bg-dark-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-400 transition-all duration-300"
                    style={{ width: `${(quota.edit.used / quota.edit.limit) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-dark-500 mt-4">
              {language === 'zh' 
                ? `配额将在 ${new Date(quota.resetAt).toLocaleDateString()} 重置` 
                : `Quota resets on ${new Date(quota.resetAt).toLocaleDateString()}`}
            </p>
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6 text-center">
            {language === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
            <details className="card p-6 cursor-pointer">
              <summary className="font-semibold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? '可以随时取消订阅吗？' : 'Can I cancel anytime?'}
              </summary>
              <p className="mt-3 text-dark-600 dark:text-dark-400 text-sm">
                {language === 'zh' 
                  ? '是的，您可以随时取消订阅。取消后将在当前计费周期结束时生效，您仍可使用剩余时间的服务。' 
                  : 'Yes, you can cancel anytime. Cancellation takes effect at the end of your current billing period, and you can still use the service until then.'}
              </p>
            </details>

            <details className="card p-6 cursor-pointer">
              <summary className="font-semibold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? '升级后立即生效吗？' : 'Does upgrade take effect immediately?'}
              </summary>
              <p className="mt-3 text-dark-600 dark:text-dark-400 text-sm">
                {language === 'zh' 
                  ? '是的，升级后您的配额和功能权限将立即生效，无需等待。' 
                  : 'Yes, your quota and feature access will be activated immediately after upgrade.'}
              </p>
            </details>

            <details className="card p-6 cursor-pointer">
              <summary className="font-semibold text-dark-900 dark:text-dark-50">
                {language === 'zh' ? 'API 访问是什么？' : 'What is API access?'}
              </summary>
              <p className="mt-3 text-dark-600 dark:text-dark-400 text-sm">
                {language === 'zh' 
                  ? 'Pro 用户可以通过 RESTful API 集成我们的服务到您自己的应用中，实现自动化工作流。' 
                  : 'Pro users can integrate our service into your own applications via RESTful API for automated workflows.'}
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

