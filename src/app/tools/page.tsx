'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Camera, Scissors, Maximize2, Palette, Image as ImageIcon, Zap, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ToolsIndexPage() {
  const { language } = useLanguage();

  const tools = [
    {
      id: 'id-photo',
      name: { zh: '证件照生成', en: 'ID Photo Generator' },
      description: { zh: '5秒生成标准证件照，无需摄影棚', en: 'Generate ID photos in 5 seconds' },
      icon: <Camera className="w-8 h-8" />,
      quota: 1,
      minPlan: 'free',
      color: 'from-blue-500 to-cyan-600',
      available: true
    },
    {
      id: 'remove-bg',
      name: { zh: '智能去背景', en: 'Remove Background' },
      description: { zh: '1秒抠图，发丝级细节', en: '1-second cutout, hair-level details' },
      icon: <Scissors className="w-8 h-8" />,
      quota: 1,
      minPlan: 'free',
      color: 'from-green-500 to-emerald-600',
      available: true
    },
    {
      id: 'upscale',
      name: { zh: '图片放大', en: 'Image Upscaler' },
      description: { zh: '无损放大4倍，保持清晰', en: 'Upscale 4x without quality loss' },
      icon: <Maximize2 className="w-8 h-8" />,
      quota: 2,
      minPlan: 'basic',
      color: 'from-purple-500 to-pink-600',
      available: true
    },
    {
      id: 'style-transfer',
      name: { zh: '风格转换', en: 'Style Transfer' },
      description: { zh: '艺术风格一键转换', en: 'One-click artistic style conversion' },
      icon: <Palette className="w-8 h-8" />,
      quota: 2,
      minPlan: 'basic',
      color: 'from-orange-500 to-red-600',
      available: false  // 即将推出
    },
    {
      id: 'enhance',
      name: { zh: '画质增强', en: 'Quality Enhancement' },
      description: { zh: '智能优化画质和色彩', en: 'Smart quality & color optimization' },
      icon: <Sparkles className="w-8 h-8" />,
      quota: 2,
      minPlan: 'basic',
      color: 'from-yellow-500 to-amber-600',
      available: false
    },
    {
      id: 'colorize',
      name: { zh: '黑白上色', en: 'Colorization' },
      description: { zh: '黑白照片AI上色', en: 'AI colorization for B&W photos' },
      icon: <ImageIcon className="w-8 h-8" />,
      quota: 2,
      minPlan: 'basic',
      color: 'from-pink-500 to-rose-600',
      available: false
    }
  ];

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-7xl mx-auto">
        
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? '专业AI工具箱' : 'Professional AI Tools'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400">
            {language === 'zh' 
              ? '即来即走的专业工具，告别复杂的PS操作' 
              : 'Quick tools, no PS complexity'}
          </p>
        </div>

        {/* 人群快捷入口 */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { labelZh: '设计师', labelEn: 'Designers', href: '/tools/remove-bg' },
            { labelZh: '教师', labelEn: 'Teachers', href: '/tools/id-photo' },
            { labelZh: '电商商家', labelEn: 'E-commerce', href: '/tools/remove-bg' },
            { labelZh: '学生', labelEn: 'Students', href: '/tools/id-photo' },
          ].map((p) => (
            <Link key={p.href} href={p.href} className="px-4 py-2 bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 rounded-full text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-700 dark:hover:text-primary-400">
              {language === 'zh' ? p.labelZh : p.labelEn}
            </Link>
          ))}
        </div>

        {/* 工具网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`card p-6 relative group ${
                tool.available 
                  ? 'hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer' 
                  : 'opacity-75'
              }`}
            >
              {/* 即将推出标签 */}
              {!tool.available && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-dark-200 dark:bg-dark-700 text-dark-600 dark:text-dark-400 text-xs font-semibold rounded-full">
                  {language === 'zh' ? '即将推出' : 'Coming Soon'}
                </div>
              )}

              {/* 图标 */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-4 ${
                tool.available ? 'group-hover:scale-110 transition-transform' : ''
              }`}>
                {tool.icon}
              </div>

              {/* 工具名称 */}
              <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                {language === 'zh' ? tool.name.zh : tool.name.en}
              </h3>

              {/* 描述 */}
              <p className="text-dark-600 dark:text-dark-400 mb-4 text-sm">
                {language === 'zh' ? tool.description.zh : tool.description.en}
              </p>

              {/* 配额和权限标签 */}
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs rounded-full">
                  {language === 'zh' ? `消耗${tool.quota}张` : `${tool.quota} quota`}
                </span>
                {tool.minPlan === 'basic' && (
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {language === 'zh' ? 'Basic及以上' : 'Basic+'}
                  </span>
                )}
              </div>

              {/* 按钮 */}
              {tool.available ? (
                <Link
                  href={`/tools/${tool.id}`}
                  className="block w-full py-3 btn-primary text-center font-semibold"
                >
                  {language === 'zh' ? '开始使用' : 'Start Using'}
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-dark-200 dark:bg-dark-800 text-dark-500 rounded-lg font-semibold cursor-not-allowed"
                >
                  {language === 'zh' ? '敬请期待' : 'Coming Soon'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 升级引导 */}
        <div className="card p-8 bg-gradient-to-r from-primary-500 to-primary-700 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Zap className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-3">
            {language === 'zh' ? '解锁全部工具' : 'Unlock All Tools'}
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            {language === 'zh' 
              ? '升级到Basic版本，获得200张月度配额，全部8+工具随便用，仅需￥19.9/月！'
              : 'Upgrade to Basic: 200 monthly quota, all 8+ tools unlimited, only ￥19.9/month!'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-primary-600 rounded-lg font-bold hover:bg-dark-50 transition-all shadow-lg text-lg"
            >
              {language === 'zh' ? '查看定价（90%选择Basic）' : 'View Pricing (90% choose Basic)'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
