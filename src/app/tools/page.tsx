'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Camera, Scissors, Maximize2, Palette, Image as ImageIcon, Sparkles, Wrench, Microscope, GitBranch, Droplet, Shapes, FileText } from 'lucide-react';
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
      available: true
    },
    {
      id: 'remove-bg',
      name: { zh: '智能去背景', en: 'Remove Background' },
      description: { zh: '1秒抠图，发丝级细节', en: '1-second cutout, hair-level details' },
      icon: <Scissors className="w-8 h-8" />,
      quota: 1,
      minPlan: 'free',
      available: true
    },
    {
      id: 'upscale',
      name: { zh: '图片放大', en: 'Image Upscaler' },
      description: { zh: '无损放大4倍，保持清晰', en: 'Upscale 4x without quality loss' },
      icon: <Maximize2 className="w-8 h-8" />,
      quota: 2,
      minPlan: 'free',
      available: true
    },
    {
      id: 'style-transfer',
      name: { zh: '风格转换', en: 'Style Transfer' },
      description: { zh: '艺术风格一键转换', en: 'One-click artistic style conversion' },
      icon: <Palette className="w-8 h-8" />,
      quota: 2,
      minPlan: 'free',
      available: true
    },
    {
      id: 'enhance',
      name: { zh: '画质增强', en: 'Quality Enhancement' },
      description: { zh: '智能优化画质和色彩', en: 'Smart quality & color optimization' },
      icon: <Sparkles className="w-8 h-8" />,
      quota: 2,
      minPlan: 'free',
      available: true
    },
    {
      id: 'colorize',
      name: { zh: '黑白上色', en: 'Colorization' },
      description: { zh: '黑白照片AI上色', en: 'AI colorization for B&W photos' },
      icon: <ImageIcon className="w-8 h-8" />,
      quota: 2,
      minPlan: 'free',
      available: true
    },
    {
      id: 'scientific-drawing',
      name: { zh: '科研绘图', en: 'Scientific Drawing' },
      description: { zh: '5分钟生成专业学术配图', en: 'Generate publication-ready scientific illustrations' },
      icon: <Microscope className="w-8 h-8" />,
      quota: 3,
      minPlan: 'free',
      available: true
    },
    {
      id: 'svg-editor',
      name: { zh: 'SVG流程图编辑器', en: 'SVG Flowchart Editor' },
      description: { zh: '可视化创建流程图、架构图、思维导图，导出SVG格式', en: 'Create flowcharts, diagrams, and mind maps visually, export as SVG' },
      icon: <GitBranch className="w-8 h-8" />,
      quota: 0,
      minPlan: 'free',
      available: true
    },
    {
      id: 'ai-icon-generator',
      name: { zh: 'AI图标生成器', en: 'AI Icon Generator' },
      description: { zh: 'AI生成各种风格图标，扁平、渐变、3D等，一键导出', en: 'Generate icons in various styles: flat, gradient, 3D, export instantly' },
      icon: <Shapes className="w-8 h-8" />,
      quota: 2,
      minPlan: 'free',
      available: true
    },
    {
      id: 'xiaohongshu-generator',
      name: { zh: '小红书图文生成器', en: 'Xiaohongshu Content Generator' },
      description: { zh: '一句话生成完整小红书图文，包含大纲和配图', en: 'Generate complete Xiaohongshu content with outline and images' },
      icon: <FileText className="w-8 h-8" />,
      quota: 0, // 按实际生成的图片数量扣费
      minPlan: 'free',
      available: true
    }
  ];

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-7xl mx-auto">
        
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-2xl mb-6">
            <Wrench className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            {language === 'zh' ? '专业AI工具箱' : 'Professional AI Tools'}
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed">
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
            { labelZh: '科研人员', labelEn: 'Researchers', href: '/tools/scientific-drawing' },
            { labelZh: '电商商家', labelEn: 'E-commerce', href: '/tools/remove-bg' },
            { labelZh: '学生', labelEn: 'Students', href: '/tools/id-photo' },
          ].map((p) => (
            <Link 
              key={p.href} 
              href={p.href} 
              className="px-5 py-2.5 bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 rounded-lg text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-700 dark:hover:text-primary-400 hover:border-primary-300 border-2 border-transparent transition-all"
            >
              {language === 'zh' ? p.labelZh : p.labelEn}
            </Link>
          ))}
        </div>

        {/* 工具网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`card p-6 relative group transition-all ${
                tool.available 
                  ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800' 
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
              <div className={`w-16 h-16 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-500 mb-5 transition-transform ${
                tool.available ? 'group-hover:scale-110' : ''
              }`}>
                {tool.icon}
              </div>

              {/* 工具名称 */}
              <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-3">
                {language === 'zh' ? tool.name.zh : tool.name.en}
              </h3>

              {/* 描述 */}
              <p className="text-dark-600 dark:text-dark-400 mb-4 text-sm leading-relaxed min-h-[3rem]">
                {language === 'zh' ? tool.description.zh : tool.description.en}
              </p>

              {/* 配额标签 */}
              <div className="flex items-center gap-2 mb-5">
                <span className="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full">
                  {language === 'zh' ? `消耗${tool.quota}张` : `${tool.quota} quota`}
                </span>
              </div>

              {/* 按钮 */}
              {tool.available ? (
                <Link
                  href={`/tools/${tool.id}`}
                  className="block w-full py-3 btn-primary text-center font-semibold text-base"
                >
                  {language === 'zh' ? '开始使用' : 'Start Using'}
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-dark-200 dark:bg-dark-800 text-dark-500 dark:text-dark-400 rounded-lg font-semibold cursor-not-allowed"
                >
                  {language === 'zh' ? '敬请期待' : 'Coming Soon'}
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
