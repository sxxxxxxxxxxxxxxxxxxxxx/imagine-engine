'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Book, Zap, Code2, HelpCircle, ArrowRight, BookOpen, Settings, Image as ImageIcon, Palette, Layers } from 'lucide-react';

export default function DocsPage() {
  const { language } = useLanguage();

  const sections = [
    {
      icon: Zap,
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      title: language === 'zh' ? '快速开始' : 'Quick Start',
      description: language === 'zh' ? '5分钟快速上手' : 'Get started in 5 minutes',
      articles: language === 'zh' ? [
        { title: '安装和设置', href: '#setup' },
        { title: '第一张图片', href: '#first-image' },
        { title: 'API 配置', href: '#api-config' },
      ] : [
        { title: 'Installation & Setup', href: '#setup' },
        { title: 'Your First Image', href: '#first-image' },
        { title: 'API Configuration', href: '#api-config' },
      ]
    },
    {
      icon: BookOpen,
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      title: language === 'zh' ? '功能详解' : 'Features',
      description: language === 'zh' ? '每个功能的详细指南' : 'Detailed guides for each feature',
      articles: language === 'zh' ? [
        { title: 'AI Studio 指南', href: '#studio' },
        { title: 'Editor 工具', href: '#editor' },
        { title: '批量处理', href: '#batch' },
        { title: '模型选择', href: '#models' },
      ] : [
        { title: 'AI Studio Guide', href: '#studio' },
        { title: 'Editor Tools', href: '#editor' },
        { title: 'Batch Processing', href: '#batch' },
        { title: 'Model Selection', href: '#models' },
      ]
    },
    {
      icon: Code2,
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      title: language === 'zh' ? 'API 参考' : 'API Reference',
      description: language === 'zh' ? '完整 API 文档' : 'Complete API documentation',
      articles: language === 'zh' ? [
        { title: '身份验证', href: '#auth' },
        { title: '生成接口', href: '#generate-api' },
        { title: '编辑接口', href: '#edit-api' },
        { title: '错误代码', href: '#errors' },
      ] : [
        { title: 'Authentication', href: '#auth' },
        { title: 'Generate Endpoint', href: '#generate-api' },
        { title: 'Edit Endpoint', href: '#edit-api' },
        { title: 'Error Codes', href: '#errors' },
      ]
    },
    {
      icon: HelpCircle,
      iconColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      title: language === 'zh' ? '常见问题' : 'FAQ',
      description: language === 'zh' ? '常见问题解答' : 'Common questions answered',
      articles: language === 'zh' ? [
        { title: '配额和限制', href: '#quota' },
        { title: '故障排查', href: '#troubleshooting' },
        { title: '最佳实践', href: '#best-practices' },
      ] : [
        { title: 'Quota & Limits', href: '#quota' },
        { title: 'Troubleshooting', href: '#troubleshooting' },
        { title: 'Best Practices', href: '#best-practices' },
      ]
    },
  ];

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-2">
            {language === 'zh' ? '文档中心' : 'Documentation Center'}
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            {language === 'zh' 
              ? '关于 Imagine Engine 的一切，从快速开始到高级 API 使用' 
              : 'Everything about Imagine Engine, from quick start to advanced API usage'}
          </p>
        </div>

        {/* Quick Start Banner */}
        <div className="card p-6 mb-6 border-2 border-primary-200 dark:border-primary-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-2">
                {language === 'zh' ? '5分钟快速开始' : '5-Minute Quick Start'}
              </h2>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-3">
                {language === 'zh' 
                  ? '新手？从这里开始创建你的第一张 AI 生成图片'
                  : 'New to Imagine Engine? Start here to create your first AI-generated image'}
              </p>
              <Link href="#quick-start" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all text-sm">
                {language === 'zh' ? '开始学习' : 'Get Started'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="card p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 ${section.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${section.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-1">
                      {section.title}
                    </h3>
                    <p className="text-xs text-dark-500 dark:text-dark-500">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {section.articles.map((article) => (
                    <li key={article.href}>
                      <Link
                        href={article.href}
                        className="flex items-center gap-2 text-sm text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-1 px-2 rounded hover:bg-dark-50 dark:hover:bg-dark-900"
                      >
                        <ArrowRight className="w-3 h-3 flex-shrink-0" />
                        <span>{article.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Quick Start Content */}
        <div id="quick-start" className="card p-6 mb-6">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6">
            {language === 'zh' ? '快速开始指南' : 'Quick Start Guide'}
          </h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                  {language === 'zh' ? '配置 API 密钥' : 'Configure API Key'}
                </h3>
              </div>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-3 pl-11">
                {language === 'zh' 
                  ? '首先，你需要配置 API 密钥才能开始生成图片'
                  : 'First, configure your API key to start generating images'}
              </p>
              <div className="pl-11">
                <ol className="list-decimal list-inside space-y-1.5 text-sm text-dark-600 dark:text-dark-400">
                  <li>
                    {language === 'zh' ? '前往' : 'Go to'} 
                    <Link href="/settings" className="text-primary-600 dark:text-primary-400 hover:underline mx-1">
                      {language === 'zh' ? '设置' : 'Settings'}
                    </Link>
                    {language === 'zh' ? '页面' : ''}
                  </li>
                  <li>{language === 'zh' ? '选择你偏好的 AI 提供商（Pockgo、Google 等）' : 'Choose your preferred AI provider (Pockgo, Google, etc.)'}</li>
                  <li>{language === 'zh' ? '输入你的 API 密钥' : 'Enter your API key'}</li>
                  <li>{language === 'zh' ? '点击"保存设置"' : 'Click "Save Settings"'}</li>
                </ol>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                  {language === 'zh' ? '创建第一张图片' : 'Create Your First Image'}
                </h3>
              </div>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-3 pl-11">
                {language === 'zh' 
                  ? '访问 AI Studio 开始创作'
                  : 'Visit AI Studio and start creating'}
              </p>
              <div className="pl-11">
                <ol className="list-decimal list-inside space-y-1.5 text-sm text-dark-600 dark:text-dark-400">
                  <li>
                    {language === 'zh' ? '访问' : 'Visit'} 
                    <Link href="/create" className="text-primary-600 dark:text-primary-400 hover:underline mx-1">
                      AI Studio
                    </Link>
                  </li>
                  <li>{language === 'zh' ? '输入提示词（如："夕阳下的宁静山景"）' : 'Enter a prompt (e.g., "a serene mountain landscape at sunset")'}</li>
                  <li>{language === 'zh' ? '选择你偏好的图片比例' : 'Select your preferred aspect ratio'}</li>
                  <li>{language === 'zh' ? '点击"开始创作"' : 'Click "Generate"'}</li>
                </ol>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50">
                  {language === 'zh' ? '探索高级功能' : 'Explore Advanced Features'}
                </h3>
              </div>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-3 pl-11">
                {language === 'zh' 
                  ? '熟悉基础操作后，探索更多功能：'
                  : 'Once comfortable with basics, explore more features:'}
              </p>
              <div className="pl-11">
                <ul className="list-disc list-inside space-y-1.5 text-sm text-dark-600 dark:text-dark-400">
                  <li>
                    <Link href="/edit" className="text-primary-600 dark:text-primary-400 hover:underline">
                      {language === 'zh' ? '图片编辑器' : 'Image Editor'}
                    </Link>
                    {language === 'zh' ? ' - 编辑和增强你的图片' : ' - Edit and enhance your images'}
                  </li>
                  <li>
                    <Link href="/playground" className="text-primary-600 dark:text-primary-400 hover:underline">
                      {language === 'zh' ? '模型对比' : 'Playground'}
                    </Link>
                    {language === 'zh' ? ' - 对比不同模型效果' : ' - Compare different models'}
                  </li>
                  <li>
                    <Link href="/templates" className="text-primary-600 dark:text-primary-400 hover:underline">
                      {language === 'zh' ? '模板库' : 'Templates'}
                    </Link>
                    {language === 'zh' ? ' - 使用预制提示词模板' : ' - Use pre-made prompts'}
                  </li>
                  <li>
                    <Link href="/showcase" className="text-primary-600 dark:text-primary-400 hover:underline">
                      {language === 'zh' ? '案例展示' : 'Showcase'}
                    </Link>
                    {language === 'zh' ? ' - 学习优秀案例' : ' - Learn from examples'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 核心功能介绍 */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Link href="/create" className="card p-5 hover:border-primary-400 dark:hover:border-primary-500 transition-all group">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-3">
              <ImageIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-dark-900 dark:text-dark-50 mb-1">
              {language === 'zh' ? 'AI Studio' : 'AI Studio'}
            </h3>
            <p className="text-xs text-dark-500 dark:text-dark-500 mb-3">
              {language === 'zh' ? '强大的AI图片生成工具' : 'Powerful AI image generation'}
            </p>
            <div className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400">
              {language === 'zh' ? '查看指南' : 'View Guide'}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/edit" className="card p-5 hover:border-primary-400 dark:hover:border-primary-500 transition-all group">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3">
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-dark-900 dark:text-dark-50 mb-1">
              Editor
            </h3>
            <p className="text-xs text-dark-500 dark:text-dark-500 mb-3">
              {language === 'zh' ? '专业图片编辑工具' : 'Professional image editing'}
            </p>
            <div className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400">
              {language === 'zh' ? '查看指南' : 'View Guide'}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/settings" className="card p-5 hover:border-primary-400 dark:hover:border-primary-500 transition-all group">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-dark-900 dark:text-dark-50 mb-1">
              {language === 'zh' ? '设置' : 'Settings'}
            </h3>
            <p className="text-xs text-dark-500 dark:text-dark-500 mb-3">
              {language === 'zh' ? 'API配置和个性化设置' : 'API config and customization'}
            </p>
            <div className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400">
              {language === 'zh' ? '查看指南' : 'View Guide'}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="card p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 ${section.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${section.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-dark-900 dark:text-dark-50 mb-1">
                      {section.title}
                    </h3>
                    <p className="text-xs text-dark-500 dark:text-dark-500">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-1">
                  {section.articles.map((article) => (
                    <li key={article.href}>
                      <Link
                        href={article.href}
                        className="flex items-center gap-2 text-sm text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-1.5 px-2 rounded hover:bg-dark-50 dark:hover:bg-dark-900"
                      >
                        <ArrowRight className="w-3 h-3 flex-shrink-0" />
                        <span>{article.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Need Help */}
        <div className="card p-6 text-center border-2 border-dashed border-dark-300 dark:border-dark-700">
          <Book className="w-10 h-10 text-primary-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-50 mb-2">
            {language === 'zh' ? '找不到你需要的内容？' : "Can't Find What You Need?"}
          </h3>
          <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
            {language === 'zh' 
              ? '更详细的文档正在完善中，请定期回来查看更新'
              : 'More detailed documentation is coming soon. Check back regularly for updates'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/showcase" className="btn-secondary text-sm">
              {language === 'zh' ? '查看案例' : 'View Examples'}
            </Link>
            <Link href="/create" className="btn-primary text-sm">
              {language === 'zh' ? '开始创作' : 'Start Creating'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
