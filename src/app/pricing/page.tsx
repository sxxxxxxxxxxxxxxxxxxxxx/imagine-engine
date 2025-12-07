/**
 * 定价页面 - 主推Basic版本策略
 * 优化转化率，降低付费门槛
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRICING_PLANS, calculateSavings } from '@/lib/pricing-plans';
import { Check, Zap, Crown, Building2, Loader2, TrendingDown, Users, Shield, X, ArrowRight } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import AuthModal from '@/components/AuthModal';
import SpotlightCard from '@/components/SpotlightCard';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import Link from 'next/link';
import { toastManager } from '@/components/Toast';

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
      toastManager.error(
        error.message || (language === 'zh' ? '订阅失败，请稍后重试' : 'Subscription failed, please try again'),
        { duration: 5000 }
      );
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
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4 tracking-tight">
            {language === 'zh' ? '选择适合你的方案' : 'Choose Your Plan'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 mb-2 tracking-normal">
            {language === 'zh'
              ? '大多数用户选择Basic版，性价比最高'
              : 'Most users choose Basic for best value'}
          </p>
          <p className="text-base text-dark-500 tracking-normal">
            {language === 'zh'
              ? '所有方案均可随时升级或降级，无需担心'
              : 'All plans can be upgraded or downgraded anytime'}
          </p>
        </div>

        {/* 定价卡片 - 统一尺寸 */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 items-stretch">
          {PRICING_PLANS.filter(p => ['free', 'basic', 'pro'].includes(p.id)).map((plan) => (
            <div
              key={plan.id}
              className="relative flex"
            >
              {/* 徽章 - 移到外面避免被 SpotlightCard 的 overflow-hidden 裁剪 */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-6 py-2 bg-primary-600 text-white text-sm font-semibold rounded-full shadow-md ring-1 ring-white/20 dark:ring-dark-900/30">
                  {language === 'zh' ? plan.badge.zh : plan.badge.en}
                </div>
              )}
              {plan.highlight ? (
                <SpotlightCard
                  spotlightColor="rgba(20, 184, 166, 0.15)"
                  className="rounded-2xl border-2 border-primary-500 shadow-xl bg-gradient-to-br from-white to-primary-50/20 dark:from-dark-900 dark:to-primary-900/10 flex flex-col h-full w-full hover:shadow-2xl hover:transform hover:-translate-y-1 hover:border-primary-600 transition-all duration-300"
                >
                  <div className="p-6 flex flex-col h-full relative">

                    {/* 套餐名称和图标 */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${plan.highlight ? 'text-primary-500' : 'text-dark-400'}`}>
                        {planIcons[plan.id]}
                      </div>
                      <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 tracking-tight">
                        {language === 'zh' ? plan.name.zh : plan.name.en}
                      </h3>
                    </div>

                    {/* 价格区域 */}
                    <div className="mb-4">
                      {plan.originalPrice && (
                        <div className="text-xs text-dark-400 line-through mb-1">
                          {language === 'zh' ? plan.originalPrice.zh : plan.originalPrice.en}
                        </div>
                      )}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-dark-900 dark:text-dark-50">
                          {language === 'zh' ? plan.price.zh : plan.price.en}
                        </span>
                        <span className="text-sm text-dark-600 dark:text-dark-400">
                          {language === 'zh' ? plan.period.zh : plan.period.en}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-dark-500">{plan.quota}</span>
                        {plan.savings && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                            💰 {language === 'zh' ? plan.savings.zh : plan.savings.en}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 功能列表 - 精简显示，最多5个 */}
                    <ul className="space-y-2 mb-6 flex-grow">
                      {plan.features.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary-500" />
                          <span className="text-dark-700 dark:text-dark-300 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 5 && (
                        <li className="text-xs text-dark-500 pl-6">
                          {language === 'zh' ? `+${plan.features.length - 5} 更多功能` : `+${plan.features.length - 5} more`}
                        </li>
                      )}
                    </ul>

                    {/* CTA按钮 */}
                    {plan.id === 'free' ? (
                      <Link
                        href="/create"
                        className="block w-full btn-primary text-center py-2.5 text-sm font-semibold mt-auto group relative overflow-hidden hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <span className="relative z-10 flex items-center justify-center tracking-tight">
                          {language === 'zh' ? plan.cta.zh : plan.cta.en}
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                        </span>
                        {/* 按钮光晕 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={loading === plan.id}
                        className="w-full btn-primary text-center py-2.5 text-sm font-semibold mt-auto group relative overflow-hidden hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10 flex items-center justify-center tracking-tight">
                          {loading === plan.id && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                          {language === 'zh' ? plan.cta.zh : plan.cta.en}
                          {!loading && <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />}
                        </span>
                        {/* 按钮光晕 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
                      </button>
                    )}
                  </div>
                </SpotlightCard>
              ) : (
                <SpotlightCard className="rounded-2xl border-2 border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 hover:shadow-xl hover:transform hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 w-full">
                  <div className="p-6 flex flex-col h-full relative">
                    {/* 套餐名称和图标 */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${plan.highlight ? 'text-primary-500' : 'text-dark-400'}`}>
                        {planIcons[plan.id]}
                      </div>
                      <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 tracking-tight">
                        {language === 'zh' ? plan.name.zh : plan.name.en}
                      </h3>
                    </div>

                    {/* 价格区域 */}
                    <div className="mb-4">
                      {plan.originalPrice && (
                        <div className="text-xs text-dark-400 line-through mb-1">
                          {language === 'zh' ? plan.originalPrice.zh : plan.originalPrice.en}
                        </div>
                      )}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-dark-900 dark:text-dark-50">
                          {language === 'zh' ? plan.price.zh : plan.price.en}
                        </span>
                        <span className="text-sm text-dark-600 dark:text-dark-400">
                          {language === 'zh' ? plan.period.zh : plan.period.en}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-dark-500">{plan.quota}</span>
                        {plan.savings && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                            💰 {language === 'zh' ? plan.savings.zh : plan.savings.en}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 功能列表 - 精简显示，最多5个 */}
                    <ul className="space-y-2 mb-6 flex-grow">
                      {plan.features.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary-500" />
                          <span className="text-dark-700 dark:text-dark-300 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 5 && (
                        <li className="text-xs text-dark-500 pl-6">
                          {language === 'zh' ? `+${plan.features.length - 5} 更多功能` : `+${plan.features.length - 5} more`}
                        </li>
                      )}
                    </ul>

                    {/* CTA按钮 */}
                    {plan.id === 'free' ? (
                      <Link
                        href="/create"
                        className="block w-full btn-primary text-center mt-auto group relative overflow-hidden hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300"
                      >
                        <span className="relative z-10 flex items-center justify-center tracking-tight">
                          {language === 'zh' ? plan.cta.zh : plan.cta.en}
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </span>
                        {/* 按钮光晕 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={loading === plan.id}
                        className="w-full btn-primary text-center mt-auto group relative overflow-hidden hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10 flex items-center justify-center tracking-tight">
                          {loading === plan.id && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          {language === 'zh' ? plan.cta.zh : plan.cta.en}
                          {!loading && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
                        </span>
                        {/* 按钮光晕 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
                      </button>
                    )}
                  </div>
                </SpotlightCard>
              )}
            </div>
          ))}
        </div>

        {/* Basic推荐说明 */}
        <SpotlightCard className="text-center mb-12 p-6 bg-primary-100 dark:bg-primary-900/40 rounded-xl border-2 border-primary-300 dark:border-primary-700">
          <p className="text-lg font-bold text-primary-900 dark:text-primary-100 mb-2 tracking-tight">
            💡 {language === 'zh' ? '不确定选哪个？' : 'Not sure which to choose?'}
          </p>
          <p className="text-base text-primary-800 dark:text-primary-200 leading-relaxed font-medium">
            {language === 'zh'
              ? '90%的用户选择Basic版本 - 性价比最高，功能完整，适合绝大多数使用场景'
              : '90% of users choose Basic - best value, full features, perfect for most use cases'}
          </p>
        </SpotlightCard>

        {/* 成本对比计算器 */}
        <SpotlightCard className="p-8 mb-16 border-2 border-primary-200 dark:border-primary-800">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6 text-center flex items-center justify-center gap-2 tracking-tight">
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
                className="w-full mt-4 py-3 btn-primary group relative overflow-hidden hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center tracking-tight">
                  {language === 'zh' ? '立即订阅Basic省钱' : 'Subscribe to Basic & Save'}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
                {/* 按钮光晕 */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
              </button>
            </div>
          </div>
        </SpotlightCard>

        {/* 功能对比表格 */}
        <SpotlightCard className="p-8 mb-16">
          <h2 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-8 text-center tracking-tight">
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
        </SpotlightCard>

        {/* 用户评价区 - 滚动轮播 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-8 text-center tracking-tight">
            {language === 'zh' ? '用户真实评价' : 'What Our Users Say'}
          </h2>
          <TestimonialCarousel
            testimonials={[
              {
                quote: "之前一直用PS处理图片，太耗时了。用了Imagine Engine的Basic版，去背景、证件照生成这些功能真的太好用了，5秒就能搞定，效率提升了好几倍。200张额度对我来说完全够用，性价比真的很高。",
                author: "张明",
                role: "自媒体运营",
                plan: "Basic用户",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming&backgroundColor=b6e3ff,c0aede,d1d4f9,ffd5dc,ffdfbf`,
                rating: 5,
                date: language === 'zh' ? '2周前' : '2 weeks ago'
              },
              {
                quote: "我是做电商的，每天需要处理大量产品图。Imagine Engine的去背景功能比PS还好用，发丝细节都能保留得很好。关键是速度快，批量处理也不卡顿。Basic版200张额度，我一个月用不完，很划算。",
                author: "李雅",
                role: "电商店主",
                plan: "Basic用户",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=liya&backgroundColor=b6e3ff,c0aede,d1d4f9,ffd5dc,ffdfbf`,
                rating: 5,
                date: language === 'zh' ? '1个月前' : '1 month ago'
              },
              {
                quote: "作为设计专业的学生，经常需要做作业和项目。试用了免费版后，发现工具真的很实用，特别是科研绘图功能，能快速生成符合学术规范的配图。订阅Basic版后，200张额度够我用一个学期了，比买素材网站会员还便宜。",
                author: "王浩",
                role: "设计专业学生",
                plan: "Basic用户",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=wanghao&backgroundColor=b6e3ff,c0aede,d1d4f9,ffd5dc,ffdfbf`,
                rating: 5,
                date: language === 'zh' ? '3周前' : '3 weeks ago'
              },
              {
                quote: "写论文时经常需要配图，以前都是手绘或者找素材，很麻烦。用了Imagine Engine的科研绘图功能，输入描述就能生成专业的学术配图，大大节省了时间。Basic版的价格对学生很友好，推荐给需要的同学。",
                author: "刘教授",
                role: "科研工作者",
                plan: "Basic用户",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=liujiaoshou&backgroundColor=b6e3ff,c0aede,d1d4f9,ffd5dc,ffdfbf`,
                rating: 5,
                date: language === 'zh' ? '1个月前' : '1 month ago'
              },
              {
                quote: "公司需要批量处理员工证件照，以前都是外包给照相馆，成本高还慢。现在用Imagine Engine，HR部门自己就能搞定，证件照生成功能很智能，自动裁剪和背景替换都很准确。Basic版完全满足我们小公司的需求。",
                author: "陈静",
                role: "HR专员",
                plan: "Basic用户",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=chenjing&backgroundColor=b6e3ff,c0aede,d1d4f9,ffd5dc,ffdfbf`,
                rating: 5,
                date: language === 'zh' ? '2周前' : '2 weeks ago'
              },
              {
                quote: "我是做短视频的，经常需要处理封面图。Imagine Engine的风格转换和画质增强功能太实用了，能让普通的照片瞬间变得有质感。Basic版200张额度，我一个月大概用150张左右，完全够用，性价比很高。",
                author: "赵磊",
                role: "短视频创作者",
                plan: "Basic用户",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=zhaolei&backgroundColor=b6e3ff,c0aede,d1d4f9,ffd5dc,ffdfbf`,
                rating: 5,
                date: language === 'zh' ? '1周前' : '1 week ago'
              }
            ]}
            language={language}
          />
        </div>

        {/* 信任标识 */}
        <SpotlightCard className="p-8 mb-16">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Shield />, text: language === 'zh' ? '数据加密传输' : 'Encrypted Data' },
              { icon: <Users />, text: language === 'zh' ? '10,000+用户信赖' : '10,000+ Users' },
              { icon: <Check />, text: language === 'zh' ? '30天退款保证' : '30-Day Refund' },
              { icon: <Zap />, text: language === 'zh' ? '即时开通' : 'Instant Activation' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-3 transition-transform hover:scale-110 duration-300">
                  {item.icon}
                </div>
                <p className="text-sm text-dark-700 dark:text-dark-300 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Enterprise咨询CTA */}
        <SpotlightCard className="p-8 bg-gradient-to-br from-dark-900 to-dark-800 text-white text-center">
          <h3 className="text-2xl font-bold mb-3 tracking-tight">
            {language === 'zh' ? '企业定制方案' : 'Enterprise Custom Solutions'}
          </h3>
          <p className="text-dark-300 mb-6 leading-relaxed">
            {language === 'zh'
              ? '大型团队？需要私有化部署？联系我们获取定制报价。'
              : 'Large team? Need private deployment? Contact us for custom pricing.'}
          </p>
          <button
            onClick={() => window.location.href = 'mailto:feedback@2art.fun?subject=企业版咨询'}
            className="px-8 py-3 bg-white text-dark-900 rounded-lg font-bold hover:bg-dark-100 transition-all hover:scale-105 duration-300 shadow-lg hover:shadow-xl"
          >
            {language === 'zh' ? '联系销售团队' : 'Contact Sales Team'}
          </button>
        </SpotlightCard>

        {/* FAQ */}
        <SpotlightCard className="p-8">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6 text-center tracking-tight">
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
        </SpotlightCard>

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
