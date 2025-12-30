'use client';

import Link from 'next/link';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SpotlightCard from '@/components/SpotlightCard';
import GridBackground from '@/components/GridBackground';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import { showcaseCases } from '@/data/showcaseCases';
import { gsap } from 'gsap';
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
  Mail,
  TrendingUp,
  FileText,
  Shapes,
  GitBranch,
  Microscope,
  Camera,
  Scissors,
  Maximize2,
  Palette,
  Droplet,
  Star,
  Users,
  Award,
  Rocket
} from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeLayer, setActiveLayer] = useState<number>(2); // 0=背景1, 1=背景2, 2=前景
  const [emailCopied, setEmailCopied] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);
  
  // GSAP 动画引用
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP 动画初始化
  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      // 创建时间线
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 标签动画
      if (badgeRef.current) {
        gsap.set(badgeRef.current, { opacity: 0, y: -20 });
        tl.to(badgeRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6
        });
      }

      // 标题动画 - 分块显示效果（按行和关键词）
      if (titleRef.current) {
        const titleText = titleRef.current;
        const originalHTML = titleText.innerHTML;
        
        // 将标题内容按行和关键词分割
        const lines = originalHTML.split('<br />').map(line => line.trim()).filter(line => line);
        
        if (lines.length > 0) {
          // 为每行创建包装并分割成词
          const processedLines: string[] = [];
          
          lines.forEach((line, lineIndex) => {
            // 提取文本内容（保留 HTML 标签）
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = line;
            const textNodes: string[] = [];
            
            const extractText = (node: Node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || '';
                // 按空格和中文分词
                const words = text.split(/(\s+)/).filter(w => w);
                words.forEach(word => {
                  if (word.trim()) {
                    textNodes.push(word.trim());
                  }
                });
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement;
                if (el.tagName === 'SPAN' && el.classList.contains('text-primary-500')) {
                  // 保留带样式的 span
                  textNodes.push(el.outerHTML);
                } else {
                  Array.from(node.childNodes).forEach(extractText);
                }
              }
            };
            
            Array.from(tempDiv.childNodes).forEach(extractText);
            
            const lineHTML = textNodes.map((word, wordIndex) => {
              if (word.startsWith('<span')) {
                // 已经是 HTML，包装它
                return `<span class="hero-word inline-block" style="opacity: 0; transform: translateY(40px) rotateX(-20deg);">${word}</span>`;
              }
              return `<span class="hero-word inline-block" style="opacity: 0; transform: translateY(40px) rotateX(-20deg);">${word}</span>`;
            }).join(' ');
            
            processedLines.push(lineHTML);
          });
          
          // 重新构建 HTML
          titleText.innerHTML = processedLines.map((line, i) => 
            i > 0 ? `<br />${line}` : line
          ).join('');
          
          // 动画所有词
          const wordSpans = titleText.querySelectorAll('.hero-word');
          if (wordSpans.length > 0) {
            tl.to(wordSpans, {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 0.6,
              stagger: {
                amount: 1.2,
                from: 'start'
              },
              ease: 'power2.out'
            }, '-=0.2');
          } else {
            // 回退：直接动画整个标题
            gsap.set(titleText, { opacity: 0, y: 50, scale: 0.95 });
            tl.to(titleText, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power3.out'
            }, '-=0.2');
          }
        } else {
          // 简单回退：直接动画整个标题
          gsap.set(titleText, { opacity: 0, y: 50, scale: 0.95 });
          tl.to(titleText, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out'
          }, '-=0.2');
        }
      }

      // 副标题动画 - 淡入 + 向上滑动
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { opacity: 0, y: 30 });
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out'
        }, '-=0.5');
      }

      // 描述文字动画 - 淡入 + 向上滑动
      if (descriptionRef.current) {
        gsap.set(descriptionRef.current, { opacity: 0, y: 30 });
        tl.to(descriptionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out'
        }, '-=0.7');
      }

      // CTA 按钮动画 - 弹性效果
      if (ctaRef.current) {
        const buttons = Array.from(ctaRef.current.children) as HTMLElement[];
        gsap.set(buttons, { opacity: 0, y: 30, scale: 0.9 });
        tl.to(buttons, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'back.out(1.4)'
        }, '-=0.5');
      }
    });

    return () => ctx.revert();
  }, [mounted, language]);

  // 复制邮箱到剪贴板
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('feedback@2art.fun');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      // 如果复制失败，打开mailto
      window.location.href = 'mailto:feedback@2art.fun';
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

  // 从所有案例中提取图片（优先使用 outputImage，如果没有则使用 inputImages 的第一张）
  const showcaseImages = useMemo(() => {
    const images: string[] = [];
    showcaseCases.forEach(caseItem => {
      // 优先使用输出图片
      if (caseItem.outputImage) {
        images.push(caseItem.outputImage);
      } else if (caseItem.inputImages && caseItem.inputImages.length > 0) {
        // 如果没有输出图片，使用第一张输入图片
        images.push(caseItem.inputImages[0]);
      }
    });
    // 去重（避免重复图片）
    return Array.from(new Set(images));
  }, []);

  useEffect(() => {
    // 轮播控制（hover时暂停）
    if (isPaused || showcaseImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 3000); // 3秒切换一张，展示更多案例

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
        email: 'feedback@2art.fun',
        emailHint: '专门用于收集反馈意见',
        emailCopyHint: '点击复制邮箱',
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
        subtitle: 'Start free, upgrade as needed',
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
        email: 'feedback@2art.fun',
        emailHint: 'For feedback and suggestions',
        emailCopyHint: 'Click to copy email',
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
      badge: language === 'zh' ? '已更新' : 'Updated'
    },
    {
      icon: ImageIcon, 
      href: '/showcase',
      title: 'Showcase',
      description: language === 'zh' ? '740+精选案例学习优秀提示词' : '740+ curated cases to learn great prompts',
      badge: language === 'zh' ? '已更新' : 'Updated'
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
      description: language === 'zh' ? '支持 Gemini 3.0、2.5 系列，智能配额管理，4K模型4倍配额' : 'Support Gemini 3.0, 2.5 series, smart quota management, 4K models with 4x quota'
    },
    { 
      icon: Rocket,
      title: language === 'zh' ? '10+专业工具' : '10+ Professional Tools',
      description: language === 'zh' ? '证件照、去背景、科研绘图、小红书生成等，即来即走' : 'ID photo, background removal, scientific drawing, content generation, ready to use'
    },
    { 
      icon: ImageIcon,
      title: language === 'zh' ? '740+精选案例' : '740+ Curated Cases',
      description: language === 'zh' ? '包含630个GPT-4o提示词案例，学习优秀提示词技巧' : 'Including 630 GPT-4o prompt cases, learn excellent prompt techniques'
    },
    { 
      icon: Shield,
      title: language === 'zh' ? '智能配额系统' : 'Smart Quota System',
      description: language === 'zh' ? '注册送20张，Gemini 3.0模型2倍配额，4K模型4倍配额' : '20 free on signup, Gemini 3.0 models 2x quota, 4K models 4x quota'
    },
    { 
      icon: CheckCircle2,
      title: language === 'zh' ? '批量处理' : 'Batch Processing',
      description: language === 'zh' ? '支持多图融合（2-6张）、批量生成、并发处理' : 'Multi-image fusion (2-6 images), batch generation, concurrent processing'
    },
    { 
      icon: Code2,
      title: language === 'zh' ? '完整API支持' : 'Full API Support',
      description: language === 'zh' ? '开发者API、详细文档、Webhook集成' : 'Developer API, detailed docs, webhook integration'
    },
  ];

  return (
    <div className="page-container">
      {/* Hero Section - 简洁专业版 */}
      <section className="content-wrapper py-24 md:py-32 relative overflow-hidden">
        {/* 网格背景 */}
        <GridBackground opacity={0.06} gridSize={50} />
        
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto relative z-10">
          {/* 左侧：文字内容 */}
          <div>
            {/* 标签 - 微妙设计 */}
            <div ref={badgeRef} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary-100/30 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-800/50 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse-slow" />
            <span className="text-sm font-semibold text-dark-700 dark:text-dark-300 uppercase tracking-wider">
              {language === 'zh' ? '专业 AI 图像创作平台' : 'Professional AI Image Creation Platform'}
            </span>
          </div>

          {/* 主标题 - 超大气，GSAP 动画 */}
          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl font-bold text-dark-900 dark:text-dark-50 mb-8 leading-tight tracking-tighter"
          >
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

          {/* 副标题 - 更大更清晰，GSAP 动画 */}
          <p 
            ref={subtitleRef}
            className="text-2xl md:text-3xl text-dark-600 dark:text-dark-400 mb-6 max-w-3xl leading-relaxed font-medium tracking-tight"
          >
            {language === 'zh' 
              ? '多图融合、精确比例控制、AI 智能助手'
              : 'Multi-Image Fusion, Precise Ratio Control, AI Assistant'}
          </p>
          
          {/* 描述文字 - GSAP 动画 */}
          <p 
            ref={descriptionRef}
            className="text-xl text-dark-500 dark:text-dark-500 mb-14 max-w-3xl tracking-normal"
          >
            {language === 'zh' 
              ? '注册即送 20 张免费图片 · 无需信用卡'
              : 'Get 20 Free Images on Sign Up · No Credit Card Required'}
          </p>

          {/* CTA - 更大更突出，GSAP 动画 */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-5">
            <Link href="/create" className="btn-primary px-12 py-5 text-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 group relative overflow-hidden">
              <span className="relative z-10 flex items-center tracking-tight">
              {language === 'zh' ? '免费开始创作' : 'Start Creating Free'}
                <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
              </span>
              {/* 按钮光晕 */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
            </Link>
            <Link href="/showcase" className="btn-outline px-12 py-5 text-xl font-semibold tracking-tight hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 group relative overflow-hidden hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5">
              <span className="relative z-10 flex items-center">
              {language === 'zh' ? '查看案例' : 'View Showcase'}
                <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
              </span>
              {/* 微妙光晕效果 */}
              <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                <span className="font-medium">{language === 'zh' ? '740+ 案例参考' : '740+ Examples'}</span>
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
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] transition-opacity duration-[5000ms] pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)',
                  opacity: 0.3 + Math.sin(currentImageIndex * 0.5) * 0.1,
                }}
              />
              {/* 额外的微妙光晕层 */}
              <div 
                className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] transition-opacity duration-[7000ms] pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 70%)',
                  opacity: 0.2 + Math.cos(currentImageIndex * 0.3) * 0.1,
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

              {/* 增强版指示器 - 只显示当前进度和总数（因为图片太多） */}
              <div className="absolute bottom-6 right-6 backdrop-blur-md bg-white/20 dark:bg-dark-900/30 px-4 py-2 rounded-full shadow-lg border border-white/20 dark:border-dark-800/20">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-dark-700 dark:text-dark-300 whitespace-nowrap">
                    {currentImageIndex + 1} / {showcaseImages.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {/* 只显示当前附近的几个指示点 */}
                    {Array.from({ length: Math.min(5, showcaseImages.length) }).map((_, i) => {
                      const idx = (currentImageIndex - 2 + i + showcaseImages.length) % showcaseImages.length;
                      const isActive = idx === currentImageIndex;
                      return (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`rounded-full transition-all duration-500 hover:scale-125 ${
                            isActive
                              ? 'bg-primary-500 w-8 h-2.5 shadow-lg shadow-primary-500/50' 
                          : 'bg-dark-300 dark:bg-dark-600 w-2 h-2 hover:bg-primary-400'
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="content-wrapper py-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-4 tracking-tight">
              {language === 'zh' ? '核心功能' : 'Core Features'}
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed">
              {language === 'zh' 
                ? '专业AI图像创作平台，为开发者和创意工作者提供强大工具' 
                : 'Professional AI image creation platform with powerful tools for developers and creators'}
            </p>
          </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
                <SpotlightCard
                key={feature.href}
                  className="rounded-xl border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300"
                >
                  <Link
                href={feature.href}
                    className="block p-6 group h-full"
              >
                <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors group-hover:scale-110 duration-300">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  {feature.badge && (
                    <span className="badge-primary">{feature.badge}</span>
                  )}
                </div>
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2 tracking-tight">
                  {feature.title}
                </h3>
                    <p className="text-sm text-dark-600 dark:text-dark-400 leading-relaxed">
                  {feature.description}
                </p>
              </Link>
                </SpotlightCard>
            );
          })}
          </div>
        </div>
      </section>

      {/* 最新更新 & 数据统计 */}
      <section className="content-wrapper py-16 relative bg-gradient-to-b from-transparent to-dark-50/50 dark:to-dark-950/50">
        <div className="max-w-7xl mx-auto">
          {/* 最新功能亮点 */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/50 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-800/50 mb-4">
                <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                  {language === 'zh' ? '最新更新' : 'Latest Updates'}
                </span>
              </div>
              <h2 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-4 tracking-tight">
                {language === 'zh' ? '持续创新，功能不断升级' : 'Continuous Innovation, Always Evolving'}
              </h2>
              <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed">
                {language === 'zh' 
                  ? '每月都有新功能上线，让AI创作更简单、更强大' 
                  : 'New features every month, making AI creation simpler and more powerful'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* 小红书图文生成器 */}
              <SpotlightCard className="rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-gradient-to-br from-white to-primary-50/30 dark:from-dark-900 dark:to-primary-900/10 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 group">
                <Link href="/tools/xiaohongshu-generator" className="block p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 dark:group-hover:bg-primary-500/30 transition-colors group-hover:scale-110 duration-300">
                      <FileText className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="badge-primary text-xs">{language === 'zh' ? '新功能' : 'New'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-2 tracking-tight">
                    {language === 'zh' ? '小红书图文生成器' : 'Xiaohongshu Generator'}
                  </h3>
                  <p className="text-sm text-dark-600 dark:text-dark-400 leading-relaxed mb-4">
                    {language === 'zh' 
                      ? '一句话生成完整小红书图文，包含大纲和配图，支持批量生成' 
                      : 'Generate complete Xiaohongshu content with outline and images from a single sentence'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{language === 'zh' ? '支持模型选择 · 智能配额管理' : 'Model Selection · Smart Quota'}</span>
                  </div>
                </Link>
              </SpotlightCard>

              {/* SVG流程图编辑器 */}
              <SpotlightCard className="rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-gradient-to-br from-white to-primary-50/30 dark:from-dark-900 dark:to-primary-900/10 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 group">
                <Link href="/tools/svg-editor" className="block p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 dark:group-hover:bg-primary-500/30 transition-colors group-hover:scale-110 duration-300">
                      <GitBranch className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="badge-primary text-xs">{language === 'zh' ? '新功能' : 'New'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-2 tracking-tight">
                    {language === 'zh' ? 'SVG流程图编辑器' : 'SVG Flowchart Editor'}
                  </h3>
                  <p className="text-sm text-dark-600 dark:text-dark-400 leading-relaxed mb-4">
                    {language === 'zh' 
                      ? '可视化创建流程图、架构图、思维导图，拖拽式操作，一键导出SVG' 
                      : 'Create flowcharts, diagrams, and mind maps visually with drag-and-drop, export as SVG'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{language === 'zh' ? '完全免费 · 无需配额' : 'Completely Free · No Quota'}</span>
                  </div>
                </Link>
              </SpotlightCard>

              {/* AI图标生成器 */}
              <SpotlightCard className="rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-gradient-to-br from-white to-primary-50/30 dark:from-dark-900 dark:to-primary-900/10 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 group">
                <Link href="/tools/ai-icon-generator" className="block p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 dark:group-hover:bg-primary-500/30 transition-colors group-hover:scale-110 duration-300">
                      <Shapes className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="badge-primary text-xs">{language === 'zh' ? '新功能' : 'New'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-2 tracking-tight">
                    {language === 'zh' ? 'AI图标生成器' : 'AI Icon Generator'}
                  </h3>
                  <p className="text-sm text-dark-600 dark:text-dark-400 leading-relaxed mb-4">
                    {language === 'zh' 
                      ? 'AI生成各种风格图标，扁平、渐变、3D等，支持自定义尺寸和颜色' 
                      : 'Generate icons in various styles: flat, gradient, 3D, with custom size and colors'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{language === 'zh' ? '多种风格 · 一键导出' : 'Multiple Styles · One-Click Export'}</span>
                  </div>
                </Link>
              </SpotlightCard>
            </div>
          </div>

          {/* 数据统计 */}
          <SpotlightCard className="rounded-2xl border-2 border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/20 dark:to-dark-900 shadow-lg">
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2 tracking-tight">
                  {language === 'zh' ? '平台数据' : 'Platform Statistics'}
                </h3>
                <p className="text-dark-600 dark:text-dark-400">
                  {language === 'zh' ? '真实数据，持续增长' : 'Real Data, Growing Every Day'}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="inline-flex w-16 h-16 bg-primary-500/10 dark:bg-primary-500/20 rounded-2xl items-center justify-center mb-3">
                    <ImageIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-1">740+</div>
                  <div className="text-sm text-dark-600 dark:text-dark-400">
                    {language === 'zh' ? '精选案例' : 'Curated Cases'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex w-16 h-16 bg-primary-500/10 dark:bg-primary-500/20 rounded-2xl items-center justify-center mb-3">
                    <Wand2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-1">10+</div>
                  <div className="text-sm text-dark-600 dark:text-dark-400">
                    {language === 'zh' ? '专业工具' : 'Professional Tools'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex w-16 h-16 bg-primary-500/10 dark:bg-primary-500/20 rounded-2xl items-center justify-center mb-3">
                    <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-1">10K+</div>
                  <div className="text-sm text-dark-600 dark:text-dark-400">
                    {language === 'zh' ? '活跃用户' : 'Active Users'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex w-16 h-16 bg-primary-500/10 dark:bg-primary-500/20 rounded-2xl items-center justify-center mb-3">
                    <Award className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-1">20</div>
                  <div className="text-sm text-dark-600 dark:text-dark-400">
                    {language === 'zh' ? '免费配额' : 'Free Quota'}
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* 专业工具展示 */}
      <section className="content-wrapper py-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-4 tracking-tight">
              {language === 'zh' ? '10+ 专业AI工具' : '10+ Professional AI Tools'}
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed">
              {language === 'zh' 
                ? '即来即走，无需复杂配置，每个工具都经过精心优化' 
                : 'Ready to use, no complex setup, every tool is carefully optimized'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Camera, name: language === 'zh' ? '证件照生成' : 'ID Photo', href: '/tools/id-photo' },
              { icon: Scissors, name: language === 'zh' ? '智能去背景' : 'Remove BG', href: '/tools/remove-bg' },
              { icon: Maximize2, name: language === 'zh' ? '图片放大' : 'Upscale', href: '/tools/upscale' },
              { icon: Palette, name: language === 'zh' ? '风格转换' : 'Style Transfer', href: '/tools/style-transfer' },
              { icon: Sparkles, name: language === 'zh' ? '画质增强' : 'Enhance', href: '/tools/enhance' },
              { icon: Droplet, name: language === 'zh' ? '黑白上色' : 'Colorize', href: '/tools/colorize' },
              { icon: Microscope, name: language === 'zh' ? '科研绘图' : 'Scientific', href: '/tools/scientific-drawing' },
              { icon: GitBranch, name: language === 'zh' ? 'SVG编辑器' : 'SVG Editor', href: '/tools/svg-editor' },
              { icon: Shapes, name: language === 'zh' ? 'AI图标' : 'AI Icons', href: '/tools/ai-icon-generator' },
              { icon: FileText, name: language === 'zh' ? '小红书生成' : 'XHS Generator', href: '/tools/xiaohongshu-generator' },
            ].map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Link key={idx} href={tool.href}>
                  <SpotlightCard className="rounded-xl border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all duration-300 group h-full">
                    <div className="p-5 text-center">
                      <div className="inline-flex w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl items-center justify-center mb-3 group-hover:scale-110 group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/20">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-dark-900 dark:text-dark-50 tracking-tight">
                        {tool.name}
                      </h3>
                    </div>
                  </SpotlightCard>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/tools" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              {language === 'zh' ? '查看所有工具' : 'View All Tools'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights - 核心优势 */}
      <section className="content-wrapper py-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-4 tracking-tight">
            {language === 'zh' ? '为什么选择创想引擎' : 'Why Choose Imagine Engine'}
          </h2>
            <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed">
              {language === 'zh' 
                ? '专业、高效、易用的AI图像创作平台，为开发者和创作者而生' 
                : 'Professional, efficient, and easy-to-use AI image creation platform built for developers and creators'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight, idx) => {
              const Icon = highlight.icon;
              return (
                <SpotlightCard key={idx} className="rounded-xl border border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-xl items-center justify-center flex transition-transform hover:scale-110 duration-300">
                        <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                  </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2 tracking-tight">
                    {highlight.title}
                  </h3>
                        <p className="text-sm text-dark-600 dark:text-dark-400 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview - 简洁专业版 */}
      <section className="content-wrapper py-20 bg-dark-50 dark:bg-dark-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-4 tracking-tight">
              {t.pricing.title}
            </h2>
            {t.pricing.subtitle && (
              <p className="text-lg text-dark-600 dark:text-dark-400 mb-6 tracking-normal">
              {t.pricing.subtitle}
            </p>
            )}
            {/* 推荐基础版提示 */}
            <div className="flex justify-center mb-8">
              <SpotlightCard className="inline-block rounded-full border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 backdrop-blur-sm">
                <div className="inline-flex items-center gap-2 px-4 py-2">
                  <span className="text-lg text-primary-700 dark:text-primary-400 font-semibold tracking-tight">
                    {language === 'zh' ? '💡 90%的用户选择基础版 - 性价比最高' : '💡 90% choose Basic - Best Value'}
                  </span>
                </div>
              </SpotlightCard>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Free */}
            <SpotlightCard className="rounded-2xl border-2 border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300">
              <div className="p-8 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2 tracking-tight">
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
                <Link href="/create" className="block w-full btn-primary text-center mt-auto group relative overflow-hidden hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300">
                  <span className="relative z-10 flex items-center justify-center tracking-tight">
                {t.pricing.free.cta}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </span>
                  {/* 按钮光晕 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
              </Link>
            </div>
            </SpotlightCard>
            
            {/* Basic - 基础版（主推） */}
            <div className="relative">
              {/* 最受欢迎徽章 - 移到外面避免被 SpotlightCard 的 overflow-hidden 裁剪 */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-5 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-full shadow-md ring-1 ring-white/20 dark:ring-dark-900/30">
                {language === 'zh' ? '最受欢迎' : 'Most Popular'}
              </div>
              <SpotlightCard 
                spotlightColor="rgba(20, 184, 166, 0.15)"
                className="rounded-2xl border-4 border-primary-500 shadow-xl bg-gradient-to-br from-white to-primary-50/20 dark:from-dark-900 dark:to-primary-900/10 flex flex-col h-full hover:shadow-2xl hover:transform hover:-translate-y-2 hover:border-primary-600 transition-all duration-300"
              >
                <div className="p-8 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2 tracking-tight">
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
                  <Link href="/pricing" className="block w-full btn-primary text-center mt-auto group relative overflow-hidden hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300">
                    <span className="relative z-10 flex items-center justify-center tracking-tight">
                {language === 'zh' ? '立即订阅' : 'Subscribe Now'}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                    {/* 按钮光晕 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
              </Link>
            </div>
              </SpotlightCard>
              </div>

            {/* Pro */}
            <SpotlightCard className="rounded-2xl border-2 border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900 hover:shadow-xl hover:transform hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300">
              <div className="p-8 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-2 tracking-tight">
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
              <Link href="/pricing" className="block w-full btn-primary text-center mt-auto group relative overflow-hidden hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300">
                <span className="relative z-10 flex items-center justify-center tracking-tight">
                {t.pricing.pro.cta}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
                {/* 按钮光晕 */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
              </Link>
            </div>
            </SpotlightCard>
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

      {/* 用户评价区 - 滚动轮播 */}
      <section className="py-24 relative overflow-hidden">
        <div className="content-wrapper relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-900 dark:text-dark-50 mb-4 tracking-tight">
              {language === 'zh' ? '用户真实评价' : 'What Our Users Say'}
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed">
              {language === 'zh' 
                ? '已有 10,000+ 用户选择 Imagine Engine，看看他们怎么说' 
                : 'Join 10,000+ users who trust Imagine Engine'}
            </p>
          </div>

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
      </section>

        {/* Footer */}
      <footer className="relative mt-32 bg-gradient-to-b from-dark-50 to-white dark:from-dark-950 dark:to-dark-900 overflow-hidden">
        {/* 装饰性背景 - 超柔和边界，使用多层渐变遮罩 */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full"
               style={{
                 filter: 'blur(120px)',
                 maskImage: 'radial-gradient(ellipse 100% 100% at center, black 20%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 60%, transparent 80%)',
                 WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at center, black 20%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 60%, transparent 80%)',
                 transform: 'scale(1.2)'
               }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-600 rounded-full"
               style={{
                 filter: 'blur(120px)',
                 maskImage: 'radial-gradient(ellipse 100% 100% at center, black 20%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 60%, transparent 80%)',
                 WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at center, black 20%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 60%, transparent 80%)',
                 transform: 'scale(1.2)'
               }} />
        </div>

        {/* 左右渐变遮罩 - 柔和边界，更宽的渐变区域 */}
        <div className="absolute inset-y-0 left-0 w-48 pointer-events-none z-10 dark:hidden"
             style={{
               background: 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)'
             }} />
        <div className="absolute inset-y-0 right-0 w-48 pointer-events-none z-10 dark:hidden"
             style={{
               background: 'linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)'
             }} />
        <div className="absolute inset-y-0 left-0 w-48 pointer-events-none z-10 hidden dark:block"
             style={{
               background: 'linear-gradient(to right, rgb(17, 24, 39) 0%, rgba(17, 24, 39, 0.8) 20%, rgba(17, 24, 39, 0.4) 50%, transparent 100%)'
             }} />
        <div className="absolute inset-y-0 right-0 w-48 pointer-events-none z-10 hidden dark:block"
             style={{
               background: 'linear-gradient(to left, rgb(17, 24, 39) 0%, rgba(17, 24, 39, 0.8) 20%, rgba(17, 24, 39, 0.4) 50%, transparent 100%)'
             }} />

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
            
            {/* 联系邮箱 - 卡片式，选中时才显示邮箱和提示 */}
              <button 
                onClick={copyEmail}
              onMouseEnter={() => setIsEmailHovered(true)}
              onMouseLeave={() => setIsEmailHovered(false)}
              onFocus={() => setIsEmailHovered(true)}
              onBlur={() => setIsEmailHovered(false)}
              className="group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-dark-100/50 dark:bg-dark-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-dark-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300"
              title={t.footer.emailCopyHint}
            >
              <Mail className="w-4 h-4 text-dark-600 dark:text-dark-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              {isEmailHovered && (
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-semibold text-dark-700 dark:text-dark-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-all duration-300">
                    feedback@2art.fun
                  </span>
                  <span className="text-xs text-dark-500 dark:text-dark-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300">
                    {t.footer.emailHint}
                  </span>
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">
                    {t.footer.emailCopyHint}
                  </span>
                </div>
              )}
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
