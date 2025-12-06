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
  Image as ImageIcon,
  Mail
} from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeLayer, setActiveLayer] = useState<number>(2); // 0=背景1, 1=背景2, 2=前景
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 复制邮箱到剪贴板
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('send@2art.fun');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      // 如果复制失败，打开mailto
      window.location.href = 'mailto:send@2art.fun';
    }
  };

  // 点击图片切换到前景
  const handleImageClick = (layerIndex: number) => {
    if (layerIndex === activeLayer) {
      // 如果点击的是前景图，跳转到Showcase
      window.location.href = '/showcase';
    } else {
      // 如果点击的是背景图，将其移到前景
      setActiveLayer(layerIndex);
      setIsPaused(true); // 暂停轮播
      setTimeout(() => setIsPaused(false), 2000); // 2秒后恢复轮播
    }
  };

  // 精选案例图片（高质量）
  const showcaseImages = [
    'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case1/output0.jpg',
    'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case2/output.jpg',
    'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case4/output.jpg',
    'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case7/output.jpg',
    'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case10/output.jpg',
    'https://raw.githubusercontent.com/PicoTrex/Awesome-Nano-Banana-images/main/images/case15/output.jpg',
  ];

  useEffect(() => {
    // 轮播控制（hover时暂停）
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 3500); // 3.5秒切换，节奏更好

    return () => clearInterval(interval);
  }, [isPaused, showcaseImages.length]);

  const content = {
    zh: {
      hero: {
        badge: 'v3.0 技术版',
        freeBanner: '🎁 新用户专享：注册即送 20 张免费 AI 图片！',
        title1: '专业 AI 图像',
        title2: '创作工作台',
        description: '面向开发者和技术创新者。多模型支持、API 访问和专业工具，适合认真的 AI 图像创作。',
        cta1: '免费开始创作',
        cta2: '查看文档',
        ctaSubtext: '无需信用卡，注册即送20张'
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
        subtitle: '从免费开始，按需升级',
        free: {
          name: 'Free',
          price: '¥0',
          features: ['20 张/月', '基础功能', '社区支持'],
          cta: '免费开始'
        },
        pro: {
          name: 'Pro',
          price: '¥49.9',
          period: '/月',
          badge: '推荐',
          features: ['500 张/月', '所有模型', '无限存储', 'API 访问'],
          cta: '立即订阅'
        },
        team: {
          name: 'Team',
          price: '¥199',
          period: '/月',
          features: ['无限生成', '团队协作', '优先支持', '自定义品牌'],
          cta: '联系销售'
        }
      },
      footer: {
        product: '产品',
        resources: '资源',
        company: '公司',
        contact: '联系我们',
        email: 'send@2art.fun',
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
      {/* Hero Section - 简洁专业版 */}
      <section className="content-wrapper py-24 md:py-32 relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto relative z-10">
          {/* 左侧：文字内容 */}
          <div>
            {/* 标签 - 微妙设计 */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100/30 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-800/50 mb-8">
            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
            <span className="text-xs font-medium text-dark-600 dark:text-dark-400 uppercase tracking-wide">
              {language === 'zh' ? '专业 AI 图像创作平台' : 'Professional AI Image Creation Platform'}
            </span>
          </div>

          {/* 主标题 - 超大气 */}
          <h1 className="text-6xl md:text-8xl font-bold text-dark-900 dark:text-dark-50 mb-8 leading-tight tracking-tight">
            {language === 'zh' ? (
              <>
                AI 图像创作
                <br />
                从这里<span className="text-primary-500">开始</span>
              </>
            ) : (
              <>
                AI Image Creation
                <br />
                Starts <span className="text-primary-500">Here</span>
              </>
            )}
          </h1>

          {/* 副标题 - 更大更清晰 */}
          <p className="text-2xl md:text-3xl text-dark-600 dark:text-dark-400 mb-6 max-w-3xl leading-relaxed font-medium">
            {language === 'zh' 
              ? '多图融合、精确比例控制、AI 智能助手'
              : 'Multi-Image Fusion, Precise Ratio Control, AI Assistant'}
          </p>
          <p className="text-xl text-dark-500 dark:text-dark-500 mb-14 max-w-3xl">
            {language === 'zh' 
              ? '注册即送 20 张免费图片 · 无需信用卡'
              : 'Get 20 Free Images on Sign Up · No Credit Card Required'}
          </p>

          {/* CTA - 更大更突出 */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link href="/create" className="btn-primary px-12 py-5 text-xl font-semibold shadow-lg hover:shadow-xl">
              {language === 'zh' ? '免费开始创作' : 'Start Creating Free'}
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
            <Link href="/showcase" className="btn-outline px-12 py-5 text-xl font-semibold">
              {language === 'zh' ? '查看案例' : 'View Showcase'}
            </Link>
          </div>

            {/* 信任标识 - 更大更清晰 */}
            <div className="mt-12 flex flex-wrap items-center gap-8 text-base text-dark-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span className="font-medium">{language === 'zh' ? '无需信用卡' : 'No Credit Card'}</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span className="font-medium">{language === 'zh' ? '注册送 20 张' : 'Get 20 Free'}</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span className="font-medium">{language === 'zh' ? '110+ 案例参考' : '110+ Examples'}</span>
              </span>
            </div>
          </div>

          {/* 右侧：超丝滑动态案例图片展示 */}
          <div 
            className="hidden lg:block relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* 图片画廊 - 3D堆叠 + Ken Burns + 视差效果 */}
            <div className="relative h-[600px] w-full overflow-hidden pl-8">{/* 添加左侧padding增加安全距离 */}
              {/* 装饰光晕 - 动态变化 */}
              <div 
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] transition-opacity duration-[5000ms]"
                style={{
                  background: 'radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, transparent 70%)',
                  opacity: 0.3 + Math.sin(currentImageIndex * 0.5) * 0.1,
                }}
              />

              {/* 图片1 - 动态层级 */}
              <div 
                className={`absolute rounded-3xl overflow-hidden transition-all duration-[1000ms] ease-in-out cursor-pointer group ${
                  activeLayer === 0 
                    ? 'bottom-16 right-12 w-[400px] h-[400px] shadow-2xl z-30 border border-white/30 dark:border-dark-700/30' 
                    : activeLayer === 1
                    ? 'top-8 right-8 w-64 h-64 z-10'
                    : 'top-24 left-4 w-80 h-80 z-20'
                }`}
                style={{
                  transform: activeLayer === 0 
                    ? `rotate(0deg)` 
                    : activeLayer === 1
                    ? `rotate(${6 + Math.sin(currentImageIndex) * 2}deg) translateY(${Math.sin(currentImageIndex * 0.5) * 10}px)`
                    : `rotate(${-3 + Math.cos(currentImageIndex) * 2}deg) translateX(${Math.cos(currentImageIndex * 0.5) * 12}px) translateY(${Math.sin(currentImageIndex * 0.3) * 8}px)`
                }}
                onClick={() => handleImageClick(0)}
              >
                <div className="relative w-full h-full">
                  <img
                    key={`img1-${currentImageIndex}`}
                    src={showcaseImages[currentImageIndex]}
                    alt="AI Generated Example"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="400"
                    className="absolute inset-0 w-full h-full transition-all duration-[1000ms] ease-out group-hover:scale-105"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      opacity: activeLayer === 0 ? 0.6 : activeLayer === 1 ? 0.25 : 0.35,
                      filter: activeLayer === 0 ? 'blur(1px)' : activeLayer === 1 ? 'blur(8px)' : 'blur(5px)',
                    }}
                  />
                  {activeLayer === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </div>
              </div>

              {/* 图片2 - 动态层级 */}
              <div 
                className={`absolute rounded-3xl overflow-hidden transition-all duration-[1000ms] ease-in-out cursor-pointer group ${
                  activeLayer === 1 
                    ? 'bottom-16 right-12 w-[400px] h-[400px] shadow-2xl z-30 border border-white/30 dark:border-dark-700/30' 
                    : activeLayer === 2
                    ? 'top-8 right-8 w-64 h-64 z-10'
                    : 'top-24 left-4 w-80 h-80 z-20'
                }`}
                style={{
                  transform: activeLayer === 1 
                    ? `rotate(0deg)` 
                    : activeLayer === 2
                    ? `rotate(${6 + Math.sin(currentImageIndex) * 2}deg) translateY(${Math.sin(currentImageIndex * 0.5) * 10}px)`
                    : `rotate(${-3 + Math.cos(currentImageIndex) * 2}deg) translateX(${Math.cos(currentImageIndex * 0.5) * 12}px) translateY(${Math.sin(currentImageIndex * 0.3) * 8}px)`
                }}
                onClick={() => handleImageClick(1)}
              >
                <div className="relative w-full h-full">
                  <img
                    key={`img2-${(currentImageIndex + 1) % showcaseImages.length}`}
                    src={showcaseImages[(currentImageIndex + 1) % showcaseImages.length]}
                    alt="AI Generated Example"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="400"
                    className="absolute inset-0 w-full h-full transition-all duration-[1000ms] ease-out group-hover:scale-105"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      opacity: activeLayer === 1 ? 0.6 : activeLayer === 2 ? 0.25 : 0.35,
                      filter: activeLayer === 1 ? 'blur(1px)' : activeLayer === 2 ? 'blur(8px)' : 'blur(5px)',
                    }}
                  />
                  {activeLayer === 1 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </div>
              </div>

              {/* 图片3 - 动态层级 */}
              <div 
                className={`absolute rounded-3xl overflow-hidden transition-all duration-[1000ms] ease-in-out cursor-pointer group ${
                  activeLayer === 2 
                    ? 'bottom-16 right-12 w-[400px] h-[400px] shadow-2xl z-30 border border-white/30 dark:border-dark-700/30' 
                    : activeLayer === 0
                    ? 'top-8 right-8 w-64 h-64 z-10'
                    : 'top-24 left-4 w-80 h-80 z-20'
                }`}
                style={{
                  transform: activeLayer === 2 
                    ? `rotate(0deg)` 
                    : activeLayer === 0
                    ? `rotate(${6 + Math.sin(currentImageIndex) * 2}deg) translateY(${Math.sin(currentImageIndex * 0.5) * 10}px)`
                    : `rotate(${-3 + Math.cos(currentImageIndex) * 2}deg) translateX(${Math.cos(currentImageIndex * 0.5) * 12}px) translateY(${Math.sin(currentImageIndex * 0.3) * 8}px)`
                }}
                onClick={() => handleImageClick(2)}
              >
                <div className="relative w-full h-full">
                  <img
                    key={`img3-${(currentImageIndex + 2) % showcaseImages.length}`}
                    src={showcaseImages[(currentImageIndex + 2) % showcaseImages.length]}
                    alt="AI Generated Example"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="400"
                    className="absolute inset-0 w-full h-full transition-all duration-[1000ms] ease-out group-hover:scale-105"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      opacity: activeLayer === 2 ? 0.6 : activeLayer === 0 ? 0.25 : 0.35,
                      filter: activeLayer === 2 ? 'blur(1px)' : activeLayer === 0 ? 'blur(8px)' : 'blur(5px)',
                    }}
                  />
                  {activeLayer === 2 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </div>
              </div>

              {/* 动态渐变遮罩 */}
              <div 
                className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 dark:via-dark-950/5 to-white dark:to-dark-950 pointer-events-none transition-all duration-[2000ms]"
                style={{
                  opacity: 0.8 + Math.sin(currentImageIndex * 0.4) * 0.2
                }}
              ></div>

              {/* 增强版指示器 */}
              <div className="absolute bottom-6 right-6 backdrop-blur-md bg-white/20 dark:bg-dark-900/30 px-3 py-2 rounded-full shadow-lg border border-white/20 dark:border-dark-800/20">
                <div className="flex items-center gap-2">
                  {showcaseImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`rounded-full transition-all duration-500 hover:scale-125 ${
                        idx === currentImageIndex 
                          ? 'bg-primary-500 w-10 h-2.5 shadow-lg shadow-primary-500/50' 
                          : 'bg-dark-300 dark:bg-dark-600 w-2 h-2 hover:bg-primary-400'
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
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

      {/* Pricing Preview - 简洁专业版 */}
      <section className="content-wrapper py-20 bg-dark-50 dark:bg-dark-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-400 mb-6">
              {t.pricing.subtitle}
            </p>
            {/* 推荐基础版提示 */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                <span className="text-lg text-primary-700 dark:text-primary-400 font-semibold">
                  {language === 'zh' ? '💡 90%的用户选择基础版 - 性价比最高' : '💡 90% choose Basic - Best Value'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Free */}
            <div className="card p-8 bg-white dark:bg-dark-900 border-2 border-dark-200 dark:border-dark-800 rounded-2xl hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                {t.pricing.free.name}
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-dark-900 dark:text-dark-50">
                  {t.pricing.free.price}
                </span>
              </div>
              <ul className="space-y-3 mb-8 text-sm flex-grow">
                {t.pricing.free.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-dark-700 dark:text-dark-300">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/create" className="block w-full btn-outline text-center mt-auto">
                {t.pricing.free.cta}
              </Link>
            </div>
            
            {/* Basic - 基础版（主推） */}
            <div className="card p-8 border-4 border-primary-500 shadow-xl relative bg-gradient-to-br from-white to-primary-50/20 dark:from-dark-900 dark:to-primary-900/10 rounded-2xl flex flex-col h-full hover:shadow-2xl hover:transform hover:-translate-y-2 hover:border-primary-600 transition-all duration-300">
              {/* 最受欢迎徽章 */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-full shadow-md ring-1 ring-white/20 dark:ring-dark-900/30">
                {language === 'zh' ? '最受欢迎' : 'Most Popular'}
              </div>
              <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2 mt-2">
                {language === 'zh' ? '基础版' : 'Basic'}
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-dark-900 dark:text-dark-50">
                  ¥19.9
                </span>
                <span className="text-dark-500 text-base">/月</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm flex-grow">
                <li className="flex items-center gap-2 text-dark-700 dark:text-dark-300">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  {language === 'zh' ? '200 张/月' : '200 images/month'}
                </li>
                <li className="flex items-center gap-2 text-dark-700 dark:text-dark-300">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  {language === 'zh' ? '所有基础功能' : 'All basic features'}
                </li>
                <li className="flex items-center gap-2 text-dark-700 dark:text-dark-300">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  {language === 'zh' ? '邮件支持' : 'Email support'}
                </li>
                <li className="flex items-center gap-2 text-dark-700 dark:text-dark-300">
                  <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  {language === 'zh' ? '社区论坛' : 'Community forum'}
                </li>
              </ul>
              <Link href="/pricing" className="block w-full btn-primary text-center mt-auto">
                {language === 'zh' ? '立即订阅' : 'Subscribe Now'}
              </Link>
            </div>

            {/* Pro */}
            <div className="card p-8 bg-white dark:bg-dark-900 border-2 border-dark-200 dark:border-dark-800 rounded-2xl hover:shadow-xl hover:transform hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                {t.pricing.pro.name}
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-dark-900 dark:text-dark-50">
                  {t.pricing.pro.price}
                </span>
                <span className="text-dark-500 text-base">{t.pricing.pro.period}</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm flex-grow">
                {t.pricing.pro.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-dark-700 dark:text-dark-300">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block w-full btn-outline text-center mt-auto">
                {t.pricing.pro.cta}
              </Link>
            </div>
          </div>

          {/* 查看完整定价链接 */}
          <div className="text-center mt-10">
            <Link href="/pricing" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              {language === 'zh' ? '查看完整定价和企业版方案' : 'View Full Pricing & Enterprise Plan'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

        {/* Footer */}
      <footer className="relative mt-32 bg-gradient-to-b from-dark-50 to-white dark:from-dark-950 dark:to-dark-900 overflow-hidden">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-600 rounded-full blur-3xl" />
        </div>

        <div className="content-wrapper relative z-10">
          {/* 主内容区 */}
          <div className="py-20 border-b border-dark-200/50 dark:border-dark-800/50">
            <div className="grid md:grid-cols-5 gap-12">
              {/* 品牌区 - 更宽 */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-dark-900 dark:text-dark-50">
                    {language === 'zh' ? '创想引擎' : 'Imagine Engine'}
                  </span>
                </div>
                <p className="text-base text-dark-600 dark:text-dark-400 mb-6 leading-relaxed">
                  {language === 'zh' 
                    ? '专业的 AI 图像创作平台，为开发者和创意工作者提供强大的工具和灵活的 API。' 
                    : 'Professional AI image creation platform with powerful tools and flexible APIs for developers and creators.'}
                </p>
                {/* 社交媒体图标 */}
                <div className="flex items-center gap-4">
                  <a href="#" className="w-9 h-9 rounded-full bg-dark-100 dark:bg-dark-800 flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:scale-110 transition-all duration-200">
                    <svg className="w-4 h-4 text-dark-600 dark:text-dark-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-dark-100 dark:bg-dark-800 flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:scale-110 transition-all duration-200">
                    <svg className="w-4 h-4 text-dark-600 dark:text-dark-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-dark-100 dark:bg-dark-800 flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:scale-110 transition-all duration-200">
                    <svg className="w-4 h-4 text-dark-600 dark:text-dark-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L7.773 13.85l-2.897-.906c-.63-.196-.642-.63.135-.93l11.316-4.36c.527-.195.984.126.813.927z"/></svg>
                  </a>
                </div>
              </div>
              
              {/* 产品 */}
              <div>
                <h4 className="text-xs font-bold text-dark-900 dark:text-dark-50 mb-4 uppercase tracking-wider">
                  {t.footer.product}
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/create" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                      <span>AI Studio</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/edit" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                      <span>Editor</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/playground" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                      <span>Playground</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                      <span>Gallery</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* 资源 */}
              <div>
                <h4 className="text-xs font-bold text-dark-900 dark:text-dark-50 mb-4 uppercase tracking-wider">
                  {t.footer.resources}
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/docs" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                      <span>{language === 'zh' ? '文档' : 'Documentation'}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/templates" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                      <span>Templates</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/showcase" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                      <span>Showcase</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                      <span>{language === 'zh' ? '定价' : 'Pricing'}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                </ul>
              </div>
            
              {/* 公司 */}
              <div>
                <h4 className="text-xs font-bold text-dark-900 dark:text-dark-50 mb-4 uppercase tracking-wider">
                  {t.footer.company}
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/settings" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                      <span>{language === 'zh' ? '设置' : 'Settings'}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" className="text-dark-600 dark:text-dark-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                      <span>{language === 'zh' ? '帮助中心' : 'Help Center'}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 底部栏 */}
          <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* 版权信息 */}
            <div className="text-sm text-dark-500 dark:text-dark-500">
              © 2025 {language === 'zh' ? '创想引擎' : 'Imagine Engine'}. {t.footer.copyright}.
            </div>
            
            {/* 联系邮箱 - 卡片式 */}
            <button 
              onClick={copyEmail}
              className="group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-dark-100/50 dark:bg-dark-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-dark-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300"
            >
              <Mail className="w-4 h-4 text-dark-600 dark:text-dark-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              <span className="text-sm font-medium text-dark-700 dark:text-dark-300 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                send@2art.fun
              </span>
              {emailCopied && (
                <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full animate-fade-in">
                  {language === 'zh' ? '✓ 已复制' : '✓ Copied'}
                </span>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
