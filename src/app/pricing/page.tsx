/**
 * 套餐选择页面
 * 展示所有订阅选项和价格
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { PLANS } from '@/lib/stripe';
import { Check, Zap, Crown, Building2, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import AuthModal from '@/components/AuthModal';

// 安全加载 Stripe（防止未配置时报错）
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function PricingPage() {
  const { user, isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubscribe = async (planType: string) => {
    // 未登录则显示注册模态框
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setLoading(planType);

    try {
      // 调用创建 Checkout Session API
      const res = await fetch('/api/payment/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // 重定向到 Stripe Checkout（使用新API）
      if (!stripePromise) {
        throw new Error('Stripe未配置，请先创建.env.local文件');
      }
      
      if (data.url) {
        // 直接重定向到 Checkout URL
        window.location.href = data.url;
      } else if (data.sessionId) {
        // 兼容旧方式
        const stripe = await stripePromise;
        if (stripe) {
          window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
        }
      }
    } catch (error: any) {
      console.error('❌ 订阅失败:', error);
      alert(error.message || '订阅失败，请稍后重试');
    } finally {
      setLoading(null);
    }
  };

  const planIcons = {
    free: <Zap className="w-8 h-8" />,
    basic: <Zap className="w-8 h-8" />,
    pro: <Crown className="w-8 h-8" />,
    enterprise: <Building2 className="w-8 h-8" />,
  };

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? '选择适合您的套餐' : 'Choose Your Plan'}
          </h1>
          <p className="text-lg text-dark-600 dark:text-dark-400">
            {language === 'zh' 
              ? '从免费试用开始，随时升级到更高级别' 
              : 'Start with free trial, upgrade anytime'}
          </p>
        </div>

        {/* 套餐卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              className={`card p-6 relative ${
                plan.recommended 
                  ? 'border-2 border-primary-500 shadow-xl' 
                  : 'border border-dark-200 dark:border-dark-800'
              }`}
            >
              {/* 推荐标签 */}
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                  {language === 'zh' ? '推荐' : 'RECOMMENDED'}
                </div>
              )}

              {/* 图标 */}
              <div className={`mb-4 ${
                plan.recommended 
                  ? 'text-primary-500' 
                  : 'text-dark-400 dark:text-dark-600'
              }`}>
                {planIcons[key as keyof typeof planIcons]}
              </div>

              {/* 套餐名称 */}
              <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                {language === 'zh' ? plan.nameZh : plan.name}
              </h3>

              {/* 价格 */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-dark-900 dark:text-dark-50">
                    ¥{plan.price}
                  </span>
                  <span className="text-dark-600 dark:text-dark-400">
                    {key === 'free' ? '' : '/月'}
                  </span>
                </div>
                <p className="text-sm text-dark-500 mt-1">
                  {plan.quota} {language === 'zh' ? '张图片/月' : 'images/month'}
                </p>
              </div>

              {/* 功能列表 */}
              <ul className="space-y-3 mb-6">
                {(language === 'zh' ? plan.featuresZh : plan.features).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-dark-700 dark:text-dark-300">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* 订阅按钮 */}
              <button
                onClick={() => handleSubscribe(key)}
                disabled={key === 'free' || loading === key}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  key === 'free'
                    ? 'bg-dark-200 dark:bg-dark-800 text-dark-500 cursor-not-allowed'
                    : plan.recommended
                    ? 'btn-primary'
                    : 'btn-outline'
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {loading === key && <Loader2 className="w-5 h-5 animate-spin" />}
                {key === 'free' 
                  ? (language === 'zh' ? '当前套餐' : 'Current Plan')
                  : (language === 'zh' ? '立即订阅' : 'Subscribe Now')}
              </button>
            </div>
          ))}
        </div>

        {/* 功能对比表 */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6 text-center">
            {language === 'zh' ? '功能对比' : 'Feature Comparison'}
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-200 dark:border-dark-800">
                  <th className="text-left py-3 px-4 text-dark-700 dark:text-dark-300">
                    {language === 'zh' ? '功能' : 'Feature'}
                  </th>
                  <th className="text-center py-3 px-4 text-dark-700 dark:text-dark-300">
                    {language === 'zh' ? '免费版' : 'Free'}
                  </th>
                  <th className="text-center py-3 px-4 text-dark-700 dark:text-dark-300">
                    {language === 'zh' ? '基础版' : 'Basic'}
                  </th>
                  <th className="text-center py-3 px-4 text-dark-700 dark:text-dark-300">
                    {language === 'zh' ? '专业版' : 'Pro'}
                  </th>
                  <th className="text-center py-3 px-4 text-dark-700 dark:text-dark-300">
                    {language === 'zh' ? '企业版' : 'Enterprise'}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dark-100 dark:border-dark-900">
                  <td className="py-3 px-4 text-dark-700 dark:text-dark-300">
                    {language === 'zh' ? '月度图片配额' : 'Monthly Images'}
                  </td>
                  <td className="text-center py-3 px-4">10</td>
                  <td className="text-center py-3 px-4">200</td>
                  <td className="text-center py-3 px-4 font-bold text-primary-600">500</td>
                  <td className="text-center py-3 px-4 font-bold">3000</td>
                </tr>
                <tr className="border-b border-dark-100 dark:border-dark-900">
                  <td className="py-3 px-4 text-dark-700 dark:text-dark-300">
                    {language === 'zh' ? '多图融合' : 'Multi-Image Fusion'}
                  </td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-primary-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-primary-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-primary-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-primary-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-dark-100 dark:border-dark-900">
                  <td className="py-3 px-4 text-dark-700 dark:text-dark-300">
                    {language === 'zh' ? '高级模型' : 'Advanced Models'}
                  </td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-primary-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-primary-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-dark-100 dark:border-dark-900">
                  <td className="py-3 px-4 text-dark-700 dark:text-dark-300">
                    {language === 'zh' ? 'API 访问' : 'API Access'}
                  </td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-primary-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="w-5 h-5 text-primary-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-dark-700 dark:text-dark-300">
                    {language === 'zh' ? '客户支持' : 'Support'}
                  </td>
                  <td className="text-center py-3 px-4 text-sm text-dark-500">
                    {language === 'zh' ? '社区' : 'Community'}
                  </td>
                  <td className="text-center py-3 px-4 text-sm text-dark-500">
                    {language === 'zh' ? '邮件' : 'Email'}
                  </td>
                  <td className="text-center py-3 px-4 text-sm text-dark-500">
                    {language === 'zh' ? '优先' : 'Priority'}
                  </td>
                  <td className="text-center py-3 px-4 text-sm text-dark-500">
                    {language === 'zh' ? '专属' : 'Dedicated'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6 text-center">
            {language === 'zh' ? '常见问题' : 'FAQ'}
          </h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="group">
              <summary className="cursor-pointer font-semibold text-dark-900 dark:text-dark-50 py-3 list-none flex items-center justify-between">
                {language === 'zh' ? '配额用完后怎么办？' : 'What happens when quota runs out?'}
                <span className="text-primary-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-dark-600 dark:text-dark-400 mt-2 pb-3">
                {language === 'zh' 
                  ? '您可以升级到更高套餐，或按需购买额外配额包。配额包永久有效。'
                  : 'You can upgrade to a higher plan or purchase additional quota packages. Packages never expire.'}
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer font-semibold text-dark-900 dark:text-dark-50 py-3 list-none flex items-center justify-between">
                {language === 'zh' ? '可以随时取消订阅吗？' : 'Can I cancel anytime?'}
                <span className="text-primary-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-dark-600 dark:text-dark-400 mt-2 pb-3">
                {language === 'zh' 
                  ? '可以。您可以随时取消订阅，当月剩余配额仍然有效，到期后不再续费。'
                  : 'Yes. You can cancel anytime. Remaining quota stays valid until the end of the period.'}
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer font-semibold text-dark-900 dark:text-dark-50 py-3 list-none flex items-center justify-between">
                {language === 'zh' ? '支持哪些支付方式？' : 'What payment methods are supported?'}
                <span className="text-primary-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-dark-600 dark:text-dark-400 mt-2 pb-3">
                {language === 'zh' 
                  ? '支持微信支付、支付宝、信用卡（Visa/MasterCard）等多种支付方式。'
                  : 'WeChat Pay, Alipay, Credit Cards (Visa/MasterCard), and more.'}
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer font-semibold text-dark-900 dark:text-dark-50 py-3 list-none flex items-center justify-between">
                {language === 'zh' ? '配额会过期吗？' : 'Do quotas expire?'}
                <span className="text-primary-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-dark-600 dark:text-dark-400 mt-2 pb-3">
                {language === 'zh' 
                  ? '月度订阅配额在每月月底重置。按需购买的配额包永久有效，不会过期。'
                  : 'Monthly subscription quotas reset at the end of each month. Purchased quota packages never expire.'}
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* 认证模态框 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </div>
  );
}

