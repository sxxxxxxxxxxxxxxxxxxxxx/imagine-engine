'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Sparkles, 
  Wand2, 
  Boxes, 
  Code2,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = {
    zh: {
      hero: {
        badge: 'v3.0 技术版',
        title1: '专业 AI 图像',
        title2: '创作工作台',
        description: '面向开发者和技术创新者。多模型支持、API 访问和专业工具，适合认真的 AI 图像创作。',
        cta1: '开始使用',
        cta2: '查看文档'
      },
      features: [
        { title: 'AI Studio', description: '多模型支持的专业图片生成' },
        { title: 'Editor', description: '支持图层的高级编辑工具' },
        { title: 'Playground', description: '实验模型和参数调优', badge: '新功能' },
        { title: 'API 访问', description: '完整的开发者 API 文档', badge: 'Pro' },
      ],
      highlights: [
        { title: '多模型支持', description: '在 Gemini、DALL-E、Stable Diffusion 等之间自由切换' },
        { title: '开发者优先', description: '完整 API 访问、详细日志和调试工具' },
        { title: '批量处理', description: '同时生成最多 8 个变体' },
      ],
      pricing: {
        title: '简单透明的定价',
        free: {
          name: '免费版',
          price: '¥0',
          features: ['每天 10 次生成', '基础模型', '保存 20 张作品'],
          cta: '免费开始'
        },
        pro: {
          name: '专业版',
          price: '¥68',
          period: '/月',
          badge: '热门',
          features: ['每月 500 次生成', '所有模型', '无限存储', 'API 访问'],
          cta: '升级到专业版'
        },
        team: {
          name: '团队版',
          price: '¥198',
          period: '/用户',
          features: ['无限生成', '团队协作', '优先支持', '自定义品牌'],
          cta: '联系销售'
        }
      },
      footer: {
        product: '产品',
        resources: '资源',
        company: '公司',
        copyright: '专业 AI 创作平台'
      }
    },
    en: {
      hero: {
        badge: 'v3.0 Tech Edition',
        title1: 'Professional AI Image',
        title2: 'Creation Workspace',
        description: 'Built for developers and tech innovators. Multi-model support, API access, and advanced tools for serious AI image creation.',
        cta1: 'Get Started',
        cta2: 'Documentation'
      },
      features: [
        { title: 'AI Studio', description: 'Professional image generation with multi-model support' },
        { title: 'Editor', description: 'Advanced editing tools with layer support' },
        { title: 'Playground', description: 'Experiment with models and parameters', badge: 'New' },
        { title: 'API Access', description: 'Full API documentation for developers', badge: 'Pro' },
      ],
      highlights: [
        { title: 'Multi-Model Support', description: 'Switch between Gemini, DALL-E, Stable Diffusion and more' },
        { title: 'Developer-First', description: 'Complete API access, detailed logs, and debugging tools' },
        { title: 'Batch Processing', description: 'Generate up to 8 variations simultaneously' },
      ],
      pricing: {
        title: 'Simple, Transparent Pricing',
        free: {
          name: 'Free',
          price: '$0',
          features: ['10 generations/day', 'Basic models', '20 saved artworks'],
          cta: 'Start Free'
        },
        pro: {
          name: 'Pro',
          price: '$9.99',
          period: '/mo',
          badge: 'Popular',
          features: ['500 generations/month', 'All models', 'Unlimited storage', 'API access'],
          cta: 'Upgrade to Pro'
        },
        team: {
          name: 'Team',
          price: '$29.99',
          period: '/user',
          features: ['Unlimited generations', 'Team collaboration', 'Priority support', 'Custom branding'],
          cta: 'Contact Sales'
        }
      },
      footer: {
        product: 'Product',
        resources: 'Resources',
        company: 'Company',
        copyright: 'Professional AI Creation Platform'
      }
    }
  };

  const t = content[language];

  if (!mounted) {
    return null;
  }

  // Features 数据（不依赖翻译数组，避免索引错误）
  const features = [
    { 
      icon: Sparkles, 
      href: '/create',
      title: 'AI Studio',
      description: language === 'zh' ? '多模型支持的专业图片生成' : 'Professional image generation with multi-model support',
      badge: null
    },
    { 
      icon: Wand2, 
      href: '/edit',
      title: 'Editor',
      description: language === 'zh' ? '支持图层的高级编辑工具' : 'Advanced editing tools with layer support',
      badge: null
    },
    {
      icon: ImageIcon, 
      href: '/showcase',
      title: 'Showcase',
      description: language === 'zh' ? '110个精选案例，学习优秀提示词' : '110 curated cases to learn great prompts',
      badge: language === 'zh' ? '新功能' : 'New'
    },
    { 
      icon: Boxes, 
      href: '/playground',
      title: 'Playground',
      description: language === 'zh' ? '实验模型和参数调优' : 'Experiment with models and parameters',
      badge: language === 'zh' ? '开发中' : 'Beta'
    },
    { 
      icon: Code2, 
      href: '/docs',
      title: language === 'zh' ? '文档' : 'Docs',
      description: language === 'zh' ? '完整的开发者API文档' : 'Full API documentation for developers',
      badge: null
    },
  ];

  const highlights = [
    { 
      icon: Zap,
      title: language === 'zh' ? '多模型支持' : 'Multi-Model Support',
      description: language === 'zh' ? '在 Gemini、DALL-E、Stable Diffusion 等之间自由切换' : 'Switch between Gemini, DALL-E, Stable Diffusion and more'
    },
    { 
      icon: Shield,
      title: language === 'zh' ? '开发者优先' : 'Developer-First',
      description: language === 'zh' ? '完整 API 访问、详细日志和调试工具' : 'Complete API access, detailed logs, and debugging tools'
    },
    { 
      icon: CheckCircle2,
      title: language === 'zh' ? '批量处理' : 'Batch Processing',
      description: language === 'zh' ? '同时生成最多 8 个变体' : 'Generate up to 8 variations simultaneously'
    },
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="content-wrapper py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 mb-6">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {t.hero.badge}
              </span>
            </div>

          <h1 className="text-5xl md:text-6xl font-bold text-dark-900 dark:text-dark-50 mb-6">
            {t.hero.title1}
            <br />
            <span className="text-primary-400">{t.hero.title2}</span>
            </h1>

          <p className="text-xl text-dark-600 dark:text-dark-400 mb-8 max-w-2xl mx-auto">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create" className="btn-primary px-8 py-3 text-base">
              {t.hero.cta1}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/docs" className="btn-secondary px-8 py-3 text-base">
              {t.hero.cta2}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="content-wrapper py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="card-hover p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  {feature.badge && (
                    <span className="badge-primary">{feature.badge}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Highlights */}
      <section className="content-wrapper py-16">
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-8 text-center">
            {language === 'zh' ? '为什么选择创想引擎' : 'Why Choose Imagine Engine'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, idx) => {
              const Icon = highlight.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="inline-flex w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400">
                    {highlight.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="content-wrapper py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-8 text-center">
            {t.pricing.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="card p-6">
              <div className="text-sm font-medium text-dark-600 dark:text-dark-400 mb-2">
                {t.pricing.free.name}
              </div>
              <div className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-4">
                {t.pricing.free.price}
              </div>
              <ul className="space-y-3 mb-6">
                {t.pricing.free.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400">
                    <CheckCircle2 className="w-4 h-4 text-primary-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
              <Link href="/create" className="btn-secondary w-full">
                {t.pricing.free.cta}
              </Link>
            </div>
            
            {/* Pro */}
            <div className="card-elevated p-6 border-2 border-primary-400 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="badge-accent">{t.pricing.pro.badge}</span>
              </div>
              <div className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
                {t.pricing.pro.name}
              </div>
              <div className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-4">
                {t.pricing.pro.price}<span className="text-base font-normal text-dark-500">{t.pricing.pro.period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {t.pricing.pro.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400">
                    <CheckCircle2 className="w-4 h-4 text-primary-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/settings" className="btn-primary w-full">
                {t.pricing.pro.cta}
              </Link>
              </div>

            {/* Team */}
            <div className="card p-6">
              <div className="text-sm font-medium text-dark-600 dark:text-dark-400 mb-2">
                {t.pricing.team.name}
              </div>
              <div className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-4">
                {t.pricing.team.price}<span className="text-base font-normal text-dark-500">{t.pricing.team.period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {t.pricing.team.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400">
                    <CheckCircle2 className="w-4 h-4 text-primary-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/settings" className="btn-secondary w-full">
                {t.pricing.team.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

        {/* Footer */}
      <footer className="border-t border-dark-200 dark:border-dark-800 mt-20">
        <div className="content-wrapper py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-400" />
                <span className="font-bold text-dark-900 dark:text-dark-50">
                  {language === 'zh' ? '创想引擎' : 'Imagine Engine'}
                </span>
              </div>
              <p className="text-sm text-dark-600 dark:text-dark-400">
                {language === 'zh' 
                  ? '面向开发者的专业 AI 图像创作工作台。' 
                  : 'Professional AI image creation workspace for developers.'}
              </p>
              </div>
              
              <div>
              <h4 className="font-semibold text-dark-900 dark:text-dark-50 mb-4">
                {t.footer.product}
              </h4>
              <ul className="space-y-2 text-sm text-dark-600 dark:text-dark-400">
                <li><Link href="/create" className="hover:text-primary-400">AI Studio</Link></li>
                <li><Link href="/edit" className="hover:text-primary-400">Editor</Link></li>
                <li><Link href="/playground" className="hover:text-primary-400">Playground</Link></li>
                <li><Link href="/gallery" className="hover:text-primary-400">Gallery</Link></li>
                </ul>
              </div>
              
              <div>
              <h4 className="font-semibold text-dark-900 dark:text-dark-50 mb-4">
                {t.footer.resources}
              </h4>
              <ul className="space-y-2 text-sm text-dark-600 dark:text-dark-400">
                <li><Link href="/docs" className="hover:text-primary-400">{language === 'zh' ? '文档' : 'Documentation'}</Link></li>
                <li><Link href="/templates" className="hover:text-primary-400">Templates</Link></li>
                <li><Link href="/settings" className="hover:text-primary-400">API</Link></li>
                </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-dark-900 dark:text-dark-50 mb-4">
                {t.footer.company}
              </h4>
              <ul className="space-y-2 text-sm text-dark-600 dark:text-dark-400">
                <li><Link href="/settings" className="hover:text-primary-400">{language === 'zh' ? '设置' : 'Settings'}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-dark-200 dark:border-dark-800 text-center text-sm text-dark-500">
            © 2025 {language === 'zh' ? '创想引擎' : 'Imagine Engine'}. {t.footer.copyright}.
            </div>
          </div>
        </footer>
    </div>
  );
}
