/**
 * 定价页面 - 主推Basic版本策略
 * 优化转化率，降低付费门槛
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRICING_PLANS, calculateSavings } from '@/lib/pricing-plans';
import { Check, Zap, Crown, Building2, Loader2, TrendingDown, Users, Shield, X } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function PricingPage() {
  const { user, isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [monthlyUsage, setMonthlyUsage] = useState(200); // 成本计算器默认值

  const handleSubscribe = async (planId: string) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (planId === 'free') return; // Free无需订阅
    if (planId === 'enterprise') {
      window.location.href = 'mailto:send@2art.fun?subject=企业版咨询';
      return;
    }

    setLoading(planId);

    try {
      const res = await fetch('/api/payment/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: planId }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('❌ 订阅失败:', error);
      alert(error.message || '订阅失败，请稍后重试');
    } finally {
      setLoading(null);
    }
  };

  const planIcons: Record<string, JSX.Element> = {
    free: <Zap className="w-8 h-8" />,
    basic: <Zap className="w-10 h-10" />,  // Basic图标更大
    pro: <Crown className="w-8 h-8" />,
    enterprise: <Building2 className="w-8 h-8" />,
  };

  const t = (key: string) => language === 'zh' ? key : key; // 简化翻译

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-7xl mx-auto">

        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? '选择适合你的方案' : 'Choose Your Plan'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 mb-2">
            {language === 'zh'
              ? '大多数用户选择Basic版，性价比最高'
              : 'Most users choose Basic for best value'}
          </p>
          <p className="text-base text-dark-500">
            {language === 'zh'
              ? '所有方案均可随时升级或降级，无需担心'
              : 'All plans can be upgraded or downgraded anytime'}
          </p>
        </div>

        {/* 定价卡片 - Basic居中放大 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 items-center">
          {PRICING_PLANS.filter(p => ['free', 'basic', 'pro'].includes(p.id)).map((plan) => (
            <div
              key={plan.id}
              className={`relative ${plan.highlight
                ? 'md:scale-110 z-10' // Basic卡片放大10%
                : ''
                }`}
            >
              <div
                className={`card p-8 relative transition-all duration-300 ${plan.highlight
                  ? 'border-4 border-primary-500 shadow-2xl bg-gradient-to-br from-white via-primary-50/30 to-white dark:from-dark-900 dark:via-primary-950/30 dark:to-dark-900'
                  : 'border-2 border-dark-200 dark:border-dark-800 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                style={plan.highlight ? {
                  animation: 'pulse-border 2s infinite'
                } : {}}
              >
                {/* 徽章 */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                    {language === 'zh' ? plan.badge.zh : plan.badge.en}
                  </div>
                )}

                {/* 图标 */}
                <div className={`mb-6 ${plan.highlight ? 'text-primary-500' : 'text-dark-400'}`}>
                  {planIcons[plan.id]}
                </div>

                {/* 套餐名称 */}
                <h3 className={`font-bold text-dark-900 dark:text-dark-50 mb-2 ${plan.highlight ? 'text-3xl' : 'text-2xl'
                  }`}>
                  {language === 'zh' ? plan.name.zh : plan.name.en}
                </h3>

                {/* 描述 */}
                <p className="text-dark-600 dark:text-dark-400 mb-6 text-sm">
                  {language === 'zh' ? plan.description.zh : plan.description.en}
                </p>

                {/* 价格 */}
                <div className="mb-6">
                  {plan.originalPrice && (
                    <div className="text-sm text-dark-500 line-through mb-1">
                      {language === 'zh' ? plan.originalPrice.zh : plan.originalPrice.en}
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className={`font-bold text-dark-900 dark:text-dark-50 ${plan.highlight ? 'text-5xl' : 'text-4xl'
                      }`}>
                      {language === 'zh' ? plan.price.zh : plan.price.en}
                    </span>
                    <span className="text-dark-600 dark:text-dark-400">
                      {language === 'zh' ? plan.period.zh : plan.period.en}
                    </span>
                  </div>
                  <p className="text-sm text-dark-500 mt-1">{plan.quota}</p>
                  {plan.savings && (
                    <div className="mt-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full inline-block">
                      💰 {language === 'zh' ? plan.savings.zh : plan.savings.en}
                    </div>
                  )}
                </div>

                {/* 适合人群 */}
                <div className="mb-6 p-3 bg-dark-50 dark:bg-dark-800 rounded-lg">
                  <p className="text-xs text-dark-600 dark:text-dark-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {language === 'zh' ? '适合：' : 'For: '}{language === 'zh' ? plan.targetAudience.zh : plan.targetAudience.en}
                  </p>
                </div>

                {/* 功能列表 */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-primary-500' : 'text-green-500'
                        }`} />
                      <span className="text-dark-700 dark:text-dark-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA按钮 */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={plan.id === 'free' || loading === plan.id}
                  className={`w-full py-4 rounded-xl font-bold transition-all text-base ${plan.id === 'free'
                    ? 'bg-dark-200 dark:bg-dark-800 text-dark-500 cursor-not-allowed'
                    : plan.highlight
                      ? 'bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'border-2 border-dark-300 dark:border-dark-700 text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800'
                    } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {loading === plan.id && <Loader2 className="w-5 h-5 animate-spin" />}
                  {language === 'zh' ? plan.cta.zh : plan.cta.en}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Basic推荐说明 */}
        <div className="text-center mb-12 p-6 bg-primary-50 dark:bg-primary-950/30 rounded-xl border-2 border-primary-200 dark:border-primary-800">
          <p className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2">
            💡 {language === 'zh' ? '不确定选哪个？' : 'Not sure which to choose?'}
          </p>
          <p className="text-base text-dark-700 dark:text-dark-300">
            {language === 'zh'
              ? '90%的用户选择Basic版本 - 性价比最高，功能完整，适合绝大多数使用场景'
              : '90% of users choose Basic - best value, full features, perfect for most use cases'}
          </p>
        </div>

        {/* 成本对比计算器 */}
        <div className="card p-8 mb-16 border-2 border-primary-200 dark:border-primary-800">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6 text-center flex items-center justify-center gap-2">
            <TrendingDown className="w-6 h-6 text-primary-500" />
            {language === 'zh' ? '💰 成本对比计算器' : '💰 Cost Comparison Calculator'}
          </h2>

          <div className="max-w-2xl mx-auto">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
              {language === 'zh' ? '你每月需要生成多少张图片？' : 'How many images do you need per month?'}
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={monthlyUsage}
              onChange={(e) => setMonthlyUsage(Number(e.target.value))}
              className="w-full h-3 bg-dark-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-dark-500 mt-2 mb-6">
              <span>50张</span>
              <span className="font-bold text-primary-600">当前：{monthlyUsage}张</span>
              <span>500张</span>
            </div>

            <div className="bg-dark-50 dark:bg-dark-800 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-dark-700 dark:text-dark-300">按次购买（￥2/张）：</span>
                <span className="text-2xl font-bold text-dark-900 dark:text-dark-50">￥{monthlyUsage * 2}</span>
              </div>
              <div className="border-t border-dark-200 dark:border-dark-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-dark-700 dark:text-dark-300">订阅Basic（￥19.9/月）：</span>
                  <span className="text-2xl font-bold text-primary-600">￥19.9</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                    💡 你将节省：
                  </span>
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ￥{(monthlyUsage * 2 - 19.9).toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-dark-500 mt-2 text-right">
                  节省比例：{Math.round((1 - 19.9 / (monthlyUsage * 2)) * 100)}%
                </p>
              </div>

              <button
                onClick={() => handleSubscribe('basic')}
                className="w-full mt-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {language === 'zh' ? '立即订阅Basic省钱' : 'Subscribe to Basic & Save'}
              </button>
            </div>
          </div>
        </div>

        {/* 功能对比表格 */}
        <div className="card p-8 mb-16">
          <h2 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-8 text-center">
            {language === 'zh' ? '详细功能对比' : 'Detailed Feature Comparison'}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-dark-200 dark:border-dark-800">
                  <th className="text-left py-4 px-4 text-dark-700 dark:text-dark-300 font-semibold">
                    {language === 'zh' ? '功能特性' : 'Features'}
                  </th>
                  <th className="text-center py-4 px-4 text-dark-700 dark:text-dark-300">Free</th>
                  <th className="text-center py-4 px-4 bg-primary-50 dark:bg-primary-950/30">
                    <div className="font-bold text-primary-600">Basic ⭐</div>
                  </th>
                  <th className="text-center py-4 px-4 text-dark-700 dark:text-dark-300">Pro</th>
                  <th className="text-center py-4 px-4 text-dark-700 dark:text-dark-300">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: language === 'zh' ? '月度额度' : 'Monthly Quota', values: ['20张', '200张', '1000张', '无限'] },
                  { name: language === 'zh' ? 'AI模型' : 'AI Models', values: ['基础', '全部（含高清）', '全部+高级', '定制'] },
                  { name: language === 'zh' ? '证件照生成' : 'ID Photo', values: [true, true, true, true] },
                  { name: language === 'zh' ? '智能去背景' : 'Remove BG', values: [true, true, true, true] },
                  { name: language === 'zh' ? '图片放大' : 'Upscale', values: [false, true, true, true] },
                  { name: language === 'zh' ? '风格转换' : 'Style Transfer', values: [false, true, true, true] },
                  { name: language === 'zh' ? 'API访问' : 'API Access', values: [false, false, true, true] },
                  { name: language === 'zh' ? '团队协作' : 'Team Collaboration', values: [false, false, '3人', '无限'] },
                  { name: language === 'zh' ? '技术支持' : 'Support', values: ['社区', '邮件', '优先', '专属'] },
                  { name: language === 'zh' ? '历史记录' : 'History', values: ['7天', '30天', '无限', '无限'] },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-dark-100 dark:border-dark-900 hover:bg-dark-50 dark:hover:bg-dark-800/50">
                    <td className="py-4 px-4 text-dark-700 dark:text-dark-300 font-medium">{row.name}</td>
                    {row.values.map((value, colIdx) => (
                      <td
                        key={colIdx}
                        className={`text-center py-4 px-4 ${colIdx === 1 ? 'bg-primary-50 dark:bg-primary-950/20 font-semibold text-primary-700 dark:text-primary-400' : ''
                          }`}
                      >
                        {typeof value === 'boolean' ? (
                          value ? <Check className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-dark-300 mx-auto" />
                        ) : (
                          <span className={colIdx === 1 ? 'font-bold' : ''}>{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 用户评价区 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-8 text-center">
            {language === 'zh' ? '用户真实评价' : 'What Our Users Say'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Basic版性价比超高，200张够我用一整月了，比单独买便宜太多！强烈推荐！",
                author: "张先生",
                role: "自媒体运营",
                plan: "Basic用户"
              },
              {
                quote: "去背景工具太好用了，效果比PS还好，关键是速度快，5秒搞定。Basic版物超所值。",
                author: "李女士",
                role: "电商店主",
                plan: "Basic用户"
              },
              {
                quote: "试用了15张免费额度后果断订阅了Basic，工具多，额度够用，￥29很值！",
                author: "王同学",
                role: "设计专业学生",
                plan: "Basic用户"
              }
            ].map((review, idx) => (
              <div key={idx} className="card p-6 border-l-4 border-primary-500">
                <p className="text-dark-700 dark:text-dark-300 mb-4 italic">
                  "{review.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-600 font-bold">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-dark-900 dark:text-dark-50">{review.author}</p>
                    <p className="text-xs text-dark-500">{review.role} · {review.plan}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 信任标识 */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: <Shield />, text: language === 'zh' ? '数据加密传输' : 'Encrypted Data' },
            { icon: <Users />, text: language === 'zh' ? '10,000+用户信赖' : '10,000+ Users' },
            { icon: <Check />, text: language === 'zh' ? '30天退款保证' : '30-Day Refund' },
            { icon: <Zap />, text: language === 'zh' ? '即时开通' : 'Instant Activation' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-3">
                {item.icon}
              </div>
              <p className="text-sm text-dark-700 dark:text-dark-300">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Enterprise咨询CTA */}
        <div className="card p-8 bg-gradient-to-r from-dark-900 to-dark-800 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">
            {language === 'zh' ? '企业定制方案' : 'Enterprise Custom Solutions'}
          </h3>
          <p className="text-dark-300 mb-6">
            {language === 'zh'
              ? '大型团队？需要私有化部署？联系我们获取定制报价。'
              : 'Large team? Need private deployment? Contact us for custom pricing.'}
          </p>
          <button
            onClick={() => window.location.href = 'mailto:send@2art.fun?subject=企业版咨询'}
            className="px-8 py-3 bg-white text-dark-900 rounded-lg font-bold hover:bg-dark-100 transition-all"
          >
            {language === 'zh' ? '联系销售团队' : 'Contact Sales Team'}
          </button>
        </div>

        {/* FAQ */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6 text-center">
            {language === 'zh' ? '常见问题' : 'FAQ'}
          </h2>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: language === 'zh' ? '配额用完后怎么办？' : 'What if I run out of quota?',
                a: language === 'zh'
                  ? '可以随时升级到更高套餐，或购买额外配额包。配额包永久有效，不会过期。'
                  : 'Upgrade to a higher plan or purchase additional quota packages anytime. Packages never expire.'
              },
              {
                q: language === 'zh' ? '可以随时取消订阅吗？' : 'Can I cancel anytime?',
                a: language === 'zh'
                  ? '可以。随时取消，当月剩余配额仍然有效，到期后不再续费。无任何违约金。'
                  : 'Yes. Cancel anytime. Remaining quota stays valid until period end. No penalties.'
              },
              {
                q: language === 'zh' ? 'Basic和Pro的主要区别？' : 'Main difference between Basic and Pro?',
                a: language === 'zh'
                  ? 'Basic适合个人用户（200张/月），Pro适合专业设计师（1000张/月+API访问+团队协作）。90%用户选择Basic。'
                  : 'Basic for individuals (200/month), Pro for professionals (1000/month + API + Teams). 90% choose Basic.'
              },
              {
                q: language === 'zh' ? '支持哪些支付方式？' : 'Payment methods?',
                a: language === 'zh'
                  ? '支持微信支付、支付宝、信用卡（Visa/MasterCard）等。'
                  : 'WeChat Pay, Alipay, Credit Cards (Visa/MasterCard), and more.'
              }
            ].map((faq, idx) => (
              <details key={idx} className="group">
                <summary className="cursor-pointer font-semibold text-dark-900 dark:text-dark-50 py-3 list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-primary-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-dark-600 dark:text-dark-400 mt-2 pb-3 pl-4">
                  {faq.a}
                </p>
              </details>
            ))}
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

      {/* Basic卡片边框脉冲动画CSS */}
      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>
  );
}
